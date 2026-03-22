import { AuthForm } from "@/components/video/auth-form";

export const metadata = {
  title: "Register",
  description: "Create your BingeWatch account and start curating external videos.",
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
