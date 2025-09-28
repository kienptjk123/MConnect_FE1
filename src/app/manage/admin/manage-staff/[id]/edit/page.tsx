import Loading from "@/app/loading";
import EditStaffFormPage from "@/app/manage/admin/manage-staff/[id]/edit/edit-form";
import React, { Suspense } from "react";

export default function EditStaffPage() {
  return (
    <Suspense fallback={<Loading />}>
      <EditStaffFormPage />
    </Suspense>
  );
}
