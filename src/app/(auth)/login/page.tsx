import AuthForm from "@/components/AuthForm";
import { demoAccountsEnabled } from "@/lib/demo-accounts";

export const dynamic = "force-dynamic";
export const metadata = { title: "Log in" };

export default function LoginPage() {
  return <AuthForm mode="login" demoEnabled={demoAccountsEnabled()} />;
}
