"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { naira, shortDate } from "@/lib/format";
import { PLANS } from "@/lib/catalog";

type Tx = { id: number; amountKobo: number; type: string; description: string; reference: string; createdAt: string };

const AMOUNTS = [1000, 2500, 5000, 10000, 20000];
const CHANNELS = ["Card", "Bank transfer", "USSD", "Opay / Moniepoint"];

export default function WalletView({
  balanceKobo,
  transactions,
  plan,
}: {
  balanceKobo: number;
  transactions: Tx[];
  plan: string;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState(5000);
  const [channel, setChannel] = useState("Card");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const fund = async () => {
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amountNaira: amount, channel }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    setMsg(res.ok ? `₦${amount.toLocaleString()} added successfully.` : (data.error ?? "Top-up failed"));
    if (res.ok) router.refresh();
  };

  const choosePlan = async (id: string) => {
    setBusy(true);
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: id }),
    });
    setBusy(false);
    router.refresh();
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Wallet & billing</h1>
        <p className="text-sm text-slate-500">Pay for consultations, tests and medication from one balance.</p>
      </div>

      <div className="gradient-hero rounded-3xl p-6 text-white">
        <p className="text-xs text-white/50">Available balance</p>
        <p className="text-4xl font-extrabold text-brand-300">{naira(balanceKobo)}</p>
        <p className="mt-1 text-xs text-white/50">
          Current plan: <span className="capitalize">{plan === "free" ? "Pay as you go" : plan}</span>
        </p>
      </div>

      <div className="card p-5">
        <p className="text-sm font-bold">Top up</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {AMOUNTS.map((a) => (
            <button
              key={a}
              onClick={() => setAmount(a)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                amount === a ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              ₦{a.toLocaleString()}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {CHANNELS.map((c) => (
            <button
              key={c}
              onClick={() => setChannel(c)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                channel === c ? "border-brand-500 bg-brand-50 text-brand-800" : "border-slate-200 text-slate-500"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <button
          onClick={fund}
          disabled={busy}
          className="mt-4 w-full rounded-xl bg-brand-600 py-3.5 text-sm font-bold text-white disabled:opacity-60"
        >
          {busy ? "Processing…" : `Fund ₦${amount.toLocaleString()} via ${channel}`}
        </button>
        {msg && <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{msg}</p>}
        <p className="mt-2 text-center text-[11px] text-slate-400">
          Demo payment rail — production build settles through Paystack/Flutterwave.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {PLANS.map((p) => (
          <div key={p.id} className={`card p-5 ${plan === p.id ? "ring-2 ring-brand-500" : ""}`}>
            <p className="font-bold">{p.name}</p>
            <p className="mt-1 text-2xl font-extrabold">
              {p.priceKobo === 0 ? "₦0" : naira(p.priceKobo)}
              <span className="text-xs font-medium text-slate-400">{p.period}</span>
            </p>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
              {p.perks.map((x) => (
                <li key={x}>✓ {x}</li>
              ))}
            </ul>
            <button
              onClick={() => choosePlan(p.id)}
              disabled={plan === p.id || busy}
              className="mt-4 w-full rounded-xl bg-brand-50 py-2.5 text-xs font-bold text-brand-800 disabled:opacity-60"
            >
              {plan === p.id ? "Current plan" : "Switch to this plan"}
            </button>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <p className="text-sm font-bold">Transaction history</p>
        <div className="mt-3 divide-y divide-slate-100">
          {transactions.length === 0 && <p className="py-4 text-sm text-slate-500">No transactions yet.</p>}
          {transactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{t.description}</p>
                <p className="text-[11px] text-slate-400">
                  {shortDate(t.createdAt)} · {t.reference}
                </p>
              </div>
              <p className={`text-sm font-bold ${t.type === "credit" ? "text-emerald-600" : "text-slate-700"}`}>
                {t.type === "credit" ? "+" : "−"}
                {naira(t.amountKobo)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
