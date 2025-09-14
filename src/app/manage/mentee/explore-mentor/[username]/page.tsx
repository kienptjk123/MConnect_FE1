import Loading from "@/app/loading";
import ExploreMentorPage from "@/app/manage/mentee/explore-mentor/page";
import { Suspense } from "react";

export default function MentorDetail() {
  return (
    <Suspense fallback={<Loading />}>
      <ExploreMentorPage />
    </Suspense>
  );
}
