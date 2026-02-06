export const dynamic = "force-dynamic";

import Link from "next/link";
import { pool } from "@/lib/db";
import { z } from "zod";

const FilterSchema = z.object({
  search: z.string().optional().default(""),
  page: z.string().transform(Number).pipe(z.number().positive()).catch(1),
  limit: z.string().transform(Number).pipe(z.number().positive().max(50)).catch(10),
});

interface ProductRow {
  id: number;
  rank: number;
  name: string;
  units: number;
  revenue: number;
  total_count: number;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const { search, page, limit } = FilterSchema.parse(params);
  const offset = (page - 1) * limit;

  try {
    // Query única que obtiene datos y conteo total
    const sql = `
      SELECT 
        id,
        rank,
        name,
        units,
        revenue,
        COUNT(*) OVER() as total_count
      FROM vw_top_products_ranked
      WHERE name ILIKE $1
      ORDER BY rank ASC
      LIMIT $2 OFFSET $3
    `;

    const { rows } = await pool.query(sql, [`%${search}%`, limit, offset]);

    const total = rows.length > 0 ? parseInt(rows[0].total_count, 10) : 0;
    const totalPages = Math.ceil(total / limit);

    return (
      <div style={{ padding: "2rem" }}>
        <Link href="/" style={{ textDecoration: "none", color: "#0066cc" }}>
          ← Volver al inicio
        </Link>

        <h1>Productos Estrella</h1>
        <p style={{ color: "#666", marginBottom: "1.5rem" }}>
          Buscar y paginar productos
        </p>

        <form
          style={{
            margin: "1.5rem 0",
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "flex-end",
          }}
        >
          <div style={{ flex: 1, minWidth: "200px" }}>
            <label htmlFor="search" style={{ display: "block", marginBottom: "0.5rem" }}>
              Buscar producto
            </label>
            <input
              id="search"
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Nombre del producto..."
              style={{ padding: "0.5rem", width: "100%", boxSizing: "border-box" }}
            />
          </div>
          <button
            type="submit"
            style={{ padding: "0.5rem 1rem", cursor: "pointer", backgroundColor: "#0066cc", color: "white", border: "none", borderRadius: "4px" }}
          >
            Buscar
          </button>
          {search && (
            <a
              href="/reports/top-products"
              style={{ padding: "0.5rem 1rem", textDecoration: "none", color: "#666" }}
            >
              Limpiar
            </a>
          )}
        </form>

        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Total: <strong>{total}</strong>
        </p>

        <div style={{ overflowX: "auto" }}>
          <table border={1} style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>#</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Producto</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Unidades</th>
                <th style={{ padding: "0.75rem", textAlign: "left" }}>Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((r: ProductRow) => (
                  <tr key={r.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "0.75rem", fontWeight: 600, color: "#0066cc" }}>
                      #{r.rank}
                    </td>
                    <td style={{ padding: "0.75rem" }}>{r.name}</td>
                    <td style={{ padding: "0.75rem" }}>{r.units}</td>
                    <td style={{ padding: "0.75rem" }}>
                      ${Number(r.revenue).toFixed(2)}
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
                    No hay productos que coincidan con tu búsqueda
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
            Página {page} de {totalPages || 1}
          </span>
          {page > 1 && (
            <a
              href={`?search=${encodeURIComponent(search)}&page=${page - 1}&limit=${limit}`}
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
          {rows.length === limit && (
            <a
              href={`?search=${encodeURIComponent(search)}&page=${page + 1}&limit=${limit}`}
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