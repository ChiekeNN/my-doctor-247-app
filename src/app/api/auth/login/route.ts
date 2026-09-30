import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, signToken, SESSION_COOKIE } from "@/lib/auth";
import { cookies } from "next/headers";
import { ensureSeed } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return Response.json({ error: "Email and password required" }, { status: 400 });
  }
  await ensureSeed();
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.email, String(email).toLowerCase().trim()))
    .limit(1);
  const user = rows[0];
  if (!user || !verifyPassword(String(password), user.passwordHash)) {
    return Response.json({ error: "Invalid email or password" }, { status: 401 });
  }
  const store = await cookies();
  store.set(SESSION_COOKIE, signToken(user.id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return Response.json({ ok: true });
}
