import { Suspense } from "react";
import Loading from "@/app/loading";
import { MessageContainer } from "@/app/manage/mentee/message/_components/MessageCore/MessageCore";

export default function MessagePage() {
  return (
    <Suspense fallback={<Loading />}>
      <MessageContainer />
    </Suspense>
  );
}
