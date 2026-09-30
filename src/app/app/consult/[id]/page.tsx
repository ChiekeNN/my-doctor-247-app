import { db } from "@/db";
import { appointments, doctors, messages } from "@/db/schema";
import { and, asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import ConsultRoom from "@/components/ConsultRoom";

export const dynamic = "force-dynamic";
export const metadata = { title: "Consultation room" };

export default async function ConsultPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const apptId = Number(id);
  const rows = await db
    .select({ a: appointments, d: doctors })
    .from(appointments)
    .leftJoin(doctors, eq(appointments.doctorId, doctors.id))
    .where(and(eq(appointments.id, apptId), eq(appointments.userId, user.id)))
    .limit(1);
  const found = rows[0];
  if (!found) notFound();

  const chat = await db
    .select()
    .from(messages)
    .where(eq(messages.appointmentId, apptId))
    .orderBy(asc(messages.id));

  return (
    <ConsultRoom
      appointmentId={apptId}
      doctorName={found.d?.name ?? "MyDoc247 Doctor"}
      doctorPhoto={found.d?.photo ?? "🩺"}
      specialty={found.d?.specialty ?? "General Practice"}
      mode={found.a.mode}
      status={found.a.status}
      feeKobo={found.a.feeKobo}
      initialMessages={chat.map((m) => ({
        id: m.id,
        sender: m.sender,
        body: m.body,
        createdAt: m.createdAt.toISOString(),
      }))}
    />
  );
}
