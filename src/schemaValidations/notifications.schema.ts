import { z } from "zod";

export const NotificationDataSchema = z
  .object({
    type: z.string(),
    requester: z.string().optional(),
    requesterId: z.number().optional(),
  })
  .catchall(z.any());

export const NotificationTypeSchema = z.enum([
  "FRIEND_REQUEST",
  "BLOG",
  "COURSE",
  "MESSAGE",
  "SYSTEM",
]);
export const NotificationStatusSchema = z.enum(["read", "UNREAD"]);
export const NotificationPrioritySchema = z.enum(["LOW", "NORMAL", "HIGH"]);

export const NotificationSchema = z.object({
  id: z.number(),
  type: NotificationTypeSchema,
  title: z.string(),
  message: z.string(),
  status: NotificationStatusSchema,
  priority: NotificationPrioritySchema,
  data: NotificationDataSchema,
  actionUrl: z.string().nullable(),
  userId: z.number(),
  relatedUserId: z.number().nullable(),
  entityId: z.number().nullable(),
  entityType: z.string().nullable(),
  createdAt: z.string(),
  readAt: z.string().nullable(),
  expiresAt: z.string().nullable(),
});

export const NotificationPaginationSchema = z.object({
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
  hasMore: z.boolean(),
});

export const NotificationResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    notifications: z.array(NotificationSchema),
    pagination: NotificationPaginationSchema,
  }),
});

export const NotificationParamsSchema = z.object({
  offset: z.number().min(0).optional(),
  limit: z.number().min(1).max(100).optional(),
  status: z.enum(["read", "unread", "all"]).optional(),
  type: z
    .enum(["FRIEND_REQUEST", "BLOG", "COURSE", "MESSAGE", "SYSTEM", "all"])
    .optional(),
});

export const UnreadCountResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    unreadCount: z.number(),
  }),
});

export type NotificationData = z.infer<typeof NotificationDataSchema>;
export type NotificationType = z.infer<typeof NotificationTypeSchema>;
export type NotificationStatus = z.infer<typeof NotificationStatusSchema>;
export type NotificationPriority = z.infer<typeof NotificationPrioritySchema>;
export type Notification = z.infer<typeof NotificationSchema>;
export type NotificationResponse = z.infer<typeof NotificationResponseSchema>;
export type NotificationParams = z.infer<typeof NotificationParamsSchema>;
export type UnreadCountResponse = z.infer<typeof UnreadCountResponseSchema>;
