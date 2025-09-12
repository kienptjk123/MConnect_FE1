"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef } from "react";
import myCoursesApiRequest from "@/apiRequests/myCourses";
import { throttle } from "@/lib/throttle";

// For now, we'll use a hardcoded list of enrolled course IDs
// In a real app, this would come from a user profile or enrollment API
const ENROLLED_COURSE_IDS = [1, 2, 3]; // Replace with actual enrolled course IDs

export const useMyCourses = () => {
  return useQuery({
    queryKey: ["myCourses"],
    queryFn: async () => {
      // Get progress for all enrolled courses
      const courseProgressPromises = ENROLLED_COURSE_IDS.map((courseId) =>
        myCoursesApiRequest.getCourseProgress(courseId)
      );

      const courseProgressResults = await Promise.allSettled(
        courseProgressPromises
      );

      // Filter successful responses and extract the data
      const enrollments = courseProgressResults
        .filter(
          (result): result is PromiseFulfilledResult<any> =>
            result.status === "fulfilled"
        )
        .map((result) => ({
          id: result.value.payload.result.enrollment.id,
          menteeProfileId:
            result.value.payload.result.enrollment.menteeProfileId,
          courseId: result.value.payload.result.enrollment.courseId,
          activatedAt: result.value.payload.result.enrollment.activatedAt,
          course: {
            ...result.value.payload.result.course,
            mentorProfile: { name: "Mentor" }, // Placeholder since API doesn't return mentor details
            _count: { enrollments: 0, ratings: 0 }, // Placeholder
          },
          progressPercentage: result.value.payload.result.progressPercentage,
          totalLessons: result.value.payload.result.totalLessons,
          completedLessons: result.value.payload.result.completedLessons,
        }));

      return {
        payload: {
          result: {
            enrollments,
          },
        },
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCourseProgress = (courseId: number) => {
  return useQuery({
    queryKey: ["courseProgress", courseId],
    queryFn: () => myCoursesApiRequest.getCourseProgress(courseId),
  });
};

export const useUpdateCourseProgress = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: myCoursesApiRequest.updateCourseProgress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courseProgress"] });
      queryClient.invalidateQueries({ queryKey: ["myCourses"] });
    },
  });

  return {
    mutate,
  };
};
