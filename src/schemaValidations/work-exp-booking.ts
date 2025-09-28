import z from "zod";

const MentorProfileSchema = z.object({
  id: z.number(),
  name: z.string(),
  avatar: z.string().nullable().optional(),
  major: z.string().nullable().optional(),
});

const MenteeProfileSchema = z.object({
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

const WorkExperiencePackageSchema = z.object({
  id: z.number(),
  mentorProfileId: z.number(),
  title: z.string(),
  description: z.string(),
  skills: z.array(z.string()).optional(),
  duration: z.number(),
  price: z.string(),
  packageType: z.enum(["SANDBOX_ONLY", "COURSE_PLUS_SANDBOX"]),
  includesCourse: z.number().nullable().optional(),
  certificateTemplate: z.string().nullable().optional(),
  maxParticipants: z.number().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]),
  createdAt: z.string(),
  updatedAt: z.string(),
  mentorProfile: MentorProfileSchema,
});

export const WorkBookingSchema = z.object({
  id: z.number(),
  workExperiencePackageId: z.number(),
  menteeProfileId: z.number(),
  kanbanId: z.number().nullable().optional(),
  startDate: z.string(),
  expectedEndDate: z.string(),
  actualEndDate: z.string().nullable().optional(),
  price: z.string(),
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PAID",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
    "ON_HOLD",
  ]),
  paymentStatus: z.enum([
    "PENDING",
    "PAID",
    "FAILED",
    "REFUNDED",
    "PARTIALLY_REFUNDED",
  ]),
  progress: z.number(),
  kickoffMeetingAt: z.string().nullable().optional(),
  kickoffMeetingLink: z.string().nullable().optional(),
  cancelReason: z.string().nullable().optional(),
  completedAt: z.string().nullable().optional(),
  certificateIssued: z.boolean(),
  certificateUrl: z.string().nullable().optional(),
  certificateVerificationCode: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  workExperiencePackage: WorkExperiencePackageSchema,
  menteeProfile: MenteeProfileSchema,
  kanban: z.any().nullable().optional(),
  milestones: z.array(z.any()),
  sessions: z.array(z.any()),
  feedback: z.any().nullable().optional(),
});

export const WorkBookingsResSchema = z.object({
  message: z.string(),
  data: z.array(WorkBookingSchema),
});

export const WorkBookingCreateSchema = z.object({
  workExperiencePackageId: z.number(),
  menteeProfileId: z.number(),
  startDate: z.string(), // today + 3 days
  price: z.string(), // price from price in package
});

export type WorkBooking = z.infer<typeof WorkBookingSchema>;
export type WorkBookingsRes = z.infer<typeof WorkBookingsResSchema>;
export type WorkBookingCreate = z.infer<typeof WorkBookingCreateSchema>;
