import http from "@/lib/http";

// Types
export interface ConversationMember {
  conversationId: number;
  userId: number;
  role: "MEMBER" | "ADMIN";
  joinedAt: string;
  lastReadAt: string;
  lastReadMsgId: number;
  user: {
    id: number;
    email: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface MessageAttachment {
  id: number;
  messageId: number;
  storageId: number;
  kind: "IMAGE" | "FILE" | "VIDEO" | "AUDIO";
  fileName: string;
  mimeType: string;
  sizeBytes: string;
  storage: {
    id: number;
    bucket: string;
    region: string;
    s3Key: string;
    fileName: string;
    mimeType: string;
    sizeBytes: string;
    checksum: string;
    width?: number;
    height?: number;
    durationSec?: number;
    thumbnailKey?: string;
    createdById: number;
    createdAt: string;
  };
}

export interface ReadReceipt {
  messageId: number;
  userId: number;
  readAt: string;
  user: {
    id: number;
    email: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  type: "TEXT" | "IMAGE" | "FILE" | "VOICE" | "VIDEO";
  content: string;
  status: "SENT" | "DELIVERED" | "READ";
  replyToId?: number;
  isDeleted: boolean;
  editedAt?: string;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: number;
    email: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  replyTo?: string;
  attachments: MessageAttachment[];
  readReceipts: ReadReceipt[];
}

export interface Conversation {
  id: number;
  type: "DIRECT" | "GROUP";
  title: string;
  createdById: number;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
  members: ConversationMember[];
  messages: Message[];
}

export interface ConversationsResponse {
  message: string;
  result: {
    conversations: Conversation[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface ConversationResponse {
  message: string;
  result: Conversation;
}

export interface MessageResponse {
  message: string;
  result: Message;
}

// Request types
export interface CreateConversationRequest {
  type: "DIRECT" | "GROUP";
  title: string;
  participantIds: number[];
}

export interface SendMessageRequest {
  content: string;
  type: "TEXT" | "IMAGE" | "FILE" | "VOICE" | "VIDEO";
  replyToId?: number;
  attachmentIds?: number[];
}

// API functions
const chatApiRequest = {
  // Tạo cuộc hội thoại mới
  createConversation: (body: CreateConversationRequest) =>
    http.post<ConversationResponse>("/chat/conversations", body),

  // Lấy danh sách cuộc hội thoại
  getConversations: (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);

    const queryString = searchParams.toString();
    const url = queryString
      ? `/chat/conversations?${queryString}`
      : "/chat/conversations";

    return http.get<ConversationsResponse>(url);
  },

  // Lấy chi tiết cuộc hội thoại
  getConversation: (conversationId: number) =>
    http.get<ConversationResponse>(`/chat/conversations/${conversationId}`),

  // Gửi tin nhắn
  sendMessage: (conversationId: number, body: SendMessageRequest) =>
    http.post<MessageResponse>(
      `/chat/conversations/${conversationId}/messages`,
      body
    ),

  // Lấy tin nhắn trong cuộc hội thoại
  getMessages: (
    conversationId: number,
    params?: {
      page?: number;
      limit?: number;
      before?: string;
      after?: string;
    }
  ) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.before) searchParams.append("before", params.before);
    if (params?.after) searchParams.append("after", params.after);

    const queryString = searchParams.toString();
    const url = queryString
      ? `/chat/conversations/${conversationId}/messages?${queryString}`
      : `/chat/conversations/${conversationId}/messages`;

    return http.get<{
      message: string;
      result: {
        messages: Message[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      };
    }>(url);
  },

  markAsRead: (conversationId: number, messageId: number) =>
    http.post(
      `/chat/conversations/${conversationId}/messages/${messageId}/read`,
      {}
    ),

  deleteMessage: (conversationId: number, messageId: number) =>
    http.delete(`/chat/conversations/${conversationId}/messages/${messageId}`),

  editMessage: (
    conversationId: number,
    messageId: number,
    body: { content: string }
  ) =>
    http.patch(
      `/chat/conversations/${conversationId}/messages/${messageId}`,
      body
    ),

  // Archive cuộc hội thoại
  archiveConversation: (conversationId: number) =>
    http.patch(`/chat/conversations/${conversationId}/archive`, {}),

  // Unarchive cuộc hội thoại
  unarchiveConversation: (conversationId: number) =>
    http.patch(`/chat/conversations/${conversationId}/unarchive`, {}),

  // Rời khỏi cuộc hội thoại
  leaveConversation: (conversationId: number) =>
    http.delete(`/chat/conversations/${conversationId}/leave`),

  // Thêm thành viên vào cuộc hội thoại
  addMembers: (conversationId: number, userIds: number[]) =>
    http.post(`/chat/conversations/${conversationId}/members`, { userIds }),

  // Xóa thành viên khỏi cuộc hội thoại
  removeMember: (conversationId: number, userId: number) =>
    http.delete(`/chat/conversations/${conversationId}/members/${userId}`),
};

export default chatApiRequest;
