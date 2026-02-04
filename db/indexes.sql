CREATE INDEX idx_orders_date ON orders(created_at);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_order_items_product ON order_items(product_id);