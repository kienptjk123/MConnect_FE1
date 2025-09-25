import { Suspense } from "react";
import RegisterForm from "./register-form";
import Loading from "@/app/loading";

export default function Register() {
  return (
    <Suspense fallback={<Loading />}>
      <RegisterForm />
    </Suspense>
  );
}
