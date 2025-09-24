import { updateRequestApiRequests } from "@/apiRequests/updateRequest";
import { EditUpdateRequest } from "@/schemaValidations/upgradeRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUpdateRequestQuery = () => {
  return useQuery({
    queryKey: ["updateRequests"],
    queryFn: updateRequestApiRequests.getAllUpdateRequests,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useMyUpdateRequestsQuery = () => {
  return useQuery({
    queryKey: ["myUpdateRequests"],
    queryFn: updateRequestApiRequests.getUpdateRequests,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useUpdateRequestByIdQuery = (id: number, enabled: boolean) => {
  return useQuery({
    queryKey: ["updateRequests", id],
    queryFn: () => updateRequestApiRequests.getUpdateRequestById(id),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
export const useCreateUpdateRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRequestApiRequests.createUpdateRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["updateRequests"] });
      queryClient.invalidateQueries({ queryKey: ["myUpdateRequests"] });
    },
  });
};

export const useEditUpdateRequestMutation = () => {
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: EditUpdateRequest }) =>
      updateRequestApiRequests.editUpdateRequest(body, id),
  });
};
