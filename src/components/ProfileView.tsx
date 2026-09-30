"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NIGERIAN_STATES, LANGUAGES } from "@/lib/format";

type Profile = {
  fullName: string;
  email: string;
  phone: string;
  state: string;
  language: string;
  gender: string;
  dob: string;
  bloodGroup: string;
  genotype: string;
  allergies: string;
  hmoProvider: string;
};

export default function ProfileView({ initial }: { initial: Profile }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const set = (k: keyof Profile, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setBusy(false);
    setMsg(res.ok ? "Profile updated ✅" : "Could not save changes");
    if (res.ok) router.refresh();
  };

  const exportRecord = () => {
    const blob = new Blob([JSON.stringify(form, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mydoc247-health-summary.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Profile & settings</h1>
        <p className="text-sm text-slate-500">
          The more complete your profile, the safer and faster your care.
        </p>
      </div>

      <div className="card grid gap-4 p-5 md:grid-cols-2">
        <F label="Full name">
          <input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} className={cls} />
        </F>
        <F label="Email (login)">
          <input value={form.email} disabled className={`${cls} opacity-60`} />
        </F>
        <F label="Phone">
          <input value={form.phone} onChange={(e) => set("phone", e.target.value)} className={cls} />
        </F>
        <F label="Date of birth">
          <input type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)} className={cls} />
        </F>
        <F label="Gender">
          <select value={form.gender} onChange={(e) => set("gender", e.target.value)} className={cls}>
            <option value="">Select</option>
            <option>Female</option>
            <option>Male</option>
          </select>
        </F>
        <F label="State of residence">
          <select value={form.state} onChange={(e) => set("state", e.target.value)} className={cls}>
            {NIGERIAN_STATES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </F>
        <F label="Preferred language">
          <select value={form.language} onChange={(e) => set("language", e.target.value)} className={cls}>
            {LANGUAGES.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </F>
        <F label="Blood group">
          <select value={form.bloodGroup} onChange={(e) => set("bloodGroup", e.target.value)} className={cls}>
            <option value="">Select</option>
            {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </F>
        <F label="Genotype">
          <select value={form.genotype} onChange={(e) => set("genotype", e.target.value)} className={cls}>
            <option value="">Select</option>
            {["AA", "AS", "AC", "SS", "SC"].map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </F>
        <F label="HMO / insurance">
          <input
            value={form.hmoProvider}
            onChange={(e) => set("hmoProvider", e.target.value)}
            placeholder="e.g. Hygeia, Reliance, AXA Mansard"
            className={cls}
          />
        </F>
        <div className="md:col-span-2">
          <F label="Allergies & chronic conditions">
            <textarea
              rows={2}
              value={form.allergies}
              onChange={(e) => set("allergies", e.target.value)}
              placeholder="e.g. Penicillin allergy, asthma, hypertension"
              className={cls}
            />
          </F>
        </div>
      </div>

      {msg && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{msg}</p>}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={save}
          disabled={busy}
          className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save changes"}
        </button>
        <button onClick={exportRecord} className="rounded-xl bg-brand-50 px-6 py-3 text-sm font-bold text-brand-800">
          Export health summary
        </button>
      </div>

      <div className="card p-5 text-xs leading-relaxed text-slate-500">
        <p className="mb-2 text-sm font-bold text-ink-900">🔒 Your data rights</p>
        In line with the Nigeria Data Protection Act (2023) you can request a copy of your data,
        correct it, or ask us to delete it at any time. Consultation records are retained for the
        clinically recommended period unless you request erasure. We never sell your data.
      </div>
    </div>
  );
}

const cls =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:bg-white";

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>
      {children}
    </label>
  );
}
