import z from "zod";

const MenteeProfileSchema = z.object({
  id: z.number(),
  name: z.string(),
  avatar: z.string().nullable().optional(),
  username: z.string().nullable().optional(),
});

const CountSchema = z.object({
  replies: z.number(),
  votes: z.number(),
});

export const QuestionSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  image: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  menteeProfile: MenteeProfileSchema,
  _count: CountSchema,
});

export const QuestionCreateBody = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  image: z.instanceof(File).optional(),
});

export const QuestionUpdateBody = z.object({
  title: z.string().min(1, "Title is required").optional(),
  content: z.string().min(1, "Content is required").optional(),
  image: z.instanceof(File).optional(),
});

export type QuestionResType = z.TypeOf<typeof QuestionSchema>;
export type QuestionBodyType = z.TypeOf<typeof QuestionCreateBody>;
export type QuestionUpdateBodyType = z.TypeOf<typeof QuestionUpdateBody>;
