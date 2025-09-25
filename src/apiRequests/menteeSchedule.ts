import http from "@/lib/http";
import {
  MenteeScheduleCreateType,
  MenteeScheduleUpdateType,
  MenteeScheduleResType,
  MenteeScheduleByIdResType,
} from "@/schemaValidations/menteeSchedule.schema";

const menteeScheduleApi = {
  getSchedules: () => http.get<MenteeScheduleResType>("/mentee/schedules"),
  getScheduleById: (id: number) =>
    http.get<MenteeScheduleByIdResType>(`/mentee/schedules/${id}`),
  createSchedule: (body: MenteeScheduleCreateType) =>
    http.post("/mentee/schedules", body),
  updateSchedule: (id: number, body: MenteeScheduleUpdateType) =>
    http.put(`/mentee/schedules/${id}`, body),
  deleteSchedule: (id: number) => http.delete(`/mentee/schedules/${id}`),
};

export default menteeScheduleApi;
