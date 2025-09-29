import Loading from "@/app/loading";
import CreateStaffFormPage from "@/app/manage/admin/manage-staff/create/create-form";
import React, { Suspense } from "react";

export default function CreateStaffPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CreateStaffFormPage />
    </Suspense>
  );
}
