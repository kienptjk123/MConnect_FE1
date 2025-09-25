import blogApiRequest from "@/apiRequests/blog";
import { BlogUpdateType } from "@/schemaValidations/blog.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useBlogsQuery = () => {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: blogApiRequest.getBlogs,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useBlogByIdQuery = (id: number, enabled: boolean) => {
  return useQuery({
    queryKey: ["blogs", id],
    queryFn: () => blogApiRequest.getBlogById(id),
    enabled,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });
};

export const useCreateBlogMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: blogApiRequest.createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};

export const useUpdateBlogMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      formData,
    }: BlogUpdateType & { id: number; formData: FormData }) =>
      blogApiRequest.updateBlog(formData as any, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};

export const useDeleteBlogMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => blogApiRequest.deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};
