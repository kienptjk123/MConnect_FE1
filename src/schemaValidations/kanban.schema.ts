import z from "zod";

export const PriorityEnum = z.enum(["LOW", "HIGH"]);
export const StatusEnum = z.enum(["TODO", "PROGRESS", "DONE"]);

export const AssigneeSchema = z.object({
  id: z.number(),
  name: z.string(),
  avatar: z.string().nullable().optional(),
});

export const CountSchema = z.object({
  comments: z.number(),
  files: z.number(),
});

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  priority: PriorityEnum,
  status: StatusEnum,
  image: z.string().nullable().optional(),
  kanbanId: z.number(),
  assigneeId: z.number().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  assignee: AssigneeSchema.nullable().optional(),
  _count: CountSchema.optional(),
  comments: z.number().default(0),
  files: z.number().default(0),
});

export const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export const TaskResponseSchema = z.object({
  message: z.string(),
  result: z.object({
    tasks: z.array(TaskSchema),
    pagination: PaginationSchema,
  }),
});

export type TaskType = z.TypeOf<typeof TaskSchema>;
export type TaskResponseType = z.TypeOf<typeof TaskResponseSchema>;
export type PaginationType = z.TypeOf<typeof PaginationSchema>;
