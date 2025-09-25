"use client";
import Loading from "@/app/loading";
import CategoryForm from "./category-form";
import { Suspense } from "react";

export default function CategoryManagement() {
  return (
    <Suspense fallback={<Loading />}>
      <CategoryForm />
    </Suspense>
  );
}