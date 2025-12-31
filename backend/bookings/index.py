import json
import os
import jwt
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    """API для управления заявками на трансфер"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        db_url = os.environ.get('DATABASE_URL')
        schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
        jwt_secret = os.environ.get('JWT_SECRET_KEY')
        
        if not db_url:
            return error_response('Database configuration error', 500)
        
        conn = psycopg2.connect(db_url)
        conn.autocommit = False
        
        query_params = event.get('queryStringParameters', {}) or {}
        path_params = event.get('pathParams', {}) or {}
        booking_id = query_params.get('id', path_params.get('id'))
        
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            return create_booking(conn, schema, body, event, jwt_secret)
        
        elif method == 'GET':
            if booking_id:
                return get_booking(conn, schema, booking_id)
            else:
                return list_bookings(conn, schema, event, jwt_secret)
        
        elif method == 'PUT' and booking_id:
            body = json.loads(event.get('body', '{}'))
            return update_booking(conn, schema, booking_id, body, event, jwt_secret)
        
        elif method == 'DELETE' and booking_id:
            return delete_booking(conn, schema, booking_id, event, jwt_secret)
        
        else:
            return error_response('Method not allowed', 405)
    
    except Exception as e:
        return error_response(f'Server error: {str(e)}', 500)
    finally:
        if 'conn' in locals():
            conn.close()


def create_booking(conn, schema: str, data: dict, event: dict, jwt_secret: str) -> dict:
    """Создание новой заявки"""
    
    user = get_user_from_token(event, jwt_secret)
    
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        user_id = user['user_id'] if user else None
        guest_name = data.get('guest_name', data.get('name', ''))
        guest_phone = data.get('guest_phone', data.get('phone', ''))
        guest_email = data.get('guest_email', data.get('email', ''))
        
        from_location = data.get('from_location', '')
        to_location = data.get('to_location', '')
        travel_date = data.get('travel_date', '')
        travel_time = data.get('travel_time', '')
        passengers = data.get('passengers', 1)
        tariff_id = data.get('tariff_id')
        payment_method = data.get('payment_method', 'prepay_50')
        notes = data.get('notes', '')
        
        if not all([from_location, to_location, travel_date, travel_time]):
            return error_response('Missing required fields', 400)
        
        if not user_id and not all([guest_name, guest_phone]):
            return error_response('Guest name and phone are required for non-registered users', 400)
        
        cursor.execute(f'''
            SELECT base_price FROM {schema}.tariffs WHERE id = %s AND is_active = true
        ''', (tariff_id,))
        tariff = cursor.fetchone()
        
        if not tariff:
            return error_response('Invalid tariff', 400)
        
        total_price = float(tariff['base_price'])
        
        cursor.execute(f'''
            INSERT INTO {schema}.bookings 
            (user_id, guest_name, guest_phone, guest_email, from_location, to_location,
             travel_date, travel_time, passengers, tariff_id, total_price, payment_method, notes)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, status, created_at
        ''', (user_id, guest_name, guest_phone, guest_email, from_location, to_location,
              travel_date, travel_time, passengers, tariff_id, total_price, payment_method, notes))
        
        booking = cursor.fetchone()
        conn.commit()
        
        return success_response({
            'booking_id': booking['id'],
            'status': booking['status'],
            'total_price': total_price,
            'message': 'Заявка успешно создана. Мы свяжемся с вами в течение 5 минут.'
        })
        
    except Exception as e:
        conn.rollback()
        return error_response(f'Failed to create booking: {str(e)}', 500)


def list_bookings(conn, schema: str, event: dict, jwt_secret: str) -> dict:
    """Получение списка заявок"""
    
    user = get_user_from_token(event, jwt_secret)
    
    if not user:
        return error_response('Authentication required', 401)
    
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        if user['role'] == 'admin':
            cursor.execute(f'''
                SELECT b.*, t.name as tariff_name, t.category,
                       u.full_name as user_name, u.email as user_email
                FROM {schema}.bookings b
                LEFT JOIN {schema}.tariffs t ON b.tariff_id = t.id
                LEFT JOIN {schema}.users u ON b.user_id = u.id
                ORDER BY b.created_at DESC
                LIMIT 100
            ''')
        else:
            cursor.execute(f'''
                SELECT b.*, t.name as tariff_name, t.category
                FROM {schema}.bookings b
                LEFT JOIN {schema}.tariffs t ON b.tariff_id = t.id
                WHERE b.user_id = %s
                ORDER BY b.created_at DESC
            ''', (user['user_id'],))
        
        bookings = cursor.fetchall()
        
        result = []
        for booking in bookings:
            result.append({
                'id': booking['id'],
                'from_location': booking['from_location'],
                'to_location': booking['to_location'],
                'travel_date': str(booking['travel_date']),
                'travel_time': str(booking['travel_time']),
                'passengers': booking['passengers'],
                'tariff_name': booking.get('tariff_name'),
                'category': booking.get('category'),
                'total_price': float(booking['total_price']) if booking['total_price'] else 0,
                'status': booking['status'],
                'payment_status': booking['payment_status'],
                'payment_method': booking['payment_method'],
                'created_at': booking['created_at'].isoformat() if booking['created_at'] else None,
                'user_name': booking.get('user_name') or booking.get('guest_name'),
                'user_email': booking.get('user_email') or booking.get('guest_email'),
                'phone': booking.get('guest_phone')
            })
        
        return success_response({'bookings': result})
        
    except Exception as e:
        return error_response(f'Failed to fetch bookings: {str(e)}', 500)


def get_booking(conn, schema: str, booking_id: str) -> dict:
    """Получение одной заявки"""
    
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute(f'''
            SELECT b.*, t.name as tariff_name, t.category, t.features,
                   v.name as vehicle_name, v.model
            FROM {schema}.bookings b
            LEFT JOIN {schema}.tariffs t ON b.tariff_id = t.id
            LEFT JOIN {schema}.vehicles v ON b.vehicle_id = v.id
            WHERE b.id = %s
        ''', (booking_id,))
        
        booking = cursor.fetchone()
        
        if not booking:
            return error_response('Booking not found', 404)
        
        result = dict(booking)
        result['travel_date'] = str(result['travel_date'])
        result['travel_time'] = str(result['travel_time'])
        result['total_price'] = float(result['total_price']) if result['total_price'] else 0
        result['created_at'] = result['created_at'].isoformat() if result['created_at'] else None
        
        return success_response(result)
        
    except Exception as e:
        return error_response(f'Failed to fetch booking: {str(e)}', 500)


def update_booking(conn, schema: str, booking_id: str, data: dict, event: dict, jwt_secret: str) -> dict:
    """Обновление заявки"""
    
    user = get_user_from_token(event, jwt_secret)
    
    if not user or user['role'] != 'admin':
        return error_response('Admin access required', 403)
    
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        update_fields = []
        values = []
        
        if 'status' in data:
            update_fields.append('status = %s')
            values.append(data['status'])
        
        if 'payment_status' in data:
            update_fields.append('payment_status = %s')
            values.append(data['payment_status'])
        
        if 'vehicle_id' in data:
            update_fields.append('vehicle_id = %s')
            values.append(data['vehicle_id'])
        
        if 'notes' in data:
            update_fields.append('notes = %s')
            values.append(data['notes'])
        
        if not update_fields:
            return error_response('No fields to update', 400)
        
        update_fields.append('updated_at = CURRENT_TIMESTAMP')
        values.append(booking_id)
        
        query = f'''
            UPDATE {schema}.bookings
            SET {', '.join(update_fields)}
            WHERE id = %s
            RETURNING id, status, payment_status
        '''
        
        cursor.execute(query, values)
        result = cursor.fetchone()
        conn.commit()
        
        if not result:
            return error_response('Booking not found', 404)
        
        return success_response({
            'booking_id': result['id'],
            'status': result['status'],
            'payment_status': result['payment_status']
        })
        
    except Exception as e:
        conn.rollback()
        return error_response(f'Failed to update booking: {str(e)}', 500)


def delete_booking(conn, schema: str, booking_id: str, event: dict, jwt_secret: str) -> dict:
    """Отмена заявки"""
    
    user = get_user_from_token(event, jwt_secret)
    
    if not user:
        return error_response('Authentication required', 401)
    
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        if user['role'] == 'admin':
            cursor.execute(f'''
                UPDATE {schema}.bookings
                SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING id
            ''', (booking_id,))
        else:
            cursor.execute(f'''
                UPDATE {schema}.bookings
                SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
                WHERE id = %s AND user_id = %s
                RETURNING id
            ''', (booking_id, user['user_id']))
        
        result = cursor.fetchone()
        conn.commit()
        
        if not result:
            return error_response('Booking not found or access denied', 404)
        
        return success_response({'message': 'Booking cancelled successfully'})
        
    except Exception as e:
        conn.rollback()
        return error_response(f'Failed to cancel booking: {str(e)}', 500)


def get_user_from_token(event: dict, jwt_secret: str):
    """Извлечение данных пользователя из JWT токена"""
    
    if not jwt_secret:
        return None
    
    auth_header = event.get('headers', {}).get('X-Authorization', '')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.replace('Bearer ', '')
    
    try:
        payload = jwt.decode(token, jwt_secret, algorithms=['HS256'])
        return payload
    except:
        return None


def success_response(data: dict) -> dict:
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(data, ensure_ascii=False),
        'isBase64Encoded': False
    }


def error_response(message: str, status_code: int) -> dict:
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': message}, ensure_ascii=False),
        'isBase64Encoded': False
    }