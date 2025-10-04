import tagApiRequest from "@/apiRequests/tag";
import { UpdateTagType } from "@/schemaValidations/tag.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useTagsQuery = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: tagApiRequest.getTags,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateTagMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tagApiRequest.createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};

export const useUpdateTagMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateTagType & { id: number }) =>
      tagApiRequest.updateTag(body, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};

export const useDeleteTagMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tagApiRequest.deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};
