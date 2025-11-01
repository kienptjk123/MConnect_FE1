import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import courseApiRequest from "@/apiRequests/course";
import { CourseEnrollmentBodyType } from "@/schemaValidations/course.schema";

export const useCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: () => courseApiRequest.getAllCourses(),
  });
};

export const useCourseByMentor = () => {
  return useQuery({
    queryKey: ["courses", "mentor"],
    queryFn: () => courseApiRequest.getAllCourseByMentor(),
  });
};

export const useByMentorCourseDetail = (id: number) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => courseApiRequest.getAllCourseByMentorDetail(id),
    select: (data) => data.payload.result,
  });
};

export const useCourseById = (id: string) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => courseApiRequest.getCourseId(id),
  });
};

export const useCourseDetail = (id: number) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => courseApiRequest.getCourseId(id.toString()),
  });
};

export const useCourseProgress = (courseId: number) => {
  return useQuery({
    queryKey: ["progress", courseId],
    queryFn: () => courseApiRequest.getCourseProgress(courseId),

    enabled: !!courseId,
  });
};

export const useLessonStream = (lessonId: number) => {
  return useQuery({
    queryKey: ["lessonStream", lessonId],
    queryFn: () => courseApiRequest.getLessonStream(lessonId),
    enabled: !!lessonId,
  });
};

export const useCoursePublicStream = (lessonId: number) => {
  return useQuery({
    queryKey: ["coursePublicStream", lessonId],
    queryFn: () => courseApiRequest.getCoursePublicStream(lessonId),
    enabled: !!lessonId,
  });
};

export const useCourseEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: CourseEnrollmentBodyType;
    }) => courseApiRequest.enrollCourse(body),
    onSuccess: (data, variables) => {
      // Invalidate and refetch course queries
      queryClient.invalidateQueries({ queryKey: ["course", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};
