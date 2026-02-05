export const dynamic = "force-dynamic";

import { pool } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  search: z.string().default(""),
  page: z.coerce.number().min(1).default(1),
});

export default async function Page({ searchParams }: any) {
  const { search, page } = schema.parse(searchParams);

  const limit = 5;
  const offset = (page - 1) * limit;

  // Query para contar total
  let countQuery = "SELECT COUNT(*) as total FROM vw_top_products_ranked WHERE 1=1";
  const countParams: any[] = [];

  if (search) {
    countParams.push(`%${search}%`);
    countQuery += ` AND name ILIKE $${countParams.length}`;
  }

  const countResult = await pool.query(countQuery, countParams);
  const total = parseInt(countResult.rows[0].total, 10);
  const totalPages = Math.ceil(total / limit);

  // Query para obtener datos paginados
  let dataQuery = "SELECT * FROM vw_top_products_ranked WHERE 1=1";
  const dataParams: any[] = [];

  if (search) {
    dataParams.push(`%${search}%`);
    dataQuery += ` AND name ILIKE $${dataParams.length}`;
  }

  dataQuery += ` ORDER BY rank ASC LIMIT $${dataParams.length + 1} OFFSET $${dataParams.length + 2}`;
  dataParams.push(limit, offset);

  const { rows } = await pool.query(dataQuery, dataParams);

  return (
    <div>
      <h1>Top productos</h1>

      <form>
        <input
          name="search"
          placeholder="Buscar producto..."
          defaultValue={search}
        />
        <button type="submit">Buscar</button>
        {search && (
          <a href="/reports/top-products">Limpiar</a>
        )}
      </form>

      <p>Total: {total}</p>

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
          {rows.map((r: any) => (
            <tr key={r.id}>
              <td>{r.rank}</td>
              <td>{r.name}</td>
              <td>{r.units}</td>
              <td>{r.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {page > 1 && (
          <a href={`?page=${page - 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}>
            Anterior
          </a>
        )}
        {" "}
        Página {page} de {totalPages}
        {" "}
        {page < totalPages && (
          <a href={`?page=${page + 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}>
            Siguiente
          </a>
        )}
      </div>
    </div>
  );
}