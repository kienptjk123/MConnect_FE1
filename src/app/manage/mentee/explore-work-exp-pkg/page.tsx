import Loading from "@/app/loading";
import { Suspense } from "react";
import { ExploreWorkExp } from "./_components";

export default function ExploreWorkExpPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ExploreWorkExp />
    </Suspense>
  );
}
