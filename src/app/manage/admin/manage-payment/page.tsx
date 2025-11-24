import Loading from "@/app/loading";
import PaymentManagementPage from "@/app/manage/admin/manage-payment/payment-form";
import { Suspense } from "react";

export default function PaymentManagement() {
  return (
    <Suspense fallback={<Loading />}>
      <PaymentManagementPage />
    </Suspense>
  );
}
