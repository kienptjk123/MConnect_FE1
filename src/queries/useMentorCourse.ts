import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import mentorCourseApiRequest from "@/apiRequests/mentorCourse";
import {
  MentorCreateCourseType,
  MentorUpdateCourseType,
  CreateModuleType,
  UpdateModuleType,
  CreateLessonType,
  UpdateLessonType,
} from "@/schemaValidations/mentorCourse.schema";
import courseApiRequest from "@/apiRequests/course";

export const MENTOR_COURSES_QUERY_KEY = ["mentor-courses"];
export const MENTOR_COURSE_DETAIL_QUERY_KEY = (id: number) => [
  "mentor-course-detail",
  id,
];

export const useMentorCourseDetail = (id: number) => {
  return useQuery({
    queryKey: MENTOR_COURSE_DETAIL_QUERY_KEY(id),
    queryFn: () => mentorCourseApiRequest.getCourseDetail(id),
    select: (data) => data.payload.result,
  });
};

export const useMentorCreateCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: MentorCreateCourseType) =>
      mentorCourseApiRequest.createCourse(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENTOR_COURSES_QUERY_KEY });
    },
  });
};

export const useMentorDeleteCourseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => mentorCourseApiRequest.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENTOR_COURSES_QUERY_KEY });
    },
  });
};

export const useMentorUpdateCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: MentorUpdateCourseType }) =>
      mentorCourseApiRequest.updateCourse(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENTOR_COURSES_QUERY_KEY });
    },
  });
};

export const useCreateModuleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      courseId,
      body,
    }: {
      courseId: number;
      body: CreateModuleType;
    }) => mentorCourseApiRequest.createModule(courseId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENTOR_COURSES_QUERY_KEY });
    },
  });
};

export const useUpdateModuleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      moduleId,
      body,
    }: {
      moduleId: number;
      body: UpdateModuleType;
    }) => mentorCourseApiRequest.updateModule(moduleId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENTOR_COURSES_QUERY_KEY });
    },
  });
};

export const useCreateLessonMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      moduleId,
      body,
    }: {
      moduleId: number;
      body: CreateLessonType;
    }) => mentorCourseApiRequest.createLesson(moduleId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENTOR_COURSES_QUERY_KEY });
    },
  });
};

export const useUpdateLessonMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lessonId,
      body,
    }: {
      lessonId: number;
      body: UpdateLessonType;
    }) => mentorCourseApiRequest.updateLesson(lessonId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENTOR_COURSES_QUERY_KEY });
    },
  });
};

// Drag and Drop Mutations
export const useUpdateModuleOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      modules,
    }: {
      courseId: number;
      modules: { id: number; order: number }[];
    }) => mentorCourseApiRequest.updateModuleOrder(courseId, modules),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENTOR_COURSES_QUERY_KEY });
    },
  });
};

export const useUpdateLessonOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      moduleId,
      lessons,
    }: {
      moduleId: number;
      lessons: { id: number; order: number }[];
    }) => mentorCourseApiRequest.updateLessonOrder(moduleId, lessons),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENTOR_COURSES_QUERY_KEY });
    },
  });
};

// Composite mutation for creating course with modules and lessons
export const useCreateCourseWithContentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      course,
      modules,
    }: {
      course: MentorCreateCourseType;
      modules: Array<{
        title: string;
        order: number;
        lessons: Array<{
          title: string;
          order: number;
          commentsEnabled?: boolean;
          durationSec?: number;
        }>;
      }>;
    }) => {
      // Create course first
      const courseResponse = await mentorCourseApiRequest.createCourse(course);
      const courseId = courseResponse.payload.result.id;

      // Create modules and lessons in parallel
      const modulePromises = modules.map(async (module) => {
        const moduleResponse = await mentorCourseApiRequest.createModule(
          courseId,
          {
            title: module.title,
            order: module.order,
          }
        );
        const moduleId = moduleResponse.payload.result.id;

        // Create lessons for this module
        const lessonPromises = module.lessons.map((lesson) =>
          mentorCourseApiRequest.createLesson(moduleId, {
            title: lesson.title,
            order: lesson.order,
            commentsEnabled: lesson.commentsEnabled ?? true,
            durationSec: lesson.durationSec ?? 0,
          })
        );

        const lessonResponses = await Promise.all(lessonPromises);
        return {
          module: moduleResponse,
          lessons: lessonResponses,
        };
      });

      const moduleResults = await Promise.all(modulePromises);

      return {
        course: courseResponse,
        modules: moduleResults,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MENTOR_COURSES_QUERY_KEY });
    },
  });
};
