import { pool } from "@/lib/db";

export default async function Page() {
  const { rows } = await pool.query(
    "SELECT * FROM vw_sales_daily"
  );

  return (
    <div>
      <h1>Ventas diarias</h1>
      <pre>{JSON.stringify(rows, null, 2)}</pre>
    </div>
  );
}