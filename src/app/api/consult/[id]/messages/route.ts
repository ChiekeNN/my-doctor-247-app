import { db } from "@/db";
import { appointments, messages, doctors } from "@/db/schema";
import { and, asc, eq } from "drizzle-orm";
import { getCurrentUser, unauthorized } from "@/lib/auth";
import { doctorReply } from "@/lib/clinic";

export const dynamic = "force-dynamic";

async function loadAppointment(id: number, userId: number) {
  const rows = await db
    .select({ appointment: appointments, doctor: doctors })
    .from(appointments)
    .leftJoin(doctors, eq(appointments.doctorId, doctors.id))
    .where(and(eq(appointments.id, id), eq(appointments.userId, userId)))
    .limit(1);
  return rows[0];
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const { id } = await ctx.params;
  const found = await loadAppointment(Number(id), user.id);
  if (!found) return Response.json({ error: "Not found" }, { status: 404 });
  const list = await db
    .select()
    .from(messages)
    .where(eq(messages.appointmentId, Number(id)))
    .orderBy(asc(messages.id));
  return Response.json({ messages: list, appointment: found.appointment, doctor: found.doctor });
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const { id } = await ctx.params;
  const { body } = await req.json();
  if (!body || !String(body).trim()) {
    return Response.json({ error: "Empty message" }, { status: 400 });
  }
  const found = await loadAppointment(Number(id), user.id);
  if (!found) return Response.json({ error: "Not found" }, { status: 404 });

  await db.insert(messages).values({
    appointmentId: Number(id),
    sender: "patient",
    body: String(body).trim(),
  });

  const existing = await db
    .select()
    .from(messages)
    .where(eq(messages.appointmentId, Number(id)));
  const rule = doctorReply(String(body), existing.length);

  await db.insert(messages).values({
    appointmentId: Number(id),
    sender: "doctor",
    body: rule.reply,
  });

  if (found.appointment.status === "upcoming") {
    await db
      .update(appointments)
      .set({ status: "active" })
      .where(eq(appointments.id, Number(id)));
  }

  const list = await db
    .select()
    .from(messages)
    .where(eq(messages.appointmentId, Number(id)))
    .orderBy(asc(messages.id));
  return Response.json({ messages: list });
}
