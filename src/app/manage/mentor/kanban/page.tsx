import Loading from "@/app/loading";
import { KanbanMentor } from "./_components/kanban-mentor";
import { Suspense } from "react";

export default function Kanban() {
  return (
    <Suspense fallback={<Loading />}>
      <KanbanMentor />
    </Suspense>
  );
}
