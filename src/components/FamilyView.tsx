"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Dep = { id: number; name: string; relationship: string; dob: string | null; gender: string };
type Rem = { id: number; title: string; timeOfDay: string; frequency: string; active: boolean };

const RELATIONS = ["Child", "Spouse", "Parent", "Sibling", "Ward", "Staff"];

export default function FamilyView({ dependents, reminders }: { dependents: Dep[]; reminders: Rem[] }) {
  const router = useRouter();
  const [dep, setDep] = useState({ name: "", relationship: "Child", dob: "", gender: "female" });
  const [rem, setRem] = useState({ title: "", timeOfDay: "08:00", frequency: "daily" });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const addDep = async () => {
    if (!dep.name) return;
    setBusy(true);
    await fetch("/api/dependents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dep),
    });
    setDep({ name: "", relationship: "Child", dob: "", gender: "female" });
    setBusy(false);
    router.refresh();
  };

  const delDep = async (id: number) => {
    await fetch("/api/dependents", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  };

  const addRem = async () => {
    if (!rem.title) return;
    setBusy(true);
    await fetch("/api/reminders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rem),
    });
    setRem({ title: "", timeOfDay: "08:00", frequency: "daily" });
    setBusy(false);
    router.refresh();
  };

  const toggleRem = async (id: number, active: boolean) => {
    await fetch("/api/reminders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active }),
    });
    router.refresh();
  };

  const enableNotifications = async () => {
    if (!("Notification" in window)) {
      setNotice("This browser does not support notifications.");
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      new Notification("MyDoc247 reminders on ✅", {
        body: "We'll nudge you when it's time to take your medication.",
        icon: "/icons/icon-192.png",
      });
      setNotice("Medication reminders enabled on this device.");
    } else {
      setNotice("Notifications blocked — you can enable them in browser settings.");
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Family & reminders</h1>
        <p className="text-sm text-slate-500">
          Cover your household on one account and never miss a dose or a clinic date.
        </p>
      </div>

      <section className="card p-5">
        <p className="text-sm font-bold">Dependents</p>
        <div className="mt-3 space-y-2">
          {dependents.length === 0 && (
            <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
              No dependents added. Family Care covers up to 5 people.
            </p>
          )}
          {dependents.map((d) => (
            <div key={d.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-lg">
                {d.relationship === "Child" ? "👶" : d.relationship === "Parent" ? "🧓" : "🧑"}
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold">{d.name}</p>
                <p className="text-xs text-slate-500">
                  {d.relationship} · {d.gender}
                  {d.dob ? ` · ${d.dob}` : ""}
                </p>
              </div>
              <button onClick={() => delDep(d.id)} className="text-xs text-red-500">
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-2 md:grid-cols-4">
          <input
            value={dep.name}
            onChange={(e) => setDep({ ...dep, name: e.target.value })}
            placeholder="Full name"
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm md:col-span-2"
          />
          <select
            value={dep.relationship}
            onChange={(e) => setDep({ ...dep, relationship: e.target.value })}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
          >
            {RELATIONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <input
            type="date"
            value={dep.dob}
            onChange={(e) => setDep({ ...dep, dob: e.target.value })}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
          />
        </div>
        <button
          onClick={addDep}
          disabled={busy}
          className="mt-3 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
        >
          Add dependent
        </button>
      </section>

      <section className="card p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">Medication & appointment reminders</p>
          <button onClick={enableNotifications} className="rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-800">
            Enable push
          </button>
        </div>
        {notice && <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-800">{notice}</p>}

        <div className="mt-3 space-y-2">
          {reminders.length === 0 && (
            <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
              No reminders yet. Try “Amlodipine 5mg” at 08:00 daily.
            </p>
          )}
          {reminders.map((r) => (
            <div key={r.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3">
              <span className="text-lg">⏰</span>
              <div className="flex-1">
                <p className="text-sm font-semibold">{r.title}</p>
                <p className="text-xs text-slate-500">
                  {r.timeOfDay} · {r.frequency}
                </p>
              </div>
              <button
                onClick={() => toggleRem(r.id, !r.active)}
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  r.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                }`}
              >
                {r.active ? "On" : "Off"}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-2 md:grid-cols-4">
          <input
            value={rem.title}
            onChange={(e) => setRem({ ...rem, title: e.target.value })}
            placeholder="e.g. Take Coartem"
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm md:col-span-2"
          />
          <input
            type="time"
            value={rem.timeOfDay}
            onChange={(e) => setRem({ ...rem, timeOfDay: e.target.value })}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
          />
          <select
            value={rem.frequency}
            onChange={(e) => setRem({ ...rem, frequency: e.target.value })}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
          >
            <option value="daily">Daily</option>
            <option value="twice-daily">Twice daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <button
          onClick={addRem}
          disabled={busy}
          className="mt-3 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
        >
          Add reminder
        </button>
      </section>
    </div>
  );
}
