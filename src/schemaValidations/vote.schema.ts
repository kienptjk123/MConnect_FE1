import z from "zod";

const UserSchema = z.object({
  id: z.number(),
  email: z.string(),
});

export const VoteSchema = z.object({
  id: z.number(),
  voteType: z.string("UP"),
  userId: z.number(),
  questionId: z.number().nullable(),
  replyId: z.number().nullable(),
  createdAt: z.string(),
  user: UserSchema,
});

export const VoteRes = z.object({
  data: VoteSchema,
  message: z.string(),
});

export const VotesListRes = z.object({
  data: z.array(VoteSchema),
  message: z.string(),
});

export const VoteBody = z.object({
  vote_type: z.string("UP"),
  question_id: z.number().optional(),
  reply_id: z.number().optional(),
});

export type VoteResType = z.TypeOf<typeof VoteRes>;
export type VotesListResType = z.TypeOf<typeof VotesListRes>;
export type VoteCreateBodyType = z.TypeOf<typeof VoteBody>;
