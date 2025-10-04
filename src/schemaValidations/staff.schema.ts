import z from "zod";
const phoneRegex = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/;

export const StaffSchema = z.object({
  id: z.number(),
  email: z.string(),
  role: z.string(),
  status: z.string(),
  staff_profile_id: z.number(),
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

export const UpdateStaffSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100)
    .optional(),
  bio: z.string().max(100, "Bio must be less than 160 characters").nullable(),
  date_of_birth: z.string().optional(),
  location: z
    .string()
    .min(3, "Location must be at least 3 characters")
    .max(100, "Location must be less than 100 characters")
    .nullable(),
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
    .min(3, "Description must be at least 3 characters")
    .max(100, "Description must be less than 100 characters")
    .nullable()
    .optional(),
  avatar: z.instanceof(File).nullable().optional(),
  coverPhoto: z.instanceof(File).nullable().optional(),
});

export const CreateStaffSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string().min(6, "Confirm password is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export type CreateStaffFormType = z.infer<typeof CreateStaffSchema>;

export const StaffResponseSchema = z.object({
  message: z.string(),
  result: z.array(StaffSchema),
});

export type StaffType = z.TypeOf<typeof StaffSchema>;
export type StaffResponseType = z.TypeOf<typeof StaffResponseSchema>;
export type UpdateStaffProfileType = z.TypeOf<typeof UpdateStaffSchema>;
