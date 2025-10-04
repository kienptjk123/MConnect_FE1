import { z } from "zod";

export const MentorCreateCourseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  description: z.string().min(1, "Description is required"),
  needToLearn: z.array(z.string()),
  price: z.number().min(10000, "Price must be at least 10,000"),
  thumbnail: z.string().min(1, "Thumbnail is required"),
  categories: z.array(z.number()).optional(),
  labels: z.array(z.number()).optional(),
});

export const MentorUpdateCourseSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  subtitle: z.string().min(1, "Subtitle is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  needToLearn: z.array(z.string()).optional(),
  price: z.number().min(0, "Price must be positive").optional(),
  thumbnail: z.string().optional(),
  categories: z.array(z.number()).optional(),
  labels: z.array(z.number()).optional(),
});

export const CreateModuleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  order: z.number().min(1, "Order must be positive"),
});

// Module Update Schema
export const UpdateModuleSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  order: z.number().min(1, "Order must be positive").optional(),
});

// Lesson Creation Schema
export const CreateLessonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  order: z.number().min(1, "Order must be positive"),
  commentsEnabled: z.boolean().optional().default(true),
  durationSec: z.number().min(0).optional().default(0),
});

// Lesson Update Schema
export const UpdateLessonSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  order: z.number().min(1, "Order must be positive").optional(),
  commentsEnabled: z.boolean().optional(),
  durationSec: z.number().min(0).optional(),
});

// Response Schemas
export const ModuleResponseSchema = z.object({
  message: z.string(),
  result: z.object({
    id: z.number(),
    title: z.string(),
    order: z.number(),
    courseId: z.number(),
  }),
});

export const LessonResponseSchema = z.object({
  message: z.string(),
  result: z.object({
    id: z.number(),
    title: z.string(),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
    order: z.number(),
    commentsEnabled: z.boolean(),
    durationSec: z.number(),
    moduleId: z.number(),
    mediaId: z.number().nullable(),
  }),
});

export const LessonFormSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Lesson title is required"),
  order: z.number().int().min(1, "Order must be >= 1"),
  commentsEnabled: z.boolean(),
  durationSec: z.number().int().min(0, "Duration must be >= 0"),
  createdLessonId: z.number().optional(),
  pendingVideoFile: z.instanceof(File).optional(),
  videoUploadStatus: z
    .enum(["idle", "uploading", "success", "error"])
    .optional(),
});

export const ModuleFormSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Module title is required"),
  order: z.number().int().min(1, "Order must be >= 1"),
  lessons: z.array(LessonFormSchema),
});

export const CourseFormDataSchema = z.object({
  title: z.string().min(1, "Course title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  description: z.string().min(1, "Description is required"),
  needToLearn: z.string().min(1, "Learning outcomes are required"),
  price: z.number().min(1, "Price must be greater than 0"),
  thumbnail: z.string().url("Thumbnail must be a valid URL"),
  categories: z.array(z.string()).min(1, "Select at least one category"),
  labels: z.array(z.string()).min(1, "Select at least one label"),
  modules: z
    .array(
      z.object({
        id: z.string(),
        title: z.string().min(1, "Module title is required"),
        order: z.number().int().min(1),
        lessons: z
          .array(
            z.object({
              id: z.string(),
              title: z.string().min(1, "Lesson title is required"),
              order: z.number().int().min(1),
              commentsEnabled: z.boolean(),
              durationSec: z.number().int().min(1, "Duration must be > 0"),
            })
          )
          .min(1, "Each module must have at least one lesson"),
      })
    )
    .min(1, "At least one module is required"),
});

export type { CourseType } from "./course.schema";

// TypeScript Types
export type MentorCreateCourseType = z.TypeOf<typeof MentorCreateCourseSchema>;
export type MentorUpdateCourseType = z.TypeOf<typeof MentorUpdateCourseSchema>;
export type CreateModuleType = z.TypeOf<typeof CreateModuleSchema>;
export type UpdateModuleType = z.TypeOf<typeof UpdateModuleSchema>;
export type CreateLessonType = z.TypeOf<typeof CreateLessonSchema>;
export type UpdateLessonType = z.TypeOf<typeof UpdateLessonSchema>;
export type ModuleResponseType = z.TypeOf<typeof ModuleResponseSchema>;
export type LessonResponseType = z.TypeOf<typeof LessonResponseSchema>;
export type LessonFormType = z.infer<typeof LessonFormSchema>;
export type ModuleFormType = z.infer<typeof ModuleFormSchema>;
export type CourseFormDataType = z.infer<typeof CourseFormDataSchema>;
