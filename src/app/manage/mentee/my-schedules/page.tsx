import Loading from "@/app/loading";
import ScheduleForm from "@/app/manage/mentee/my-schedules/schedule-form";
import { Suspense } from "react";

export default function MenteeSchedulesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ScheduleForm />
    </Suspense>
  );
}
