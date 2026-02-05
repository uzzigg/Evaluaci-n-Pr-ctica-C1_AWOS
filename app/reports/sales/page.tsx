export const dynamic = "force-dynamic";

import { Pool } from "pg";
import { z } from "zod";

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "postgres",
  port: Number(process.env.DB_PORT) || 5432,
});

const schema = z.object({
  date_from: z.string().default(""),
  date_to: z.string().default(""),
});

export default async function Page({ searchParams }: any) {
  const { date_from, date_to } = schema.parse(searchParams);

  try {
    // Construir query dinámicamente
    let query = "SELECT * FROM vw_sales_daily WHERE 1=1";
    const values: any[] = [];

    if (date_from) {
      values.push(date_from);
      query += ` AND day >= $${values.length}`;
    }

    if (date_to) {
      values.push(date_to);
      query += ` AND day <= $${values.length}`;
    }

    query += " ORDER BY day DESC";

    const { rows } = await pool.query(query, values);

    return (
      <div>
        <h1>Ventas diarias</h1>

        <form>
          <input
            name="date_from"
            type="date"
            defaultValue={date_from}
          />
          <input
            name="date_to"
            type="date"
            defaultValue={date_to}
          />
          <button type="submit">Filtrar</button>
          {(date_from || date_to) && (
            <a href="/reports/sales">Limpiar</a>
          )}
        </form>

        <p>Total registros: {rows.length}</p>

        <table border={1}>
          <thead>
            <tr>
              <th>Día</th>
              <th>Total</th>
              <th>Tickets</th>
              <th>Promedio</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r: any, i: number) => (
              <tr key={i}>
                <td>
                  {new Date(r.day).toLocaleDateString()}
                </td>
                <td>{r.total_sales}</td>
                <td>{r.tickets}</td>
                <td>{r.avg_ticket}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } catch (error) {
    console.error("Error:", error);
    return <div>Error cargando datos: {String(error)}</div>;
  }
}