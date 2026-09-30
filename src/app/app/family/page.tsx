import { db } from "@/db";
import { dependents, reminders } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth";
import FamilyView from "@/components/FamilyView";

export const dynamic = "force-dynamic";
export const metadata = { title: "Family & reminders" };

export default async function FamilyPage() {
  const user = await requireUser();
  const [deps, rems] = await Promise.all([
    db.select().from(dependents).where(eq(dependents.userId, user.id)),
    db.select().from(reminders).where(eq(reminders.userId, user.id)).orderBy(desc(reminders.createdAt)),
  ]);
  return (
    <FamilyView
      dependents={deps}
      reminders={rems.map((r) => ({
        id: r.id,
        title: r.title,
        timeOfDay: r.timeOfDay,
        frequency: r.frequency,
        active: r.active,
      }))}
    />
  );
}
