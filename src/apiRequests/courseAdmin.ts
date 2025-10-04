import http from "@/lib/http";
import {
  AdminUpdateCourseType,
  CourseResponseType,
} from "@/schemaValidations/course.schema";
export const courseAdminApiRequest = {
  getAllCoursesByAdmin: () => {
    return http.get<CourseResponseType>("/courses/admin/allCourse");
  },
  getCourseByIdByAdmin: (id: string) => {
    return http.get<CourseResponseType>(`/courses/admin/${id}`);
  },
  updateCoursesStatusByAdmin: (id: string, body: AdminUpdateCourseType) =>
    http.put(`/courses/admin/${id}`, body),
  deleteCourseByAdmin: (id: string) => http.delete(`/courses/admin/${id}`),
};
