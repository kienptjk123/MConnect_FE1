import z from "zod";

export const CallTypeEnum = z.enum(["VOICE", "VIDEO"]);
export const CallStatusEnum = z.enum([
  "PENDING",
  "RINGING",
  "ACCEPTED",
  "DECLINED",
  "ENDED",
  "MISSED",
]);

const UserSchema = z.object({
  id: z.number(),
  email: z.string(),
  username: z.string().optional(),
  avatar: z.string().nullable().optional(),
  menteeProfiles: z.array(z.any()).default([]),
  mentorProfiles: z.array(z.any()).default([]),
  adminProfiles: z.array(z.any()).default([]),
  StaffProfile: z.array(z.any()).default([]),
});

export const CallSchema = z.object({
  id: z.number(),
  callerId: z.number(),
  receiverId: z.number(),
  callType: CallTypeEnum,
  status: CallStatusEnum,
  conversationId: z.number().nullable().optional(),
  startedAt: z.string(),
  ringingAt: z.string().nullable().optional(),
  acceptedAt: z.string().nullable().optional(),
  endedAt: z.string().nullable().optional(),
  duration: z.number().nullable().optional(),
  endReason: z.string().nullable().optional(),
  caller: UserSchema,
  receiver: UserSchema,
});

export const InitiateCallSchema = z.object({
  receiverId: z.number().min(1, "Receiver ID is required"),
  callType: CallTypeEnum,
  conversationId: z.number().optional(),
});

export const CallResponseSchema = z.object({
  action: z.enum(["accept", "decline"]),
  reason: z.string().optional(),
});

export const CallHistoryRes = z.object({
  result: z.object({
    calls: z.array(CallSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
    }),
  }),
  message: z.string(),
});

export const CallRes = z.object({
  result: CallSchema,
  message: z.string(),
});

export const CallStatsRes = z.object({
  result: z.object({
    totalCalls: z.number(),
    totalDuration: z.number(),
    statusBreakdown: z.record(z.string(), z.number()),
  }),
  message: z.string(),
});

export type CallType = z.TypeOf<typeof CallSchema>;
export type InitiateCallType = z.TypeOf<typeof InitiateCallSchema>;
export type CallResponseType = z.TypeOf<typeof CallResponseSchema>;
export type CallHistoryResType = z.TypeOf<typeof CallHistoryRes>;
export type CallResType = z.TypeOf<typeof CallRes>;
export type CallStatsResType = z.TypeOf<typeof CallStatsRes>;
export type CallTypeEnum = z.TypeOf<typeof CallTypeEnum>;
export type CallStatusEnum = z.TypeOf<typeof CallStatusEnum>;
