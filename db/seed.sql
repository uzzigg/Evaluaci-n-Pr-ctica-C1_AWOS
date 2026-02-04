CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category_id INT REFERENCES categories(id),
  price NUMERIC(10,2),
  stock INT,
  active BOOLEAN DEFAULT true
);

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150),
  email VARCHAR(150) UNIQUE
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(id),
  created_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50),
  channel VARCHAR(50)
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id),
  product_id INT REFERENCES products(id),
  qty INT,
  unit_price NUMERIC(10,2)
);

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id),
  method VARCHAR(50),
  paid_amount NUMERIC(10,2)
);