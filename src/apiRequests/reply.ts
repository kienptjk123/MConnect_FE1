import http from "@/lib/http";
import {
  RepliesListResType,
  ReplyCreateBody,
  ReplyResType,
} from "@/schemaValidations/reply.schema";

const replyApiRequest = {
  getRepliesByQuestionId: (questionId: number) =>
    http.get<RepliesListResType>(`/replies/question/${questionId}`),
  createReply: (body: ReplyCreateBody) =>
    http.post<ReplyResType>("/replies/create", body),
  updateReply: (id: number, body: ReplyCreateBody) =>
    http.put<ReplyResType>(`/replies/update/${id}`, body),
  deleteReply: (id: number) =>
    http.delete<{ message: string }>(`/replies/delete/${id}`),
};

export default replyApiRequest;
