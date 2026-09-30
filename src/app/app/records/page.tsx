import { db } from "@/db";
import { vitals, prescriptions, appointments, doctors } from "@/db/schema";
import { and, desc, eq, ne } from "drizzle-orm";
import { requireUser } from "@/lib/auth";
import RecordsView from "@/components/RecordsView";

export const dynamic = "force-dynamic";
export const metadata = { title: "Health record" };

type Med = { name: string; dose: string; duration: string };

export default async function RecordsPage() {
  const user = await requireUser();
  const [v, rx, notes] = await Promise.all([
    db.select().from(vitals).where(eq(vitals.userId, user.id)).orderBy(desc(vitals.recordedAt)).limit(60),
    db
      .select()
      .from(prescriptions)
      .where(eq(prescriptions.userId, user.id))
      .orderBy(desc(prescriptions.issuedAt)),
    db
      .select({ a: appointments, d: doctors })
      .from(appointments)
      .leftJoin(doctors, eq(appointments.doctorId, doctors.id))
      .where(and(eq(appointments.userId, user.id), ne(appointments.doctorNote, "")))
      .orderBy(desc(appointments.scheduledAt)),
  ]);

  return (
    <RecordsView
      vitals={v.map((x) => ({ ...x, recordedAt: x.recordedAt.toISOString() }))}
      prescriptions={rx.map((p) => ({
        id: p.id,
        refCode: p.refCode,
        doctorName: p.doctorName,
        medications: (p.medications as Med[]) ?? [],
        instructions: p.instructions,
        status: p.status,
        issuedAt: p.issuedAt.toISOString(),
      }))}
      notes={notes.map(({ a, d }) => ({
        id: a.id,
        diagnosis: a.diagnosis,
        doctorNote: a.doctorNote,
        scheduledAt: a.scheduledAt.toISOString(),
        doctorName: d?.name ?? "MyDoc247 Doctor",
      }))}
      profile={{
        fullName: user.fullName,
        bloodGroup: user.bloodGroup ?? "",
        genotype: user.genotype ?? "",
        allergies: user.allergies ?? "",
        hmoProvider: user.hmoProvider ?? "",
      }}
    />
  );
}
