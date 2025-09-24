import Loading from "@/app/loading";
import EditBlogFormPage from "@/app/manage/staff/manage-blog/[id]/edit/edit-form";
import React, { Suspense } from "react";

export default function EditBlogPage() {
  return (
    <Suspense fallback={<Loading />}>
      <EditBlogFormPage />
    </Suspense>
  );
}
