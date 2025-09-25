import http from "@/lib/http";
import {
  CreateTagType,
  TagResType,
  UpdateTagType,
} from "@/schemaValidations/tag.schema";

const tagApiRequest = {
  getTags: () => http.get<TagResType>("/tags"),
  createTag: (body: CreateTagType) =>
    http.post<TagResType>("/tags/create", body),
  updateTag: (body: UpdateTagType, id: number) =>
    http.put<TagResType>(`/tags/update/${id}`, body),
  deleteTag: (id: number) => http.delete<TagResType>(`/tags/delete/${id}`),
};

export default tagApiRequest;
