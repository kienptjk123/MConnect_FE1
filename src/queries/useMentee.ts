import menteeApiRequest from "@/apiRequests/mentee";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useMentees = () => {
  return useQuery({
    queryKey: ["mentees"],
    queryFn: () => menteeApiRequest.getAllMentees(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useDeleteMenteeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: menteeApiRequest.deleteMentee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentees"] });
    },
  });
};
