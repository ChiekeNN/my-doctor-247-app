import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, signToken, SESSION_COOKIE } from "@/lib/auth";
import { cookies } from "next/headers";
import { ensureSeed } from "@/lib/seed";
import { DEMO_ACCOUNTS, demoAccountsEnabled } from "@/lib/demo-accounts";
import { isUserRole, ROLE_INFO, type UserRole } from "@/lib/roles";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, role } = body ?? {};
  if (!email || !password) {
    return Response.json({ error: "Email and password required" }, { status: 400 });
  }
  if (role !== undefined && !isUserRole(role)) {
    return Response.json({ error: "Choose a valid account type" }, { status: 400 });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  if (!demoAccountsEnabled() && DEMO_ACCOUNTS.some((account) => account.email === normalizedEmail)) {
    return Response.json({ error: "Demo accounts are disabled" }, { status: 401 });
  }

  await ensureSeed();
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);
  const user = rows[0];
  if (!user || !verifyPassword(String(password), user.passwordHash)) {
    return Response.json({ error: "Invalid email or password" }, { status: 401 });
  }
  const requestedRole = role as UserRole | undefined;
  if (requestedRole && user.role !== requestedRole) {
    const actualRole = isUserRole(user.role) ? ROLE_INFO[user.role].label : "another account type";
    return Response.json(
      { error: `This account is for ${actualRole}. Select ${actualRole} to continue.` },
      { status: 403 },
    );
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
