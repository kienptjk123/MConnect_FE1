import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import categoriesApiRequest from "@/apiRequests/categories";
import {
  CategoryCreateType,
  CategoryUpdateType,
} from "@/schemaValidations/category.schema";

// Query Keys
export const CATEGORIES_QUERY_KEY = ["categories"];

// Get all categories
export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: () => categoriesApiRequest.getAllCategories(),
  });
};

// Get single category by ID
export const useCategoryQuery = (id: number) => {
  return useQuery({
    queryKey: [...CATEGORIES_QUERY_KEY, id],
    queryFn: () => categoriesApiRequest.getCategoryById(id),
    enabled: !!id,
  });
};

// Create category mutation
export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CategoryCreateType) =>
      categoriesApiRequest.createCategory(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
};

// Update category mutation
export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: CategoryUpdateType }) =>
      categoriesApiRequest.updateCategory(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
};

// Delete category mutation
export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoriesApiRequest.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
};
