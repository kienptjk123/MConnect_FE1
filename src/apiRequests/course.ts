import http from "@/lib/http";
import {
  CourseProgressResponseType,
  CourseDetailSchema,
  CoursePublicStreamResponseType,
  CourseResponseType,
  CourseEnrollmentResponseType,
  CourseEnrollmentBodyType,
} from "@/schemaValidations/course.schema";

const courseApiRequest = {
  getAllCourses: () => {
    return http.get<CourseResponseType>("/courses/public");
  },
  getAllCourseByMentor: () => {
    return http.get<CourseResponseType>("/courses/mentor/my-courses");
  },
  getCourseId: (id: string) => {
    return http.get<CourseDetailSchema>(`/courses/public/${id}`);
  },
  getCourseProgress: (courseId: number) => {
    return http.get<CourseProgressResponseType>(
      `/mentee/courses/${courseId}/progress`
    );
  },
  getLessonStream: (lessonId: number) => {
    return http.get<CoursePublicStreamResponseType>(
      `/mentee/lessons/${lessonId}/stream`
    );
  },
  getCoursePublicStream: (lessonId: number) => {
    return http.get<CoursePublicStreamResponseType>(
      `/courses/public/lesson/${lessonId}/stream`
    );
  },
  enrollCourse: (body: CourseEnrollmentBodyType) => {
    return http.post<CourseEnrollmentResponseType>(
      "/payment/course/create",
      body
    );
  },
};

export default courseApiRequest;
