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

const FilterSchema = z.object({
  date_from: z.string().optional().transform(val => val && val.match(/^\d{4}-\d{2}-\d{2}$/) ? val : undefined),
  date_to: z.string().optional().transform(val => val && val.match(/^\d{4}-\d{2}-\d{2}$/) ? val : undefined),
});

interface SalesRow {
  day: Date;
  total_sales: number;
  tickets: number;
  avg_ticket: number;
}

export default async function Page({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const { date_from, date_to } = FilterSchema.parse(params);

  try {
    const sqlQuery = `
      SELECT day, total_sales, tickets, avg_ticket
      FROM vw_sales_daily 
      WHERE ($1::DATE IS NULL OR day >= $1)
        AND ($2::DATE IS NULL OR day <= $2)
      ORDER BY day DESC
    `;

    const { rows } = await pool.query(sqlQuery, [date_from || null, date_to || null]);
    
    const total = rows.reduce((acc, r) => acc + Number(r.total_sales), 0);

    return (
      <div style={{ padding: "2rem" }}>
        <h1>Ventas diarias</h1>

        <form style={{ margin: "1.5rem 0", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div>
            <label htmlFor="date_from" style={{ display: "block", marginBottom: "0.5rem" }}>Desde</label>
            <input
              id="date_from"
              name="date_from"
              type="date"
              defaultValue={date_from || ""}
              style={{ padding: "0.5rem" }}
            />
          </div>
          <div>
            <label htmlFor="date_to" style={{ display: "block", marginBottom: "0.5rem" }}>Hasta</label>
            <input
              id="date_to"
              name="date_to"
              type="date"
              defaultValue={date_to || ""}
              style={{ padding: "0.5rem" }}
            />
          </div>
          <button type="submit" style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
            Filtrar
          </button>
          {(date_from || date_to) && (
            <a href="/reports/sales" style={{ padding: "0.5rem 1rem", textDecoration: "none" }}>
              Limpiar
            </a>
          )}
        </form>

        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ maxWidth: "250px", padding: "1rem", border: "1px solid #ccc", borderRadius: "4px" }}>
            <div style={{ fontSize: "0.875rem", color: "#666" }}>Total del Período</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>${total.toFixed(2)}</div>
          </div>
        </div>

        <p style={{ marginBottom: "1rem" }}>Total registros: {rows.length}</p>

        <div style={{ overflowX: "auto" }}>
          <table border={1} style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Día</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Total</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Tickets</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Promedio</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                (rows as SalesRow[]).map((r, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "0.75rem" }}>
                      {new Date(r.day).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      ${Number(r.total_sales).toFixed(2)}
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      {r.tickets}
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      ${Number(r.avg_ticket).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ padding: "1rem", textAlign: "center", color: "#666" }}>
                    No hay datos disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error:", error);
    return (
      <div style={{ padding: "2rem", color: "#d32f2f" }}>
        Error cargando datos: {String(error)}
      </div>
    );
  }
}