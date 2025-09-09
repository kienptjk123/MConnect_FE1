import z from "zod";

const MenteeProfileSchema = z.object({
  id: z.number(),
  name: z.string(),
  avatar: z.string().nullable().optional(),
  username: z.string().nullable().optional(),
});

const CountSchema = z.object({
  votes: z.number(),
  childReplies: z.number(),
});

export const ReplySchema = z.object({
  id: z.number(),
  content: z.string(),
  authorType: z.string(),
  menteeProfileId: z.number(),
  questionId: z.number(),
  parentReplyId: z.number().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  menteeProfile: MenteeProfileSchema,
  _count: CountSchema,
});

export const ReplyCreateBody = z.object({
  content: z.string().min(1, "Content is required"),
  author_type: z.string(),
  question_id: z.number(),
  parent_reply_id: z.number().nullable().optional(),
});

export const ReplyUpdateBody = z.object({
  content: z.string().min(1, "Content is required"),
  author_type: z.string(),
  question_id: z.number(),
  parent_reply_id: z.number().nullable().optional(),
});

export type ReplyResType = z.TypeOf<typeof ReplySchema>;
export type ReplyCreateBody = z.TypeOf<typeof ReplyCreateBody>;
export type ReplyUpdateBody = z.TypeOf<typeof ReplyUpdateBody>;
