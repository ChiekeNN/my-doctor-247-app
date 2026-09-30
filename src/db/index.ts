import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

// Managed Postgres hosts (Neon, Vercel Postgres, Supabase, Railway, Render,
// AWS RDS) require an encrypted connection. Most of them already put
// `?sslmode=require` in the connection string they hand you, which `pg`
// understands — but if a provider ever omits it, the connection fails with a
// cryptic "no pg_hba.conf entry ... SSL off" error. Turn SSL on for those
// hosts automatically, unless the URL already asks for it.
const MANAGED_HOST =
  /neon\.tech|vercel-storage\.com|supabase\.co|supabase\.com|railway\.app|render\.com|aivencloud\.com|amazonaws\.com/i;
const HAS_SSL_PARAM = /[?&]ssl(mode)?=/i;

const needsSsl = MANAGED_HOST.test(databaseUrl) && !HAS_SSL_PARAM.test(databaseUrl);

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    ...(needsSsl ? { ssl: { rejectUnauthorized: false } } : {}),
    // Serverless functions are short-lived; keep the pool small so we never
    // exhaust the database's connection limit when Vercel scales out.
    max: process.env.VERCEL ? 5 : 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
