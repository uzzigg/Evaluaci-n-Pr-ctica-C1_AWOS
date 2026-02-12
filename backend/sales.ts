import { pool } from "@/lib/db";

export interface SalesRow {
  day: Date;
  total_sales: number;
  tickets: number;
  avg_ticket: number;
}

export async function getSalesData(
  date_from?: string | null,
  date_to?: string | null
): Promise<SalesRow[]> {
  const sqlQuery = `
    SELECT day, total_sales, tickets, avg_ticket
    FROM vw_sales_daily 
    WHERE ($1::DATE IS NULL OR day >= $1)
      AND ($2::DATE IS NULL OR day <= $2)
    ORDER BY day DESC
  `;

  const { rows } = await pool.query(sqlQuery, [date_from || null, date_to || null]);
  return rows;
}
