export const dynamic = "force-dynamic";

import Link from "next/link";
import { getInventoryRisk, type InventoryRiskRow } from "@/backend/inventoryRisk";

export default async function Page() {
  const rows = await getInventoryRisk();

  return (
    <div>
      <Link href="/" className="back-link">
        ← Volver al inicio
      </Link>

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
          {rows.map((r: InventoryRiskRow,i:number)=>(
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