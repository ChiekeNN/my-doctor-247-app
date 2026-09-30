"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LAB_TESTS } from "@/lib/catalog";
import { naira, shortDate } from "@/lib/format";

type Order = {
  id: number;
  testName: string;
  priceKobo: number;
  status: string;
  collectionType: string;
  address: string;
  resultSummary: string;
  scheduledAt: string;
};

export default function LabBooking({ orders, plan }: { orders: Order[]; plan: string }) {
  const router = useRouter();
  const [picked, setPicked] = useState<(typeof LAB_TESTS)[number] | null>(null);
  const [collection, setCollection] = useState("home");
  const [address, setAddress] = useState("");
  const [when, setWhen] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const price = (kobo: number) => (plan === "family" ? Math.round(kobo * 0.8) : kobo);

  const submit = async () => {
    if (!picked) return;
    setBusy(true);
    setError("");
    const res = await fetch("/api/labs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        testName: picked.name,
        priceKobo: picked.priceKobo,
        collectionType: collection,
        address,
        scheduledAt: when || undefined,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Could not book test");
      return;
    }
    setPicked(null);
    setOk("Booked! A certified phlebotomist will contact you before arrival.");
    router.refresh();
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Lab tests at home</h1>
        <p className="text-sm text-slate-500">
          Accredited partner labs in Lagos, Abuja, Port Harcourt, Ibadan & Kano. Results straight into your record.
        </p>
      </div>

      {ok && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{ok}</p>}

      <div className="grid gap-3 md:grid-cols-2">
        {LAB_TESTS.map((t) => (
          <div key={t.name} className="card flex items-center gap-4 p-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-2xl">{t.emoji}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold leading-snug">{t.name}</p>
              <p className="text-xs text-slate-500">Results: {t.turnaround}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-brand-700">{naira(price(t.priceKobo))}</p>
              <button
                onClick={() => {
                  setPicked(t);
                  setOk("");
                }}
                className="mt-1 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-bold text-white"
              >
                Book
              </button>
            </div>
          </div>
        ))}
      </div>

      <section className="card p-5">
        <h2 className="font-bold">My lab orders</h2>
        {orders.length === 0 ? (
          <p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            No tests ordered yet. Testing before treating prevents wrong prescriptions.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{o.testName}</p>
                  <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase text-amber-700">
                    {o.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {o.collectionType === "home" ? "Home collection" : "Walk-in centre"} ·{" "}
                  {shortDate(o.scheduledAt)} · {naira(o.priceKobo)}
                </p>
                {o.address && <p className="mt-1 text-xs text-slate-400">{o.address}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      {picked && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 md:items-center md:p-4">
          <div className="w-full max-w-md rounded-t-3xl bg-white p-6 md:rounded-3xl animate-fadeup">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Booking</p>
                <h2 className="font-bold">{picked.name}</h2>
              </div>
              <button onClick={() => setPicked(null)} className="text-slate-400">✕</button>
            </div>

            <div className="mt-5 flex gap-2">
              {[
                { id: "home", label: "🏠 Home collection" },
                { id: "centre", label: "🏥 Walk into centre" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCollection(c.id)}
                  className={`flex-1 rounded-xl border px-3 py-2.5 text-xs font-semibold ${
                    collection === c.id ? "border-brand-500 bg-brand-50 text-brand-800" : "border-slate-200 text-slate-500"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {collection === "home" && (
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                placeholder="Street address, landmark, LGA"
                className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
              />
            )}
            <input
              type="datetime-local"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            />

            {error && <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

            <button
              onClick={submit}
              disabled={busy}
              className="mt-5 w-full rounded-xl bg-brand-600 py-3.5 text-sm font-bold text-white disabled:opacity-60"
            >
              {busy ? "Booking…" : `Pay ${naira(price(picked.priceKobo))} from wallet`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
