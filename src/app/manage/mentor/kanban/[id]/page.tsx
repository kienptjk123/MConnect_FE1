import { KanbanDetailPage } from "./_components/kanban-detail-page";
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function KanbanDetailPageRoute({ params }: PageProps) {
  const { id } = await params;
  return <KanbanDetailPage kanbanId={id} />;
}
