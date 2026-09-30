import { db } from "@/db";
import { doctors } from "@/db/schema";
import { desc } from "drizzle-orm";
import { ensureSeed } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureSeed();
  const rows = await db.select().from(doctors).orderBy(desc(doctors.rating));
  return Response.json({ doctors: rows });
}
