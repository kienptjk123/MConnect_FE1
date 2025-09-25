import { Suspense } from "react";
import VerifyEmailForm from "./verify-email-form";

export default function VerifyEmail() {
  return (
    <Suspense>
      <VerifyEmailForm />
    </Suspense>
  );
}
