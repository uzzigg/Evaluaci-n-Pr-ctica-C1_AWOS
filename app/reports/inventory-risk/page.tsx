import { pool } from "@/lib/db";

export default async function Page() {
  const { rows } = await pool.query(
    "SELECT * FROM vw_inventory_risk"
  );

  return (
    <div>
      <h1>Riesgo de inventario</h1>
      <p>Productos con bajo stock</p>

      <table border={1}>
        <thead>
          <tr>
            <th>Categoría</th>
            <th>Producto</th>
            <th>Stock</th>
            <th>Riesgo</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r:any,i:number)=>(
            <tr key={i}>
              <td>{r.category}</td>
              <td>{r.product}</td>
              <td>{r.stock}</td>
              <td>{r.risk_level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}