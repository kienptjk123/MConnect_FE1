import Loading from "@/app/loading";
import CourseDetailPage from "@/app/manage/mentee/explore-courses/_components/ExploreCoursesDetail/ExploreCoursesDetail";
import { Suspense } from "react";

export default function CourseDetailPages() {
  return (
    <Suspense fallback={<Loading />}>
      <CourseDetailPage />
    </Suspense>
  );
}
