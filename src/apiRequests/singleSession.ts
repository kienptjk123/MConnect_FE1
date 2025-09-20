import http from "@/lib/http";
import {
  SingleSessionCreateType,
  SingleSessionResType,
  SingleSessionUpdateType,
} from "@/schemaValidations/singleSession.schema";

const singleSessionApiRequest = {
  getAllSingleSessions: (menteeProfileId: number) =>
    http.get<SingleSessionResType>(
      `/single-session-topics/mentee/${menteeProfileId}`
    ),
  createSingleSession: (body: SingleSessionCreateType) =>
    http.post<SingleSessionResType>(`/single-session-topics`, body),
  updateSingleSession: (id: number, body: SingleSessionUpdateType) =>
    http.put<SingleSessionResType>(`/single-session-topics/${id}`, body),
  deleteSingleSession: (id: number) =>
    http.delete<{ message: string }>(`/single-session-topics/${id}`),
};

export default singleSessionApiRequest;
