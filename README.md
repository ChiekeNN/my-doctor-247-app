# MyDoc247 — Nigeria's 24/7 Doctor in Your Pocket

A full-stack, installable **Progressive Web App (PWA)** that brings affordable, verified
healthcare to every Nigerian — on any phone, on any network, at any hour.

> Built with Next.js (App Router), PostgreSQL and Drizzle ORM.

---

## 🩺 The problem

Nigeria has roughly **one doctor for every 5,000 people** (the WHO recommends 1:600). Patients
lose a day's wages queuing at a clinic, self-medicate for malaria without testing, and people in
rural areas on 2G networks are excluded from digital health entirely.

## 💡 The solution

MyDoc247 compresses a whole clinic into a 2 MB web app that installs on the home screen, caches
records for offline use, and falls back to USSD/IVR when there is no data at all.

---

## ✨ Features

| Area | What it does |
|---|---|
| **Doctor marketplace** | Search 10+ specialties, filter by **language** (English, Pidgin, Yoruba, Igbo, Hausa), price and online status. MDCN licence numbers displayed for trust. |
| **4 consultation modes** | Chat (lowest data), Voice (works on 2G), Video, and Home Visit — each dynamically priced. |
| **Live consultation room** | Persisted chat, simulated video/voice UI with call timer, quick-reply chips, and a Nigeria-aware clinical response engine (malaria, typhoid, hypertension, diabetes, antenatal, paediatrics, mental health, dermatology, emergency escalation). |
| **AI symptom checker** | 20-symptom triage engine with red-flag detection → Emergency / Urgent / Routine / Self-care, ranked differential diagnoses, recommended specialty and suggested lab tests. |
| **E-prescriptions** | Auto-generated on consultation close, QR-ready reference code, printable/exportable to PDF. |
| **Home lab tests** | 8-test catalogue with home phlebotomy or walk-in collection, wallet payment and order tracking. |
| **Electronic health record** | Vitals tracker (BP, blood sugar, weight, temperature, SpO2) with trend charts, doctor's notes, genotype / blood group / allergies / HMO. |
| **Wallet & billing** | Naira wallet, top-up via Card / Bank transfer / USSD / Opay, full transaction ledger, 3 subscription tiers. |
| **Family accounts** | Add up to 5 dependents plus medication reminders using the Web Notifications API. |
| **Emergency SOS** | One tap captures geolocation, alerts the rapid desk, tap-to-dial 112 / 767 / 122 / 6232, plus an offline first-aid guide. |
| **Health library** | Plain-language articles written for Nigerian conditions, cached for offline reading. |

### 📶 Built for the Nigerian network reality
- **Installable PWA** — manifest, maskable icons, app shortcuts, standalone display.
- **Service worker** — network-first for pages, cache-first for assets, custom `/offline` fallback.
- **Offline banner** + saved records so prescriptions are readable with zero bars.
- **USSD `*347*247#` and IVR `0700-247-247`** fallbacks for 2G / feature-phone users.
- **Chat-first design** — a text consultation uses ~95% less data than video.

### 🔒 Privacy
Passwords hashed with `scrypt`, HMAC-signed httpOnly session cookies, per-user row scoping on
every query, and an in-app **Nigeria Data Protection Act (2023)** data-rights notice with
one-click health-summary export.

---

## 🛠 Tech stack

- **Next.js 16** (App Router, Server Components, Route Handlers)
- **PostgreSQL** + **Drizzle ORM** (12 tables)
- **Tailwind CSS v4**
- **TypeScript** (strict)
- Zero-dependency auth (Node `crypto`) and a hand-rolled service worker — no bloat

---

## 🚀 Getting started

```bash
# 1. install dependencies
npm install

# 2. create your environment file
cp .env.example .env
#    then edit .env with your PostgreSQL URL and a random AUTH_SECRET

# 3. create the database tables
npx drizzle-kit push

# 4. run it
npm run dev
```

Open <http://localhost:3000>.

On the login page click **“Try the live demo account”** for instant access — the wallet is
pre-funded with a ₦5,000 welcome credit. Doctors and health articles seed themselves on first run.

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |

---

## 📁 Project structure

```
src/
├── app/
│   ├── page.tsx              # Marketing landing page
│   ├── (auth)/               # Login & register
│   ├── app/                  # Authenticated PWA shell
│   │   ├── page.tsx          # Dashboard
│   │   ├── doctors/          # Doctor marketplace + booking
│   │   ├── consult/[id]/     # Live consultation room
│   │   ├── checker/          # AI symptom triage
│   │   ├── labs/             # Lab test ordering
│   │   ├── records/          # Health record & vitals
│   │   ├── wallet/           # Wallet & subscriptions
│   │   ├── family/           # Dependents & reminders
│   │   ├── emergency/        # SOS & first aid
│   │   └── learn/            # Health library
│   ├── api/                  # Route handlers
│   └── offline/              # Offline fallback page
├── components/               # Client components
├── db/                       # Drizzle schema & client
└── lib/                      # Auth, triage engine, clinical engine, catalog
public/
├── manifest.webmanifest      # PWA manifest
└── sw.js                     # Service worker
```

---

## ⚠️ Disclaimer

This application is a demonstration build. The clinical response engine is rule-based and the
payment rails are simulated. It is **not a substitute for emergency care** — in a
life-threatening emergency in Nigeria, dial **112**.

---

© MyDoc247
