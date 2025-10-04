import Loading from "@/app/loading";
import MentorApplicationForm from "@/app/manage/mentee/mentor-application/mentor-application-form";
import React, { Suspense } from "react";

export default function MentorApplication() {
  return (
    <Suspense fallback={<Loading />}>
      <MentorApplicationForm />
    </Suspense>
  );
}
