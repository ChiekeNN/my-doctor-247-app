# 🚀 Deploying MyDoc247 to Vercel — plain-English guide

**The big picture, in two sentences:** Vercel is a website host that builds and runs your
Next.js app for free. Your app also needs a database that lives on the internet (not on your
laptop), so you'll create a free one at Neon and tell Vercel where it is.

You need to do **6 steps**. Budget about **15–20 minutes**. Everything here is free.

---

## ✅ Before you start — what you need

| Thing | Where to get it | Cost |
|---|---|---|
| A GitHub account | github.com | Free |
| A Vercel account | vercel.com → **"Sign up with GitHub"** | Free |
| A Neon account | neon.com → **"Sign up with GitHub"** | Free |
| Node.js installed on your computer | nodejs.org (LTS version) | Free |

> **Tip:** use the same GitHub account for all three. It makes the "connect" steps one click.

Your code is already on GitHub at **`ChiekeNN/my-doctor-247-app`**, on the `main` branch,
and it is already deploy-ready. 🎉

Your app needs exactly **two** secret settings (called "environment variables"):

- **`DATABASE_URL`** — the address of your database
- **`AUTH_SECRET`** — a random password used to sign login sessions

---

## Step 1 — Create your free database (Neon) — *~3 min*

1. Go to **neon.com** and sign up with GitHub.
2. Click **"Create a project"**.
3. Give it a name like `mydoc247`. Pick any region — **choose one close to Nigeria,
   e.g. `AWS Frankfurt (eu-central-1)` or `AWS London (eu-west-2)`**. Closer = faster.
4. Click **Create**.
5. Neon now shows you a **"Connection string"**. It looks like this:

   ```
   postgresql://neondb_owner:nPg_abc123@ep-cool-darkness-123456-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

6. **Copy it and paste it somewhere safe (a notepad).** You'll need it twice.

### ⚠️ The one detail that breaks most deployments

Neon gives you two versions of that address. **You must use the "pooled" one.**

- ✅ **Pooled (correct):** hostname contains **`-pooler`**
  `ep-cool-darkness-123456`**`-pooler`**`.eu-central-1.aws.neon.tech`
- ❌ **Direct (wrong for Vercel):** no `-pooler`
  `ep-cool-darkness-123456.eu-central-1.aws.neon.tech`

**Why?** Vercel runs your app as lots of tiny short-lived "serverless functions". Each one
tries to open its own database connection. The pooled address shares connections safely
(up to 10,000); the direct one runs out and your app starts throwing random errors.

> If you can't find the pooled string: in Neon, open your project → **"Connect"** or
> **"Connection Details"** → flip the **"Pooled connection"** toggle **ON**.

---

## Step 2 — Create the tables inside your database — *~4 min*

Your database is empty right now. It needs the 12 tables (users, doctors, appointments…).
This step builds them.

Open your terminal/command prompt **in your project folder** and run:

```bash
# 1. install the project's tools (only needed the first time)
npm install

# 2. create a local settings file
cp .env.example .env
#    Windows command prompt? use:  copy .env.example .env
```

**3.** Open the new `.env` file in any text editor (Notepad, VS Code) and paste your Neon
connection string, replacing the existing line:

```bash
DATABASE_URL=postgresql://neondb_owner:nPg_abc123@ep-cool-darkness-123456-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
AUTH_SECRET=paste-the-random-string-from-step-4-here
```

**4.** Generate a random `AUTH_SECRET`. Run whichever works on your machine:

```bash
# macOS / Linux
openssl rand -hex 32

# anywhere Node.js is installed (Windows included)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the long string it prints and paste it after `AUTH_SECRET=`.

**5.** Now create the tables:

```bash
npx drizzle-kit push
```

You should see it list the tables and finish without errors. ✅

> 🔒 `.env` is in your `.gitignore`, so your secrets will **never** be uploaded to GitHub.
> Never remove that line.

### Don't have Node.js installed? Skip Step 2 entirely

You can make Vercel create the tables for you during its build instead:

- In Vercel: **Settings → Build & Deployment → Build Command → Override**, enter:
  ```
  npx drizzle-kit push --force && next build
  ```
- Then deploy (Steps 3–5). Tables get created automatically.

This is fine for a demo/portfolio. If you later take real users, go back to doing Step 2
manually — you don't want schema changes running automatically on every deploy.

---

## Step 3 — Connect Vercel to your GitHub repo — *~3 min*

1. Go to **vercel.com** and sign up with GitHub.
2. Click **"Add New…" → "Project"**.
3. You'll see a list of your GitHub repos. Find **`my-doctor-247-app`** and click
   **"Import"**.
   - *Not in the list?* Click **"Adjust GitHub App Permissions"** and tick that repo.
4. Vercel now shows a settings screen. **Leave almost everything alone** — it correctly
   detects Next.js by itself. Check only these:

   | Setting | Should be |
   |---|---|
   | Project name | `my-doctor-247-app` (this becomes part of your web address) |
   | Framework Preset | **Next.js** *(auto-detected — don't change)* |
   | Root Directory | *(leave blank)* |
   | Build / Output / Install commands | *(leave as-is)* |

---

## Step 4 — Add your two secrets — *~2 min* ⭐ most important step

**Still on that same screen, before you click Deploy**, scroll to
**"Environment Variables"**. Add these two:

**Variable 1**
- **Key:** `DATABASE_URL`
- **Value:** your Neon **pooled** connection string (the one with `-pooler`)
- Tick ☑️ **Production**, ☑️ **Preview**, ☑️ **Development**
- Click **Add**

**Variable 2**
- **Key:** `AUTH_SECRET`
- **Value:** the long random string from Step 2
- Tick ☑️ **Production**, ☑️ **Preview**, ☑️ **Development**
- Click **Add**

### Gotchas that cause 90% of failed deploys

- 📋 **Paste carefully.** A single stray space or a line-break at the end will break it.
  Paste, then check the start and end of the string.
- 🔑 **Keep the `?sslmode=require`** at the end of the Neon URL. Don't delete it.
- 🚫 **Don't** wrap values in quotes. No `"..."` — just the raw text.
- ❌ **Don't** commit a `.env` file to GitHub instead. Vercel **never reads it**.

---

## Step 5 — Deploy! — *~2 min*

1. Click the big **"Deploy"** button.
2. Watch the build log scroll. It takes about **1–3 minutes**.
3. You'll get a **"Congratulations"** screen with confetti. 🎉
4. Click **"Continue to Dashboard"**, then **"Visit"** to open your live site.

Your address will look like: **`https://my-doctor-247-app.vercel.app`**

---

## Step 6 — Check it actually works — *~2 min*

Don't skip this. A site can *look* deployed but fail to reach the database.

**1. Test the database connection.** Open this in your browser:

```
https://YOUR-APP.vercel.app/api/health
```

| You see | Meaning |
|---|---|
| `{"ok":true}` | ✅ Database connected. You're done! |
| `{"ok":false}` | ❌ Vercel can't reach Neon. See troubleshooting below. |

**2. Log in.** Go to your site's homepage → **Login** → click
**"Try the live demo account"**.

It signs you in as **Ada Demo** with a pre-funded ₦5,000 wallet. The doctors list and
health articles fill themselves in automatically on first run — you don't seed anything
by hand.

*(Or register your own account with any email + a password of 8+ characters.)*

**3. Click around.** Doctors → book a consultation → send a message. Try the symptom
checker. If those work, your whole stack is live.

---

## 🔧 Troubleshooting

| Symptom | Fix |
|---|---|
| `{"ok":false}` at `/api/health` | Your `DATABASE_URL` is wrong. Confirm it has **`-pooler`** and **`?sslmode=require`**. Fix it in **Settings → Environment Variables**, then **redeploy**. |
| Site loads but login fails / 500 error | Usually a missing or mistyped env var. Check both exist and are ticked for **Production**. |
| `DATABASE_URL is required` in the build log | You added the variable *after* deploying. Env vars are read at **build** time — go to **Deployments → ⋯ → Redeploy**. |
| I changed an env var but nothing happened | Same thing. **You must redeploy** after every env var change. |
| First page load is slow (~1–2s), then fast | Normal. Neon's free tier **sleeps when idle** and takes ~0.5s to wake up. Harmless. |
| Build fails with a TypeScript error | Run `npm run typecheck` locally to see it. Your repo currently passes clean. |
| Everything broke after I edited code | Push to `main` — Vercel redeploys automatically within seconds. |

**Where to read the real error:** Vercel dashboard → your project → **Deployments** →
click the latest one → **Functions** / **Logs** tab. The actual error message is always
there, and it's usually more specific than what the browser shows you.

---

## 🔁 After this — how updating works

It's automatic. From now on:

```bash
git add .
git commit -m "describe what you changed"
git push origin main
```

Vercel watches `main`, rebuilds, and your live site updates in ~1 minute. No re-doing
any of the steps above.

Every **pull request** also gets its own temporary preview URL — handy for testing changes
before they go live.

---

## 🌍 Optional — use your own domain (e.g. `mydoc247.com`)

1. Buy a domain (Namecheap, Cloudflare, Google→Squarespace).
2. Vercel → your project → **Settings → Domains** → type your domain → **Add**.
3. Vercel shows you records to create. At your domain registrar, add them:
   - `A` record → `@` → `76.76.21.21`
   - `CNAME` record → `www` → `cname.vercel-dns.com`
4. Wait 5 min – 24 hrs. Vercel issues the free HTTPS certificate automatically.

---

## 📝 Notes specific to this app

- **PWA / "Add to Home Screen"** needs HTTPS — Vercel gives you that free, automatically.
  The manifest and service worker in `public/` work with no extra config.
- **Service worker caching:** after a deploy, an installed PWA may show a stale screen for a
  moment. Close and reopen it, or hard-refresh (`Ctrl+Shift+R`).
- **Neon free tier limits:** 0.5 GB storage and 100 compute-hours per month per project.
  Plenty for a demo, portfolio or pilot. If you hit the ceiling the database pauses until
  next month — upgrade Neon, don't change your code.
- **Payments are simulated.** The wallet top-up flow does not move real money. To go live
  you'd integrate Paystack or Flutterwave.
- ⚠️ **This is a demonstration build.** The clinical engine is rule-based and it is *not*
  medical advice or a substitute for emergency care. In Nigeria, dial **112**.

---

## 🧭 The whole thing on one screen

```
1. neon.com        → create project → copy the "-pooler" connection string
2. locally         → npm install → create .env → paste URL + AUTH_SECRET
                      → npx drizzle-kit push        (creates the 12 tables)
3. vercel.com      → Add New Project → import ChiekeNN/my-doctor-247-app
4. same screen     → Environment Variables:
                      DATABASE_URL = <pooled neon string>
                      AUTH_SECRET  = <long random string>
                      tick Production + Preview + Development
5. click DEPLOY    → wait ~2 min
6. verify          → /api/health  must say  {"ok":true}
                      → Login → "Try the live demo account"
```

That's it. 🩺
