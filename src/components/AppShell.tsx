"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { naira } from "@/lib/format";

const NAV = [
  { href: "/app", label: "Home", icon: "🏠" },
  { href: "/app/doctors", label: "Doctors", icon: "🩺" },
  { href: "/app/checker", label: "Checker", icon: "🤖" },
  { href: "/app/labs", label: "Labs", icon: "🧪" },
  { href: "/app/records", label: "Records", icon: "📁" },
];

const MORE = [
  { href: "/app/consultations", label: "My consultations", icon: "💬" },
  { href: "/app/wallet", label: "Wallet & billing", icon: "👛" },
  { href: "/app/family", label: "Family & reminders", icon: "👨‍👩‍👧" },
  { href: "/app/learn", label: "Health library", icon: "📚" },
  { href: "/app/emergency", label: "Emergency SOS", icon: "🚨" },
  { href: "/app/profile", label: "Profile & settings", icon: "⚙️" },
];

export default function AppShell({
  children,
  name,
  walletKobo,
  plan,
}: {
  children: React.ReactNode;
  name: string;
  walletKobo: number;
  plan: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menu, setMenu] = useState(false);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const active = (href: string) =>
    href === "/app" ? pathname === "/app" : pathname.startsWith(href);

  return (
    <div className="min-h-screen md:flex">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-1 border-r border-slate-200 bg-white p-4 md:flex">
        <Link href="/" className="mb-6 flex items-center gap-2 px-2">
          <Image src="/icons/icon-192.png" alt="" width={34} height={34} className="rounded-xl" />
          <span className="font-bold">MyDoc<span className="text-brand-600">247</span></span>
        </Link>
        {[...NAV, ...MORE].map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              active(n.href) ? "bg-brand-50 text-brand-800" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span>{n.icon}</span>
            {n.label}
          </Link>
        ))}
        <div className="mt-auto rounded-2xl bg-[#04231d] p-4 text-white">
          <p className="text-xs text-white/50">Wallet balance</p>
          <p className="text-xl font-bold text-brand-300">{naira(walletKobo)}</p>
          <Link
            href="/app/wallet"
            className="mt-3 block rounded-lg bg-brand-500 py-2 text-center text-xs font-bold text-[#04231d]"
          >
            Fund wallet
          </Link>
        </div>
        <button onClick={logout} className="mt-3 rounded-xl px-3 py-2 text-left text-sm text-slate-500 hover:bg-slate-50">
          ↩︎ Log out
        </button>
      </aside>

      <div className="flex-1">
        {/* Topbar */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-2 md:hidden">
            <Image src="/icons/icon-192.png" alt="" width={30} height={30} className="rounded-lg" />
            <span className="font-bold text-sm">MyDoc247</span>
          </div>
          <p className="hidden text-sm text-slate-500 md:block">
            Hello, <span className="font-semibold text-ink-900">{name.split(" ")[0]}</span> 👋 —{" "}
            <span className="capitalize">{plan === "free" ? "Pay as you go" : plan}</span> plan
          </p>
          <div className="flex items-center gap-2">
            <Link
              href="/app/wallet"
              className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-800"
            >
              {naira(walletKobo)}
            </Link>
            <Link
              href="/app/emergency"
              className="animate-sos rounded-full bg-red-500 px-3 py-1.5 text-xs font-bold text-white"
            >
              SOS
            </Link>
            <button
              onClick={() => setMenu((m) => !m)}
              className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-sm font-bold md:hidden"
            >
              {name.charAt(0)}
            </button>
          </div>
        </header>

        {menu && (
          <div className="border-b border-slate-200 bg-white p-3 md:hidden">
            <div className="grid grid-cols-2 gap-2">
              {MORE.map((m) => (
                <Link
                  key={m.href}
                  href={m.href}
                  onClick={() => setMenu(false)}
                  className="rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-medium"
                >
                  {m.icon} {m.label}
                </Link>
              ))}
            </div>
            <button onClick={logout} className="mt-2 w-full rounded-xl bg-red-50 py-2.5 text-sm font-semibold text-red-600">
              Log out
            </button>
          </div>
        )}

        <div className="safe-bottom mx-auto max-w-5xl px-4 py-5 md:pb-12">{children}</div>
      </div>

      {/* Bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium ${
              active(n.href) ? "text-brand-700" : "text-slate-400"
            }`}
          >
            <span className="text-lg">{n.icon}</span>
            {n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
