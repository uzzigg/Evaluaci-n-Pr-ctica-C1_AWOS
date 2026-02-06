# Dashboard de Analítica — Gestión de Cafetería

Esta aplicación desarrollada en Next.js y TypeScript permite la visualización de reportes operativos mediante el consumo de Views en PostgreSQL. La arquitectura delega la lógica de agregación de datos al motor de base de datos, optimizando el rendimiento del servidor.

---

## Stack Tecnológico

* **Framework:** Next.js (App Router) con TypeScript
* **Base de Datos:** PostgreSQL
* **Conectividad:** pg (Pool de conexiones)
* **Validación:** Zod para esquemas de datos y parámetros de consulta

---

## Modelo de Datos

El sistema utiliza un esquema relacional normalizado que incluye las tablas:
`categories`, `products`, `customers`, `orders`, `order_items` y `payments`.

---

## Vistas de Inteligencia de Negocio

Se implementaron vistas especializadas para desacoplar la lógica de negocio y centralizar los cálculos:

* vw_sales_daily: 
Resumen cronológico de ventas, tickets emitidos y promedio por transacción.

* vw_top_products_ranked: 
Clasificación de productos por ingresos mediante funciones de ventana (Window Functions).

* vw_inventory_risk: 
Monitor de existencias con clasificación de riesgo (Bajo, Medio, Crítico) según niveles de stock.

* vw_customer_value: 
Análisis de fidelización basado en frecuencia de pedidos y gasto acumulado por cliente.

* vw_payment_mix: 
Distribución porcentual de ingresos según el método de pago utilizado.

---

## Funcionalidades de Consulta

La interfaz gestiona el volumen de datos mediante las siguientes estrategias:

* **Filtros:** Segmentación por rangos de fechas en reportes de ventas.
* **Búsqueda:** Filtrado por nombre en el ranking de productos.
* **Paginación:** Gestión de carga en el servidor para los listados de mayor volumen.
* **Seguridad:** Consultas parametrizadas y validación de tipos estricta con Zod.

---

## Seguridad y Acceso

Siguiendo el principio de menor privilegio, la aplicación no utiliza credenciales de superusuario. Se configuró un usuario dedicado:

* **Usuario:** `app_user`
* **Permisos:** Acceso exclusivo de lectura (SELECT) sobre las vistas del esquema público.

### Verificación de seguridad

Restricciones aplicadas a nivel de base de datos:


SET ROLE app_user;
SELECT * FROM products; -- Error: Permiso denegado
SELECT * FROM vw_sales_daily; -- Éxito: Acceso permitido


---

## Optimización y Rendimiento

### Índices

Se crearon índices para mejorar el tiempo de respuesta en consultas críticas:

* `orders(created_at)`
* `products(name)`
* `order_items(product_id)`

### Evidencia de ejecución

El uso de `EXPLAIN` confirma que los índices reducen los costos de búsqueda en las operaciones de Join y filtrado por fechas.

---

## Instrucciones de Despliegue

### 1. Configuración de Base de Datos

Ejecutar los scripts SQL en el siguiente orden:

* `schema.sql`
* `seed.sql`
* `reports_vw.sql`
* `indexes.sql`
* `roles.sql`

### 2. Configuración de Conexión

En el archivo `lib/db.ts`, validar las credenciales:

user: "app_user"
password: "apppass"
database: "postgres"


### 3. Ejecución del Proyecto

npm install
npm run dev


