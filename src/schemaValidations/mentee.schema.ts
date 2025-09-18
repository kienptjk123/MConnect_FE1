import z from "zod";

export const MenteeSchema = z.object({
  id: z.number(),
  email: z.string(),
  role: z.string(),
  status: z.string(),
  mentee_profile_id: z.number(),
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

export const MenteeResponseSchema = z.object({
  message: z.string(),
  result: z.array(MenteeSchema),
});

export type MenteeType = z.TypeOf<typeof MenteeSchema>;
export type MenteeResponseType = z.TypeOf<typeof MenteeResponseSchema>;
