import http from "@/lib/http";
import { BlogByIdResType, BlogResType } from "@/schemaValidations/blog.schema";

const blogApiRequest = {
  getBlogs: () => http.get<BlogResType>("/blogs"),
  getBlogById: (id: number) => http.get<BlogByIdResType>(`/blogs/${id}`),
};

export default blogApiRequest;
