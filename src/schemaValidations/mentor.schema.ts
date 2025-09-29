import z from "zod";
import { CourseSchema } from "./course.schema";

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
  dateOfBirth: z.string().nullable(),
  website: z.string().nullable(),
  socialLinks: z.array(z.any()),
  major: z.string().nullable(),
  myCv: z.string().nullable(),
  userId: z.number(),
  courses: z.array(CourseSchema).optional(),
});

export const MentorSchema = z.object({
  id: z.number(),
  email: z.string(),
  role: z.string(),
  status: z.string(),
  mentor_profile_id: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  name: z.string(),
  bio: z.string().nullable(),
  location: z.string().nullable(),
  major: z.string().nullable(),
  my_cv: z.string().nullable(),
  username: z.string(),
  avatar: z.string().nullable(),
  coverPhoto: z.string().nullable(),
  date_of_birth: z.string().nullable(),
  website: z.string().nullable(),
  phone_number: z.string().nullable(),
  description: z.string().nullable(),
});

export const MentorDetailSchema = z.object({
  id: z.number(),
  role: z.string(),
  email: z.string(),
  mentorProfiles: MentorProfileSchema,
});

export const MentorResponseSchema = z.object({
  message: z.string(),
  result: z.array(MentorSchema),
});

export const MentorDetailResponseSchema = z.object({
  message: z.string(),
  result: MentorDetailSchema,
});

export const MentorCoursesResponseSchema = z.object({
  message: z.string(),
  result: MentorProfileSchema,
});

export type MentorType = z.TypeOf<typeof MentorSchema>;
export type MentorDetailType = z.TypeOf<typeof MentorDetailSchema>;
export type MentorResponseType = z.TypeOf<typeof MentorResponseSchema>;
export type MentorDetailResponseType = z.TypeOf<
  typeof MentorDetailResponseSchema
>;
export type MentorCoursesResponseType = z.TypeOf<
  typeof MentorCoursesResponseSchema
>;
