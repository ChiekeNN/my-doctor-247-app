import { requireUser } from "@/lib/auth";
import EmergencyView from "@/components/EmergencyView";

export const dynamic = "force-dynamic";
export const metadata = { title: "Emergency SOS" };

export default async function EmergencyPage() {
  const user = await requireUser();
  return <EmergencyView name={user.fullName} phone={user.phone} />;
}
