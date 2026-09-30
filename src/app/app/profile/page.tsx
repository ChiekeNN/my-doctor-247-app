import { requireUser } from "@/lib/auth";
import ProfileView from "@/components/ProfileView";

export const dynamic = "force-dynamic";
export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const user = await requireUser();
  return (
    <ProfileView
      initial={{
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        state: user.state ?? "Lagos",
        language: user.language ?? "English",
        gender: user.gender ?? "",
        dob: user.dob ?? "",
        bloodGroup: user.bloodGroup ?? "",
        genotype: user.genotype ?? "",
        allergies: user.allergies ?? "",
        hmoProvider: user.hmoProvider ?? "",
      }}
    />
  );
}
