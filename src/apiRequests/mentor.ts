import http from "@/lib/http";
import {
  MentorResponseType,
  MentorDetailResponseType,
  MentorCoursesResponseType,
} from "@/schemaValidations/mentor.schema";

const mentorApiRequest = {
  getAllMentors: () => {
    return http.get<MentorResponseType>("/users/mentor/all");
  },
  getMentorById: (id: number) => {
    return http.get<MentorDetailResponseType>(`/users/mentor/${id}`);
  },
  getMentorCourses: (mentorId: number) => {
    return http.get<MentorCoursesResponseType>(`/courses/mentor/${mentorId}`);
  },
  deleteMentor: (id: number) => {
    return http.delete(`/users/delete/${id}`);
  },
};

export default mentorApiRequest;
