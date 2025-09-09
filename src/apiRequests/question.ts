import http from "@/lib/http";
import {
  QuestionBodyType,
  QuestionResType,
  QuestionUpdateBodyType,
} from "@/schemaValidations/question.schema";

const questionApiRequest = {
  getQuestions: () => http.get<QuestionResType>("/questions"),
  getQuestionById: (id: number) =>
    http.get<QuestionResType>(`/questions/${id}`),
  createQuestion: (body: QuestionBodyType) =>
    http.post<QuestionBodyType>("/questions/create", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  updateQuestion: (id: number, body: QuestionUpdateBodyType) =>
    http.put<QuestionUpdateBodyType>(`/questions/update/${id}`, body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  deleteQuestion: (id: number) =>
    http.delete<{ message: string }>(`/questions/delete/${id}`),
};

export default questionApiRequest;
