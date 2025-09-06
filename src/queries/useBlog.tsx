import blogApiRequest from "@/apiRequests/blog";
import tagApiRequest from "@/apiRequests/tag";
import { useQuery } from "@tanstack/react-query";

export const useBlogsQuery = () => {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: blogApiRequest.getBlogs,
  });
};

export const useTagsQuery = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: tagApiRequest.getTags,
  });
};
