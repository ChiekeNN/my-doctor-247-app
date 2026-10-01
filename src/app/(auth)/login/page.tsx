import AuthForm from "@/components/AuthForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Log in" };

export default function LoginPage() {
  const demoEnabled = process.env.NODE_ENV !== "production" || process.env.ENABLE_DEMO_ACCOUNTS === "true";
  return <AuthForm mode="login" demoEnabled={demoEnabled} />;
}
