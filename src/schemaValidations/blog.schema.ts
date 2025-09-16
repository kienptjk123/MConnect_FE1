import z from "zod";

const StaffSchema = z.object({
  id: z.number(),
  name: z.string(),
  avatar: z.string().nullable().optional(),
  coverPhoto: z.string().nullable().optional(),
});
const TagSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const BlogTagSchema = z.object({
  tag: TagSchema,
});

export const BlogSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  image: z.string(),
  date: z.string(),
  staffId: z.number(),
  staff: StaffSchema,
  tags: z.array(BlogTagSchema).default([]),
});

export const BlogByIdRes = z.object({
  data: BlogSchema,
  message: z.string(),
});

export const BlogRes = z.object({
  data: z.array(BlogSchema),
  message: z.string(),
});

export const BlogCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  date: z.string().min(1, "Date is required"),
  image: z.string().optional(),
  tags: z.array(z.number()).optional(),
});

export const BlogUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  content: z.string().min(1, "Content is required").optional(),
  date: z.string().min(1, "Date is required").optional(),
  image: z.string().optional(),
  tags: z.array(z.number()).optional(),
});

export const BlogCreateFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  date: z.string().min(1, "Date is required"),
  tags: z.array(z.number()).optional(),
});

export const BlogUpdateFormSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  content: z.string().min(1, "Content is required").optional(),
  date: z.string().min(1, "Date is required").optional(),
  tags: z.array(z.number()).optional(),
});

export type BlogType = z.TypeOf<typeof BlogSchema>;
export type BlogResType = z.TypeOf<typeof BlogRes>;
export type BlogByIdResType = z.TypeOf<typeof BlogByIdRes>;
export type BlogCreateType = z.TypeOf<typeof BlogCreateSchema>;
export type BlogUpdateType = z.TypeOf<typeof BlogUpdateSchema>;
export type BlogCreateFormType = z.TypeOf<typeof BlogCreateFormSchema>;
export type BlogUpdateFormType = z.TypeOf<typeof BlogUpdateFormSchema>;
