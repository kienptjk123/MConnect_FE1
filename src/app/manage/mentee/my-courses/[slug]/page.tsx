import Loading from "@/app/loading";
import LearningPage from "@/app/manage/mentee/my-courses/_components/LearningPage/LearningPage";
import { Suspense } from "react";

export default function CourseIdPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LearningPage />
    </Suspense>
  );
}
