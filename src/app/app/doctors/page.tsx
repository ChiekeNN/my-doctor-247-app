import { db } from "@/db";
import { doctors } from "@/db/schema";
import { desc } from "drizzle-orm";
import DoctorBrowser from "@/components/DoctorBrowser";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Find a doctor" };

export default async function DoctorsPage() {
  const user = await requireUser();
  const list = await db.select().from(doctors).orderBy(desc(doctors.availableNow), desc(doctors.rating));
  return <DoctorBrowser doctors={list} plan={user.plan} />;
}
