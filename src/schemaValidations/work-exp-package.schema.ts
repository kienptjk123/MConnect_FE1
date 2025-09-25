import z from "zod";

export const WorkExperiencePackageSchema = z.object({
  id: z.number(),
  mentorProfileId: z.number(),
  title: z.string(),
  description: z.string(),
  skills: z.string().array().optional(),
  duration: z.number(),
  price: z.number(),
  packageType: z.enum(["SANDBOX_ONLY", "COURSE_PLUS_SANDBOX"]),
  includesCourse: z.number().nullable().optional(),
  certificateTemplate: z.string().nullable().optional(),
  maxParticipants: z.number().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]),
  createdAt: z.string(),
  updatedAt: z.string(),
  mentorProfile: z.object({
    id: z.number(),
    name: z.string(),
    avatar: z.string().array().optional(),
    major: z.string().nullable().optional(),
    mentorSpecialties: z.string().array().optional(),
  }),
  requirements: z.array(
    z.object({
      id: z.number(),
      workExperiencePackageId: z.number(),
      title: z.string(),
      description: z.string(),
      order: z.number(),
      isOptional: z.boolean(),
    })
  ),
  _count: z.object({
    bookings: z.number(),
  }),
});

export const WorkExperiencePackageRes = z.object({
  data: z.object({
    packages: WorkExperiencePackageSchema.array(),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
    }),
    message: z.string(),
  }),
});

export const WorkExperiencePackageCreateSchema = z.object({
  mentorProfileId: z.number(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  skills: z.string().array().optional(),
  duration: z.number().min(1, "Duration is required"),
  price: z
    .number()
    .min(2000000)
    .max(5000000, "Price must be between 2,000,000 and 5,000,000"),
  packageType: z.enum(["SANDBOX_ONLY", "COURSE_PLUS_SANDBOX"]),
  includesCourse: z.number().optional(),
  certificateTemplate: z.string().nullable().optional(),
  maxParticipants: z.number().optional(),
  requirements: z
    .array(
      z.object({
        title: z.string().min(1, "Requirement title is required"),
        description: z.string().min(1, "Requirement description is required"),
        order: z.number().min(1, "Requirement order must be at least 1"),
        isOptional: z.boolean().optional(),
      })
    )
    .min(1, "At least one requirement is required"),
});

export const WorkExperiencePackageUpdateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  skills: z.string().array(),
  duration: z.number().min(1, "Duration is required"),
  price: z
    .number()
    .min(2000000)
    .max(5000000, "Price must be between 2,000,000 and 5,000,000"),
  packageType: z.enum(["SANDBOX_ONLY", "COURSE_PLUS_SANDBOX"]),
  includesCourse: z.number().optional(),
  certificateTemplate: z.string().nullable().optional(),
  maxParticipants: z.number().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]),
  requirements: z
    .array(
      z.object({
        id: z.number().optional(),
        workExperiencePackageId: z.number().optional(),
        title: z.string().min(1, "Requirement title is required"),
        description: z.string().min(1, "Requirement description is required"),
        order: z.number().min(1, "Requirement order must be at least 1"),
        isOptional: z.boolean().optional(),
      })
    )
    .min(1, "At least one requirement is required"),
});

export type WorkExperiencePackage = z.infer<typeof WorkExperiencePackageSchema>;
export type WorkExperiencePackageRes = z.infer<typeof WorkExperiencePackageRes>;
export type WorkExperiencePackageCreateInput = z.infer<
  typeof WorkExperiencePackageCreateSchema
>;
export type WorkExperiencePackageUpdateInput = z.infer<
  typeof WorkExperiencePackageUpdateSchema
>;
