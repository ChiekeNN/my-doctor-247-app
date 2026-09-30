"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { shortDate } from "@/lib/format";

type Vital = { id: number; type: string; value: string; numeric: number; recordedAt: string; note: string };
type Med = { name: string; dose: string; duration: string };
type Rx = {
  id: number;
  refCode: string;
  doctorName: string;
  medications: Med[];
  instructions: string;
  status: string;
  issuedAt: string;
};
type Note = { id: number; diagnosis: string; doctorNote: string; scheduledAt: string; doctorName: string };

const VITAL_TYPES = [
  { id: "bp", label: "Blood pressure", unit: "mmHg", placeholder: "120/80", emoji: "🫀" },
  { id: "sugar", label: "Blood sugar", unit: "mg/dL", placeholder: "95", emoji: "🩸" },
  { id: "weight", label: "Weight", unit: "kg", placeholder: "72", emoji: "⚖️" },
  { id: "temp", label: "Temperature", unit: "°C", placeholder: "36.8", emoji: "🌡️" },
  { id: "spo2", label: "Oxygen (SpO2)", unit: "%", placeholder: "98", emoji: "🫁" },
];

export default function RecordsView({
  vitals,
  prescriptions,
  notes,
  profile,
}: {
  vitals: Vital[];
  prescriptions: Rx[];
  notes: Note[];
  profile: { fullName: string; bloodGroup: string; genotype: string; allergies: string; hmoProvider: string };
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"vitals" | "rx" | "notes">("vitals");
  const [type, setType] = useState("bp");
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);

  const add = async () => {
    if (!value.trim()) return;
    setBusy(true);
    await fetch("/api/vitals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, value }),
    });
    setValue("");
    setBusy(false);
    router.refresh();
  };

  const active = VITAL_TYPES.find((v) => v.id === type)!;
  const series = vitals.filter((v) => v.type === type).slice(0, 12).reverse();
  const max = Math.max(...series.map((s) => s.numeric), 1);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Health record</h1>
        <p className="text-sm text-slate-500">
          Your lifelong, portable medical file. Available offline once loaded.
        </p>
      </div>

      <div className="card grid grid-cols-2 gap-3 p-4 text-sm md:grid-cols-4">
        <Info label="Patient" value={profile.fullName} />
        <Info label="Blood group" value={profile.bloodGroup || "—"} />
        <Info label="Genotype" value={profile.genotype || "—"} />
        <Info label="HMO" value={profile.hmoProvider || "None"} />
        <div className="col-span-2 md:col-span-4">
          <p className="text-[11px] uppercase tracking-wide text-slate-400">Allergies</p>
          <p className="font-semibold text-red-600">{profile.allergies || "None recorded"}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {[
          { id: "vitals", label: "Vitals" },
          { id: "rx", label: `Prescriptions (${prescriptions.length})` },
          { id: "notes", label: `Doctor notes (${notes.length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={`rounded-full px-4 py-2 text-xs font-bold ${
              tab === t.id ? "bg-brand-600 text-white" : "bg-white text-slate-500 ring-1 ring-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "vitals" && (
        <div className="space-y-4">
          <div className="card p-5">
            <p className="text-sm font-bold">Log a reading</p>
            <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
              {VITAL_TYPES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setType(v.id)}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${
                    type === v.id ? "bg-brand-50 text-brand-800 ring-1 ring-brand-300" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {v.emoji} {v.label}
                </button>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`${active.placeholder} ${active.unit}`}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              />
              <button
                onClick={add}
                disabled={busy}
                className="rounded-xl bg-brand-600 px-5 text-sm font-bold text-white disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>

          <div className="card p-5">
            <p className="text-sm font-bold">{active.label} trend</p>
            {series.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">No readings yet for {active.label.toLowerCase()}.</p>
            ) : (
              <div className="mt-5 flex h-40 items-end gap-2">
                {series.map((s) => (
                  <div key={s.id} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-[10px] font-semibold text-slate-500">{s.value}</span>
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-brand-500 to-brand-300"
                      style={{ height: `${Math.max((s.numeric / max) * 100, 6)}%` }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card divide-y divide-slate-100 p-1">
            {vitals.slice(0, 12).map((v) => (
              <div key={v.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-semibold capitalize">{v.type}</p>
                  <p className="text-xs text-slate-400">{shortDate(v.recordedAt)}</p>
                </div>
                <p className="text-lg font-extrabold">{v.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "rx" && (
        <div className="space-y-4">
          {prescriptions.length === 0 && (
            <p className="card p-6 text-sm text-slate-500">
              No prescriptions yet. After a consultation your doctor issues a QR-verified e-prescription here.
            </p>
          )}
          {prescriptions.map((p) => (
            <div key={p.id} className="card overflow-hidden">
              <div className="flex items-center justify-between bg-[#04231d] px-5 py-3 text-white">
                <div>
                  <p className="text-xs text-white/50">E-Prescription</p>
                  <p className="font-bold">{p.refCode}</p>
                </div>
                <div className="text-right text-xs text-white/60">
                  <p>{p.doctorName}</p>
                  <p>{shortDate(p.issuedAt)}</p>
                </div>
              </div>
              <div className="space-y-3 p-5">
                {p.medications.map((m) => (
                  <div key={m.name} className="rounded-xl bg-slate-50 p-3">
                    <p className="text-sm font-bold">💊 {m.name}</p>
                    <p className="text-xs text-slate-600">{m.dose}</p>
                    <p className="text-xs text-slate-400">Duration: {m.duration}</p>
                  </div>
                ))}
                <p className="text-xs leading-relaxed text-slate-500">{p.instructions}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="rounded-xl bg-brand-50 px-4 py-2 text-xs font-bold text-brand-800"
                  >
                    Print / save PDF
                  </button>
                  <span className="rounded-xl bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
                    ✔︎ Verified digitally signed
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "notes" && (
        <div className="space-y-3">
          {notes.length === 0 && (
            <p className="card p-6 text-sm text-slate-500">Doctor notes appear after each completed consultation.</p>
          )}
          {notes.map((n) => (
            <div key={n.id} className="card p-5">
              <p className="text-xs text-slate-400">{shortDate(n.scheduledAt)} · {n.doctorName}</p>
              <p className="mt-1 font-bold">{n.diagnosis || "General consultation"}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{n.doctorNote}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
