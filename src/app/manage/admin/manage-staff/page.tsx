"use client";
import Loading from "@/app/loading";
import StaffForm from "@/app/manage/admin/manage-staff/staff-form";
import { Suspense } from "react";

export default function StaffManagement() {
  return (
    <Suspense fallback={<Loading />}>
      <StaffForm />
    </Suspense>
  );
}
