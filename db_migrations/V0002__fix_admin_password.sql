-- Обновление пароля администратора для тестов
-- Новый пароль: admin123 (правильный хэш bcrypt)

UPDATE users 
SET password_hash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5lSLj8YbZdXZG'
WHERE email = 'admin@transfer-abkhazia.ru';
