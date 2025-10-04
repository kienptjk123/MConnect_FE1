import Loading from "@/app/loading";
import EditWorkExperiencePackageFormPage from "@/app/manage/mentor/work-experience-package/[id]/edit/edit-form";

import React, { Suspense } from "react";

export default function EditWorkExperiencePackagePage() {
  return (
    <Suspense fallback={<Loading />}>
      <EditWorkExperiencePackageFormPage />
    </Suspense>
  );
}
