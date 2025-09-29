import http from "@/lib/http";

export interface NotificationData {
  type: string;
  requester?: string;
  requesterId?: number;
  [key: string]: any;
}

export interface Notification {
  id: number;
  type: "FRIEND_REQUEST" | "BLOG" | "COURSE" | "MESSAGE" | "SYSTEM";
  title: string;
  message: string;
  status: "READ" | "UNREAD";
  priority: "LOW" | "NORMAL" | "HIGH";
  data: NotificationData;
  actionUrl: string | null;
  userId: number;
  relatedUserId: number | null;
  entityId: number | null;
  entityType: string | null;
  createdAt: string;
  readAt: string | null;
  expiresAt: string | null;
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  data: {
    notifications: Notification[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  };
}

export interface NotificationParams {
  limit?: number;
  offset?: number;
  status?: "read" | "unread" | "all";
  type?: "FRIEND_REQUEST" | "BLOG" | "COURSE" | "MESSAGE" | "SYSTEM" | "all";
}

const notificationApiRequest = {
  // Get notifications for specific user
  getUserNotifications: (userId: number, params?: NotificationParams) => {
    const queryParams = new URLSearchParams();

    if (params?.offset) queryParams.append("offset", params.offset.toString());
    if (params?.type && params.type !== "all")
      queryParams.append("type", params.type);

    const url = `/notifications/users/${userId}?includeRead=true`;

    return http.get<NotificationResponse>(url);
  },
  markAsRead: (userId: number, notificationId: number) =>
    http.put<{ success: boolean; message: string }>(
      `/notifications/users/${userId}/${notificationId}/read`,
      {}
    ),

  markAllAsRead: (userId: number) =>
    http.put<{ success: boolean; message: string }>(
      `/notifications/users/${userId}/read-all`,
      {}
    ),

  deleteNotification: (userId: number, notificationId: number) =>
    http.delete<{ success: boolean; message: string }>(
      `/notifications/users/${userId}/${notificationId}`
    ),

  getUnreadCount: (userId: number) =>
    http.get<{
      success: boolean;
      message: string;
      data: { unreadCount: number };
    }>(`/notifications/users/${userId}/unread-count`),
};

export default notificationApiRequest;
