import http from "@/lib/http";
import {
  QuestionBodyType,
  QuestionResType,
  QuestionsListResType,
  QuestionUpdateBodyType,
} from "@/schemaValidations/question.schema";

const questionApiRequest = {
  getQuestions: () => http.get<QuestionsListResType>("/questions"),
  getQuestionById: (id: number) =>
    http.get<QuestionResType>(`/questions/${id}`),
  createQuestion: (body: QuestionBodyType) =>
    http.post<QuestionResType>("/questions/create", body),
  updateQuestion: (id: number, body: QuestionUpdateBodyType) =>
    http.put<QuestionResType>(`/questions/update/${id}`, body),
  deleteQuestion: (id: number) =>
    http.delete<{ message: string }>(`/questions/delete/${id}`),
};

export default questionApiRequest;
