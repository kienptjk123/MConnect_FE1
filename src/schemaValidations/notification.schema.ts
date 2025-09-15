import { z } from "zod";

// Enum definitions
export const NotificationTypeSchema = z.enum([
  "FRIEND_REQUEST",
  "BLOG",
  "COURSE",
  "MESSAGE",
  "SYSTEM",
]);

export const NotificationStatusSchema = z.enum(["READ", "UNREAD"]);

export const NotificationPrioritySchema = z.enum(["LOW", "NORMAL", "HIGH"]);

// Data schema for extra fields depending on type
export const NotificationDataSchema = z
  .object({
    type: z.string(),
    requester: z.string().optional(),
    requesterId: z.number().optional(),
  })
  .catchall(z.any());

// Main notification schema
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

// Pagination
export const NotificationPaginationSchema = z.object({
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
  hasMore: z.boolean(),
});

// Response with notifications
export const NotificationResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    notifications: z.array(NotificationSchema),
    pagination: NotificationPaginationSchema,
  }),
});

// Query params for fetching
export const NotificationParamsSchema = z.object({
  offset: z.number().min(0).optional(),
  limit: z.number().min(1).max(100).optional(),
  status: z.enum(["READ", "UNREAD", "ALL"]).optional(),
  type: z
    .enum(["FRIEND_REQUEST", "BLOG", "COURSE", "MESSAGE", "SYSTEM", "ALL"])
    .optional(),
});

// Mark as read response
export const MarkAsReadResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

// Unread count
export const UnreadCountResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    count: z.number(),
  }),
});

// ==== Types ====
export type NotificationData = z.infer<typeof NotificationDataSchema>;
export type NotificationType = z.infer<typeof NotificationTypeSchema>;
export type NotificationStatus = z.infer<typeof NotificationStatusSchema>;
export type NotificationPriority = z.infer<typeof NotificationPrioritySchema>;
export type Notification = z.infer<typeof NotificationSchema>;
export type NotificationPagination = z.infer<
  typeof NotificationPaginationSchema
>;
export type NotificationResponse = z.infer<typeof NotificationResponseSchema>;
export type NotificationParams = z.infer<typeof NotificationParamsSchema>;
export type MarkAsReadResponse = z.infer<typeof MarkAsReadResponseSchema>;
export type UnreadCountResponse = z.infer<typeof UnreadCountResponseSchema>;
