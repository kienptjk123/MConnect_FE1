"use client";
import Loading from "@/app/loading";
import WorkExperiencePackageForm from "@/app/manage/mentor/work-experience-package/package-form";
import { Suspense } from "react";

export default function WorkExperiencePackageManagement() {
  return (
    <Suspense fallback={<Loading />}>
      <WorkExperiencePackageForm />
    </Suspense>
  );
}
