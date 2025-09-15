"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef } from "react";
import myCoursesApiRequest from "@/apiRequests/myCourses";
import { throttle } from "@/lib/throttle";

export const useLearningCourses = () => {
  return useQuery({
    queryKey: ["learning-courses"],
    queryFn: () => myCoursesApiRequest.getLearningCourses(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useMyCourses = () => {
  return useLearningCourses();
};

export const useCourseProgress = (courseId: number) => {
  return useQuery({
    queryKey: ["course-progress", courseId],
    queryFn: () => myCoursesApiRequest.getCourseProgress(courseId),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: !!courseId,
  });
};

export const useUpdateCourseProgress = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: myCoursesApiRequest.updateCourseProgress,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["course-progress", variables.courseId],
      });

      queryClient.invalidateQueries({
        queryKey: ["learning-courses"],
      });
    },
  });

  const throttledUpdate = useCallback(
    throttle((data: Parameters<typeof mutate>[0]) => {
      mutate(data);
    }, 2000),
    [mutate]
  );

  return {
    mutate,
    throttledUpdate,
  };
};
