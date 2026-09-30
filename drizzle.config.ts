import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load `.env` so `npx drizzle-kit push` talks to whatever database
// DATABASE_URL points at — your laptop in dev, Neon/Supabase in production.
dotenv.config({ quiet: true });

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://postgres:postgres@127.0.0.1:5432/app_db",
  },
});
