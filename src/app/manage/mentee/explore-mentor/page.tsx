import Loading from "@/app/loading";
import ExploreMentors from "@/app/manage/mentee/explore-mentor/_components/ExploreMentors/ExploreMentors";
import { Suspense } from "react";

export default function ExploreMentorPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ExploreMentors />
    </Suspense>
  );
}
