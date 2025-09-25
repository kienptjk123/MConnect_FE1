import Loading from "@/app/loading";
import EditMentorApplicationForm from "@/app/manage/staff/mentor-application/[id]/edit-mentor-application-form";
import React, { Suspense } from "react";

export default function EditMentorApplicationPage() {
  return (
    <Suspense fallback={<Loading />}>
      <EditMentorApplicationForm />
    </Suspense>
  );
}
