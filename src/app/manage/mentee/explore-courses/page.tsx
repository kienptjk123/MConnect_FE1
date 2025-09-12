import Loading from "@/app/loading";
import ExploreCourses from "@/app/manage/mentee/explore-courses/_components/ExploreCourses/ExploreCourses";
import { Suspense } from "react";

export default function ExploreCoursesPag() {
  return (
    <Suspense fallback={<Loading />}>
      <ExploreCourses />
    </Suspense>
  );
}
