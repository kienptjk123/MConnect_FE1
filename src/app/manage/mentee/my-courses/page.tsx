import Loading from "@/app/loading";
import MyCourses from "@/app/manage/mentee/my-courses/_components/MyCourses/MyCourses";
import { Suspense } from "react";

export default function MyCoursesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <MyCourses />
    </Suspense>
  );
}
