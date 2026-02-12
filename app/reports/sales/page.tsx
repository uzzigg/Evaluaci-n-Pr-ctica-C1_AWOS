export const dynamic = "force-dynamic";

import Link from "next/link";
import { getSalesData, type SalesRow } from "@/backend/sales";
import { z } from "zod";

const FilterSchema = z.object({
  date_from: z.string().optional().transform(val => val && val.match(/^\d{4}-\d{2}-\d{2}$/) ? val : undefined),
  date_to: z.string().optional().transform(val => val && val.match(/^\d{4}-\d{2}-\d{2}$/) ? val : undefined),
});

export default async function Page({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const { date_from, date_to } = FilterSchema.parse(params);

  try {
    const rows = await getSalesData(date_from, date_to);
    
    const total = rows.reduce((acc, r) => acc + Number(r.total_sales), 0);

    return (
      <div>
        <Link href="/" className="back-link">
          ← Volver al inicio
        </Link>

        <h1>Ventas diarias</h1>

        <form>
          <div>
            <label htmlFor="date_from">Desde</label>
            <input
              id="date_from"
              name="date_from"
              type="date"
              defaultValue={date_from || ""}
            />
          </div>
          <div>
            <label htmlFor="date_to">Hasta</label>
            <input
              id="date_to"
              name="date_to"
              type="date"
              defaultValue={date_to || ""}
            />
          </div>
          <button type="submit">
            Filtrar
          </button>
          {(date_from || date_to) && (
            <a href="/reports/sales">
              Limpiar
            </a>
          )}
        </form>

        <div className="info-box">
          <div className="label">Total del Período</div>
          <div className="value">${total.toFixed(2)}</div>
        </div>

        <p>Total registros: {rows.length}</p>

        <div className="table-container">
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
              {rows.length > 0 ? (
                (rows as SalesRow[]).map((r, i) => (
                  <tr key={i}>
                    <td>
                      {new Date(r.day).toLocaleDateString()}
                    </td>
                    <td>
                      ${Number(r.total_sales).toFixed(2)}
                    </td>
                    <td>
                      {r.tickets}
                    </td>
                    <td>
                      ${Number(r.avg_ticket).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>
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
      <div>
        Error cargando datos: {String(error)}
      </div>
    );
  }
}