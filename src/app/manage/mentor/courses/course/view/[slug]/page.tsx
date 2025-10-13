import Loading from "@/app/loading";
import MentorCourseDetailPage from "@/app/manage/mentor/courses/course/_components/MentorCourseDetail/MentorCourseDetail";
import { Suspense } from "react";

export default function MentorCourseDetails() {
  return (
    <Suspense fallback={<Loading />}>
      <MentorCourseDetailPage />
    </Suspense>
  );
}
