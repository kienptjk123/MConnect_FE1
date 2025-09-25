import http from "@/lib/http";
import {
  BlogByIdResType,
  BlogCreateType,
  BlogResType,
  BlogUpdateType,
} from "@/schemaValidations/blog.schema";

const blogApiRequest = {
  getBlogs: () => http.get<BlogResType>("/blogs"),
  getBlogById: (id: number) => http.get<BlogByIdResType>(`/blogs/${id}`),
  createBlog: (body: BlogCreateType) => http.post("/blogs/create", body),
  updateBlog: (body: BlogUpdateType, id: number) =>
    http.put(`/blogs/update/${id}`, body),
  deleteBlog: (id: number) => http.delete(`/blogs/delete/${id}`),
};

export default blogApiRequest;
