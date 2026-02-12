import { pool } from "@/lib/db";

export interface ProductRow {
  id: number;
  rank: number;
  name: string;
  units: number;
  revenue: number;
  total_count: number;
}

interface PaginationResult {
  rows: ProductRow[];
  total: number;
  totalPages: number;
}

export async function getTopProducts(
  search: string = "",
  page: number = 1,
  limit: number = 10
): Promise<PaginationResult> {
  const offset = (page - 1) * limit;

 
  const sql = `
    SELECT 
      id,
      rank,
      name,
      units,
      revenue,
      COUNT(*) OVER() as total_count
    FROM vw_top_products_ranked
    WHERE name ILIKE $1
    ORDER BY rank ASC
    LIMIT $2 OFFSET $3
  `;

  const { rows } = await pool.query(sql, [`%${search}%`, limit, offset]);

  const total = rows.length > 0 ? parseInt(rows[0].total_count, 10) : 0;
  const totalPages = Math.ceil(total / limit);

  return {
    rows,
    total,
    totalPages,
  };
}
