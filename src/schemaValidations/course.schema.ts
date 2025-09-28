import z from "zod";

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
  major: z.string().nullable(),
  myCv: z.string().nullable(),
  userId: z.number(),
  user: z.object({
    id: z.number(),
    email: z.string(),
    password: z.string(),
    role: z.string(),
    status: z.string(),
    emailVerifyToken: z.string(),
    forgotPasswordToken: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});

export const ModuleSchema = z.array(
  z.object({
    id: z.number(),
    courseId: z.number(),
    title: z.string(),
    order: z.number(),
    lessons: z.array(
      z.object({
        id: z.number(),
        moduleId: z.number(),
        title: z.string(),
        order: z.number(),
        mediaId: z.number().nullable(),
        commentsEnabled: z.boolean(),
        durationSec: z.number(),
      })
    ),
  })
);

export const CourseSchema = z.object({
  id: z.number(),
  mentorProfileId: z.number(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  price: z.string(),
  status: z.enum(["PUBLISHED", "DRAFT", "ARCHIVED"]),
  avgRating: z.number(),
  ratingCount: z.number(),
  thumbnail: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  categories: z.array(
    z.object({
      courseCategory: z.object({
        id: z.number(),
        name: z.string(),
        slug: z.string(),
      }),
    })
  ),
  modules: ModuleSchema,
  mentorProfile: MentorProfileSchema,
  _count: z.object({
    enrollments: z.number(),
    ratings: z.number(),
    modules: z.number(),
  }),
});

export const CourseDetailSchema = z.object({
  id: z.number(),
  mentorProfileId: z.number(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  price: z.string(),
  status: z.enum(["PUBLISHED", "DRAFT", "ARCHIVED"]),
  avgRating: z.number(),
  ratingCount: z.number(),
  thumbnail: z.string(),
  createdAt: z.string(),
  categories: z.array(
    z.object({
      courseCategory: z.object({
        id: z.number(),
        name: z.string(),
        slug: z.string(),
      }),
    })
  ),
  updatedAt: z.string(),
  mentorProfile: MentorProfileSchema,
  modules: z.array(
    z.object({
      id: z.number(),
      courseId: z.number(),
      title: z.string(),
      order: z.number(),
      lessons: z.array(
        z.object({
          id: z.number(),
          moduleId: z.number(),
          title: z.string(),
          order: z.number(),
          mediaId: z.number().nullable(),
          commentsEnabled: z.boolean(),
          durationSec: z.number(),
          media: z
            .object({
              id: z.number(),
              type: z.string(),
              s3Key: z.string(),
              status: z.string(),
              durationSec: z.number(),
              thumbnailKey: z.string().nullable(),
              createdAt: z.string(),
            })
            .nullable(),
        })
      ),
    })
  ),
  _count: z.object({
    enrollments: z.number(),
    ratings: z.number(),
  }),
});

export const CourseResponseSchema = z.object({
  message: z.string(),
  result: z.object({
    courses: z.array(CourseSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
    }),
  }),
});

export const CoursePublicStreamResponseSchema = z.object({
  message: z.string(),
  result: z.object({
    streamUrl: z.string().url(),
    expiresIn: z.number(),
  }),
});

export const CourseDetailResponseSchema = z.object({
  message: z.string(),
  result: CourseDetailSchema,
});

export const LessonProgressSchema = z.object({
  watchedSec: z.number(),
  lastPositionSec: z.number(),
  completed: z.boolean(),
});

export const LessonWithProgressSchema = z.object({
  id: z.number(),
  moduleId: z.number(),
  title: z.string(),
  order: z.number(),
  mediaId: z.number().nullable(),
  commentsEnabled: z.boolean(),
  durationSec: z.number(),
  status: z.string(),
  progress: LessonProgressSchema,
});

export const ModuleWithProgressSchema = z.object({
  id: z.number(),
  courseId: z.number(),
  title: z.string(),
  order: z.number(),
  lessons: z.array(LessonWithProgressSchema),
});

export const CourseWithProgressSchema = z.object({
  id: z.number(),
  mentorProfileId: z.number(),
  title: z.string(),
  subtitle: z.string(),
  slug: z.string(),
  description: z.string(),
  needToLearn: z.array(z.string()),
  price: z.string(),
  status: z.enum(["PUBLISHED", "DRAFT", "ARCHIVED"]),
  avgRating: z.number(),
  ratingCount: z.number(),
  thumbnail: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  modules: z.array(ModuleWithProgressSchema),
});

export const CourseProgressResponseSchema = z.object({
  message: z.string(),
  result: z.object({
    course: CourseWithProgressSchema,
    enrollment: z.object({
      id: z.number(),
      menteeProfileId: z.number(),
      courseId: z.number(),
      activatedAt: z.string(),
    }),
    progressPercentage: z.number(),
    totalLessons: z.number(),
    completedLessons: z.number(),
  }),
});

export const AdminUpdateCourseSchema = z.object({
  status: z
    .enum(["PUBLISHED", "DRAFT", "PENDING_REVIEW", "ARCHIVED"])
    .optional(),
  note: z.string().optional(),
});

export type CourseType = z.TypeOf<typeof CourseSchema>;
export type CourseDetailType = z.TypeOf<typeof CourseDetailSchema>;
export type CourseDetailSchema = z.TypeOf<typeof CourseDetailResponseSchema>;
export type CourseResponseType = z.TypeOf<typeof CourseResponseSchema>;
export type CourseProgressResponseType = z.TypeOf<
  typeof CourseProgressResponseSchema
>;
export type CourseWithProgressType = z.TypeOf<typeof CourseWithProgressSchema>;
export type CoursePublicStreamResponseType = z.TypeOf<
  typeof CoursePublicStreamResponseSchema
>;
export type AdminUpdateCourseType = z.TypeOf<typeof AdminUpdateCourseSchema>;

// Course Enrollment Schemas
export const CourseEnrollmentBodySchema = z.object({
  courseId: z.number(),
  amount: z.number(),
  orderInfo: z.string(),
});

export const CourseEnrollmentResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    paymentUrl: z.string(),
    courseId: z.number(),
    amount: z.number(),
  }),
});

export type CourseEnrollmentBodyType = z.TypeOf<
  typeof CourseEnrollmentBodySchema
>;
export type CourseEnrollmentResponseType = z.TypeOf<
  typeof CourseEnrollmentResponseSchema
>;
