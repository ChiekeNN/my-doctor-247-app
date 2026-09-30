import { db } from "@/db";
import { appointments, messages, doctors, prescriptions } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getCurrentUser, unauthorized } from "@/lib/auth";
import { summarise } from "@/lib/clinic";

export const dynamic = "force-dynamic";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const { id } = await ctx.params;
  const apptId = Number(id);
  const rows = await db
    .select({ appointment: appointments, doctor: doctors })
    .from(appointments)
    .leftJoin(doctors, eq(appointments.doctorId, doctors.id))
    .where(and(eq(appointments.id, apptId), eq(appointments.userId, user.id)))
    .limit(1);
  const found = rows[0];
  if (!found) return Response.json({ error: "Not found" }, { status: 404 });
  if (found.appointment.status === "completed") {
    return Response.json({ ok: true, alreadyCompleted: true });
  }

  const chat = await db.select().from(messages).where(eq(messages.appointmentId, apptId));
  const patientTexts = chat.filter((m) => m.sender === "patient").map((m) => m.body);
  const summary = summarise(patientTexts.length ? patientTexts : [found.appointment.reason]);
  const doctorName = found.doctor?.name ?? "MyDoc247 Physician";
  const refCode = `RX-${new Date().getFullYear()}-${String(apptId).padStart(4, "0")}`;

  await db
    .update(appointments)
    .set({ status: "completed", diagnosis: summary.diagnosis, doctorNote: summary.note })
    .where(eq(appointments.id, apptId));

  await db.insert(prescriptions).values({
    userId: user.id,
    appointmentId: apptId,
    doctorName,
    refCode,
    medications: summary.meds,
    instructions:
      "Take medications exactly as written. Complete the full course. Do not share medication. Report any rash, swelling or breathing difficulty immediately.",
  });

  await db.insert(messages).values({
    appointmentId: apptId,
    sender: "system",
    body: `Consultation closed. ${doctorName} issued e-prescription ${refCode}. It is available under Records and can be presented at any partner pharmacy.`,
  });

  return Response.json({ ok: true, refCode, diagnosis: summary.diagnosis });
}
