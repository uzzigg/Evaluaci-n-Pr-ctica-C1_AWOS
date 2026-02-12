import { pool } from "@/lib/db";

export interface CustomerRow {
  id: number;
  name: string;
  num_orders: number;
  total_spent: number;
  avg_spent: number;
}

interface PaginationResult {
  rows: CustomerRow[];
  total: number;
  totalPages: number;
  hasNextPage: boolean;
}

export async function getCustomerValue(
  page: number,
  limit: number = 5
): Promise<PaginationResult> {
  const offset = (page - 1) * limit;


  const sql = `
    SELECT id, name, num_orders, total_spent, avg_spent
    FROM vw_customer_value 
    ORDER BY total_spent DESC 
    LIMIT $1 OFFSET $2
  `;

  const { rows } = await pool.query(sql, [limit + 1, offset]);

  // Si traemos más de limit registros, hay siguiente página
  const hasNextPage = rows.length > limit;
  const displayRows = rows.slice(0, limit);

  // Obtener total solo si es primera página (optimización)
  let total = 0;
  let totalPages = 0;
  if (page === 1) {
    const countResult = await pool.query(
      "SELECT COUNT(*) as total FROM vw_customer_value"
    );
    total = parseInt(countResult.rows[0].total, 10);
    totalPages = Math.ceil(total / limit);
  }

  return {
    rows: displayRows,
    total,
    totalPages,
    hasNextPage,
  };
}
