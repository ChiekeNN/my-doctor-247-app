"use client";

import { useState } from "react";
import Link from "next/link";
import { SYMPTOMS, type TriageResult } from "@/lib/triage";

const LEVEL_STYLE: Record<string, { bg: string; label: string; emoji: string }> = {
  emergency: { bg: "bg-red-600", label: "Emergency", emoji: "🚨" },
  urgent: { bg: "bg-amber-500", label: "Urgent", emoji: "⚠️" },
  routine: { bg: "bg-brand-600", label: "See a doctor", emoji: "🩺" },
  selfcare: { bg: "bg-emerald-600", label: "Self-care", emoji: "🌿" },
};

export default function SymptomChecker() {
  const [selected, setSelected] = useState<string[]>([]);
  const [duration, setDuration] = useState(2);
  const [result, setResult] = useState<TriageResult | null>(null);
  const [busy, setBusy] = useState(false);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const run = async () => {
    setBusy(true);
    const res = await fetch("/api/triage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms: selected, durationDays: duration }),
    });
    const data = await res.json();
    setBusy(false);
    if (data.result) setResult(data.result);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">AI symptom checker</h1>
        <p className="text-sm text-slate-500">
          Tuned for Nigerian conditions — malaria, typhoid, hypertension, maternal red flags. Free and unlimited.
        </p>
      </div>

      <div className="card p-5">
        <p className="text-sm font-semibold">What are you feeling? Select all that apply.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {SYMPTOMS.map((s) => (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              className={`rounded-full border px-3 py-2 text-xs font-medium transition ${
                selected.includes(s.id)
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-brand-300"
              }`}
            >
              {s.emoji} {s.label}
            </button>
          ))}
        </div>

        <p className="mt-6 text-sm font-semibold">
          How long have you had these symptoms?{" "}
          <span className="text-brand-700">{duration} day{duration > 1 ? "s" : ""}</span>
        </p>
        <input
          type="range"
          min={1}
          max={30}
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="mt-3 w-full accent-brand-600"
        />

        <button
          onClick={run}
          disabled={selected.length === 0 || busy}
          className="mt-5 w-full rounded-xl bg-brand-600 py-3.5 text-sm font-bold text-white disabled:opacity-50"
        >
          {busy ? "Analysing…" : "Check my symptoms"}
        </button>
        <p className="mt-2 text-center text-[11px] text-slate-400">
          This tool supports but never replaces a doctor&apos;s judgement.
        </p>
      </div>

      {result && (
        <div className="space-y-4 animate-fadeup">
          <div className={`rounded-3xl p-6 text-white ${LEVEL_STYLE[result.level].bg}`}>
            <p className="text-xs uppercase tracking-[0.2em] opacity-80">
              {LEVEL_STYLE[result.level].emoji} {LEVEL_STYLE[result.level].label}
            </p>
            <h2 className="mt-2 text-2xl font-extrabold">{result.headline}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/85">{result.advice}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {result.level === "emergency" ? (
                <Link href="/app/emergency" className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-red-700">
                  Open emergency SOS
                </Link>
              ) : (
                <Link href="/app/doctors" className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-ink-900">
                  Talk to a {result.recommendedSpecialty} doctor
                </Link>
              )}
              <Link href="/app/labs" className="rounded-xl bg-black/20 px-4 py-2.5 text-sm font-bold">
                Order suggested tests
              </Link>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-bold">Possible causes</h3>
            <p className="text-xs text-slate-500">Ranked by likelihood based on your inputs</p>
            <div className="mt-4 space-y-4">
              {result.possibleConditions.map((c) => (
                <div key={c.name}>
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span>{c.name}</span>
                    <span className="text-brand-700">{c.likelihood}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-brand-500" style={{ width: `${c.likelihood}%` }} />
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500">{c.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-bold">Suggested tests</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {result.suggestedTests.map((t) => (
                <span key={t} className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-800">
                  🧪 {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
