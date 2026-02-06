export const dynamic = "force-dynamic";

import { pool } from "@/lib/db";

export default async function Page() {
  const { rows } = await pool.query(
    "SELECT * FROM vw_payment_mix"
  );

  return (
    <div>
      <h1>Mezcla de pagos</h1>
      <p>Distribución por método de pago</p>

      <table border={1}>
        <thead>
          <tr>
            <th>Método</th>
            <th>Total</th>
            <th>Porcentaje</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r:any,i:number)=>(
            <tr key={i}>
              <td>{r.method}</td>
              <td>{r.total}</td>
              <td>{r.percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}