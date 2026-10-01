import Link from "next/link";
import Image from "next/image";
import Faq from "@/components/Faq";
import { db } from "@/db";
import { doctors, articles } from "@/db/schema";
import { desc } from "drizzle-orm";
import { ensureSeed } from "@/lib/seed";
import { SPECIALTIES, PLANS } from "@/lib/catalog";
import { naira } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATS = [
  { value: "300+", label: "Verified doctors" },
  { value: "48k+", label: "Consultations delivered" },
  { value: "6 min", label: "Average wait time" },
  { value: "4.9★", label: "Patient rating" },
];

const STEPS = [
  { t: "Create your profile", d: "Sign up with your phone or email in under 60 seconds. Add genotype, allergies and HMO.", e: "📝" },
  { t: "Describe how you feel", d: "Use the AI symptom checker — tuned for malaria, typhoid, BP and maternal red flags.", e: "🤖" },
  { t: "Match with a doctor", d: "Pick by specialty, language and price. Instant or scheduled, chat, voice or video.", e: "👩🏾‍⚕️" },
  { t: "Get treated & tracked", d: "E-prescription, home lab sample pickup, and your records stored securely forever.", e: "💊" },
];

const FEATURES = [
  { t: "24/7 instant response", d: "A doctor is always on call — 2am toothache or a fever in the village, we answer.", e: "⏱️" },
  { t: "AI symptom triage", d: "Nigeria-tuned triage engine flags emergencies and suggests the right specialty and tests.", e: "🧠" },
  { t: "E-prescriptions", d: "Digitally signed, QR-verified prescriptions accepted at partner pharmacies nationwide.", e: "📄" },
  { t: "Home lab collection", d: "Order malaria RDT, FBC, HbA1c and more. A phlebotomist comes to your door.", e: "🧪" },
  { t: "Family accounts", d: "Add up to 5 dependents — parents, children, spouse — under one wallet and record.", e: "👨‍👩‍👧" },
  { t: "USSD & IVR fallback", d: "*347*247# works on 2G feature phones for patients with no smartphone or data.", e: "📞" },
  { t: "Emergency SOS", d: "One tap shares your live location with 112, LASEMA and the nearest partner hospital.", e: "🚨" },
  { t: "Vitals & med reminders", d: "Track BP, sugar, weight and SpO2 with trends your doctor can read before the call.", e: "📈" },
];

export default async function LandingPage() {
  await ensureSeed();
  const topDoctors = await db.select().from(doctors).orderBy(desc(doctors.rating)).limit(4);
  const posts = await db.select().from(articles).orderBy(desc(articles.publishedAt)).limit(3);

  return (
    <main className="overflow-x-hidden">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#04231d]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/icons/icon-192.png" alt="MyDoc247" width={36} height={36} className="rounded-xl" />
            <span className="text-lg font-bold tracking-tight text-white">
              MyDoc<span className="text-brand-400">247</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-white/70 md:flex">
            <a href="#services" className="hover:text-white">Services</a>
            <a href="#how" className="hover:text-white">How it works</a>
            <a href="#doctors" className="hover:text-white">Doctors</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="rounded-xl px-3 py-2 text-sm font-medium text-white/80 hover:text-white">
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-[#04231d] shadow-lg shadow-brand-500/25 hover:bg-brand-400"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="gradient-hero relative isolate overflow-hidden text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="animate-fadeup">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-200">
              <span className="h-2 w-2 animate-pulse rounded-full bg-brand-400" />
              184 doctors online right now
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
              Nigeria&apos;s doctor,<br />
              <span className="bg-gradient-to-r from-brand-300 to-emerald-200 bg-clip-text text-transparent">
                in your pocket 24/7.
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70 md:text-lg">
              Chat, call or video a verified Nigerian doctor in minutes. Get an e-prescription, order
              lab tests to your door, and keep your whole family&apos;s health record in one secure app —
              built to work even on slow networks.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="rounded-2xl bg-brand-500 px-6 py-3.5 text-sm font-bold text-[#04231d] shadow-xl shadow-brand-500/30 transition hover:bg-brand-400"
              >
                Talk to a doctor now →
              </Link>
              <Link
                href="/app/checker"
                className="glass rounded-2xl px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Free symptom check
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/50">
              <span>✅ MDCN-verified clinicians</span>
              <span>🔒 NDPA-aligned privacy</span>
              <span>📶 Works offline (PWA)</span>
              <span>📞 USSD *347*247#</span>
            </div>
          </div>

          <div className="relative animate-floaty">
            <div className="absolute -inset-6 rounded-[3rem] bg-brand-500/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/15 shadow-2xl">
              <Image
                src="/images/hero-doctor.jpg"
                alt="Nigerian doctor available on MyDoc247"
                width={800}
                height={1000}
                priority
                className="h-[420px] w-full object-cover md:h-[520px]"
              />
            </div>
            <div className="glass absolute -bottom-5 -left-4 w-56 rounded-2xl p-3 text-xs shadow-xl">
              <p className="font-semibold text-white">Dr. Amaka Obi</p>
              <p className="text-white/60">General Practice · 4.9★</p>
              <p className="mt-2 rounded-lg bg-brand-500/20 px-2 py-1 text-brand-200">
                Joined your video call
              </p>
            </div>
            <div className="glass absolute -top-4 right-2 rounded-2xl px-3 py-2 text-xs shadow-xl">
              <p className="text-white/60">Malaria RDT result</p>
              <p className="font-semibold text-brand-300">Ready in 3 hrs</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-white/10 px-4 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="px-2 py-6 text-center">
                <p className="text-2xl font-extrabold text-brand-300 md:text-3xl">{s.value}</p>
                <p className="mt-1 text-xs text-white/55">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">What we offer</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
            A complete clinic, rebuilt for the Nigerian reality
          </h2>
          <p className="mt-4 text-slate-600">
            Power cuts, slow data, distance, cost and stigma keep people from care. Every feature
            below exists to remove one of those barriers.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.t} className="card p-5 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-xl">{f.e}</div>
              <h3 className="mt-4 font-bold">{f.t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">How it works</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
              4 easy steps to see a doctor
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {STEPS.map((s, i) => (
              <div key={s.t} className="relative rounded-3xl bg-[#f5f8f7] p-6">
                <span className="absolute right-5 top-4 text-5xl font-black text-brand-100">{i + 1}</span>
                <div className="text-3xl">{s.e}</div>
                <h3 className="mt-4 font-bold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-5">
            {SPECIALTIES.map((s) => (
              <div
                key={s.name}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 px-4 py-3 text-sm font-medium"
              >
                <span className="text-xl">{s.emoji}</span>
                {s.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOCTORS */}
      <section id="doctors" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Our panel</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">Meet a few of our doctors</h2>
            <p className="mt-2 text-xs text-slate-400">Sample doctor profiles for demonstration only.</p>
          </div>
          <Link href="/app/doctors" className="text-sm font-semibold text-brand-700 hover:underline">
            See all doctors →
          </Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {topDoctors.map((d) => (
            <div key={d.id} className="card p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-3xl" aria-label="Doctor profile">
                  🩺
                </div>
                <div>
                  <p className="font-bold leading-tight">{d.name}</p>
                  <p className="text-xs text-slate-500">{d.specialty}</p>
                </div>
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-slate-600">{d.bio}</p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="rounded-full bg-amber-50 px-2 py-1 font-semibold text-amber-700">
                  {d.rating.toFixed(1)}★ ({d.reviewCount})
                </span>
                <span className="font-semibold text-brand-700">{naira(d.feeKobo)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Pricing</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">Care that fits your budget</h2>
            <p className="mt-4 text-slate-600">
              No hidden charges. Pay per consult, or cover your entire household for less than the
              cost of one hospital visit.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.id}
                className={`relative rounded-3xl p-7 ${
                  p.popular
                    ? "bg-[#04231d] text-white shadow-2xl ring-2 ring-brand-500"
                    : "card"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-7 rounded-full bg-brand-500 px-3 py-1 text-[11px] font-bold text-[#04231d]">
                    MOST POPULAR
                  </span>
                )}
                <h3 className="text-lg font-bold">{p.name}</h3>
                <p className="mt-3 text-3xl font-extrabold">
                  {p.priceKobo === 0 ? "₦0" : naira(p.priceKobo)}
                  <span className={`text-sm font-medium ${p.popular ? "text-white/50" : "text-slate-400"}`}>
                    {p.period}
                  </span>
                </p>
                <ul className={`mt-6 space-y-3 text-sm ${p.popular ? "text-white/80" : "text-slate-600"}`}>
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex gap-2">
                      <span className="text-brand-500">✓</span>
                      {perk}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`mt-7 block rounded-xl py-3 text-center text-sm font-bold ${
                    p.popular ? "bg-brand-500 text-[#04231d]" : "bg-brand-50 text-brand-800"
                  }`}
                >
                  Choose {p.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT / USSD */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="gradient-hero overflow-hidden rounded-[2rem] px-6 py-12 text-white md:px-12">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">No smartphone? No data? Still covered.</h2>
              <p className="mt-4 text-white/70">
                Over 60% of Nigerians still browse on 2G or feature phones. MyDoc247 ships with a USSD
                short code and IVR nurse desk so a farmer in Zamfara gets the same triage as a banker
                in Victoria Island.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="glass rounded-2xl px-5 py-3">
                  <p className="text-xs text-white/50">Dial</p>
                  <p className="text-xl font-bold text-brand-300">*347*247#</p>
                </div>
                <div className="glass rounded-2xl px-5 py-3">
                  <p className="text-xs text-white/50">Call nurse desk</p>
                  <p className="text-xl font-bold text-brand-300">0700-247-247</p>
                </div>
              </div>
            </div>
            <div className="glass rounded-3xl p-6 text-sm">
              <p className="font-mono text-xs text-white/50">USSD SESSION</p>
              <div className="mt-3 space-y-2 font-mono text-[13px] leading-relaxed">
                <p className="text-brand-200">MyDoc247</p>
                <p>1. Talk to a doctor</p>
                <p>2. Check symptoms</p>
                <p>3. Book lab test</p>
                <p>4. My prescriptions</p>
                <p>5. Emergency help</p>
                <p className="text-white/40">Reply with option…</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight">Latest wellness tips</h2>
          <Link href="/app/learn" className="text-sm font-semibold text-brand-700 hover:underline">
            Read all →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.id} href={`/app/learn/${p.slug}`} className="card overflow-hidden transition hover:-translate-y-1">
              <div className="flex h-32 items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 text-5xl">
                {p.emoji}
              </div>
              <div className="p-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">{p.category}</span>
                <h3 className="mt-2 font-bold leading-snug">{p.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{p.excerpt}</p>
                <p className="mt-3 text-xs text-slate-400">{p.readMinutes} min read</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Frequently asked questions</h2>
          </div>
          <Faq />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-[2rem] bg-brand-600 px-6 py-14 text-center text-white md:px-12">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Effective medical help, anywhere, anytime.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Join thousands of Nigerian families who no longer wait hours in a queue to be heard.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/register" className="rounded-2xl bg-white px-7 py-3.5 text-sm font-bold text-brand-700">
              Create free account
            </Link>
            <Link href="/app" className="rounded-2xl border border-white/40 px-7 py-3.5 text-sm font-bold">
              Open the app
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#04231d] py-12 text-white/60">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Image src="/icons/icon-192.png" alt="" width={32} height={32} className="rounded-lg" />
              <span className="font-bold text-white">MyDoc247</span>
            </div>
            <p className="mt-4 text-sm">
              Nigeria&apos;s telemedicine platform offering prompt, convenient and affordable online
              healthcare — right from the comfort of your home.
            </p>
          </div>
          <div>
            <p className="font-semibold text-white">Services</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>Doctor consultation</li>
              <li>Home lab tests</li>
              <li>E-prescriptions</li>
              <li>Mental health counselling</li>
              <li>Corporate wellness</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white">Company</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#how">How it works</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><Link href="/app/emergency">Emergency numbers</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white">Contact</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>0700-247-247</li>
              <li>USSD *347*247#</li>
              <li>hello@mydoc247.com.ng</li>
              <li>Lagos · Abuja · Port Harcourt</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 px-4 pt-6 text-xs">
          © {new Date().getFullYear()} MyDoc247. Not a substitute for emergency care — dial 112 in a
          life-threatening emergency.
        </div>
      </footer>
    </main>
  );
}
