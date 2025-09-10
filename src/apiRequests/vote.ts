import http from "@/lib/http";
import {
  VoteCreateBodyType,
  VoteResType,
  VotesListResType,
} from "@/schemaValidations/vote.schema";

export const voteApiRequests = {
  getVotesByQuestionId: (questionId: number) =>
    http.get<VotesListResType>(`/votes/question/${questionId}`),
  getVotesByReplyId: (replyId: number) =>
    http.get<VotesListResType>(`/votes/reply/${replyId}`),
  createVote: (body: VoteCreateBodyType) =>
    http.post<VoteResType>("/votes/create", body),
  deleteVote: (id: number) =>
    http.delete<{ message: string }>(`/votes/delete/${id}`),
};
