import Loading from "@/app/loading";
import MentorWorkScheduleForm from "@/app/manage/mentor/work-schedule/work-schedule_form";
import React, { Suspense } from "react";

export default function MentorWorkSchedulePage() {
  return (
    <Suspense fallback={<Loading />}>
      <MentorWorkScheduleForm />
    </Suspense>
  );
}
