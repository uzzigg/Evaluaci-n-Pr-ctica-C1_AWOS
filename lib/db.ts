import { Pool } from "pg";

export const pool = new Pool({
  host: "db",   
  user: "app_user",
  password: "apppass",
  database: "postgres",
  port: 5432,
});