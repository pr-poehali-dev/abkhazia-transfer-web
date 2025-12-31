import json
import os
import jwt
import bcrypt
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    """API для регистрации и авторизации пользователей трансфера"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
        
        if not db_url or not jwt_secret:
            return error_response('Server configuration error', 500)
        
        conn = psycopg2.connect(db_url)
        conn.autocommit = False
        
        query_params = event.get('queryStringParameters', {}) or {}
        action = query_params.get('action', '')
        
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            if action == 'register':
                return handle_register(conn, schema, body, jwt_secret)
            elif action == 'login':
                return handle_login(conn, schema, body, jwt_secret)
            else:
                return error_response('Unknown action', 400)
        
        elif method == 'GET' and action == 'verify':
            auth_header = event.get('headers', {}).get('X-Authorization', '')
            return handle_verify(auth_header, jwt_secret)
        
        else:
            return error_response('Method not allowed', 405)
    
    except Exception as e:
        return error_response(f'Server error: {str(e)}', 500)
    finally:
        if 'conn' in locals():
            conn.close()


def handle_register(conn, schema: str, data: dict, jwt_secret: str) -> dict:
    """Регистрация нового пользователя"""
    
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    full_name = data.get('full_name', '').strip()
    phone = data.get('phone', '').strip()
    
    if not all([email, password, full_name, phone]):
        return error_response('All fields are required', 400)
    
    if len(password) < 6:
        return error_response('Password must be at least 6 characters', 400)
    
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute(f'SELECT id FROM {schema}.users WHERE email = %s', (email,))
        if cursor.fetchone():
            return error_response('Email already registered', 400)
        
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        cursor.execute(f'''
            INSERT INTO {schema}.users (email, password_hash, full_name, phone, role)
            VALUES (%s, %s, %s, %s, 'client')
            RETURNING id, email, full_name, phone, role, created_at
        ''', (email, password_hash, full_name, phone))
        
        user = cursor.fetchone()
        conn.commit()
        
        token = generate_token(user['id'], user['email'], user['role'], jwt_secret)
        
        return success_response({
            'token': token,
            'user': {
                'id': user['id'],
                'email': user['email'],
                'full_name': user['full_name'],
                'phone': user['phone'],
                'role': user['role']
            }
        })
        
    except Exception as e:
        conn.rollback()
        return error_response(f'Registration failed: {str(e)}', 500)


def handle_login(conn, schema: str, data: dict, jwt_secret: str) -> dict:
    """Вход пользователя"""
    
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    
    if not email or not password:
        return error_response('Email and password are required', 400)
    
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute(f'''
            SELECT id, email, password_hash, full_name, phone, role
            FROM {schema}.users
            WHERE email = %s
        ''', (email,))
        
        user = cursor.fetchone()
        
        if not user:
            return error_response('Invalid email or password', 401)
        
        if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            return error_response('Invalid email or password', 401)
        
        token = generate_token(user['id'], user['email'], user['role'], jwt_secret)
        
        return success_response({
            'token': token,
            'user': {
                'id': user['id'],
                'email': user['email'],
                'full_name': user['full_name'],
                'phone': user['phone'],
                'role': user['role']
            }
        })
        
    except Exception as e:
        return error_response(f'Login failed: {str(e)}', 500)


def handle_verify(auth_header: str, jwt_secret: str) -> dict:
    """Проверка валидности токена"""
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return error_response('Invalid authorization header', 401)
    
    token = auth_header.replace('Bearer ', '')
    
    try:
        payload = jwt.decode(token, jwt_secret, algorithms=['HS256'])
        return success_response({
            'valid': True,
            'user': {
                'id': payload['user_id'],
                'email': payload['email'],
                'role': payload['role']
            }
        })
    except jwt.ExpiredSignatureError:
        return error_response('Token expired', 401)
    except jwt.InvalidTokenError:
        return error_response('Invalid token', 401)


def generate_token(user_id: int, email: str, role: str, jwt_secret: str) -> str:
    """Генерация JWT токена"""
    
    payload = {
        'user_id': user_id,
        'email': email,
        'role': role,
        'exp': datetime.utcnow() + timedelta(days=30)
    }
    
    return jwt.encode(payload, jwt_secret, algorithm='HS256')


def success_response(data: dict) -> dict:
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(data),
        'isBase64Encoded': False
    }


def error_response(message: str, status_code: int) -> dict:
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': message}),
        'isBase64Encoded': False
    }