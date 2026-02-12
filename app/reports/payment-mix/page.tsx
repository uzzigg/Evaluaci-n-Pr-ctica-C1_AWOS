export const dynamic = "force-dynamic";

import Link from "next/link";
import { getPaymentMix, type PaymentMixRow } from "@/backend/paymentMix";

export default async function Page() {
  const rows = await getPaymentMix();

  return (
    <div>
      <Link href="/" className="back-link">
        ← Volver al inicio
      </Link>

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
          {rows.map((r: PaymentMixRow,i:number)=>(
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