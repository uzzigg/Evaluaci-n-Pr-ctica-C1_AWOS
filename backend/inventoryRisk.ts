import { pool } from "@/lib/db";

export interface InventoryRiskRow {
  category: string;
  product: string;
  stock: number;
  risk_level: string;
}

export async function getInventoryRisk(): Promise<InventoryRiskRow[]> {
  const { rows } = await pool.query("SELECT * FROM vw_inventory_risk");
  return rows;
}
