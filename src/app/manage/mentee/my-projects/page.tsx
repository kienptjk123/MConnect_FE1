import Loading from "@/app/loading";
import { KanbanBoard } from "@/app/manage/mentee/my-projects/_components/kanban-board";
import { Suspense } from "react";

export default function Kanban() {
  return (
    <Suspense fallback={<Loading />}>
      <KanbanBoard />
    </Suspense>
  );
}
