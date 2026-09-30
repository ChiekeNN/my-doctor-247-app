import { db } from "@/db";
import { walletTx, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { getCurrentUser, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const rows = await db
    .select()
    .from(walletTx)
    .where(eq(walletTx.userId, user.id))
    .orderBy(desc(walletTx.createdAt))
    .limit(40);
  return Response.json({ balanceKobo: user.walletKobo, transactions: rows });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const { amountNaira, channel } = await req.json();
  const amount = Math.round(Number(amountNaira) * 100);
  if (!amount || amount < 50000) {
    return Response.json({ error: "Minimum top-up is ₦500" }, { status: 400 });
  }
  const [updated] = await db
    .update(users)
    .set({ walletKobo: user.walletKobo + amount })
    .where(eq(users.id, user.id))
    .returning();
  await db.insert(walletTx).values({
    userId: user.id,
    amountKobo: amount,
    type: "credit",
    description: `Wallet top-up via ${channel ?? "Card"}`,
    reference: `PSK-${Date.now().toString().slice(-8)}`,
  });
  return Response.json({ ok: true, balanceKobo: updated.walletKobo });
}
