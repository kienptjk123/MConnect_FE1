import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import labelsApiRequest from "@/apiRequests/label";
import {
  LabelCreateType,
  LabelUpdateType,
} from "@/schemaValidations/label.schema";

// Query Keys
export const LABELS_QUERY_KEY = ["labels"];

// Get all labels
export const useLabelsQuery = () => {
  return useQuery({
    queryKey: LABELS_QUERY_KEY,
    queryFn: () => labelsApiRequest.getAllLabels(),
  });
};

// Get single label by ID
export const useLabelQuery = (id: number) => {
  return useQuery({
    queryKey: [...LABELS_QUERY_KEY, id],
    queryFn: () => labelsApiRequest.getLabelById(id),
    enabled: !!id,
  });
};

// Create label mutation
export const useCreateLabelMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: LabelCreateType) => labelsApiRequest.createLabel(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LABELS_QUERY_KEY });
    },
  });
};

// Update label mutation
export const useUpdateLabelMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: LabelUpdateType }) =>
      labelsApiRequest.updateLabel(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LABELS_QUERY_KEY });
    },
  });
};

// Delete label mutation
export const useDeleteLabelMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => labelsApiRequest.deleteLabel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LABELS_QUERY_KEY });
    },
  });
};
