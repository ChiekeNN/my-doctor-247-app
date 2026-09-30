"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NIGERIAN_STATES, LANGUAGES } from "@/lib/format";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const isLogin = mode === "login";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    state: "Lagos",
    language: "English",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch(isLogin ? "/api/auth/login" : "/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }
    router.push("/app");
    router.refresh();
  };

  const demo = async () => {
    setLoading(true);
    setError("");
    const creds = { email: "demo@mydoc247.com.ng", password: "demo1234" };
    let res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(creds),
    });
    if (!res.ok) {
      res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...creds,
          fullName: "Ada Demo",
          phone: "08012345678",
          state: "Lagos",
          language: "English",
        }),
      });
    }
    setLoading(false);
    if (res.ok) {
      router.push("/app");
      router.refresh();
    } else {
      setError("Could not start demo session.");
    }
  };

  return (
    <main className="grid min-h-screen md:grid-cols-2">
      <div className="gradient-hero relative hidden flex-col justify-between p-10 text-white md:flex">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/icons/icon-192.png" alt="" width={36} height={36} className="rounded-xl" />
          <span className="text-lg font-bold">MyDoc247</span>
        </Link>
        <div>
          <h2 className="text-4xl font-extrabold leading-tight">
            Your family&apos;s health,<br />one secure record.
          </h2>
          <p className="mt-4 max-w-sm text-white/65">
            Consultations, prescriptions, lab results and vitals — always with you, even offline.
          </p>
          <div className="mt-8 space-y-3 text-sm text-white/70">
            <p>✅ Verified MDCN-licensed doctors</p>
            <p>🔒 Encrypted, NDPA-aligned records</p>
            <p>🎁 ₦5,000 welcome health credit</p>
          </div>
        </div>
        <p className="text-xs text-white/40">In an emergency dial 112 immediately.</p>
      </div>

      <div className="flex items-center justify-center bg-white px-5 py-10">
        <form onSubmit={submit} className="w-full max-w-md">
          <Link href="/" className="mb-6 inline-flex items-center gap-2 md:hidden">
            <Image src="/icons/icon-192.png" alt="" width={32} height={32} className="rounded-lg" />
            <span className="font-bold">MyDoc247</span>
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {isLogin ? "Welcome back" : "Create your free account"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {isLogin
              ? "Log in to reach a doctor in minutes."
              : "It takes under a minute. We'll credit ₦5,000 to your wallet to get you started."}
          </p>

          {error && (
            <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <div className="mt-6 space-y-4">
            {!isLogin && (
              <Field label="Full name">
                <input
                  required
                  value={form.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                  placeholder="Adaeze Okonkwo"
                  className={inputCls}
                />
              </Field>
            )}
            <Field label="Email address">
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@email.com"
                className={inputCls}
              />
            </Field>
            {!isLogin && (
              <>
                <Field label="Phone number">
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="0803 000 0000"
                    className={inputCls}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="State">
                    <select value={form.state} onChange={(e) => set("state", e.target.value)} className={inputCls}>
                      {NIGERIAN_STATES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Preferred language">
                    <select value={form.language} onChange={(e) => set("language", e.target.value)} className={inputCls}>
                      {LANGUAGES.map((l) => (
                        <option key={l}>{l}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              </>
            )}
            <Field label="Password">
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="At least 6 characters"
                className={inputCls}
              />
            </Field>
          </div>

          <button
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-brand-600 py-3.5 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? "Please wait…" : isLogin ? "Log in" : "Create account"}
          </button>

          <button
            type="button"
            onClick={demo}
            disabled={loading}
            className="mt-3 w-full rounded-xl border border-brand-200 bg-brand-50 py-3 text-sm font-semibold text-brand-800"
          >
            Try the live demo account
          </button>

          <p className="mt-6 text-center text-sm text-slate-500">
            {isLogin ? "New to MyDoc247?" : "Already have an account?"}{" "}
            <Link href={isLogin ? "/register" : "/login"} className="font-semibold text-brand-700">
              {isLogin ? "Create an account" : "Log in"}
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>
      {children}
    </label>
  );
}
