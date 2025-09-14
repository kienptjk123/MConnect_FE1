import http from "@/lib/http";
import { TaskResponseType } from "@/schemaValidations/taskKanban.schema";

export const kanbanTaskApiRequest = {
  getAllTasks: () => {
    return http.get<TaskResponseType>("/kanbans/tasks/my");
  },
  updateTasks: (taskId: string, body: { status: string }) =>
    http.patch<TaskResponseType>(`/kanbans/tasks/${taskId}/status`, body),
};
