"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { naira } from "@/lib/format";
import { SPECIALTIES, LANGUAGES_LIST } from "@/lib/uiconst";

export type Doctor = {
  id: number;
  name: string;
  specialty: string;
  bio: string;
  qualifications: string;
  mdcnNumber: string;
  languages: string;
  yearsExperience: number;
  rating: number;
  reviewCount: number;
  feeKobo: number;
  availableNow: boolean;
  photo: string;
  location: string;
};

const MODES = [
  { id: "chat", label: "Chat", mult: 0.6, icon: "💬", note: "Lowest data usage" },
  { id: "voice", label: "Voice call", mult: 0.8, icon: "📞", note: "Works on 2G/3G" },
  { id: "video", label: "Video call", mult: 1, icon: "🎥", note: "Face-to-face" },
  { id: "home", label: "Home visit", mult: 1.8, icon: "🏠", note: "Lagos, Abuja, PH" },
];

export default function DoctorBrowser({ doctors, plan }: { doctors: Doctor[]; plan: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [spec, setSpec] = useState("All");
  const [lang, setLang] = useState("All");
  const [onlyOnline, setOnlyOnline] = useState(false);
  const [selected, setSelected] = useState<Doctor | null>(null);
  const [mode, setMode] = useState("chat");
  const [reason, setReason] = useState("");
  const [instant, setInstant] = useState(true);
  const [when, setWhen] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const list = useMemo(
    () =>
      doctors.filter(
        (d) =>
          (spec === "All" || d.specialty === spec) &&
          (lang === "All" || d.languages.includes(lang)) &&
          (!onlyOnline || d.availableNow) &&
          (q === "" ||
            d.name.toLowerCase().includes(q.toLowerCase()) ||
            d.specialty.toLowerCase().includes(q.toLowerCase()) ||
            d.bio.toLowerCase().includes(q.toLowerCase())),
      ),
    [doctors, q, spec, lang, onlyOnline],
  );

  const feeFor = (d: Doctor, m: string) => {
    const mult = MODES.find((x) => x.id === m)?.mult ?? 1;
    const base = Math.round(d.feeKobo * mult);
    return plan === "family" ? Math.round(base * 0.5) : base;
  };

  const book = async () => {
    if (!selected) return;
    setBusy(true);
    setError("");
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctorId: selected.id,
        mode,
        reason,
        instant,
        scheduledAt: instant ? undefined : when,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Could not book consultation");
      return;
    }
    router.push(`/app/consult/${data.appointment.id}`);
    router.refresh();
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Find a doctor</h1>
        <p className="text-sm text-slate-500">
          {list.filter((d) => d.availableNow).length} clinicians available right now · average wait 6 minutes
        </p>
      </div>

      <div className="card space-y-3 p-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, specialty or condition…"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-400 focus:bg-white"
        />
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {["All", ...SPECIALTIES.map((s) => s.name)].map((s) => (
            <button
              key={s}
              onClick={() => setSpec(s)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${
                spec === s ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {["All", ...LANGUAGES_LIST].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`rounded-full border px-3 py-1 text-xs ${
                lang === l ? "border-brand-500 bg-brand-50 text-brand-800" : "border-slate-200 text-slate-500"
              }`}
            >
              {l}
            </button>
          ))}
          <label className="ml-auto flex items-center gap-2 text-xs font-medium text-slate-600">
            <input type="checkbox" checked={onlyOnline} onChange={(e) => setOnlyOnline(e.target.checked)} />
            Online now
          </label>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {list.map((d) => (
          <div key={d.id} className="card p-5">
            <div className="flex items-start gap-3">
              <div className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-50 text-3xl">
                {d.photo}
                {d.availableNow && (
                  <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate font-bold">{d.name}</p>
                  <span className="text-brand-600" title="MDCN verified">✔︎</span>
                </div>
                <p className="text-xs text-slate-500">
                  {d.specialty} · {d.yearsExperience} yrs · {d.location}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {d.qualifications} · MDCN {d.mdcnNumber}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-brand-700">{naira(d.feeKobo)}</p>
                <p className="text-[10px] text-slate-400">from</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{d.bio}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {d.languages.split(",").map((l) => (
                <span key={l} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                  {l.trim()}
                </span>
              ))}
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                {d.rating.toFixed(1)}★ ({d.reviewCount})
              </span>
            </div>
            <button
              onClick={() => {
                setSelected(d);
                setError("");
              }}
              className="mt-4 w-full rounded-xl bg-brand-600 py-2.5 text-sm font-bold text-white hover:bg-brand-700"
            >
              {d.availableNow ? "Consult now" : "Book appointment"}
            </button>
          </div>
        ))}
        {list.length === 0 && (
          <p className="card p-6 text-sm text-slate-500">No doctors match those filters. Try widening your search.</p>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 p-0 md:items-center md:p-4">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 md:rounded-3xl animate-fadeup">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Booking with</p>
                <h2 className="text-lg font-bold">{selected.name}</h2>
                <p className="text-xs text-slate-500">{selected.specialty}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400">✕</button>
            </div>

            <p className="mt-5 text-xs font-semibold text-slate-600">Consultation type</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`rounded-2xl border p-3 text-left ${
                    mode === m.id ? "border-brand-500 bg-brand-50" : "border-slate-200"
                  }`}
                >
                  <p className="text-sm font-semibold">{m.icon} {m.label}</p>
                  <p className="text-[11px] text-slate-500">{m.note}</p>
                  <p className="mt-1 text-sm font-bold text-brand-700">{naira(feeFor(selected, m.id))}</p>
                </button>
              ))}
            </div>

            <p className="mt-5 text-xs font-semibold text-slate-600">When?</p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => setInstant(true)}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold ${
                  instant ? "border-brand-500 bg-brand-50 text-brand-800" : "border-slate-200 text-slate-500"
                }`}
              >
                Now (≈6 min)
              </button>
              <button
                onClick={() => setInstant(false)}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold ${
                  !instant ? "border-brand-500 bg-brand-50 text-brand-800" : "border-slate-200 text-slate-500"
                }`}
              >
                Schedule
              </button>
            </div>
            {!instant && (
              <input
                type="datetime-local"
                value={when}
                onChange={(e) => setWhen(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              />
            )}

            <p className="mt-5 text-xs font-semibold text-slate-600">What&apos;s troubling you?</p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="e.g. Fever and headache for 3 days, took paracetamol"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:bg-white"
            />

            {error && <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

            <button
              onClick={book}
              disabled={busy || (!instant && !when)}
              className="mt-5 w-full rounded-xl bg-brand-600 py-3.5 text-sm font-bold text-white disabled:opacity-60"
            >
              {busy ? "Booking…" : `Pay ${naira(feeFor(selected, mode))} & start`}
            </button>
            <p className="mt-2 text-center text-[11px] text-slate-400">
              Charged from your MyDoc247 wallet. Refunded in full if the doctor does not show.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
