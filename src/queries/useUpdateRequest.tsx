import { updateRequestApiRequests } from "@/apiRequests/updateRequest";
import { EditUpdateRequest } from "@/schemaValidations/upgradeRequest";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useUpdateRequestQuery = () => {
  return useQuery({
    queryKey: ["updateRequests"],
    queryFn: updateRequestApiRequests.getAllUpdateRequests,
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
  return useMutation({
    mutationFn: updateRequestApiRequests.createUpdateRequest,
  });
};

export const useEditUpdateRequestMutation = () => {
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: EditUpdateRequest }) =>
      updateRequestApiRequests.editUpdateRequest(body, id),
  });
};
