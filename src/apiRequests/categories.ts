import http from "@/lib/http";
import {
  CategoryCreateResponseType,
  CategoryUpdateResponseType,
  CategoriesResponseType,
  CategoryDeleteResponseType,
  CategoryCreateType,
  CategoryUpdateType,
} from "@/schemaValidations/category.schema";

const categoriesApiRequest = {
  getAllCategories: () => {
    return http.get<CategoriesResponseType>("/categories");
  },

  getCategoryById: (id: number) => {
    return http.get<CategoryCreateResponseType>(`/categories/${id}`);
  },

  createCategory: (body: CategoryCreateType) => {
    return http.post<CategoryCreateResponseType>("/categories/create", body);
  },

  updateCategory: (id: number, body: CategoryUpdateType) => {
    return http.put<CategoryUpdateResponseType>(`/categories/${id}`, body);
  },

  deleteCategory: (id: number) => {
    return http.delete<CategoryDeleteResponseType>(`/categories/delete/${id}`);
  },
};

export default categoriesApiRequest;
