import blogApiRequest from "@/apiRequests/blog";
import tagApiRequest from "@/apiRequests/tag";
import { useQuery } from "@tanstack/react-query";

export const useBlogsQuery = () => {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: blogApiRequest.getBlogs,
  });
};

export const useBlogByIdQuery = (id: number, enabled: boolean) => {
  return useQuery({
    queryKey: ["blogs", id],
    queryFn: () => blogApiRequest.getBlogById(id),
    enabled,
  });
};
