import blogApiRequest from "@/apiRequests/blog";
import tagApiRequest from "@/apiRequests/tag";
import { useQuery } from "@tanstack/react-query";

export const useBlogsQuery = () => {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: blogApiRequest.getBlogs,
  });
};

export const useBlogByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: () => blogApiRequest.getBlogById(id),
    enabled: !!id,
  });
};

export const useTagsQuery = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: tagApiRequest.getTags,
  });
};
