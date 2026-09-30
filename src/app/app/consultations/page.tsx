import Link from "next/link";
import { db } from "@/db";
import { appointments, doctors } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth";
import { naira, shortDate } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "My consultations" };

export default async function ConsultationsPage() {
  const user = await requireUser();
  const rows = await db
    .select({ a: appointments, d: doctors })
    .from(appointments)
    .leftJoin(doctors, eq(appointments.doctorId, doctors.id))
    .where(eq(appointments.userId, user.id))
    .orderBy(desc(appointments.scheduledAt));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">My consultations</h1>
          <p className="text-sm text-slate-500">{rows.length} total · notes stored forever</p>
        </div>
        <Link href="/app/doctors" className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white">
          New consult
        </Link>
      </div>

      {rows.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-4xl">💬</p>
          <p className="mt-3 font-semibold">No consultations yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Chat consultations start from ₦1,500 and a doctor typically replies within 6 minutes.
          </p>
          <Link
            href="/app/doctors"
            className="mt-5 inline-block rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white"
          >
            Talk to a doctor
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {rows.map(({ a, d }) => (
          <Link key={a.id} href={`/app/consult/${a.id}`} className="card block p-4 hover:shadow-md">
            <div className="flex items-start gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-2xl">
                {d?.photo}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold">{d?.name}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      a.status === "completed"
                        ? "bg-slate-100 text-slate-500"
                        : a.status === "active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {a.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {shortDate(a.scheduledAt)} · {a.mode} · {naira(a.feeKobo)}
                </p>
                {a.reason && <p className="mt-2 text-sm text-slate-600">“{a.reason}”</p>}
                {a.diagnosis && (
                  <p className="mt-2 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-800">
                    Dx: {a.diagnosis}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
