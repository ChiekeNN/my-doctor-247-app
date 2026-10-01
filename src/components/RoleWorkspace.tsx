"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROLE_INFO, type StaffRole } from "@/lib/roles";

type WorkspaceCard = {
  icon: string;
  title: string;
  description: string;
};

const WORKSPACES: Record<StaffRole, { description: string; cards: WorkspaceCard[] }> = {
  admin: {
    description: "A preview of MyDoc247 platform operations and account oversight.",
    cards: [
      { icon: "👥", title: "User directory", description: "Manage patient and clinician accounts." },
      { icon: "✅", title: "Clinician approvals", description: "Review professional details and credentials." },
      { icon: "🏥", title: "Institution registry", description: "Review hospitals and health-centre profiles." },
    ],
  },
  doctor: {
    description: "A preview of the clinical workspace for consultations and patient follow-up.",
    cards: [
      { icon: "💬", title: "Consultations", description: "Review current and upcoming patient visits." },
      { icon: "📋", title: "Patient follow-up", description: "Keep track of care plans and follow-up needs." },
      { icon: "🟢", title: "Availability", description: "Manage when patients can book or consult you." },
    ],
  },
  institution: {
    description: "A preview of the workspace for hospitals, health centres and FMCs.",
    cards: [
      { icon: "🏥", title: "Facility profile", description: "Manage services, location and contact details." },
      { icon: "🔁", title: "Referrals", description: "Coordinate referrals and care transitions." },
      { icon: "🩺", title: "Care team", description: "Manage clinicians connected to your facility." },
    ],
  },
};

export default function RoleWorkspace({ name, role }: { name: string; role: StaffRole }) {
  const router = useRouter();
  const workspace = WORKSPACES[role];
  const roleInfo = ROLE_INFO[role];

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#f5f8f7]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4">
          <Link href="/" className="font-bold text-lg">
            MyDoc<span className="text-brand-600">247</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-800">
              {roleInfo.icon} {roleInfo.label}
            </span>
            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        <section className="gradient-hero rounded-3xl p-6 text-white md:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-200">
            {roleInfo.icon} {roleInfo.label} workspace · Demo
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
            Welcome, {name}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
            {workspace.description}
          </p>
        </section>

        <section>
          <div className="mb-3">
            <h2 className="text-lg font-bold">Your workspace</h2>
            <p className="text-sm text-slate-500">Role-specific tools for your MyDoc247 account.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {workspace.cards.map((card) => (
              <article key={card.title} className="card p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-2xl">
                    {card.icon}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                    Demo preview
                  </span>
                </div>
                <h3 className="mt-4 font-bold">{card.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <aside className="rounded-2xl border border-brand-100 bg-brand-50 p-4 text-sm text-brand-900">
          This is a demo workspace. Role-specific account types are set up; operational tools and records are not connected yet.
        </aside>
      </main>
    </div>
  );
}
