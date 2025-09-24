import Loading from "@/app/loading";
import CreateBlogFormPage from "@/app/manage/admin/manage-blog/create/create-form";
import React, { Suspense } from "react";

export default function CreateBlogPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CreateBlogFormPage />
    </Suspense>
  );
}
