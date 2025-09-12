import http from "@/lib/http";
import { CourseProgressResponseType } from "@/schemaValidations/course.schema";

const myCoursesApiRequest = {
  getCourseProgress: (courseId: number) => {
    return http.get<CourseProgressResponseType>(
      `/mentee/courses/${courseId}/progress`
    );
  },

  updateCourseProgress: ({
    courseId,
    data,
  }: {
    courseId: number;
    data: {
      lessonId: number;
      lastPositionSec: number;
      watchedSec: number;
      completed: boolean;
    };
  }) => {
    return http.put(`/mentee/courses/${courseId}/progress`, data);
  },
};

export default myCoursesApiRequest;
