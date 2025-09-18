import BlogDetailForm from "@/app/(public)/(guest)/blog/[slug]/blog-detail-form";
import Loading from "@/app/loading";
import React, { Suspense } from "react";

export default function BlogDetailPage() {
  return (
    <Suspense fallback={<Loading />}>
      <BlogDetailForm />
    </Suspense>
  );
}
