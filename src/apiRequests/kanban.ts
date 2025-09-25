import http from "@/lib/http";
import { TaskResponseType } from "@/schemaValidations/kanban.schema";

export const kanbanTaskApiRequest = {
  //mentee
  getAllTasks: () => {
    return http.get<TaskResponseType>("/kanbans/tasks/my");
  },
  //mentee
  updateTasks: (taskId: string, body: { status: string }) =>
    http.patch<TaskResponseType>(`/kanbans/tasks/${taskId}/status`, body),

  // //mentor
  // createKanban: (body: { title: string; description: string }) =>
  //   http.post("/kanbans", body),
  // getListKanbans: () => http.get("/kanbans"),
  // getAllTasksByKanbanId: (kanbanId: string) =>
  //   http.get<TaskResponseType>(`/kanbans/${kanbanId}`),
  // updateKanban: (
  //   kanbanId: string,
  //   body: { title: string; description: string }
  // ) => http.patch(`/kanbans/${kanbanId}`, body),
  // deleteKanban: (kanbanId: string) => http.delete(`/kanbans/${kanbanId}`),
  // createKanbanTask: (body: {
  //   title: string;
  //   description: string;
  //   priority: string;
  //   status: string;
  //   assignee_id: number;
  // }) => http.post("/kanbans/tasks", body),
  // updateKanbanTask: (
  //   taskId: string,
  //   body: {
  //     title?: string;
  //     description?: string;
  //     due_date?: string;
  //     status?: string;
  //     assignee_id?: number;
  //   }
  // ) => http.patch(`/kanbans/tasks/${taskId}`, body),
  // deleteKanbanTask: (taskId: string) => http.delete(`/kanbans/tasks/${taskId}`),
  // //mentor or mentee
  // createKanbanComment: (taskId: string, body: { content: string }) =>
  //   http.post(`/kanbans/tasks/${taskId}/comments`, body),
  // //mentor or mentee
  // getAllCommentsByTaskId: (taskId: string) =>
  //   http.get(`/kanbans/tasks/${taskId}/comments`),
  // //mentor
  // createKanbanFile: (taskId: string, body) =>
  //   http.post(`/kanbans/tasks/${taskId}/files`, body),
  // //mentor
  // deleteKanbanFile: (fileId: string) => http.delete(`/kanbans/files/${fileId}`),
  // //mentor
  // getKanbanLogs: (kanbanId: string) => http.get(`/kanbans/${kanbanId}/logs`),
};
