import { db } from "@/db";
import { appointments, doctors, users, walletTx, messages } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { getCurrentUser, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const rows = await db
    .select({
      appointment: appointments,
      doctor: doctors,
    })
    .from(appointments)
    .leftJoin(doctors, eq(appointments.doctorId, doctors.id))
    .where(eq(appointments.userId, user.id))
    .orderBy(desc(appointments.scheduledAt));
  return Response.json({ appointments: rows });
}

const MODE_MULTIPLIER: Record<string, number> = {
  chat: 0.6,
  voice: 0.8,
  video: 1,
  home: 1.8,
};

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const { doctorId, mode, scheduledAt, reason, patientName, instant } = await req.json();
  if (!doctorId || !mode) return Response.json({ error: "Doctor and mode required" }, { status: 400 });

  const [doctor] = await db.select().from(doctors).where(eq(doctors.id, Number(doctorId))).limit(1);
  if (!doctor) return Response.json({ error: "Doctor not found" }, { status: 404 });

  const fee = Math.round(doctor.feeKobo * (MODE_MULTIPLIER[mode] ?? 1));
  const discounted = user.plan === "family" ? Math.round(fee * 0.5) : fee;

  if (user.walletKobo < discounted) {
    return Response.json(
      { error: "Insufficient wallet balance. Please fund your wallet to continue." },
      { status: 402 },
    );
  }

  const when = instant ? new Date(Date.now() + 2 * 60 * 1000) : new Date(scheduledAt);
  if (Number.isNaN(when.getTime())) {
    return Response.json({ error: "Invalid date/time" }, { status: 400 });
  }

  const [appt] = await db
    .insert(appointments)
    .values({
      userId: user.id,
      doctorId: doctor.id,
      patientName: patientName || user.fullName,
      mode,
      scheduledAt: when,
      reason: reason ?? "",
      status: instant ? "active" : "upcoming",
      feeKobo: discounted,
    })
    .returning();

  await db
    .update(users)
    .set({ walletKobo: user.walletKobo - discounted })
    .where(eq(users.id, user.id));

  await db.insert(walletTx).values({
    userId: user.id,
    amountKobo: discounted,
    type: "debit",
    description: `${mode === "home" ? "Home visit" : mode.charAt(0).toUpperCase() + mode.slice(1)} consultation — ${doctor.name}`,
    reference: `CON-${appt.id}-${Date.now().toString().slice(-5)}`,
  });

  await db.insert(messages).values([
    {
      appointmentId: appt.id,
      sender: "system",
      body: `Consultation room opened. ${doctor.name} (${doctor.specialty}) has been notified. Fee ₦${(discounted / 100).toLocaleString()} paid from wallet.`,
    },
    {
      appointmentId: appt.id,
      sender: "doctor",
      body: `Good day ${(patientName || user.fullName).split(" ")[0]}, I'm ${doctor.name}. Thank you for reaching out. Please tell me what you are feeling, when it started, and any medication you have taken.`,
    },
  ]);

  return Response.json({ ok: true, appointment: appt });
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const { id, status, rating } = await req.json();
  const patch: Record<string, unknown> = {};
  if (status) patch.status = status;
  if (rating) patch.rating = rating;
  if (!id || Object.keys(patch).length === 0) {
    return Response.json({ error: "Nothing to update" }, { status: 400 });
  }
  await db
    .update(appointments)
    .set(patch)
    .where(and(eq(appointments.id, Number(id)), eq(appointments.userId, user.id)));
  return Response.json({ ok: true });
}
