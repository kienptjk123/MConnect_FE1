import Loading from "@/app/loading";
import { KanbanDetailPage } from "@/app/manage/mentor/kanban/[id]/_components/kanban-detail-page";

import { Suspense } from "react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function KanbanDetailPageRoute({ params }: PageProps) {
  const { id } = await params;
  return (
    <Suspense fallback={<Loading />}>
      <KanbanDetailPage kanbanId={id} />
    </Suspense>
  );
}
