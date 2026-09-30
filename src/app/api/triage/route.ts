import { db } from "@/db";
import { triageChecks } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { runTriage } from "@/lib/triage";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ checks: [] });
  const rows = await db
    .select()
    .from(triageChecks)
    .where(eq(triageChecks.userId, user.id))
    .orderBy(desc(triageChecks.createdAt))
    .limit(10);
  return Response.json({ checks: rows });
}

export async function POST(req: Request) {
  const { symptoms, durationDays } = await req.json();
  const ids: string[] = Array.isArray(symptoms) ? symptoms : [];
  if (ids.length === 0) return Response.json({ error: "Select at least one symptom" }, { status: 400 });
  const result = runTriage(ids, Number(durationDays) || 1);
  const user = await getCurrentUser();
  if (user) {
    await db.insert(triageChecks).values({
      userId: user.id,
      symptoms: ids,
      level: result.level,
      advice: result.advice,
      possibleConditions: result.possibleConditions,
    });
  }
  return Response.json({ result });
}
