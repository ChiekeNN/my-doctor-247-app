import { db } from "@/db";
import { walletTx } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth";
import WalletView from "@/components/WalletView";

export const dynamic = "force-dynamic";
export const metadata = { title: "Wallet" };

export default async function WalletPage() {
  const user = await requireUser();
  const tx = await db
    .select()
    .from(walletTx)
    .where(eq(walletTx.userId, user.id))
    .orderBy(desc(walletTx.createdAt))
    .limit(40);
  return (
    <WalletView
      balanceKobo={user.walletKobo}
      plan={user.plan}
      transactions={tx.map((t) => ({ ...t, createdAt: t.createdAt.toISOString() }))}
    />
  );
}
