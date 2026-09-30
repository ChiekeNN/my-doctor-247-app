import { db } from "@/db";
import { vitals } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { getCurrentUser, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const rows = await db
    .select()
    .from(vitals)
    .where(eq(vitals.userId, user.id))
    .orderBy(desc(vitals.recordedAt))
    .limit(60);
  return Response.json({ vitals: rows });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const { type, value, note } = await req.json();
  if (!type || !value) return Response.json({ error: "Type and value required" }, { status: 400 });
  const numeric = parseFloat(String(value).split("/")[0]) || 0;
  const [row] = await db
    .insert(vitals)
    .values({ userId: user.id, type, value: String(value), numeric, note: note ?? "" })
    .returning();
  return Response.json({ ok: true, vital: row });
}
