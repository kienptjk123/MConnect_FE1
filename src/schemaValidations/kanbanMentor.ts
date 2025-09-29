import z from "zod";

export const PriorityEnum = z.enum(["LOW", "HIGH"]);
export const StatusEnum = z.enum(["TODO", "PROGRESS", "DONE"]);

export const KanbanSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable().optional(),
  mentorProfileId: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const KanBanRes = z.object({
  message: z.string(),
  result: z.object({
    kanbans: z.array(KanbanSchema),
  }),
});

export const KanBanCreateForm = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export const KanBanUpdateForm = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
});

export const AssigneeSchemaInKanBanTask = z.object({
  id: z.number(),
  name: z.string(),
  avatar: z.string().nullable().optional(),
  user: z.object({
    email: z.string(),
  }),
});

export const AssigneeTypeInKanBanTaskResponse = z.object({
  message: z.string(),
  data: z.array(AssigneeSchemaInKanBanTask),
});

export const TaskByKanBanIdSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable().optional(),
  mentorProfileId: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  tasks: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      priority: PriorityEnum,
      status: StatusEnum,
      image: z.string(),
      kanbanId: z.number(),
      assigneeId: z.number().nullable().optional(),
      createdAt: z.string(),
      assignee: z.object({
        id: z.number(),
        name: z.string(),
        avatar: z.string().nullable(),
      }),
      _count: z.object({
        comments: z.number(),
        files: z.number(),
      }),
      comments: z.number(),
      files: z.number(),
    })
  ),
});

export const TaskByKanBanIdResponse = z.object({
  message: z.string(),
  result: z.object({
    id: z.number(),
    title: z.string(),
    description: z.string().nullable().optional(),
    mentorProfileId: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    tasks: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        priority: PriorityEnum,
        status: StatusEnum,
        image: z.string(),
        kanbanId: z.number(),
        assigneeId: z.number().nullable().optional(),
        createdAt: z.string(),
        assignee: z.object({
          id: z.number(),
          name: z.string(),
          avatar: z.string().nullable(),
        }),
        _count: z.object({
          comments: z.number(),
          files: z.number(),
        }),
        comments: z.number(),
        files: z.number(),
      })
    ),
  }),
});

export const TaskCreateForm = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: PriorityEnum,
  assigneeId: z.number(),
  image: z.string(),
});

export const TaskUpdateForm = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  status: StatusEnum.optional(),
  assigneeId: z.number().optional(),
  image: z.string().optional(),
});

export type KanbanType = z.TypeOf<typeof KanbanSchema>;
export type KanBanResType = z.TypeOf<typeof KanBanRes>;
export type KanBanCreateFormType = z.TypeOf<typeof KanBanCreateForm>;
export type KanBanUpdateFormType = z.TypeOf<typeof KanBanUpdateForm>;
export type AssigneeTypeInKanBanTask = z.TypeOf<
  typeof AssigneeSchemaInKanBanTask
>;
export type TaskCreateFormType = z.TypeOf<typeof TaskCreateForm>;
export type TaskUpdateFormType = z.TypeOf<typeof TaskUpdateForm>;
export type TaskByKanBanIdType = z.TypeOf<typeof TaskByKanBanIdSchema>;
export type TaskByKanBanIdResponseType = z.TypeOf<
  typeof TaskByKanBanIdResponse
>;
export type AssigneeTypeInKanBanTaskResponseType = z.TypeOf<
  typeof AssigneeTypeInKanBanTaskResponse
>;
