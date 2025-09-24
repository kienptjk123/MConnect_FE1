import z from "zod";

const MentorScheduleSchema = z.object({
  id: z.string(),
  mentorProfileId: z.number(),
  title: z.string(),
  description: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  status: z.enum(["PENDING", "ACCEPTED", "AVAILABLE", "BOOKED", "REJECTED"]),
  createdAt: z.string(),
  acceptedAt: z.string(),
  bookedBy: z.string().nullable(),
  bookedAt: z.string().nullable(),
});

export const MentorScheduleRes = z.object({
  message: z.string(),
  data: z.array(MentorScheduleSchema),
});

export const MentorScheduleCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

export const MentorScheduleUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  date: z.string().min(1, "Date is required").optional(),
  startTime: z.string().min(1, "Start time is required").optional(),
  endTime: z.string().min(1, "End time is required").optional(),
});

export type MentorScheduleType = z.TypeOf<typeof MentorScheduleSchema>;
export type MentorScheduleResType = z.TypeOf<typeof MentorScheduleRes>;
export type MentorScheduleCreateType = z.TypeOf<
  typeof MentorScheduleCreateSchema
>;
export type MentorScheduleUpdateType = z.TypeOf<
  typeof MentorScheduleUpdateSchema
>;
