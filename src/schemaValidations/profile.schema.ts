import z, { date } from "zod";

export const ProfileSchema = z.object({
  id: z.number(),
  email: z.string(),
  role: z.string(),
  status: z.string(),
  mentee_profile_id: z.number(),
  mentor_profile_id: z.number().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  name: z.string(),
  bio: z.string().nullable(),
  location: z.string().nullable(),
  username: z.string(),
  avatar: z.string().nullable(),
  coverPhoto: z.string().nullable(),
  date_of_birth: z.string().nullable(),
  website: z.string().nullable(),
  phone_number: z.string().nullable(),
  description: z.string().nullable(),
});

export const ProfileRes = z.object({
  message: z.string(),
  result: ProfileSchema,
});
const phoneRegex = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/;

export const UpdateProfileSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100)
    .optional(),
  bio: z
    .string()
    .max(160, "Bio must be less than 160 characters")
    .nullable()
    .optional(),
  date_of_birth: z.string().optional(),
  location: z
    .string()
    .max(100, "Location must be less than 100 characters")
    .nullable()
    .optional(),
  website: z
    .string()
    .url("Please enter a valid URL")
    .max(100)
    .nullable()
    .optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30)
    .optional(),
  phone_number: z
    .string()
    .regex(phoneRegex, "Please enter a valid phone number")
    .max(10)
    .nullable()
    .optional(),
  description: z
    .string()
    .max(100, "Description must be less than 100 characters")
    .nullable()
    .optional(),
  avatar: z.instanceof(File).nullable().optional(),
  coverPhoto: z.instanceof(File).nullable().optional(),
});

export const UpdatePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(6, "Old password must be at least 6 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ProfileResType = z.TypeOf<typeof ProfileRes>;
export type UserProfile = z.TypeOf<typeof ProfileSchema>;
export type UpdateProfile = z.TypeOf<typeof UpdateProfileSchema>;
export type UpdatePassword = z.TypeOf<typeof UpdatePasswordSchema>;
