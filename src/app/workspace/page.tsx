import { redirect } from "next/navigation";
import RoleWorkspace from "@/components/RoleWorkspace";
import { getCurrentUser } from "@/lib/auth";
import { isStaffRole } from "@/lib/roles";

export const dynamic = "force-dynamic";
export const metadata = { title: "Workspace" };

export default async function WorkspacePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "patient") redirect("/app");
  if (!isStaffRole(user.role)) redirect("/login");

  return <RoleWorkspace name={user.fullName} role={user.role} />;
}
