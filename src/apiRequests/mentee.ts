import http from "@/lib/http";
import { MenteeResponseType } from "@/schemaValidations/mentee.schema";

const menteeApiRequest = {
  getAllMentees: () => {
    return http.get<MenteeResponseType>("/users/mentee/all");
  },
  deleteMentee: (id: number) => {
    return http.delete(`/users/delete/${id}`);
  },
};

export default menteeApiRequest;
