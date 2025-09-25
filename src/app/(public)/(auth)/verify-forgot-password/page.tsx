import VerifyForgotPasswordForm from "@/app/(public)/(auth)/verify-forgot-password/verify-forgot-password-form";
import { Suspense } from "react";

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <VerifyForgotPasswordForm />
    </Suspense>
  );
}
