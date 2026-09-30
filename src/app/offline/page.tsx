import Link from "next/link";

export const metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <main className="gradient-hero flex min-h-screen flex-col items-center justify-center px-6 text-center text-white">
      <p className="text-6xl">📴</p>
      <h1 className="mt-5 text-2xl font-extrabold">You&apos;re offline</h1>
      <p className="mt-3 max-w-sm text-sm text-white/70">
        No network right now. Your saved prescriptions, records and health guides are still
        available. For urgent care that does not need data:
      </p>
      <div className="mt-6 space-y-3">
        <a href="tel:112" className="block rounded-2xl bg-red-500 px-8 py-3 text-sm font-bold">
          📞 Call 112 — national emergency
        </a>
        <a href="tel:0700247247" className="glass block rounded-2xl px-8 py-3 text-sm font-bold">
          ☎️ MyDoc247 nurse desk · 0700-247-247
        </a>
        <p className="text-xs text-white/50">Or dial USSD *347*247# on any 2G phone</p>
      </div>
      <Link href="/app" className="mt-8 text-sm font-semibold text-brand-300">
        Try again →
      </Link>
    </main>
  );
}
