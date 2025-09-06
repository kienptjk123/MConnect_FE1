import http from "@/lib/http";
import { BlogResType } from "@/schemaValidations/blog.schema";

const blogApiRequest = {
  getBlogs: () => http.get<BlogResType>("/blogs"),
  getBlogById: (id: number) => http.get<BlogResType>(`/blogs/${id}`),
};

export default blogApiRequest;
