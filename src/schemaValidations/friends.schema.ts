import z from "zod";

// Friend Request Schema
const UserProfileSchema = z.object({
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
  userId: z.number(),
});

const MentorProfileSchema = UserProfileSchema.extend({
  socialLinks: z.array(z.string()),
  major: z.string(),
  myCv: z.string(),
});

const UserSchema = z.object({
  id: z.number(),
  email: z.string(),
  role: z.string(),
  status: z.string(),
  notificationEnabled: z.boolean(),
  lastSeen: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  menteeProfiles: UserProfileSchema.nullable(),
  mentorProfiles: MentorProfileSchema.nullable(),
  adminProfiles: z.any().nullable(),
  StaffProfile: z.any().nullable(),
});

const FriendRequestSchema = z.object({
  id: z.number(),
  senderId: z.number(),
  receiverId: z.number(),
  status: z.enum(["PENDING", "ACCEPTED", "DECLINED"]),
  message: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  sender: UserSchema,
  receiver: UserSchema,
});

// Request/Response schemas
export const SendFriendRequestBody = z.object({
  receiverId: z.number(),
  message: z.string(),
});

export const SendFriendRequestRes = z.object({
  message: z.string(),
  result: FriendRequestSchema,
});

export const AcceptFriendRequestBody = z.object({
  action: z.enum(["accept", "decline"]),
});

export const AcceptFriendRequestRes = z.object({
  message: z.string(),
  result: FriendRequestSchema,
});

// Notification Schema
const NotificationSchema = z.object({
  id: z.number(),
  type: z.string(),
  title: z.string(),
  message: z.string(),
  isRead: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export const NotificationsRes = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    notifications: z.array(NotificationSchema),
    pagination: PaginationSchema,
  }),
});

export const FriendsListRes = z.object({
  message: z.string(),
  result: z.object({
    friends: z.array(UserSchema),
    pagination: PaginationSchema,
  }),
});

export const FriendsRequestRes = z.object({
  message: z.string(),
  result: z.object({
    requests: z.array(FriendRequestSchema),
    pagination: PaginationSchema,
  }),
});

export type SendFriendRequestBodyType = z.TypeOf<typeof SendFriendRequestBody>;
export type SendFriendRequestResType = z.TypeOf<typeof SendFriendRequestRes>;
export type AcceptFriendRequestBodyType = z.TypeOf<
  typeof AcceptFriendRequestBody
>;
export type AcceptFriendRequestResType = z.TypeOf<
  typeof AcceptFriendRequestRes
>;
export type NotificationsResType = z.TypeOf<typeof NotificationsRes>;
export type FriendRequestType = z.TypeOf<typeof FriendRequestSchema>;
export type NotificationType = z.TypeOf<typeof NotificationSchema>;
export type FriendsListResType = z.TypeOf<typeof FriendsListRes>;
export type FriendsRequestResType = z.TypeOf<typeof FriendsRequestRes>;
export type UserType = z.TypeOf<typeof UserSchema>;
