-- Создание таблиц для системы трансфера

-- Таблица пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    role VARCHAR(20) DEFAULT 'client' CHECK (role IN ('client', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица тарифов
CREATE TABLE tariffs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    price_per_km DECIMAL(10, 2),
    max_passengers INTEGER NOT NULL,
    features TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица автомобилей
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    seats INTEGER NOT NULL,
    image_url TEXT,
    features TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица маршрутов
CREATE TABLE routes (
    id SERIAL PRIMARY KEY,
    from_location VARCHAR(255) NOT NULL,
    to_location VARCHAR(255) NOT NULL,
    distance_km DECIMAL(10, 2),
    duration_minutes INTEGER,
    base_price DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица заявок (бронирований)
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    guest_name VARCHAR(255),
    guest_phone VARCHAR(50),
    guest_email VARCHAR(255),
    from_location VARCHAR(255) NOT NULL,
    to_location VARCHAR(255) NOT NULL,
    travel_date DATE NOT NULL,
    travel_time TIME NOT NULL,
    passengers INTEGER NOT NULL,
    tariff_id INTEGER REFERENCES tariffs(id),
    vehicle_id INTEGER REFERENCES vehicles(id),
    total_price DECIMAL(10, 2),
    payment_method VARCHAR(50) CHECK (payment_method IN ('prepay_50', 'full_payment', 'cash')),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded')),
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица платежей
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id),
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending',
    transaction_id VARCHAR(255),
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица рекламных блоков
CREATE TABLE advertisements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    image_url TEXT,
    link_url TEXT,
    position VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_travel_date ON bookings(travel_date);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_payments_booking_id ON payments(booking_id);

-- Вставка начальных данных для тарифов
INSERT INTO tariffs (name, category, description, base_price, price_per_km, max_passengers, features) VALUES
('Эконом', 'economy', 'Комфортные седаны для повседневных поездок', 1800.00, 25.00, 4, ARRAY['До 4 пассажиров', 'Кондиционер', 'Опытный водитель', 'Чистый автомобиль']),
('Комфорт', 'comfort', 'Просторные минивэны для семейных поездок', 3500.00, 40.00, 7, ARRAY['До 7 пассажиров', 'Багажное отделение', 'Детские кресла', 'Wi-Fi на борту']),
('VIP', 'vip', 'Премиальные автомобили для особых случаев', 5000.00, 60.00, 7, ARRAY['Бизнес-класс', 'Кожаный салон', 'Персональный сервис', 'Напитки в салоне']);

-- Вставка начальных данных для автомобилей
INSERT INTO vehicles (name, model, category, seats, image_url, features) VALUES
('Toyota Vellfire', 'Toyota Vellfire', 'VIP', 7, 'https://cdn.poehali.dev/projects/d163404f-065f-4a89-9e0a-737f43549a8e/files/0ada021e-a637-4aeb-aa3b-ffede31e3539.jpg', ARRAY['Кожаный салон', 'Климат-контроль', 'Wi-Fi']),
('Toyota Voxy', 'Toyota Voxy', 'Комфорт', 7, 'https://cdn.poehali.dev/projects/d163404f-065f-4a89-9e0a-737f43549a8e/files/0ada021e-a637-4aeb-aa3b-ffede31e3539.jpg', ARRAY['Просторный салон', 'Кондиционер', 'USB порты']),
('Toyota Prius', 'Toyota Prius', 'Эконом', 4, 'https://cdn.poehali.dev/projects/d163404f-065f-4a89-9e0a-737f43549a8e/files/f2754206-df7c-43ee-9d66-d32c146aa2e4.jpg', ARRAY['Гибрид', 'Экономичный', 'Комфортный']),
('Honda StepWagn', 'Honda StepWagn', 'Комфорт', 7, 'https://cdn.poehali.dev/projects/d163404f-065f-4a89-9e0a-737f43549a8e/files/0ada021e-a637-4aeb-aa3b-ffede31e3539.jpg', ARRAY['Семейный', 'Багажник', 'Безопасность']),
('Hyundai Solaris', 'Hyundai Solaris', 'Эконом', 4, 'https://cdn.poehali.dev/projects/d163404f-065f-4a89-9e0a-737f43549a8e/files/f2754206-df7c-43ee-9d66-d32c146aa2e4.jpg', ARRAY['Надёжный', 'Бюджетный', 'Городской']),
('Volkswagen Polo', 'Volkswagen Polo', 'Эконом', 4, 'https://cdn.poehali.dev/projects/d163404f-065f-4a89-9e0a-737f43549a8e/files/f2754206-df7c-43ee-9d66-d32c146aa2e4.jpg', ARRAY['Немецкое качество', 'Экономичный', 'Надёжный']);

-- Вставка популярных маршрутов
INSERT INTO routes (from_location, to_location, distance_km, duration_minutes, base_price) VALUES
('Аэропорт Сочи', 'Гагра', 80, 90, 3500.00),
('Аэропорт Сочи', 'Пицунда', 100, 120, 4000.00),
('Аэропорт Сочи', 'Сухум', 150, 180, 5000.00),
('Гагра', 'Новый Афон', 40, 60, 2000.00),
('Сухум', 'Гудаута', 30, 45, 1500.00),
('Пицунда', 'Рица', 70, 120, 4500.00);

-- Создание администратора по умолчанию (пароль: admin123)
INSERT INTO users (email, password_hash, full_name, phone, role) VALUES
('admin@transfer-abkhazia.ru', '$2b$10$rXJp0kqM6YqVvQd6z4bPnuZvN9vwX8YfK7nUO/EKmB8Z3xGpqh1xS', 'Администратор', '+7 (999) 123-45-67', 'admin');
