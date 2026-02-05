export const dynamic = "force-dynamic";

import { pool } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  page: z.coerce.number().min(1).default(1),
});

export default async function Page({ searchParams }: any) {
  const { page } = schema.parse(searchParams);

  const limit = 5;
  const offset = (page - 1) * limit;

  const countResult = await pool.query(
    "SELECT COUNT(*) as total FROM vw_customer_value"
  );
  const total = parseInt(countResult.rows[0].total, 10);
  const totalPages = Math.ceil(total / limit);

  // Query para obtener datos paginados
  const { rows } = await pool.query(
    "SELECT * FROM vw_customer_value ORDER BY total_spent DESC LIMIT $1 OFFSET $2",
    [limit, offset]
  );

  return (
    <div>
      <h1>Valor de clientes</h1>

      <table border={1}>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Órdenes</th>
            <th>Total</th>
            <th>Promedio</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r: any) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.num_orders}</td>
              <td>{r.total_spent}</td>
              <td>{r.avg_spent}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {page > 1 && (
          <a href={`?page=${page - 1}`}>Anterior</a>
        )}
        {" "}
        Página {page} de {totalPages}
        {" "}
        {page < totalPages && (
          <a href={`?page=${page + 1}`}>Siguiente</a>
        )}
      </div>
    </div>
  );
}