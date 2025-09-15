import Loading from "@/app/loading";
import TagForm from "@/app/manage/staff/manage-tag/tag-form";
import React, { Suspense } from "react";

export default function TagManagement() {
  return (
    <Suspense fallback={<Loading />}>
      <TagForm />
    </Suspense>
  );
}
