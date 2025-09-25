import Loading from "@/app/loading";
import MentorDetailPage from "@/app/manage/mentee/explore-mentor/_components/ExploreMentorDetail/ExploreMentorDetail";
import { Suspense } from "react";

export default function MentorDetail() {
  return (
    <Suspense fallback={<Loading />}>
      <MentorDetailPage />
    </Suspense>
  );
}
