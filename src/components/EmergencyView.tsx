"use client";

import { useState } from "react";
import Link from "next/link";
import { EMERGENCY_NUMBERS } from "@/lib/catalog";

const FIRST_AID = [
  { t: "Severe bleeding", d: "Press firmly on the wound with a clean cloth. Raise the limb above the heart. Do not remove a soaked cloth — add another on top.", e: "🩸" },
  { t: "Convulsion / seizure", d: "Lay the person on their side, clear objects away, cushion the head. Do NOT put anything in the mouth. Time the seizure.", e: "⚡" },
  { t: "Choking", d: "5 firm back blows between the shoulder blades, then 5 abdominal thrusts. Repeat until the object clears.", e: "😮" },
  { t: "Burns", d: "Cool under clean running water for 20 minutes. No ice, no toothpaste, no palm oil. Cover with cling film.", e: "🔥" },
  { t: "Suspected stroke (FAST)", d: "Face drooping, Arm weakness, Speech difficulty — Time to call 112. Note the time symptoms began.", e: "🧠" },
  { t: "Snake bite", d: "Keep the person still and the limb below heart level. Do not cut, suck or apply a tourniquet. Get to hospital fast.", e: "🐍" },
];

export default function EmergencyView({ name, phone }: { name: string; phone: string }) {
  const [state, setState] = useState<"idle" | "locating" | "sent">("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [err, setErr] = useState("");

  const trigger = () => {
    setState("locating");
    setErr("");
    if (!navigator.geolocation) {
      setState("sent");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setState("sent");
      },
      () => {
        setErr("Location unavailable — the response team will call you on " + phone + ".");
        setState("sent");
      },
      { timeout: 8000 },
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Emergency SOS</h1>
        <p className="text-sm text-slate-500">
          One tap alerts our rapid desk, shares your live location and dials the right responder.
        </p>
      </div>

      <div className="card overflow-hidden">
        <div className="bg-red-600 p-6 text-center text-white">
          {state !== "sent" ? (
            <>
              <button
                onClick={trigger}
                className="animate-sos mx-auto grid h-36 w-36 place-items-center rounded-full bg-white text-xl font-black text-red-600"
              >
                {state === "locating" ? "Locating…" : "SOS"}
              </button>
              <p className="mt-5 text-sm text-white/80">
                Hold your phone steady. We alert MyDoc247 rapid desk + your nearest partner hospital.
              </p>
            </>
          ) : (
            <div className="animate-fadeup">
              <p className="text-5xl">🚑</p>
              <h2 className="mt-3 text-xl font-extrabold">Alert sent, {name.split(" ")[0]}</h2>
              <p className="mt-2 text-sm text-white/85">
                MyDoc247 rapid desk has your case. An emergency physician will call{" "}
                <span className="font-bold">{phone}</span> within 2 minutes.
              </p>
              {coords && (
                <p className="mt-3 rounded-xl bg-black/20 px-3 py-2 text-xs">
                  📍 Location shared: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                </p>
              )}
              {err && <p className="mt-3 text-xs text-white/70">{err}</p>}
              <a
                href="tel:112"
                className="mt-5 inline-block rounded-xl bg-white px-6 py-3 text-sm font-bold text-red-700"
              >
                📞 Also call 112 now
              </a>
            </div>
          )}
        </div>
      </div>

      <section className="card p-5">
        <p className="text-sm font-bold">Nigerian emergency numbers</p>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {EMERGENCY_NUMBERS.map((n) => (
            <a
              key={n.number}
              href={`tel:${n.number.replace(/[^0-9]/g, "")}`}
              className="flex items-center justify-between rounded-2xl border border-slate-100 p-3 hover:bg-slate-50"
            >
              <div>
                <p className="text-sm font-semibold">{n.name}</p>
                <p className="text-xs text-slate-500">{n.note}</p>
              </div>
              <span className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-bold text-red-700">{n.number}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="card p-5">
        <p className="text-sm font-bold">First aid while help is coming</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {FIRST_AID.map((f) => (
            <div key={f.t} className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-bold">{f.e} {f.t}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="card p-5 text-sm text-slate-600">
        Not an emergency but still worried?{" "}
        <Link href="/app/doctors" className="font-semibold text-brand-700">
          Chat a doctor now →
        </Link>
      </div>
    </div>
  );
}
