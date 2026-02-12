import { pool } from "@/lib/db";

export interface PaymentMixRow {
  method: string;
  total: number;
  percentage: number;
}

export async function getPaymentMix(): Promise<PaymentMixRow[]> {
  const { rows } = await pool.query("SELECT * FROM vw_payment_mix");
  return rows;
}
