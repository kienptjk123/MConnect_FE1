import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  Notification,
  NotificationParams,
} from "@/schemaValidations/notifications.schema";
import notificationApiRequest from "@/apiRequests/notification";
import { useProfileStore } from "@/stores/profileStore";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

interface NotificationActions {
  fetchNotifications: (
    userId: number,
    params?: NotificationParams
  ) => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: (userId: number) => Promise<void>;
  deleteNotification: (notificationId: number) => Promise<void>;
  fetchUnreadCount: (userId: number) => Promise<void>;
  addNotification: (notification: Notification) => void;
  updateNotificationStatus: (
    notificationId: number,
    status: "read" | "UNREAD"
  ) => void;
  clearNotifications: () => void;
  setError: (error: string | null) => void;
}

type NotificationStore = NotificationState & NotificationActions;

export const useNotificationStore = create<NotificationStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,
      pagination: {
        total: 0,
        limit: 10,
        offset: 0,
        hasMore: false,
      },

      // Actions
      fetchNotifications: async (
        userId: number,
        params?: NotificationParams
      ) => {
        set({ isLoading: true, error: null });
        try {
          const response = await notificationApiRequest.getUserNotifications(
            userId,
            params
          );

          if (response.payload.success) {
            const { notifications, pagination } = response.payload.data;

            // If offset is 0, replace notifications; otherwise, append
            const existingNotifications =
              params?.offset === 0 || !params?.offset
                ? []
                : get().notifications;

            // Normalize status values to match local state expectations
            const normalizedNotifications = notifications.map(
              (notification) => ({
                ...notification,
                status:
                  notification.status === "READ"
                    ? ("read" as const)
                    : notification.status,
              })
            );

            set({
              notifications: [
                ...existingNotifications,
                ...normalizedNotifications,
              ],
              pagination,
              isLoading: false,
              error: null,
            });
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
          set({
            error: "Failed to fetch notifications",
            isLoading: false,
          });
        }
      },

      markAsRead: async (notificationId: number) => {
        try {
          const userId = useProfileStore.getState().profile?.id;
          const response = await notificationApiRequest.markAsRead(
            Number(userId),
            notificationId
          );

          if (response.payload.success) {
            const { notifications, unreadCount } = get();

            const updatedNotifications = notifications.map((notification) =>
              notification.id === notificationId
                ? { ...notification, status: "read" as const }
                : notification
            );

            set({
              notifications: updatedNotifications,
              unreadCount: Math.max(0, unreadCount - 1),
            });
          }
        } catch (error) {
          console.error("Error marking notification as read:", error);
          set({ error: "Failed to mark notification as read" });
        }
      },

      markAllAsRead: async (userId: number) => {
        try {
          const response = await notificationApiRequest.markAllAsRead(userId);

          if (response.payload.success) {
            const { notifications } = get();

            const updatedNotifications = notifications.map((notification) => ({
              ...notification,
              status: "read" as const,
            }));

            set({
              notifications: updatedNotifications,
              unreadCount: 0,
            });
          }
        } catch (error) {
          console.error("Error marking all notifications as read:", error);
          set({ error: "Failed to mark all notifications as read" });
        }
      },

      deleteNotification: async (notificationId: number) => {
        try {
          const userId = useProfileStore.getState().profile?.id;
          const response = await notificationApiRequest.deleteNotification(
            Number(userId),
            notificationId
          );

          if (response.payload.success) {
            const { notifications, unreadCount } = get();
            const notificationToDelete = notifications.find(
              (n) => n.id === notificationId
            );

            // Remove notification locally
            const updatedNotifications = notifications.filter(
              (notification) => notification.id !== notificationId
            );

            set({
              notifications: updatedNotifications,
              unreadCount:
                notificationToDelete?.status === "UNREAD"
                  ? Math.max(0, unreadCount - 1)
                  : unreadCount,
            });
          }
        } catch (error) {
          console.error("Error deleting notification:", error);
          set({ error: "Failed to delete notification" });
        }
      },

      fetchUnreadCount: async (userId: number) => {
        try {
          const response = await notificationApiRequest.getUnreadCount(userId);

          if (response.payload.success) {
            set({ unreadCount: response.payload.data.unreadCount });
          }
        } catch (error) {
          console.error("Error fetching unread count:", error);
          set({ error: "Failed to fetch unread count" });
        }
      },

      // Real-time updates from socket
      addNotification: (notification: Notification) => {
        const { notifications } = get();
        set({
          notifications: [notification, ...notifications],
          unreadCount:
            get().unreadCount + (notification.status === "UNREAD" ? 1 : 0),
        });
      },

      updateNotificationStatus: (
        notificationId: number,
        status: "READ" | "UNREAD"
      ) => {
        const { notifications, unreadCount } = get();
        const updatedNotifications = notifications.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                status: status === "READ" ? ("read" as const) : status,
              }
            : notification
        );

        const oldNotification = notifications.find(
          (n) => n.id === notificationId
        );
        let newUnreadCount = unreadCount;

        if (oldNotification) {
          if (oldNotification.status === "UNREAD" && status === "READ") {
            newUnreadCount = Math.max(0, unreadCount - 1);
          } else if (oldNotification.status === "read" && status === "UNREAD") {
            newUnreadCount = unreadCount + 1;
          }
        }

        set({
          notifications: updatedNotifications,
          unreadCount: newUnreadCount,
        });
      },

      clearNotifications: () => {
        set({
          notifications: [],
          unreadCount: 0,
          pagination: {
            total: 0,
            limit: 10,
            offset: 0,
            hasMore: false,
          },
        });
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: "notification-store",
    }
  )
);
