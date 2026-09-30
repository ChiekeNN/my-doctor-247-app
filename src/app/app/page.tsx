import Link from "next/link";
import { db } from "@/db";
import { appointments, doctors, articles, vitals, prescriptions, labOrders } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth";
import { naira, shortDate } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

const QUICK = [
  { href: "/app/doctors", label: "Talk to a doctor", sub: "Instant · from ₦1,500", icon: "🩺", tone: "bg-brand-600 text-white" },
  { href: "/app/checker", label: "Check symptoms", sub: "Free AI triage", icon: "🤖", tone: "bg-white" },
  { href: "/app/labs", label: "Book a lab test", sub: "Home sample pickup", icon: "🧪", tone: "bg-white" },
  { href: "/app/emergency", label: "Emergency SOS", sub: "112 · nearest hospital", icon: "🚨", tone: "bg-red-50 text-red-700" },
];

export default async function Dashboard() {
  const user = await requireUser();
  const [appts, recentVitals, rx, labs, posts] = await Promise.all([
    db
      .select({ a: appointments, d: doctors })
      .from(appointments)
      .leftJoin(doctors, eq(appointments.doctorId, doctors.id))
      .where(eq(appointments.userId, user.id))
      .orderBy(desc(appointments.scheduledAt))
      .limit(3),
    db.select().from(vitals).where(eq(vitals.userId, user.id)).orderBy(desc(vitals.recordedAt)).limit(4),
    db.select().from(prescriptions).where(eq(prescriptions.userId, user.id)).orderBy(desc(prescriptions.issuedAt)).limit(2),
    db.select().from(labOrders).where(eq(labOrders.userId, user.id)).orderBy(desc(labOrders.scheduledAt)).limit(2),
    db.select().from(articles).orderBy(desc(articles.publishedAt)).limit(2),
  ]);

  const upcoming = appts.filter((x) => x.a.status !== "completed" && x.a.status !== "cancelled");
  const completeness =
    [user.gender, user.dob, user.bloodGroup, user.genotype, user.allergies, user.hmoProvider].filter(
      Boolean,
    ).length;

  return (
    <div className="space-y-6">
      <section className="gradient-hero overflow-hidden rounded-3xl p-6 text-white">
        <p className="text-sm text-white/60">Welcome back,</p>
        <h1 className="text-2xl font-extrabold">{user.fullName.split(" ")[0]} 👋</h1>
        <p className="mt-2 max-w-md text-sm text-white/65">
          {upcoming.length
            ? `You have ${upcoming.length} active consultation${upcoming.length > 1 ? "s" : ""}. Tap below to continue.`
            : "How are you feeling today? A doctor is online right now and can see you in about 6 minutes."}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/app/doctors" className="rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-bold text-[#04231d]">
            Start consultation
          </Link>
          {upcoming[0] && (
            <Link
              href={`/app/consult/${upcoming[0].a.id}`}
              className="glass rounded-xl px-4 py-2.5 text-sm font-semibold"
            >
              Resume with {upcoming[0].d?.name}
            </Link>
          )}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {QUICK.map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className={`card p-4 transition hover:-translate-y-0.5 ${q.tone}`}
          >
            <div className="text-2xl">{q.icon}</div>
            <p className="mt-2 text-sm font-bold leading-tight">{q.label}</p>
            <p className={`mt-0.5 text-[11px] ${q.tone.includes("text-white") ? "text-white/70" : "opacity-60"}`}>
              {q.sub}
            </p>
          </Link>
        ))}
      </section>

      {completeness < 6 && (
        <section className="card flex items-center gap-4 p-4">
          <div className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">
            {Math.round((completeness / 6) * 100)}%
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold">Complete your health profile</p>
            <p className="text-xs text-slate-500">
              Genotype, blood group and allergies help doctors prescribe safely and faster.
            </p>
          </div>
          <Link href="/app/profile" className="rounded-xl bg-brand-600 px-3 py-2 text-xs font-bold text-white">
            Update
          </Link>
        </section>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Consultations</h2>
            <Link href="/app/consultations" className="text-xs font-semibold text-brand-700">View all</Link>
          </div>
          <div className="mt-4 space-y-3">
            {appts.length === 0 && (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                No consultations yet. Your first doctor chat is only a tap away.
              </p>
            )}
            {appts.map(({ a, d }) => (
              <Link
                key={a.id}
                href={`/app/consult/${a.id}`}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3 hover:bg-slate-50"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-xl">{d?.photo}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{d?.name}</p>
                  <p className="truncate text-xs text-slate-500">
                    {shortDate(a.scheduledAt)} · {a.mode}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                    a.status === "completed"
                      ? "bg-slate-100 text-slate-500"
                      : a.status === "active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {a.status}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Latest vitals</h2>
            <Link href="/app/records" className="text-xs font-semibold text-brand-700">Log new</Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {recentVitals.length === 0 && (
              <p className="col-span-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                Start logging blood pressure, sugar or weight to see trends your doctor can read.
              </p>
            )}
            {recentVitals.map((v) => (
              <div key={v.id} className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">{v.type}</p>
                <p className="text-lg font-extrabold">{v.value}</p>
                <p className="text-[11px] text-slate-400">{shortDate(v.recordedAt)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="card p-5">
          <h2 className="font-bold">Prescriptions & labs</h2>
          <div className="mt-4 space-y-3">
            {rx.length === 0 && labs.length === 0 && (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                E-prescriptions and lab results will appear here after your consultation.
              </p>
            )}
            {rx.map((p) => (
              <div key={p.id} className="rounded-2xl border border-slate-100 p-3">
                <p className="text-sm font-semibold">💊 {p.refCode}</p>
                <p className="text-xs text-slate-500">
                  {p.doctorName} · {shortDate(p.issuedAt)}
                </p>
              </div>
            ))}
            {labs.map((l) => (
              <div key={l.id} className="rounded-2xl border border-slate-100 p-3">
                <p className="text-sm font-semibold">🧪 {l.testName}</p>
                <p className="text-xs text-slate-500">
                  {l.status} · {naira(l.priceKobo)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Health library</h2>
            <Link href="/app/learn" className="text-xs font-semibold text-brand-700">Browse</Link>
          </div>
          <div className="mt-4 space-y-3">
            {posts.map((p) => (
              <Link key={p.id} href={`/app/learn/${p.slug}`} className="flex gap-3 rounded-2xl border border-slate-100 p-3 hover:bg-slate-50">
                <span className="text-2xl">{p.emoji}</span>
                <div>
                  <p className="text-sm font-semibold leading-snug">{p.title}</p>
                  <p className="text-xs text-slate-500">{p.readMinutes} min read · {p.category}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
