import http from "@/lib/http";
import {
  ReplyCreateBody,
  ReplyResType,
} from "@/schemaValidations/reply.schema";

const replyApiRequest = {
  getRepliesByQuestionId: (questionId: number) =>
    http.get<ReplyResType>(`/replies/question/${questionId}`),
  createReply: (body: ReplyCreateBody) =>
    http.post<ReplyCreateBody>("/replies/create", body),
  updateReply: (id: number, body: ReplyCreateBody) =>
    http.put<ReplyCreateBody>(`/replies/update/${id}`, body),
  deleteReply: (id: number) =>
    http.delete<{ message: string }>(`/replies/delete/${id}`),
};

export default replyApiRequest;
