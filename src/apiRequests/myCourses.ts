import http from "@/lib/http";
import {
  CourseProgressResponseType,
  MyCoursesResponseType,
} from "@/schemaValidations/myCourses.schema";

const myCoursesApiRequest = {
  getLearningCourses: () => {
    return http.get<MyCoursesResponseType>(`/mentee/learning-courses`);
  },

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
