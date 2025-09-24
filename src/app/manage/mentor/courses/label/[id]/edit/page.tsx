"use client";
import Loading from "@/app/loading";
import EditCategoryForm from "./edit-form";
import { Suspense } from "react";

export default function EditCategoryPage() {
  return (
    <Suspense fallback={<Loading />}>
      <EditCategoryForm />
    </Suspense>
  );
}