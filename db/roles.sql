CREATE ROLE app_user LOGIN PASSWORD 'apppass';

GRANT CONNECT ON DATABASE postgres TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;

GRANT SELECT ON
  vw_sales_daily,
  vw_top_products_ranked,
  vw_inventory_risk,
  vw_customer_value,
  vw_payment_mix
TO app_user;