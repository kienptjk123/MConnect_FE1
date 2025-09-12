import z from "zod";

export const EnrollmentSchema = z.object({
  id: z.number(),
  menteeProfileId: z.number(),
  courseId: z.number(),
  activatedAt: z.string(),
  course: z.object({
    id: z.number(),
    mentorProfileId: z.number(),
    title: z.string(),
    subtitle: z.string(),
    slug: z.string(),
    description: z.string(),
    needToLearn: z.array(z.any()),
    price: z.string(),
    status: z.string(),
    avgRating: z.number(),
    ratingCount: z.number(),
    thumbnail: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    mentorProfile: z.object({
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
      user: z.object({
        id: z.number(),
        email: z.string(),
        password: z.string(),
        role: z.string(),
        status: z.string(),
        emailVerifyToken: z.string(),
        forgotPasswordToken: z.string().nullable(),
        fcmTokens: z.array(z.any()),
        webFcmToken: z.string().nullable(),
        notificationEnabled: z.boolean(),
        lastSeen: z.string().nullable(),
        lastDeviceInfo: z.string().nullable(),
        createdAt: z.string(),
        updatedAt: z.string(),
      }),
    }),
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
            status: z.string(),
          })
        ),
      })
    ),
    _count: z.object({
      enrollments: z.number(),
      ratings: z.number(),
    }),
  }),
  progressPercentage: z.number(),
  totalLessons: z.number(),
  completedLessons: z.number(),
});

export const MyCoursesSchema = z.object({
  enrollments: z.array(EnrollmentSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const MyCoursesResponseSchema = z.object({
  message: z.string(),
  result: MyCoursesSchema,
});

export const CourseProgressUpdateSchema = z.object({
  lessonId: z.number(),
  lastPositionSec: z.number(),
  watchedSec: z.number(),
  completed: z.boolean(),
});

export const CourseProgressSchema = z.object({
  id: z.number(),
  userId: z.number(),
  lessonId: z.number(),
  lastPositionSec: z.number(),
  watchedSec: z.number(),
  completed: z.boolean(),
  lesson: z.object({
    id: z.number(),
    moduleId: z.number(),
    title: z.string(),
    order: z.number(),
    mediaId: z.number(),
    commentsEnabled: z.boolean(),
    durationSec: z.number(),
    media: z.object({
      id: z.number(),
      type: z.string(),
      s3Key: z.string(),
      status: z.string(),
      durationSec: z.number(),
      thumbnailKey: z.string(),
      createdAt: z.string(),
    }),
  }),
});

export const CourseProgressResponseSchema = z.object({
  message: z.string(),
  result: CourseProgressSchema,
});

export type EnrollmentType = z.TypeOf<typeof EnrollmentSchema>;
export type MyCoursesType = z.TypeOf<typeof MyCoursesSchema>;
export type MyCoursesResponseType = z.TypeOf<typeof MyCoursesResponseSchema>;
export type CourseProgressUpdateType = z.TypeOf<
  typeof CourseProgressUpdateSchema
>;
export type CourseProgressType = z.TypeOf<typeof CourseProgressSchema>;
export type CourseProgressResponseType = z.TypeOf<
  typeof CourseProgressResponseSchema
>;
