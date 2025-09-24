"use client";
import Loading from "@/app/loading";
import CreateCategoryForm from "./create-form";
import { Suspense } from "react";

export default function CreateCategoryPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CreateCategoryForm />
    </Suspense>
  );
}