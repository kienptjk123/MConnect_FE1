import { z } from "zod";

// Profile schemas (reuse from friends schema or create here)
const MenteeProfileSchema = z.object({
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

const MentorProfileSchema = MenteeProfileSchema.extend({
  socialLinks: z.array(z.string()),
  major: z.string(),
  myCv: z.string(),
});

// Schema cho user object
const UserSchema = z.object({
  id: z.number(),
  email: z.string(),
  password: z.string(),
  role: z.string(),
  status: z.string(),
  emailVerifyToken: z.string().nullable(),
  forgotPasswordToken: z.string().nullable(),
  fcmTokens: z.array(z.string()),
  webFcmToken: z.string().nullable(),
  notificationEnabled: z.boolean(),
  lastSeen: z.string().nullable(),
  lastDeviceInfo: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  menteeProfiles: MenteeProfileSchema.nullable(),
  mentorProfiles: MentorProfileSchema.nullable(),
  adminProfiles: z.any().nullable(),
  StaffProfile: z.any().nullable(),
});

// Schema cho storage object
const StorageSchema = z.object({
  id: z.number(),
  bucket: z.string(),
  region: z.string(),
  s3Key: z.string(),
  fileName: z.string(),
  mimeType: z.string(),
  sizeBytes: z.string(),
  checksum: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  durationSec: z.number().nullable().optional(),
  thumbnailKey: z.string().optional(),
  createdById: z.number(),
  createdAt: z.string(),
});

// Schema cho attachment
const MessageAttachmentSchema = z.object({
  id: z.number(),
  messageId: z.number(),
  storageId: z.number(),
  kind: z.enum(["IMAGE", "FILE", "VIDEO", "AUDIO"]),
  fileName: z.string(),
  mimeType: z.string(),
  sizeBytes: z.string(),
  storage: StorageSchema,
});

// Schema cho read receipt
const ReadReceiptSchema = z.object({
  messageId: z.number(),
  userId: z.number(),
  readAt: z.string(),
  user: UserSchema,
});

// Schema cho message
const MessageSchema = z.object({
  id: z.number(),
  conversationId: z.number(),
  senderId: z.number(),
  type: z.enum(["TEXT", "IMAGE", "FILE", "VOICE", "VIDEO"]),
  content: z.string(),
  status: z.enum(["SENT", "DELIVERED", "READ"]),
  replyToId: z.number().optional(),
  isDeleted: z.boolean(),
  editedAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  sender: UserSchema,
  replyTo: z.string().optional(),
  attachments: z.array(MessageAttachmentSchema),
  readReceipts: z.array(ReadReceiptSchema),
});

// Schema cho conversation member
const ConversationMemberSchema = z.object({
  conversationId: z.number(),
  userId: z.number(),
  role: z.enum(["MEMBER", "ADMIN", "OWNER"]),
  joinedAt: z.string(),
  lastReadAt: z.string().nullable(),
  lastReadMsgId: z.number().nullable(),
  user: UserSchema,
});

// Schema cho conversation
const ConversationSchema = z.object({
  id: z.number(),
  type: z.enum(["DIRECT", "GROUP"]),
  title: z.string(),
  createdById: z.number(),
  lastMessageAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isArchived: z.boolean(),
  members: z.array(ConversationMemberSchema),
  messages: z.array(MessageSchema),
});

// Schema cho pagination
const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

// Request schemas
const CreateConversationSchema = z.object({
  type: z.enum(["DIRECT", "GROUP"]),
  title: z.string().min(1, "Title không được để trống"),
  participantIds: z
    .array(z.number())
    .min(1, "Cần ít nhất 1 người tham gia")
    .max(50, "Tối đa 50 người tham gia"),
});

const SendMessageSchema = z.object({
  content: z
    .string()
    .min(1, "Nội dung tin nhắn không được để trống")
    .max(2000, "Tin nhắn quá dài"),
  type: z.enum(["TEXT", "IMAGE", "FILE", "VOICE", "VIDEO"]).default("TEXT"),
  replyToId: z.number().optional(),
  attachmentIds: z.array(z.number()).optional(),
});

const EditMessageSchema = z.object({
  content: z
    .string()
    .min(1, "Nội dung tin nhắn không được để trống")
    .max(2000, "Tin nhắn quá dài"),
});

const GetConversationsSchema = z.object({
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(20),
  search: z.string().optional(),
});

const GetMessagesSchema = z.object({
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(50),
  before: z.string().optional(),
  after: z.string().optional(),
});

const AddMembersSchema = z.object({
  userIds: z
    .array(z.number())
    .min(1, "Cần ít nhất 1 người để thêm")
    .max(10, "Chỉ có thể thêm tối đa 10 người cùng lúc"),
});

// Response schemas
const ConversationResponseSchema = z.object({
  message: z.string(),
  result: ConversationSchema,
});

const ConversationsResponseSchema = z.object({
  message: z.string(),
  result: z.object({
    conversations: z.array(ConversationSchema),
    pagination: PaginationSchema,
  }),
});

const MessageResponseSchema = z.object({
  message: z.string(),
  result: MessageSchema,
});

const MessagesResponseSchema = z.object({
  message: z.string(),
  result: z.object({
    messages: z.array(MessageSchema),
    pagination: PaginationSchema,
  }),
});

// Type exports
export type CreateConversationBody = z.TypeOf<typeof CreateConversationSchema>;
export type SendMessageBody = z.TypeOf<typeof SendMessageSchema>;
export type EditMessageBody = z.TypeOf<typeof EditMessageSchema>;
export type GetConversationsQuery = z.TypeOf<typeof GetConversationsSchema>;
export type GetMessagesQuery = z.TypeOf<typeof GetMessagesSchema>;
export type AddMembersBody = z.TypeOf<typeof AddMembersSchema>;

export type ConversationResponse = z.TypeOf<typeof ConversationResponseSchema>;
export type ConversationsResponse = z.TypeOf<
  typeof ConversationsResponseSchema
>;
export type MessageResponse = z.TypeOf<typeof MessageResponseSchema>;
export type MessagesResponse = z.TypeOf<typeof MessagesResponseSchema>;

export type Conversation = z.TypeOf<typeof ConversationSchema>;
export type Message = z.TypeOf<typeof MessageSchema>;
export type ConversationMember = z.TypeOf<typeof ConversationMemberSchema>;
export type MessageAttachment = z.TypeOf<typeof MessageAttachmentSchema>;
export type ReadReceipt = z.TypeOf<typeof ReadReceiptSchema>;
export type User = z.TypeOf<typeof UserSchema>;
export type Pagination = z.TypeOf<typeof PaginationSchema>;

// Schema exports
export {
  CreateConversationSchema,
  SendMessageSchema,
  EditMessageSchema,
  GetConversationsSchema,
  GetMessagesSchema,
  AddMembersSchema,
  ConversationResponseSchema,
  ConversationsResponseSchema,
  MessageResponseSchema,
  MessagesResponseSchema,
  ConversationSchema,
  MessageSchema,
  ConversationMemberSchema,
  MessageAttachmentSchema,
  ReadReceiptSchema,
  UserSchema,
  PaginationSchema,
};
