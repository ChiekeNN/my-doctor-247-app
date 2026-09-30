import { db } from "@/db";
import { labOrders, users, walletTx } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { getCurrentUser, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const rows = await db
    .select()
    .from(labOrders)
    .where(eq(labOrders.userId, user.id))
    .orderBy(desc(labOrders.scheduledAt));
  return Response.json({ orders: rows });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const { testName, priceKobo, collectionType, address, scheduledAt } = await req.json();
  if (!testName || !priceKobo) return Response.json({ error: "Test required" }, { status: 400 });
  const price = user.plan === "family" ? Math.round(Number(priceKobo) * 0.8) : Number(priceKobo);
  if (user.walletKobo < price) {
    return Response.json({ error: "Insufficient wallet balance. Fund your wallet first." }, { status: 402 });
  }
  const when = scheduledAt ? new Date(scheduledAt) : new Date(Date.now() + 86400000);
  const [order] = await db
    .insert(labOrders)
    .values({
      userId: user.id,
      testName,
      priceKobo: price,
      collectionType: collectionType ?? "home",
      address: address ?? "",
      scheduledAt: Number.isNaN(when.getTime()) ? new Date() : when,
    })
    .returning();
  await db.update(users).set({ walletKobo: user.walletKobo - price }).where(eq(users.id, user.id));
  await db.insert(walletTx).values({
    userId: user.id,
    amountKobo: price,
    type: "debit",
    description: `Lab test — ${testName}`,
    reference: `LAB-${order.id}-${Date.now().toString().slice(-5)}`,
  });
  return Response.json({ ok: true, order });
}
