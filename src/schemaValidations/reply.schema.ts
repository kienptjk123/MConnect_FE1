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

export const ReplyRes = z.object({
  data: ReplySchema,
  message: z.string(),
});

export const ReplyListRes = z.object({
  data: z.array(ReplySchema),
  message: z.string(),
});

export const ReplyBody = z.object({
  content: z.string().min(1, "Content is required"),
  author_type: z.string(),
  question_id: z.number(),
  parent_reply_id: z.number().nullable().optional(),
});

export type ReplyResType = z.TypeOf<typeof ReplyRes>;
export type RepliesListResType = z.TypeOf<typeof ReplyListRes>;
export type ReplyCreateBody = z.TypeOf<typeof ReplyBody>;
