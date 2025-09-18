import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import mentorApiRequest from "@/apiRequests/mentor";

export const useMentors = () => {
  return useQuery({
    queryKey: ["mentors"],
    queryFn: () => mentorApiRequest.getAllMentors(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useMentorById = (id: number) => {
  return useQuery({
    queryKey: ["mentor", id],
    queryFn: () => mentorApiRequest.getMentorById(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!id,
  });
};

export const useMentorByUsername = (username: string) => {
  const { data: allMentors } = useMentors();
  const mentor = allMentors?.payload?.result?.find(
    (m: any) => m.username === username
  );

  return useMentorById(mentor?.id || 0);
};

export const useMentorCourses = (mentorId: number) => {
  return useQuery({
    queryKey: ["mentor-courses", mentorId],
    queryFn: () => mentorApiRequest.getMentorCourses(mentorId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!mentorId,
  });
};

export const useDeleteMentorMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mentorApiRequest.deleteMentor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
  });
};
