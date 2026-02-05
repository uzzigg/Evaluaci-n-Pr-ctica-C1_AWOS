import { pool } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  date_from: z.string().optional(),
  date_to: z.string().optional(),
});

export default async function Page({ searchParams }: any) {
  const parsed = schema.safeParse(searchParams);

  const dateFrom = parsed.success ? parsed.data.date_from : undefined;
  const dateTo = parsed.success ? parsed.data.date_to : undefined;

  let query = "SELECT * FROM vw_sales_daily WHERE 1=1";
  const values: any[] = [];

  if (dateFrom) {
    values.push(dateFrom);
    query += ` AND day >= $${values.length}`;
  }

  if (dateTo) {
    values.push(dateTo);
    query += ` AND day <= $${values.length}`;
  }

  const { rows } = await pool.query(query, values);

  return (
    <div>
      <h1>Ventas diarias</h1>

      {/* Formulario de filtros */}
      <form>
        <input name="date_from" type="date" />
        <input name="date_to" type="date" />
        <button type="submit">Filtrar</button>
      </form>

      {/* Tabla */}
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
}