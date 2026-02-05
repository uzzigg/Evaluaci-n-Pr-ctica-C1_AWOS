CREATE VIEW vw_sales_daily AS
SELECT 
  DATE(o.created_at) as day,
  SUM(p.paid_amount) as total_sales,
  COUNT(DISTINCT o.id) as tickets,
  ROUND(SUM(p.paid_amount)/COUNT(DISTINCT o.id),2) as avg_ticket
FROM orders o
JOIN payments p ON o.id=p.order_id
GROUP BY DATE(o.created_at)
HAVING SUM(p.paid_amount) > 0;

CREATE VIEW vw_top_products_ranked AS
SELECT
  pr.id,
  pr.name,
  SUM(oi.qty) as units,
  SUM(oi.qty*oi.unit_price) as revenue,
  RANK() OVER (ORDER BY SUM(oi.qty*oi.unit_price) DESC) as rank
FROM products pr
JOIN order_items oi ON pr.id=oi.product_id
GROUP BY pr.id,pr.name;

CREATE VIEW vw_inventory_risk AS
SELECT
  c.name as category,
  p.name as product,
  p.stock,
  CASE 
    WHEN p.stock<10 THEN 'HIGH'
    WHEN p.stock<20 THEN 'MEDIUM'
    ELSE 'LOW'
  END as risk_level
FROM products p
JOIN categories c ON p.category_id=c.id;

CREATE VIEW vw_customer_value AS
SELECT
  c.id,
  c.name,
  COUNT(o.id) as num_orders,
  SUM(pa.paid_amount) as total_spent,
  ROUND(SUM(pa.paid_amount)/COUNT(o.id),2) as avg_spent
FROM customers c
JOIN orders o ON c.id=o.customer_id
JOIN payments pa ON o.id=pa.order_id
GROUP BY c.id,c.name;

CREATE VIEW vw_payment_mix AS
WITH totals AS (
  SELECT SUM(paid_amount) as total FROM payments
)
SELECT
  method,
  SUM(paid_amount) as total,
  ROUND(100*SUM(paid_amount)/(SELECT total FROM totals),2) as percentage
FROM payments
GROUP BY method;