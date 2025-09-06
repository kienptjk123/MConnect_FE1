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

export const BlogRes = z.object({
  data: z.array(BlogSchema),
  message: z.string(),
});

export type BlogResType = z.TypeOf<typeof BlogRes>;
