import Loading from "@/app/loading";
import CreateWorkExperiencePackageFormPage from "@/app/manage/mentor/work-experience-package/create/create-form";
import React, { Suspense } from "react";

export default function CreateWorkExperiencePackagePage() {
  return (
    <Suspense fallback={<Loading />}>
      <CreateWorkExperiencePackageFormPage />
    </Suspense>
  );
}
