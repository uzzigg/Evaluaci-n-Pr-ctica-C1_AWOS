import { pool } from "@/lib/db";

export default async function Page() {
  const { rows } = await pool.query(
    "SELECT * FROM vw_top_products_ranked"
  );

  return (
    <div>
      <h1>Top productos</h1>
      <p>Ranking de productos por ingresos y unidades vendidas</p>

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
    </div>
  );
}