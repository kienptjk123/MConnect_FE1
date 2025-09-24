"use client";
import Loading from "@/app/loading";
import LabelForm from "./label-form";
import { Suspense } from "react";

export default function LabelManagement() {
  return (
    <Suspense fallback={<Loading />}>
      <LabelForm />
    </Suspense>
  );
}