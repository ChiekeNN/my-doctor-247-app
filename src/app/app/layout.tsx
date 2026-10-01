import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ensureSeed } from "@/lib/seed";
import AppShell from "@/components/AppShell";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await ensureSeed();
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "patient") redirect("/workspace");
  return (
    <AppShell name={user.fullName} walletKobo={user.walletKobo} plan={user.plan}>
      {children}
    </AppShell>
  );
}
