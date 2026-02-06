-- Vista: Resumen de ventas diarias
-- Calcula el total vendido, número de tickets y el promedio por ticket agrupado por día.
-- Filtro: Solo incluye días con ventas mayores a 0.

-- Ejemplo de uso:
-- SELECT * FROM vw_sales_daily ORDER BY day DESC;

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



-- Vista: Ranking de productos más vendidos
-- Calcula unidades totales e ingresos por producto, asignando un lugar en el ranking (rank).
-- Basado en: Monto total de ventas acumulado.

-- Ejemplo: SELECT * FROM vw_top_products_ranked WHERE rank <= 10;

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



-- Vista: Análisis de riesgo de stock por producto
-- Categoriza el nivel de riesgo según existencias: <10 (HIGH), <20 (MEDIUM), resto (LOW).
-- Ayuda a identificar qué productos necesitan reabastecimiento urgente.

-- Ejemplo: Ver solo productos críticos
-- SELECT * FROM vw_inventory_risk WHERE risk_level = 'HIGH';

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



-- Vista: Perfil de valor del cliente
-- Consolida el historial de compras: número de pedidos, gasto total y promedio por compra.
-- Útil para identificar clientes VIP o con mayor frecuencia de compra.

-- Ejemplo: Top 5 clientes que más han gastado
-- SELECT * FROM vw_customer_value ORDER BY total_spent DESC LIMIT 5;

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




-- Vista: Mix de métodos de pago
-- Calcula el monto total recaudado por cada método (efectivo, tarjeta, etc.) y su peso porcentual.
-- Ayuda a entender la preferencia de pago de los clientes sobre el total de ingresos.

-- Ejemplo de uso:
-- SELECT * FROM vw_payment_mix ORDER BY percentage DESC;

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