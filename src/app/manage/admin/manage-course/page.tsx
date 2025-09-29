"use client";
import Loading from "@/app/loading";
import CourseForm from "@/app/manage/admin/manage-course/course-form";
import { Suspense } from "react";

export default function CourseManagement() {
  return (
    <Suspense fallback={<Loading />}>
      <CourseForm />
    </Suspense>
  );
}
