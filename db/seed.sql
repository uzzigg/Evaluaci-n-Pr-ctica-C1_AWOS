-- 1. CATEGORÍAS
INSERT INTO categories (name) VALUES 
('Bebidas'), ('Postres'), ('Snacks'), ('Comida Caliente');

-- 2. PRODUCTOS (IDs del 1 al 10)
INSERT INTO products (name, category_id, price, stock) VALUES
('Mocha', 1, 65, 30),
('Té Chai', 1, 50, 25),
('Galleta', 3, 20, 40),
('Muffin Arándano', 2, 35, 15),
('Bagel Cream Cheese', 3, 45, 18),
('Oreo Cake', 2, 55, 12),
('Tostada Aguacate', 4, 85, 8),
('Capuccino', 1, 55, 20),
('Agua Ciel', 1, 25, 50),
('Té Jamaica', 1, 35, 28);


INSERT INTO customers (name, email) VALUES
('Carlos Ruiz', 'carlos@mail.com'), ('Maria Torres', 'maria@mail.com'),
('Pedro Lopez', 'pedro@mail.com'), ('Sofia Garcia', 'sofia@mail.com'),
('Diego Martinez', 'diego@mail.com'), ('Laura Rivas', 'laura@mail.com'),
('Jorge Cano', 'jorge@mail.com'), ('Elena Sanz', 'elena@mail.com'),
('Ana Mendez', 'ana@mail.com'), ('Beto Ortiz', 'beto@mail.com');


INSERT INTO orders (customer_id, status, channel, created_at) VALUES
(1, 'paid', 'store', '2025-01-05'), (2, 'paid', 'app', '2025-01-06'),
(3, 'paid', 'store', '2025-01-07'), (4, 'paid', 'app', '2025-01-08'),
(5, 'paid', 'store', '2025-01-09'), (6, 'paid', 'app', '2025-01-10'),
(7, 'paid', 'store', '2025-01-11'), (8, 'paid', 'app', '2025-01-12'),
(9, 'paid', 'store', '2025-01-13'), (10, 'paid', 'app', '2025-01-14'),
(1, 'paid', 'store', '2025-01-15'), (2, 'paid', 'app', '2025-01-16'),
(3, 'paid', 'store', '2025-01-17'), (4, 'paid', 'app', '2025-01-18'),
(5, 'paid', 'store', '2025-01-19'), (6, 'paid', 'app', '2025-01-20'),
(7, 'paid', 'store', '2025-01-21'), (8, 'paid', 'app', '2025-01-22'),
(9, 'paid', 'store', '2025-01-23'), (10, 'paid', 'app', '2025-01-24'),
(1, 'paid', 'store', '2025-02-01'), (2, 'paid', 'app', '2025-02-02'),
(3, 'paid', 'store', '2025-02-03'), (4, 'paid', 'app', '2025-02-04'),
(5, 'paid', 'store', '2025-02-05');


INSERT INTO order_items (order_id, product_id, qty, unit_price) VALUES
(1, 1, 2, 65), (2, 2, 1, 50), (3, 3, 5, 20), (4, 4, 1, 35), (5, 5, 2, 45),
(6, 6, 1, 55), (7, 7, 2, 85), (8, 8, 1, 55), (9, 9, 3, 25), (10, 10, 2, 35),
(11, 1, 1, 65), (12, 2, 2, 50), (13, 3, 10, 20), (14, 4, 2, 35), (15, 5, 1, 45),
(16, 6, 2, 55), (17, 7, 1, 85), (18, 8, 3, 55), (19, 9, 4, 25), (20, 10, 1, 35),
(21, 1, 2, 65), (22, 2, 1, 50), (23, 3, 2, 20), (24, 4, 1, 35), (25, 5, 2, 45);

-- 6. PAGOS
INSERT INTO payments (order_id, method, paid_amount) VALUES
(1, 'cash', 130), (2, 'card', 50), (3, 'card', 100), (4, 'cash', 35), (5, 'card', 90),
(6, 'cash', 55), (7, 'card', 170), (8, 'cash', 55), (9, 'card', 75), (10, 'cash', 70),
(11, 'card', 65), (12, 'cash', 100), (13, 'card', 200), (14, 'cash', 70), (15, 'card', 45),
(16, 'cash', 110), (17, 'card', 85), (18, 'cash', 165), (19, 'card', 100), (20, 'cash', 35),
(21, 'card', 130), (22, 'cash', 50), (23, 'card', 40), (24, 'cash', 35), (25, 'card', 90);