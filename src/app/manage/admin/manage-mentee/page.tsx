import Loading from "@/app/loading";
import ManageMenteeForm from "@/app/manage/admin/manage-mentee/manage-mentee-form";
import React, { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<Loading />}>
      <ManageMenteeForm />
    </Suspense>
  );
}
