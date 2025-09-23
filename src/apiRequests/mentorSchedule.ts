import http from "@/lib/http";
import {
  MentorScheduleCreateType,
  MentorScheduleResType,
  MentorScheduleUpdateType,
} from "@/schemaValidations/mentorSchedule.schema";

const mentorScheduleApiRequest = {
  getAllMentorSchedules: () =>
    http.get<MentorScheduleResType>(`/mentor-work-schedules`),
  createMentorSchedule: (body: MentorScheduleCreateType) =>
    http.post<MentorScheduleResType>(`/mentor-work-schedules`, body),
  updateMentorSchedule: (id: number, body: MentorScheduleUpdateType) =>
    http.put<MentorScheduleResType>(`/mentor-work-schedules/${id}`, body),
  deleteMentorSchedule: (id: number) =>
    http.delete<{ message: string }>(`/mentor-work-schedules/${id}`),
};

export default mentorScheduleApiRequest;
