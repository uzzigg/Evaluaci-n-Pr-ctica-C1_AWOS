export const dynamic = "force-dynamic";

import { pool } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
});

export default async function Page({ searchParams }: any) {
  const { search, page } = schema.parse(searchParams);

  const limit = 5;
  const offset = (page - 1) * limit;

  let query = `
    SELECT * FROM vw_top_products_ranked
    WHERE ($1::text IS NULL OR name ILIKE '%' || $1 || '%')
    LIMIT $2 OFFSET $3
  `;

  const { rows } = await pool.query(query, [
    search || null,
    limit,
    offset,
  ]);

  return (
    <div>
      <h1>Top productos</h1>

      <form>
        <input name="search" placeholder="Buscar producto..." />
        <button>Buscar</button>
      </form>

      <table border={1}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Producto</th>
            <th>Unidades</th>
            <th>Ingresos</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r:any)=>(
            <tr key={r.id}>
              <td>{r.rank}</td>
              <td>{r.name}</td>
              <td>{r.units}</td>
              <td>{r.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <a href={`?page=${page-1}`}>Anterior</a>{" "}
      <a href={`?page=${page+1}`}>Siguiente</a>
    </div>
  );
}