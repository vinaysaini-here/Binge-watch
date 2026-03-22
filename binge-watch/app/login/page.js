import { AuthForm } from "@/components/video/auth-form";

export const metadata = {
  title: "Login",
  description: "Access your BingeWatch dashboard and stream submissions.",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
