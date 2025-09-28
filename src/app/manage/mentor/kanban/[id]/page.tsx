import Loading from "@/app/loading";
import { KanbanDetailPage } from "@/app/manage/mentor/kanban/[id]/_components/kanban-detail-page";

import { Suspense } from "react";

interface PageProps {
  params: {
    id: string;
  };
}

export default function KanbanDetailPageRoute({ params }: PageProps) {
  return (
    <Suspense fallback={<Loading />}>
      <KanbanDetailPage kanbanId={params.id} />
    </Suspense>
  );
}
