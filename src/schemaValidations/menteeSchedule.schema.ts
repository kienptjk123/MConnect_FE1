import z from "zod";

export const MenteeProfileSchema = z.object({
  id: z.number(),
  name: z.string(),
  bio: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  username: z.string(),
  avatar: z.string().nullable().optional(),
  coverPhoto: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  dateOfBirth: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  userId: z.number(),
});

export const MenteeScheduleSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  location: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  status: z.enum(["ACTIVE", "CANCELLED", "DONE"]).default("ACTIVE"),
  createdAt: z.string(),
  updatedAt: z.string(),
  menteeProfileId: z.number(),
  menteeProfile: MenteeProfileSchema,
});

export const MenteeScheduleRes = z.object({
  message: z.string(),
  data: z.array(MenteeScheduleSchema),
});

export const MenteeScheduleByIdRes = z.object({
  message: z.string(),
  data: MenteeScheduleSchema,
});

export const MenteeScheduleCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  date: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  status: z.enum(["ACTIVE", "CANCELLED", "DONE"]).default("ACTIVE"),
});

export const MenteeScheduleUpdateSchema = MenteeScheduleCreateSchema.partial();

export type MenteeScheduleType = z.TypeOf<typeof MenteeScheduleSchema>;
export type MenteeScheduleResType = z.TypeOf<typeof MenteeScheduleRes>;
export type MenteeScheduleByIdResType = z.TypeOf<typeof MenteeScheduleByIdRes>;
export type MenteeScheduleCreateType = z.TypeOf<
  typeof MenteeScheduleCreateSchema
>;
export type MenteeScheduleUpdateType = z.TypeOf<
  typeof MenteeScheduleUpdateSchema
>;
