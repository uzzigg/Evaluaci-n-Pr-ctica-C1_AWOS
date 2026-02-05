import { pool } from "@/lib/db";

export default async function Page() {
  const { rows } = await pool.query(
    "SELECT * FROM vw_customer_value"
  );

  return (
    <div>
      <h1>Valor de clientes</h1>
      <p>Clientes con mayor gasto</p>

      <table border={1}>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Órdenes</th>
            <th>Total gastado</th>
            <th>Promedio</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r:any)=>(
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.num_orders}</td>
              <td>{r.total_spent}</td>
              <td>{r.avg_spent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}