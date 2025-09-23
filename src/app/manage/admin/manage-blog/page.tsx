"use client";
import Loading from "@/app/loading";
import BlogForm from "@/app/manage/admin/manage-blog/blog-form";
import { Suspense } from "react";

export default function BlogManagement() {
  return (
    <Suspense fallback={<Loading />}>
      <BlogForm />
    </Suspense>
  );
}
