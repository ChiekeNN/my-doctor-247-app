import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  return Response.json({ user: { ...user, passwordHash: undefined } });
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const body = await req.json();
  const allowed = [
    "fullName", "phone", "state", "language", "gender", "dob",
    "bloodGroup", "genotype", "allergies", "hmoProvider", "plan",
  ] as const;
  const patch: Record<string, unknown> = {};
  for (const key of allowed) {
    if (body[key] !== undefined && body[key] !== "") patch[key] = body[key];
  }
  if (Object.keys(patch).length === 0) return Response.json({ ok: true });
  const [updated] = await db.update(users).set(patch).where(eq(users.id, user.id)).returning();
  return Response.json({ ok: true, user: { ...updated, passwordHash: undefined } });
}
