import { useQuery } from "@tanstack/react-query";
import courseApiRequest from "@/apiRequests/course";

export const useCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: () => courseApiRequest.getAllCourses(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCourseById = (id: string) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => courseApiRequest.getCourseId(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCourseDetail = (id: number) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => courseApiRequest.getCourseId(id.toString()),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCourseProgress = (courseId: number) => {
  return useQuery({
    queryKey: ["progress", courseId],
    queryFn: () => courseApiRequest.getCourseProgress(courseId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!courseId,
  });
};

export const useLessonStream = (lessonId: number) => {
  return useQuery({
    queryKey: ["lessonStream", lessonId],
    queryFn: () => courseApiRequest.getLessonStream(lessonId),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: !!lessonId,
  });
};

export const useCoursePublicStream = (lessonId: number) => {
  return useQuery({
    queryKey: ["coursePublicStream", lessonId],
    queryFn: () => courseApiRequest.getCoursePublicStream(lessonId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!lessonId,
  });
};
