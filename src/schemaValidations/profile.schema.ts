import z from "zod";

const ProfileSchema = z.object({
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

export const ProfileRes = z.object({
  message: z.string(),
  result: ProfileSchema,
});

export type UserProfile = {
  id: number;
  email: string;
  role: string;
  status: string;
  mentee_profile_id: number;
  name: string;
  bio?: string | null;
  location?: string | null;
  username: string;
  avatar?: string | null;
  coverPhoto?: string | null;
  date_of_birth?: string | null;
  website?: string | null;
  phone_number?: string | null;
  description?: string | null;
};

export type ProfileResType = z.TypeOf<typeof ProfileRes>;
