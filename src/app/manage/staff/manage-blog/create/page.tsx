import Loading from "@/app/loading";
import CreateBlogFormPage from "@/app/manage/staff/manage-blog/create/create-form";
import React, { Suspense } from "react";

export default function CreateBlogPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CreateBlogFormPage />
    </Suspense>
  );
}
