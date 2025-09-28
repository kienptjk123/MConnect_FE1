import http from "@/lib/http";
import {
  MentorCreateCourseType,
  MentorUpdateCourseType,
  CreateModuleType,
  UpdateModuleType,
  CreateLessonType,
  UpdateLessonType,
  ModuleResponseType,
  LessonResponseType,
  CourseType,
} from "@/schemaValidations/mentorCourse.schema";

const mentorCourseApiRequest = {
  createCourse: (body: MentorCreateCourseType) => {
    return http.post<{ message: string; result: CourseType }>(
      "/courses/mentor",
      body
    );
  },

  getCourseDetail: (id: number) => {
    return http.get<{ message: string; result: CourseType }>(`/courses/${id}`);
  },

  updateCourse: (id: number, body: MentorUpdateCourseType) => {
    return http.put<{ message: string; result: CourseType }>(
      `/courses/mentor/${id}`,
      body
    );
  },

  deleteCourse: (id: number) => {
    return http.delete<{ message: string; result: CourseType }>(
      `/courses/mentor/${id}`
    );
  },

  createModule: (courseId: number, body: CreateModuleType) => {
    return http.post<ModuleResponseType>(
      `/courses/mentor/${courseId}/modules`,
      body
    );
  },

  updateModule: (moduleId: number, body: UpdateModuleType) => {
    return http.put<ModuleResponseType>(
      `/courses/mentor/modules/${moduleId}`,
      body
    );
  },

  createLesson: (moduleId: number, body: CreateLessonType) => {
    return http.post<LessonResponseType>(
      `/courses/mentor/modules/${moduleId}/lessons`,
      body
    );
  },

  updateLesson: (lessonId: number, body: UpdateLessonType) => {
    return http.put<LessonResponseType>(
      `/courses/mentor/lessons/${lessonId}`,
      body
    );
  },

  updateModuleOrder: (
    courseId: number,
    modules: { id: number; order: number }[]
  ) => {
    return http.put(`/courses/mentor/${courseId}/modules/reorder`, { modules });
  },

  updateLessonOrder: (
    moduleId: number,
    lessons: { id: number; order: number }[]
  ) => {
    return http.put(`/courses/mentor/modules/${moduleId}/lessons/reorder`, {
      lessons,
    });
  },
};

export default mentorCourseApiRequest;
