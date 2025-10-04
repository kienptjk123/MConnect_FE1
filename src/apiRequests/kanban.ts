import http from "@/lib/http";
import { TaskResponseType } from "@/schemaValidations/kanban.schema";
import {
  AssigneeTypeInKanBanTaskResponseType,
  KanBanCreateFormType,
  KanBanUpdateFormType,
  TaskByKanBanIdResponseType,
  TaskCreateFormType,
  TaskUpdateFormType,
} from "@/schemaValidations/kanbanMentor";

export const kanbanTaskApiRequest = {
  //mentee
  getAllTasks: () => {
    return http.get<TaskResponseType>("/kanbans/tasks/my");
  },
  //mentee
  updateTasks: (taskId: string, body: { status: string }) =>
    http.patch<TaskResponseType>(`/kanbans/tasks/${taskId}/status`, body),
  //----------------------------------------------------------------

  //mentor
  createKanban: (body: KanBanCreateFormType) => http.post("/kanbans", body),
  getListKanbans: () => http.get("/kanbans"),
  getAllTasksByKanbanId: (kanbanId: string) =>
    http.get<TaskByKanBanIdResponseType>(`/kanbans/${kanbanId}`),
  updateKanban: (kanbanId: string, body: KanBanUpdateFormType) =>
    http.patch(`/kanbans/${kanbanId}`, body),
  deleteKanban: (kanbanId: string) => http.delete(`/kanbans/${kanbanId}`),

  getAllAssigneesInKanbanTasks: () =>
    http.get<AssigneeTypeInKanBanTaskResponseType>(
      "/work-experience-booking/all-mentees"
    ), // to get assignee id -> create kanban task

  createKanbanTask: (kanbanId: number, body: TaskCreateFormType) =>
    http.post(`/kanbans/${kanbanId}/tasks`, body),
  updateKanbanTask: (taskId: string, body: TaskUpdateFormType) =>
    http.patch(`/kanbans/tasks/${taskId}`, body),
  deleteKanbanTask: (taskId: string) => http.delete(`/kanbans/tasks/${taskId}`),
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
