INSERT INTO categories (name) VALUES
('Bebidas'), ('Postres'), ('Snacks');

INSERT INTO products (name, category_id, price, stock) VALUES
('Café Latte',1,60,50),
('Capuccino',1,55,40),
('Cheesecake',2,80,10),
('Brownie',2,45,5),
('Sandwich',3,70,20);

INSERT INTO customers (name,email) VALUES
('Juan Perez','juan@mail.com'),
('Ana Lopez','ana@mail.com'),
('Luis Diaz','luis@mail.com');

-- Generar varias órdenes
INSERT INTO orders (customer_id,status,channel,created_at) VALUES
(1,'paid','store','2025-01-01'),
(2,'paid','app','2025-01-02'),
(1,'paid','store','2025-01-03'),
(3,'paid','app','2025-01-04');

INSERT INTO order_items (order_id,product_id,qty,unit_price) VALUES
(1,1,2,60),
(1,3,1,80),
(2,2,1,55),
(2,4,2,45),
(3,1,1,60),
(4,5,1,70);

INSERT INTO payments (order_id,method,paid_amount) VALUES
(1,'cash',200),
(2,'card',145),
(3,'card',60),
(4,'cash',70);