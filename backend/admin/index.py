import json
import os
import jwt
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    """API для административной панели управления трансфером"""
    
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
        user = get_user_from_token(event)
        
        if not user or user['role'] != 'admin':
            return error_response('Admin access required', 403)
        
        db_url = os.environ.get('DATABASE_URL')
        schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
        
        if not db_url:
            return error_response('Database configuration error', 500)
        
        conn = psycopg2.connect(db_url)
        conn.autocommit = False
        
        query_params = event.get('queryStringParameters', {}) or {}
        path_params = event.get('pathParams', {}) or {}
        resource = query_params.get('resource', path_params.get('resource', ''))
        item_id = query_params.get('id', path_params.get('id'))
        
        if resource == 'tariffs':
            return handle_tariffs(conn, schema, method, item_id, event)
        elif resource == 'vehicles':
            return handle_vehicles(conn, schema, method, item_id, event)
        elif resource == 'advertisements':
            return handle_advertisements(conn, schema, method, item_id, event)
        elif resource == 'stats':
            return get_statistics(conn, schema)
        else:
            return error_response('Unknown resource', 400)
    
    except Exception as e:
        return error_response(f'Server error: {str(e)}', 500)
    finally:
        if 'conn' in locals():
            conn.close()


def handle_tariffs(conn, schema: str, method: str, item_id: str, event: dict) -> dict:
    """Управление тарифами"""
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            if item_id:
                cursor.execute(f'SELECT * FROM {schema}.tariffs WHERE id = %s', (item_id,))
                tariff = cursor.fetchone()
                if not tariff:
                    return error_response('Tariff not found', 404)
                return success_response(dict(tariff))
            else:
                cursor.execute(f'SELECT * FROM {schema}.tariffs ORDER BY created_at DESC')
                tariffs = cursor.fetchall()
                return success_response({'tariffs': [dict(t) for t in tariffs]})
        
        elif method == 'POST':
            data = json.loads(event.get('body', '{}'))
            cursor.execute(f'''
                INSERT INTO {schema}.tariffs 
                (name, category, description, base_price, price_per_km, max_passengers, features, is_active)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            ''', (
                data['name'], data['category'], data.get('description'),
                data['base_price'], data.get('price_per_km'), data['max_passengers'],
                data.get('features', []), data.get('is_active', True)
            ))
            result = cursor.fetchone()
            conn.commit()
            return success_response({'id': result['id'], 'message': 'Tariff created'})
        
        elif method == 'PUT' and item_id:
            data = json.loads(event.get('body', '{}'))
            
            update_fields = []
            values = []
            
            for field in ['name', 'category', 'description', 'base_price', 'price_per_km', 'max_passengers', 'features', 'is_active']:
                if field in data:
                    update_fields.append(f'{field} = %s')
                    values.append(data[field])
            
            if not update_fields:
                return error_response('No fields to update', 400)
            
            values.append(item_id)
            
            cursor.execute(f'''
                UPDATE {schema}.tariffs
                SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING id
            ''', values)
            
            result = cursor.fetchone()
            conn.commit()
            
            if not result:
                return error_response('Tariff not found', 404)
            
            return success_response({'message': 'Tariff updated'})
        
        elif method == 'DELETE' and item_id:
            cursor.execute(f'DELETE FROM {schema}.tariffs WHERE id = %s RETURNING id', (item_id,))
            result = cursor.fetchone()
            conn.commit()
            
            if not result:
                return error_response('Tariff not found', 404)
            
            return success_response({'message': 'Tariff deleted'})
        
        else:
            return error_response('Method not allowed', 405)
    
    except Exception as e:
        conn.rollback()
        return error_response(f'Operation failed: {str(e)}', 500)


def handle_vehicles(conn, schema: str, method: str, item_id: str, event: dict) -> dict:
    """Управление автопарком"""
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            if item_id:
                cursor.execute(f'SELECT * FROM {schema}.vehicles WHERE id = %s', (item_id,))
                vehicle = cursor.fetchone()
                if not vehicle:
                    return error_response('Vehicle not found', 404)
                return success_response(dict(vehicle))
            else:
                cursor.execute(f'SELECT * FROM {schema}.vehicles ORDER BY created_at DESC')
                vehicles = cursor.fetchall()
                return success_response({'vehicles': [dict(v) for v in vehicles]})
        
        elif method == 'POST':
            data = json.loads(event.get('body', '{}'))
            cursor.execute(f'''
                INSERT INTO {schema}.vehicles 
                (name, model, category, seats, image_url, features, is_active)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            ''', (
                data['name'], data['model'], data['category'], data['seats'],
                data.get('image_url'), data.get('features', []), data.get('is_active', True)
            ))
            result = cursor.fetchone()
            conn.commit()
            return success_response({'id': result['id'], 'message': 'Vehicle added'})
        
        elif method == 'PUT' and item_id:
            data = json.loads(event.get('body', '{}'))
            
            update_fields = []
            values = []
            
            for field in ['name', 'model', 'category', 'seats', 'image_url', 'features', 'is_active']:
                if field in data:
                    update_fields.append(f'{field} = %s')
                    values.append(data[field])
            
            if not update_fields:
                return error_response('No fields to update', 400)
            
            values.append(item_id)
            
            cursor.execute(f'''
                UPDATE {schema}.vehicles
                SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING id
            ''', values)
            
            result = cursor.fetchone()
            conn.commit()
            
            if not result:
                return error_response('Vehicle not found', 404)
            
            return success_response({'message': 'Vehicle updated'})
        
        elif method == 'DELETE' and item_id:
            cursor.execute(f'DELETE FROM {schema}.vehicles WHERE id = %s RETURNING id', (item_id,))
            result = cursor.fetchone()
            conn.commit()
            
            if not result:
                return error_response('Vehicle not found', 404)
            
            return success_response({'message': 'Vehicle deleted'})
        
        else:
            return error_response('Method not allowed', 405)
    
    except Exception as e:
        conn.rollback()
        return error_response(f'Operation failed: {str(e)}', 500)


def handle_advertisements(conn, schema: str, method: str, item_id: str, event: dict) -> dict:
    """Управление рекламными блоками"""
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            if item_id:
                cursor.execute(f'SELECT * FROM {schema}.advertisements WHERE id = %s', (item_id,))
                ad = cursor.fetchone()
                if not ad:
                    return error_response('Advertisement not found', 404)
                return success_response(dict(ad))
            else:
                cursor.execute(f'SELECT * FROM {schema}.advertisements ORDER BY display_order, created_at DESC')
                ads = cursor.fetchall()
                return success_response({'advertisements': [dict(a) for a in ads]})
        
        elif method == 'POST':
            data = json.loads(event.get('body', '{}'))
            cursor.execute(f'''
                INSERT INTO {schema}.advertisements 
                (title, content, image_url, link_url, position, is_active, display_order)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            ''', (
                data['title'], data.get('content'), data.get('image_url'),
                data.get('link_url'), data.get('position'), 
                data.get('is_active', True), data.get('display_order', 0)
            ))
            result = cursor.fetchone()
            conn.commit()
            return success_response({'id': result['id'], 'message': 'Advertisement created'})
        
        elif method == 'PUT' and item_id:
            data = json.loads(event.get('body', '{}'))
            
            update_fields = []
            values = []
            
            for field in ['title', 'content', 'image_url', 'link_url', 'position', 'is_active', 'display_order']:
                if field in data:
                    update_fields.append(f'{field} = %s')
                    values.append(data[field])
            
            if not update_fields:
                return error_response('No fields to update', 400)
            
            values.append(item_id)
            
            cursor.execute(f'''
                UPDATE {schema}.advertisements
                SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING id
            ''', values)
            
            result = cursor.fetchone()
            conn.commit()
            
            if not result:
                return error_response('Advertisement not found', 404)
            
            return success_response({'message': 'Advertisement updated'})
        
        elif method == 'DELETE' and item_id:
            cursor.execute(f'DELETE FROM {schema}.advertisements WHERE id = %s RETURNING id', (item_id,))
            result = cursor.fetchone()
            conn.commit()
            
            if not result:
                return error_response('Advertisement not found', 404)
            
            return success_response({'message': 'Advertisement deleted'})
        
        else:
            return error_response('Method not allowed', 405)
    
    except Exception as e:
        conn.rollback()
        return error_response(f'Operation failed: {str(e)}', 500)


def get_statistics(conn, schema: str) -> dict:
    """Получение статистики для админки"""
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cursor.execute(f'''
            SELECT 
                COUNT(*) as total_bookings,
                COUNT(CASE WHEN status = 'new' THEN 1 END) as new_bookings,
                COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_bookings,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_bookings,
                COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_bookings,
                SUM(CASE WHEN status = 'completed' THEN total_price ELSE 0 END) as total_revenue
            FROM {schema}.bookings
        ''')
        
        stats = cursor.fetchone()
        
        cursor.execute(f'''
            SELECT DATE(created_at) as date, COUNT(*) as count
            FROM {schema}.bookings
            WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        ''')
        
        daily_stats = cursor.fetchall()
        
        return success_response({
            'total_bookings': stats['total_bookings'],
            'new_bookings': stats['new_bookings'],
            'confirmed_bookings': stats['confirmed_bookings'],
            'completed_bookings': stats['completed_bookings'],
            'cancelled_bookings': stats['cancelled_bookings'],
            'total_revenue': float(stats['total_revenue']) if stats['total_revenue'] else 0,
            'daily_bookings': [{'date': str(d['date']), 'count': d['count']} for d in daily_stats]
        })
        
    except Exception as e:
        return error_response(f'Failed to fetch statistics: {str(e)}', 500)


def get_user_from_token(event: dict):
    """Извлечение данных пользователя из JWT токена"""
    
    jwt_secret = os.environ.get('JWT_SECRET_KEY')
    
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
        'body': json.dumps(data, ensure_ascii=False, default=str),
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