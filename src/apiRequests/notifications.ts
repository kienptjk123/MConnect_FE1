import http from "@/lib/http";
import { NotificationsResType } from "@/schemaValidations/friends.schema";

export const notificationsApiRequest = {
  getUserNotifications: (userId: number) =>
    http.get<NotificationsResType>(`/notifications/users/${userId}`),

  sendFriendRequestNotification: (data: {
    senderId: number;
    receiverId: number;
    message: string;
  }) => http.post("/notifications/friend-request", data),
};
