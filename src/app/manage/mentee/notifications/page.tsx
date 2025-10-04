"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNotificationStore } from "@/stores/notificationStore";
import { useProfileStore } from "@/stores/profileStore";
import { useSocket } from "@/components/SocketProvider";
import { toast } from "@/components/ui/use-toast";
import { useFriendActions, useFriendRequests } from "@/queries/useFriends";
import NotificationFilters from "@/app/manage/mentee/notifications/_components/NotificationFilters/NotificationFilters";
import NotificationItem from "@/app/manage/mentee/notifications/_components/NotificationItem/NotificationItem";

export default function NotificationsPage() {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const { profile: userProfile } = useProfileStore();
  const request_friend = useFriendRequests();

  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchUnreadCount,
    addNotification,
    updateNotificationStatus,
  } = useNotificationStore();

  const {
    onNotification,
    onFriendRequestReceived,
    onNotificationUpdate,
    onNewFriendAdded,
  } = useSocket();

  const { acceptRequest, declineRequest } = useFriendActions();

  useEffect(() => {
    if (userProfile?.id) {
      const params = {
        limit: 50,
        offset: 0,
        ...(selectedType !== "all" && { type: selectedType as any }),
        ...(selectedStatus !== "all" && { status: selectedStatus as any }),
      };
      fetchNotifications(userProfile.id, params);
      fetchUnreadCount(userProfile.id);
    }
  }, [
    userProfile?.id,
    selectedType,
    selectedStatus,
    fetchNotifications,
    fetchUnreadCount,
  ]);

  useEffect(() => {
    if (!userProfile?.id) return;

    const unsubscribeNotification = onNotification((data) => {
      addNotification(data);
      const getToastMessage = (notification: any) => {
        switch (notification.type) {
          case "FRIEND_REQUEST":
            return {
              title: "Friend Request",
              description: notification.message,
            };
          case "MESSAGE":
            return { title: "New Message", description: notification.message };
          case "BLOG":
            return { title: "Blog Update", description: notification.message };
          case "COURSE":
            return {
              title: "Course Update",
              description: notification.message,
            };
          default:
            return { title: "Notification", description: notification.message };
        }
      };

      const toastMessage = getToastMessage(data);
      toast({
        title: toastMessage.title,
        description: toastMessage.description,
        duration: 5000,
      });

      fetchUnreadCount(userProfile.id);
    });

    const unsubscribeFriendRequestReceived = onFriendRequestReceived((data) => {
      if (data.notification) {
        addNotification(data.notification);
      }
      toast({
        title: "Friend Request",
        description: `${data.requester || "Someone"} sent you a friend request`,
      });
      fetchUnreadCount(userProfile.id);
    });

    const unsubscribeNewFriendAdded = onNewFriendAdded((data) => {
      toast({
        title: "New Friend",
        description: `You are now friends with ${
          data.friendName || "someone"
        }!`,
      });
      // Refresh notifications to update any related friend request notifications
      fetchNotifications(userProfile.id, {
        limit: 50,
        offset: 0,
        ...(selectedType !== "all" && { type: selectedType as any }),
        ...(selectedStatus !== "all" && { status: selectedStatus as any }),
      });
    });

    const unsubscribeNotificationUpdate = onNotificationUpdate((data) => {
      if (data.type === "read" && data.notificationId) {
        updateNotificationStatus(data.notificationId, "READ");
      }
      fetchUnreadCount(userProfile.id);
    });

    return () => {
      unsubscribeNotification();
      unsubscribeFriendRequestReceived();
      unsubscribeNewFriendAdded();
      unsubscribeNotificationUpdate();
    };
  }, [
    userProfile?.id,
    onNotification,
    onFriendRequestReceived,
    onNewFriendAdded,
    onNotificationUpdate,
    addNotification,
    updateNotificationStatus,
    fetchUnreadCount,
    fetchNotifications,
    selectedType,
    selectedStatus,
  ]);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsRead(notificationId);
      toast({
        title: "Success",
        description: "Notification marked as read",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark as read",
        variant: "destructive",
      });
    }
  };

  const handleMarkAllRead = async () => {
    if (!userProfile?.id || unreadCount === 0) return;

    try {
      await markAllAsRead(userProfile.id);
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark all as read",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (notificationId: number) => {
    try {
      await deleteNotification(notificationId);
      toast({
        title: "Success",
        description: "Notification deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    }
  };

  const handleNotificationClick = async (
    notificationId: number,
    actionUrl?: string | null
  ) => {
    const notification = notifications.find((n) => n.id === notificationId);
    if (notification?.status === "UNREAD") {
      await handleMarkAsRead(notificationId);
    }

    if (actionUrl) {
      window.open(actionUrl, "_blank");
    }
  };

  const handleAcceptFriend = async (
    notificationId: number,
    relatedUserId?: number
  ) => {
    if (!relatedUserId) {
      toast({
        title: "Error",
        description: "Friend request ID not found",
        variant: "destructive",
      });
      return;
    }
    try {
      const friends = request_friend.data?.payload.result.requests.find(
        (friend) => friend.sender.id === relatedUserId
      );
      await acceptRequest(Number(friends?.id));
      await handleMarkAsRead(notificationId);
      toast({
        title: "Success",
        description: "Friend request accepted!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept friend request",
        variant: "destructive",
      });
    }
  };

  const handleRejectFriend = async (
    notificationId: number,
    relatedUserId?: number
  ) => {
    if (!relatedUserId) {
      toast({
        title: "Error",
        description: "Friend request ID not found",
        variant: "destructive",
      });
      return;
    }

    try {
      const friends = request_friend.data?.payload.result.requests.find(
        (friend) => friend.sender.id === relatedUserId
      );
      await declineRequest(Number(friends?.id));
      await handleMarkAsRead(notificationId);
      toast({
        title: "Success",
        description: "Friend request declined",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to decline friend request",
        variant: "destructive",
      });
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    const typeMatch =
      selectedType === "all" || notification.type === selectedType;
    const statusMatch =
      selectedStatus === "all" ||
      (selectedStatus === "unread" && notification.status === "UNREAD") ||
      (selectedStatus === "read" && notification.status === "read");
    return typeMatch && statusMatch;
  });

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Bell className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Notifications
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your notifications and stay updated
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <Button onClick={handleMarkAllRead} variant="outline" size="sm">
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark All Read ({unreadCount})
            </Button>
          )}
        </div>

        <NotificationFilters
          selectedType={selectedType}
          selectedStatus={selectedStatus}
          onTypeChange={setSelectedType}
          onStatusChange={setSelectedStatus}
        />
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No notifications found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {selectedType !== "all" || selectedStatus !== "all"
                ? "Try changing your filter settings to see more notifications."
                : "You're all caught up! No new notifications."}
            </p>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
              onClick={handleNotificationClick}
              onAcceptFriend={handleAcceptFriend}
              onRejectFriend={handleRejectFriend}
            />
          ))
        )}
      </div>
    </div>
  );
}
