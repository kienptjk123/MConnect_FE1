import { z } from "zod";

// Category Schema
export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

// Category Create Schema
export const CategoryCreateSchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

// Category Update Schema
export const CategoryUpdateSchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

// API Response Schemas
export const CategoryCreateResponseSchema = z.object({
  message: z.string(),
  data: CategorySchema,
});

export const CategoryUpdateResponseSchema = z.object({
  message: z.string(),
  data: CategorySchema,
});

export const CategoriesResponseSchema = z.object({
  message: z.string(),
  data: z.array(CategorySchema),
});

export const CategoryDeleteResponseSchema = z.object({
  message: z.string(),
});

// TypeScript Types
export type CategoryType = z.TypeOf<typeof CategorySchema>;
export type CategoryCreateType = z.TypeOf<typeof CategoryCreateSchema>;
export type CategoryUpdateType = z.TypeOf<typeof CategoryUpdateSchema>;
export type CategoryCreateResponseType = z.TypeOf<
  typeof CategoryCreateResponseSchema
>;
export type CategoryUpdateResponseType = z.TypeOf<
  typeof CategoryUpdateResponseSchema
>;
export type CategoriesResponseType = z.TypeOf<typeof CategoriesResponseSchema>;
export type CategoryDeleteResponseType = z.TypeOf<
  typeof CategoryDeleteResponseSchema
>;
