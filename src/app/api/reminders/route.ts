import { db } from "@/db";
import { reminders } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { getCurrentUser, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const rows = await db
    .select()
    .from(reminders)
    .where(eq(reminders.userId, user.id))
    .orderBy(desc(reminders.createdAt));
  return Response.json({ reminders: rows });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const { title, timeOfDay, frequency } = await req.json();
  if (!title || !timeOfDay) return Response.json({ error: "Title and time required" }, { status: 400 });
  const [row] = await db
    .insert(reminders)
    .values({ userId: user.id, title, timeOfDay, frequency: frequency ?? "daily" })
    .returning();
  return Response.json({ ok: true, reminder: row });
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const { id, active } = await req.json();
  await db
    .update(reminders)
    .set({ active: Boolean(active) })
    .where(and(eq(reminders.id, Number(id)), eq(reminders.userId, user.id)));
  return Response.json({ ok: true });
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const { id } = await req.json();
  await db.delete(reminders).where(and(eq(reminders.id, Number(id)), eq(reminders.userId, user.id)));
  return Response.json({ ok: true });
}
