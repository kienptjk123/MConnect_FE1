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
  // GET /categories
  getAllCategories: () => {
    return http.get<CategoriesResponseType>("/categories");
  },

  // GET /categories/:id
  getCategoryById: (id: number) => {
    return http.get<CategoryCreateResponseType>(`/categories/${id}`);
  },

  // POST /categories/create
  createCategory: (body: CategoryCreateType) => {
    return http.post<CategoryCreateResponseType>("/categories/create", body);
  },

  // PUT /categories/:id
  updateCategory: (id: number, body: CategoryUpdateType) => {
    return http.put<CategoryUpdateResponseType>(`/categories/${id}`, body);
  },

  // DELETE /categories/delete/:id
  deleteCategory: (id: number) => {
    return http.delete<CategoryDeleteResponseType>(`/categories/delete/${id}`);
  },
};

export default categoriesApiRequest;
