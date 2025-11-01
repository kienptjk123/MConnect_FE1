import mentorCardApiRequest from "@/apiRequests/mentorCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useMentorCardsQuery = () => {
  return useQuery({
    queryKey: ["mentorCards"],
    queryFn: () => mentorCardApiRequest.getMentorCards(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useDefaultCardQuery = () => {
  return useQuery({
    queryKey: ["defaultCard"],
    queryFn: () => mentorCardApiRequest.getDefaultCard(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false, // Don't retry if no default card exists
  });
};

export const useCreateMentorCardMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mentorCardApiRequest.createMentorCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentorCards"] });
      queryClient.invalidateQueries({ queryKey: ["defaultCard"] });
    },
  });
};

export const useUpdateMentorCardMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: any }) =>
      mentorCardApiRequest.updateMentorCard(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentorCards"] });
      queryClient.invalidateQueries({ queryKey: ["defaultCard"] });
    },
  });
};

export const useDeleteMentorCardMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mentorCardApiRequest.deleteMentorCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentorCards"] });
      queryClient.invalidateQueries({ queryKey: ["defaultCard"] });
    },
  });
};

export const useSetDefaultCardMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mentorCardApiRequest.setDefaultCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentorCards"] });
      queryClient.invalidateQueries({ queryKey: ["defaultCard"] });
    },
  });
};
