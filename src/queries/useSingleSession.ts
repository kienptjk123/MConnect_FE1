import singleSessionApiRequest from "@/apiRequests/singleSession";
import { SingleSessionUpdateType } from "@/schemaValidations/singleSession.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useSingleSessions = (mentorProfileId: number) => {
  return useQuery({
    queryKey: ["singleSessions"],
    queryFn: () =>
      singleSessionApiRequest.getAllSingleSessions(mentorProfileId),
  });
};

export const useCreateSingleSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: singleSessionApiRequest.createSingleSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["singleSessions"] });
    },
  });
};

export const useUpdateSingleSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: SingleSessionUpdateType }) =>
      singleSessionApiRequest.updateSingleSession(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["singleSessions"] });
    },
  });
};

export const useDeleteSingleSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => singleSessionApiRequest.deleteSingleSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["singleSessions"] });
    },
  });
};
