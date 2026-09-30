import { db } from "@/db";
import { dependents } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getCurrentUser, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const rows = await db.select().from(dependents).where(eq(dependents.userId, user.id));
  return Response.json({ dependents: rows });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const { name, relationship, dob, gender } = await req.json();
  if (!name || !relationship) return Response.json({ error: "Name and relationship required" }, { status: 400 });
  const [row] = await db
    .insert(dependents)
    .values({ userId: user.id, name, relationship, dob: dob || null, gender: gender ?? "female" })
    .returning();
  return Response.json({ ok: true, dependent: row });
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const { id } = await req.json();
  await db.delete(dependents).where(and(eq(dependents.id, Number(id)), eq(dependents.userId, user.id)));
  return Response.json({ ok: true });
}
