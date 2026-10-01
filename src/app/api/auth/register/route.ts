import { db } from "@/db";
import { users, walletTx } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, signToken, SESSION_COOKIE } from "@/lib/auth";
import { cookies } from "next/headers";
import { ensureSeed } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json();
  const { fullName, email, phone, password, state, language } = body ?? {};
  if (!fullName || !email || !phone || !password) {
    return Response.json({ error: "All fields are required" }, { status: 400 });
  }
  if (String(password).length < 6) {
    return Response.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }
  await ensureSeed();
  const normalized = String(email).toLowerCase().trim();
  const existing = await db.select().from(users).where(eq(users.email, normalized)).limit(1);
  if (existing.length) {
    return Response.json({ error: "An account with this email already exists" }, { status: 409 });
  }
  const [user] = await db
    .insert(users)
    .values({
      fullName,
      email: normalized,
      phone,
      passwordHash: hashPassword(String(password)),
      role: "patient",
      state: state ?? "Lagos",
      language: language ?? "English",
      walletKobo: 500000,
    })
    .returning();

  await db.insert(walletTx).values({
    userId: user.id,
    amountKobo: 500000,
    type: "credit",
    description: "Welcome bonus — ₦5,000 health credit",
    reference: `WEL-${user.id}-${Date.now().toString().slice(-6)}`,
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, signToken(user.id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return Response.json({ ok: true, user: { id: user.id, fullName: user.fullName } });
}
