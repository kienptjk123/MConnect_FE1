import { id } from "date-fns/locale";
import z from "zod";
const phoneRegex = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/;

export const UpgradeRequestSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  bio: z.string().min(1, "Bio is required"),
  major: z.string().min(1, "Major is required"),
  cv_url: z.string().url("Invalid URL").min(1, "CV URL is required"),
  description: z.string().min(1, "Description is required"),
  website: z.string().url("Invalid URL").nullable().optional(),
  phone_number: z
    .string()
    .regex(phoneRegex, "Please enter a valid phone number")
    .max(10, "Phone number must be at most 10 numbers")
    .nullable()
    .optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  review_comment: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  mentee_profile: z.object({
    id: z.number(),
    name: z.string(),
    username: z.string(),
    avatar: z.string().url().nullable(),
  }),
  reviewed_by: z.object({
    id: z.number(),
    email: z.string(),
    role: z.string(),
  }),
});

export const UpdateRequestResultSchema = z.object({
  requests: z.array(UpgradeRequestSchema),
  pagination: z.object({
    current_page: z.number(),
    total_pages: z.number(),
    total_count: z.number(),
    per_page: z.number(),
  }),
});

export const UpgradeRequestRes = z.object({
  result: UpdateRequestResultSchema,
  message: z.string(),
});

export const UpgradeRequestByIdRes = z.object({
  result: UpgradeRequestSchema,
  message: z.string(),
});

export const CreateUpdateRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().min(1, "Bio is required"),
  major: z.string().min(1, "Major is required"),
  description: z.string().min(1, "Description is required"),
  website: z.string().url("Invalid URL").nullable().optional(),
  phone_number: z
    .string()
    .regex(phoneRegex, "Please enter a valid phone number")
    .max(10, "Phone number must be at most 10 numbers")
    .nullable()
    .optional(),
  cv: z.instanceof(File).optional(),
});

export const EditUpdateRequestSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  review_comment: z.string().optional().nullable(),
});

export type UpgradeRequestType = z.infer<typeof UpgradeRequestSchema>;
export type UpgradeRequestResType = z.infer<typeof UpgradeRequestRes>;
export type CreateUpdateRequest = z.infer<typeof CreateUpdateRequestSchema>;
export type EditUpdateRequest = z.infer<typeof EditUpdateRequestSchema>;
export type UpgradeRequestByIdResType = z.infer<typeof UpgradeRequestByIdRes>;
