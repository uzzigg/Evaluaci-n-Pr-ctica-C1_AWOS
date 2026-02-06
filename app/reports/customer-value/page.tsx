export const dynamic = "force-dynamic";

import Link from "next/link";
import { pool } from "@/lib/db";
import { z } from "zod";

const PaginationSchema = z.object({
  page: z.string().transform(Number).pipe(z.number().positive()).catch(1),
});

interface CustomerRow {
  id: number;
  name: string;
  num_orders: number;
  total_spent: number;
  avg_spent: number;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const { page } = PaginationSchema.parse(params);
  
  const limit = 5;
  const offset = (page - 1) * limit;

  try {
    // Query única que obtiene datos y permite saber si hay más páginas
    const sql = `
      SELECT id, name, num_orders, total_spent, avg_spent
      FROM vw_customer_value 
      ORDER BY total_spent DESC 
      LIMIT $1 OFFSET $2
    `;

    const { rows } = await pool.query(sql, [limit + 1, offset]);

    // Si traemos más de limit registros, hay siguiente página
    const hasNextPage = rows.length > limit;
    const displayRows = rows.slice(0, limit);

    // Obtener total solo si es primera página (optimización)
    let total = 0;
    let totalPages = 0;
    if (page === 1) {
      const countResult = await pool.query(
        "SELECT COUNT(*) as total FROM vw_customer_value"
      );
      total = parseInt(countResult.rows[0].total, 10);
      totalPages = Math.ceil(total / limit);
    }

    return (
      <div style={{ padding: "2rem" }}>
        <Link href="/" style={{ textDecoration: "none", color: "#0066cc" }}>
          ← Volver al inicio
        </Link>

        <h1>Valor de Clientes</h1>
        <p style={{ color: "#666", marginBottom: "1.5rem" }}>
          Clientes ordenados por gasto total
        </p>

        <div style={{ overflowX: "auto" }}>
          <table border={1} style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Cliente</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Órdenes</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Total Gastado</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Promedio</th>
              </tr>
            </thead>
            <tbody>
              {displayRows.length > 0 ? (
                displayRows.map((r: CustomerRow) => (
                  <tr key={r.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "0.75rem" }}>{r.name}</td>
                    <td style={{ padding: "0.75rem" }}>{r.num_orders}</td>
                    <td style={{ padding: "0.75rem" }}>
                      ${Number(r.total_spent).toFixed(2)}
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      ${Number(r.avg_spent).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      padding: "1rem",
                      textAlign: "center",
                      color: "#666",
                    }}
                  >
                    No hay clientes disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span style={{ color: "#666", fontSize: "0.875rem" }}>
            Página {page}
            {page === 1 && totalPages > 0 && ` de ${totalPages}`}
            {" "}(Mostrando {displayRows.length} de {limit})
          </span>
          {page > 1 && (
            <a
              href={`?page=${page - 1}`}
              style={{
                padding: "0.5rem 1rem",
                textDecoration: "none",
                backgroundColor: "#f0f0f0",
                color: "#333",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              ← Anterior
            </a>
          )}
          {hasNextPage && (
            <a
              href={`?page=${page + 1}`}
              style={{
                padding: "0.5rem 1rem",
                textDecoration: "none",
                backgroundColor: "#f0f0f0",
                color: "#333",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Siguiente →
            </a>
          )}
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