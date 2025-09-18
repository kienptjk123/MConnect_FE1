import { z } from "zod";

// Mentor Profile Schema
export const MentorProfileSchema = z.object({
  id: z.number(),
  name: z.string(),
  bio: z.string().nullable(),
  location: z.string().nullable(),
  username: z.string(),
  avatar: z.string().nullable(),
  coverPhoto: z.string().nullable(),
  description: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  dateOfBirth: z.string(),
  website: z.string().nullable(),
  socialLinks: z.array(z.string()),
  major: z.string(),
  myCv: z.string(),
  userId: z.number(),
});

// Mentee Profile Schema
export const MenteeProfileSchema = z.object({
  id: z.number(),
  name: z.string(),
  bio: z.string().nullable(),
  location: z.string().nullable(),
  username: z.string(),
  avatar: z.string().nullable(),
  coverPhoto: z.string().nullable(),
  description: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  dateOfBirth: z.string(),
  website: z.string().nullable(),
  userId: z.number(),
});

// Single Session Topic Schema (individual item)
export const SingleSessionTopicItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  topic: z.string(),
  price: z.string(),
  status: z.string(),
  mentorProfileId: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Single Session Topic Array Schema
export const SingleSessionTopicSchema = z.array(SingleSessionTopicItemSchema);

export const SingleSessionTopicResSchema = z.array(
  SingleSessionTopicItemSchema
);

// Mentor Work Schedule Schema
export const MentorWorkScheduleSchema = z.object({
  id: z.number(),
  mentorProfileId: z.number(),
  title: z.string(),
  description: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  status: z.enum(["AVAILABLE", "BOOKED", "CANCELLED"]),
  createdAt: z.string(),
  acceptedAt: z.string().nullable(),
  bookedBy: z.number().nullable(),
  bookedAt: z.string().nullable(),
});

export const MentorWorkScheduleResSchema = z.object({
  message: z.string(),
  data: z.array(MentorWorkScheduleSchema),
});

// Single Session Booking Schema
export const SingleSessionBookingSchema = z.object({
  id: z.number(),
  mentorProfileId: z.number(),
  menteeProfileId: z.number(),
  singleSessionTopicId: z.number(),
  mentorWorkScheduleId: z.number(),
  title: z.string(),
  description: z.string(),
  topic: z.string(),
  price: z.string(),
  sessionDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  meetingLink: z.string().nullable(),
  meetingPlatform: z.string().nullable(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]),
  cancelReason: z.string().nullable(),
  completedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  mentorProfile: MentorProfileSchema,
  menteeProfile: MenteeProfileSchema,
});

// Request Schemas
export const CreateBookingBodySchema = z.object({
  mentorProfileId: z.number(),
  mentorWorkScheduleId: z.number(),
  singleSessionTopicId: z.number(),
});

// Response Schemas
export const CreateBookingResSchema = z.object({
  message: z.string(),
  data: SingleSessionBookingSchema,
});

export const PaymentResSchema = z.object({
  message: z.string(),
  data: z.object({
    paymentUrl: z.string(),
    booking: z.object({
      id: z.number(),
      title: z.string(),
      price: z.string(),
      sessionDate: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      mentor: z.object({
        name: z.string(),
        avatar: z.string().nullable(),
      }),
    }),
  }),
});

// Type exports
export type SingleSessionTopicType = z.infer<
  typeof SingleSessionTopicItemSchema
>;
export type SingleSessionTopicResType = z.infer<
  typeof SingleSessionTopicResSchema
>;
export type MentorWorkScheduleType = z.infer<typeof MentorWorkScheduleSchema>;
export type MentorWorkScheduleResType = z.infer<
  typeof MentorWorkScheduleResSchema
>;
export type SingleSessionBookingType = z.infer<
  typeof SingleSessionBookingSchema
>;
export type CreateBookingBodyType = z.infer<typeof CreateBookingBodySchema>;
export type CreateBookingResType = z.infer<typeof CreateBookingResSchema>;
export type PaymentResType = z.infer<typeof PaymentResSchema>;
export type MentorProfileType = z.infer<typeof MentorProfileSchema>;
export type MenteeProfileType = z.infer<typeof MenteeProfileSchema>;
