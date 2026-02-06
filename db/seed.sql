INSERT INTO categories (name) VALUES
('Bebidas'), ('Postres'), ('Snacks');

INSERT INTO products (name, category_id, price, stock) VALUES
('Mocha', 1, 65, 30),
('Té Chai', 1, 50, 25),
('Galleta', 3, 20, 40),
('Muffin', 2, 35, 15),
('Bagel', 3, 45, 18);

-- Agregamos 8 clientes para que coincidan con los IDs de las órdenes
INSERT INTO customers (name, email) VALUES
('Carlos Ruiz', 'carlos@mail.com'),
('Maria Torres', 'maria@mail.com'),
('Pedro Lopez', 'pedro@mail.com'),
('Sofia Garcia', 'sofia@mail.com'),
('Diego Martinez', 'diego@mail.com'),
('Laura Rivas', 'laura@mail.com'),
('Jorge Cano', 'jorge@mail.com'),
('Elena Sanz', 'elena@mail.com');

-- Generar órdenes (ahora todos los customer_id existen)
INSERT INTO orders (customer_id, status, channel, created_at) VALUES
(1, 'paid', 'store', '2025-01-05'),
(2, 'paid', 'app', '2025-01-06'),
(3, 'paid', 'store', '2025-01-07'),
(4, 'paid', 'app', '2025-01-08'),
(5, 'paid', 'store', '2025-01-09'),
(6, 'paid', 'app', '2025-01-10'),
(7, 'paid', 'store', '2025-01-11'),
(8, 'paid', 'app', '2025-01-12'),
(2, 'paid', 'store', '2025-01-13'),
(3, 'paid', 'app', '2025-01-14'),
(4, 'paid', 'store', '2025-01-15'),
(5, 'paid', 'app', '2025-01-16'),
(6, 'paid', 'store', '2025-01-17'),
(7, 'paid', 'app', '2025-01-18'),
(8, 'paid', 'store', '2025-01-19');

-- Ajuste de order_id (comienzan en 1) y product_id válidos (1 al 5)
INSERT INTO order_items (order_id, product_id, qty, unit_price) VALUES
(1, 1, 2, 65), (2, 2, 1, 50), (3, 3, 2, 20), (4, 4, 1, 35), (5, 5, 2, 45),
(6, 1, 1, 65), (7, 2, 3, 50), (8, 3, 2, 20), (9, 4, 1, 35), (10, 5, 2, 45),
(11, 1, 1, 65), (12, 2, 2, 50), (13, 3, 1, 20), (14, 4, 3, 35), (15, 5, 2, 45);

INSERT INTO payments (order_id, method, paid_amount) VALUES
(1, 'cash', 130), (2, 'card', 50), (3, 'card', 40), (4, 'cash', 35), (5, 'card', 90),
(6, 'cash', 65), (7, 'card', 150), (8, 'cash', 40), (9, 'card', 35), (10, 'cash', 90),
(11, 'card', 65), (12, 'cash', 100), (13, 'card', 20), (14, 'cash', 105), (15, 'card', 90);