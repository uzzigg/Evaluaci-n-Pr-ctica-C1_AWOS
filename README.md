# Dashboard de Analítica — Gestión de Cafetería

Esta aplicación desarrollada en Next.js y TypeScript permite la visualización de reportes operativos mediante el consumo de Views en PostgreSQL. La arquitectura delega la lógica de agregación de datos al motor de base de datos, optimizando el rendimiento del servidor.

---

## Stack Tecnológico

* **Framework:** Next.js (App Router) con TypeScript
* **Base de Datos:** PostgreSQL 15
* **Contenedorización:** Docker & Docker Compose
* **Conectividad:** pg (Pool de conexiones)
* **Validación:** Zod para esquemas de datos y parámetros de consulta

---

## Modelo de Datos

El sistema utiliza un esquema relacional normalizado que incluye las tablas:
`categories`, `products`, `customers`, `orders`, `order_items` y `payments`.

---

## Vistas de Inteligencia de Negocio

Se implementaron vistas especializadas para desacoplar la lógica de negocio y centralizar los cálculos:

* **vw_sales_daily:** 
Resumen cronológico de ventas, tickets emitidos y promedio por transacción.

* **vw_top_products_ranked:** 
Clasificación de productos por ingresos mediante funciones de ventana (Window Functions).

* **vw_inventory_risk:** 
Monitor de existencias con clasificación de riesgo (Bajo, Medio, Crítico) según niveles de stock.

* **vw_customer_value:** 
Análisis de fidelización basado en frecuencia de pedidos y gasto acumulado por cliente.

* **vw_payment_mix:** 
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

```sql
SET ROLE app_user;
SELECT * FROM products; -- Error: Permiso denegado
SELECT * FROM vw_sales_daily; -- Éxito: Acceso permitido
```

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

## Requisitos

- Docker y Docker Compose instalados
- Git

---

## Instrucciones de Despliegue

### 1. Clonar o descargar el proyecto

```bash
git clone <tu-repositorio>
cd evaluacion_1
```

### 2. Ejecutar con Docker Compose

Para construir las imágenes y levantar los contenedores:

```bash
docker compose up --build
```

En futuras ocasiones (sin cambios en dependencias):

```bash
docker compose up
```

### 3. Acceder a la aplicación

Una vez que veas en la consola que el servicio está listo, abre tu navegador en:

```
http://localhost:3000
```

---

## Configuración de Servicios

### Base de Datos (PostgreSQL 15)

* **Host:** `db` (interno dentro de Docker)
* **Usuario:** `postgres`
* **Contraseña:** `postgres`
* **Base de datos:** `postgres`
* **Puerto:** `5432`

La BD se inicializa automáticamente con:
- Schema base (`schema.sql`)
- Datos de prueba (`seed.sql`)
- Vistas de reportes (`reports_vw.sql`)
- Índices (`indexes.sql`)
- Roles y permisos (`roles.sql`)

### Aplicación Web (Next.js)

* **URL:** `http://localhost:3000`
* **Puerto:** `3000`
* **Conexión a BD:** Variables de entorno (ver sección siguiente)

---

## Variables de Entorno

La configuración se realiza automáticamente en `docker-compose.yml`. No requiere archivo `.env` local:

```env
DB_HOST: db              # Host del contenedor PostgreSQL
DB_USER: app_user        # Usuario de la aplicación
DB_PASSWORD: apppass     # Contraseña de la aplicación
DB_NAME: postgres        # Nombre de la base de datos
DB_PORT: 5432            # Puerto PostgreSQL
```

---

## Comandos Útiles

### Ver logs de los servicios

```bash
# Todos los servicios
docker compose logs -f

# Solo la BD
docker compose logs -f db

# Solo la web
docker compose logs -f web
```

### Detener los servicios

```bash
docker compose down
```

### Detener y eliminar volúmenes 

```bash
docker compose down -v
```

### Reconstruir después de cambios en dependencias

```bash
docker compose up --build
```

---

## Estructura del Proyecto

```
evaluacion_1/
├── app/                      # Aplicación Next.js
│   ├── reports/
│   │   └── sales/
│   │       └── page.tsx      # Página de reportes con filtro de fechas
│   └── ...
├── db/                        # Scripts de inicialización
│   ├── schema.sql
│   ├── seed.sql
│   ├── reports_vw.sql
│   ├── indexes.sql
│   └── roles.sql
├── lib/
│   └── db.ts                  # Conexión a PostgreSQL
├── docker-compose.yml         # Orquestación de servicios
├── Dockerfile                 # Imagen de la aplicación
├── .dockerignore              # Archivos ignorados en Docker
├── package.json
└── README.md
```

---

## Desarrollo Local (sin Docker)

Si prefieres desarrollar sin Docker:

1. Instala PostgreSQL localmente
2. Crea un archivo `.env.local`:

```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=postgres
DB_PORT=5432
```

3. Ejecuta:

```bash
npm install
npm run dev
```

---

## Solución de Problemas

### El contenedor web no conecta a la BD

- Verifica que ambos servicios estén corriendo: `docker compose ps`
- Revisa los logs: `docker compose logs db`
- Asegúrate de que el `healthcheck` de la BD pasó correctamente

### Puerto 3000 ya está en uso

```bash
docker compose down  # Detén primero
docker compose up    # Luego levanta de nuevo
```

### Cambios en código no se reflejan

Reinicia el contenedor:

```bash
docker compose restart web
```

---

## Notas de Seguridad

Para **producción**, modifica en `docker-compose.yml`:

- Contraseñas de BD (variables `POSTGRES_PASSWORD`, `DB_PASSWORD`)
- Usuario de la aplicación (variable `DB_USER`)
- Variables en archivos `.env` seguros, nunca en repositorio

---
