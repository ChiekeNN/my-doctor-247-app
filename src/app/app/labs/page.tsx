import { db } from "@/db";
import { labOrders } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth";
import LabBooking from "@/components/LabBooking";

export const dynamic = "force-dynamic";
export const metadata = { title: "Lab tests" };

export default async function LabsPage() {
  const user = await requireUser();
  const orders = await db
    .select()
    .from(labOrders)
    .where(eq(labOrders.userId, user.id))
    .orderBy(desc(labOrders.scheduledAt));
  return (
    <LabBooking
      plan={user.plan}
      orders={orders.map((o) => ({ ...o, scheduledAt: o.scheduledAt.toISOString() }))}
    />
  );
}
