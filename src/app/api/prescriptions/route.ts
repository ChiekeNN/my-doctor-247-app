import { db } from "@/db";
import { prescriptions } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { getCurrentUser, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const rows = await db
    .select()
    .from(prescriptions)
    .where(eq(prescriptions.userId, user.id))
    .orderBy(desc(prescriptions.issuedAt));
  return Response.json({ prescriptions: rows });
}
