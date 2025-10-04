import Loading from "@/app/loading";
import SingleSessionPage from "@/app/manage/mentor/single-session/single-session-page";
import React, { Suspense } from "react";

export default function SingleSession() {
  return (
    <Suspense fallback={<Loading />}>
      <SingleSessionPage />
    </Suspense>
  );
}
