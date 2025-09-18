import Loading from "@/app/loading";
import MentorApplicationForm from "@/app/manage/staff/mentor-application/mentor-application-form";
import React, { Suspense } from "react";

export default function MentorApplicationPage() {
  return (
    <Suspense fallback={<Loading />}>
      <MentorApplicationForm />
    </Suspense>
  );
}
