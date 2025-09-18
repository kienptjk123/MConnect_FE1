import { kanbanTaskApiRequest } from "@/apiRequests/kanban";
import { TaskType } from "@/schemaValidations/kanban.schema";
import { useQuery } from "@tanstack/react-query";

export const useKanbanTasks = () => {
  return useQuery({
    queryKey: ["kanban-tasks"],
    queryFn: () => kanbanTaskApiRequest.getAllTasks(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    select: (res): TaskType[] => {
      return res.payload?.result?.tasks ?? [];
    },
    retry: 3,
    retryDelay: 1000,
  });
};

// export const usePatchKanbanTask = () => {
//   return useQuery({
//     queryKey: ["patch-kanban-task"],
//     queryFn: (taskId: string, body: { status: string }) =>
//       kanbanTaskApiRequest.updateTasks(taskId, body),
//   });
// };
