"use client";

import { useSocket } from "@/components/SocketProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useNotificationStore } from "@/stores/notificationStore";
import { useProfileStore } from "@/stores/profileStore";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  BookOpen,
  Check,
  Info,
  MessageCircle,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

interface NotificationDropdownProps {
  className?: string;
}

export default function NotificationDropdown({
  className,
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { profile: userProfile } = useProfileStore();
  const {
    onFriendRequestReceived,
    onFriendRequestSent,
    onNotificationUpdate,
    onNotification,
  } = useSocket();
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "FRIEND_REQUEST":
        return <Users className="w-4 h-4" />;
      case "MESSAGE":
        return <MessageCircle className="w-4 h-4" />;
      case "BLOG":
      case "COURSE":
        return <BookOpen className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === "HIGH") return "text-red-500";
    if (priority === "NORMAL") return "text-blue-500";
    return "text-gray-500";
  };
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && userProfile?.id) {
      fetchNotifications(userProfile.id, { limit: 20, offset: 0 });
    }
  }, [isOpen, userProfile?.id, fetchNotifications]);

  useEffect(() => {
    if (userProfile?.id) {
      fetchUnreadCount(userProfile.id);
    }
  }, [userProfile?.id, fetchUnreadCount]);

  useEffect(() => {
    if (!userProfile?.id) return;
    const unsubscribeNotification = onNotification((data) => {
      if (data) {
        addNotification(data);
        const getToastMessage = (notification: any) => {
          switch (notification.type) {
            case "FRIEND_REQUEST":
              return {
                title: "Friend Request",
                description:
                  notification.message || "You have a new friend request",
              };
            case "MESSAGE":
              return {
                title: "New Message",
                description: notification.message || "You have a new message",
              };
            case "BLOG":
              return {
                title: "Blog Update",
                description:
                  notification.message || "New blog update available",
              };
            case "COURSE":
              return {
                title: "Course Update",
                description: notification.message || "Course update available",
              };
            default:
              return {
                title: "Notification",
                description:
                  notification.message || "You have a new notification",
              };
          }
        };

        const toastMessage = getToastMessage(data);
        toast({
          title: toastMessage.title,
          description: toastMessage.description,
          duration: 5000,
        });
      }

      // Refresh unread count
      fetchUnreadCount(userProfile.id);
    });

    // Listen for friend request received (specific event)
    const unsubscribeFriendRequestReceived = onFriendRequestReceived((data) => {
      console.log("👥 [Socket] Friend request received:", data);

      // Add notification to store if provided
      if (data.notification) {
        addNotification(data.notification);
      }

      // Show specific friend request toast
      toast({
        title: "Friend Request Received",
        description: `${data.requester || "Someone"} sent you a friend request`,
        duration: 5000,
      });

      // Refresh unread count
      fetchUnreadCount(userProfile.id);
    });

    // Listen for friend request sent confirmation
    const unsubscribeFriendRequestSent = onFriendRequestSent((data) => {
      console.log("📤 [Socket] Friend request sent:", data);

      // Show success toast
      toast({
        title: "Friend Request Sent",
        description: `Friend request sent successfully to ${
          data.receiver || "user"
        }`,
        variant: "default",
      });
    });

    // Listen for general notification updates
    const unsubscribeNotificationUpdate = onNotificationUpdate((data) => {
      console.log("🔔 [Socket] Notification update:", data);

      if (data.type === "read" && data.notificationId) {
        // Update notification status locally
        updateNotificationStatus(data.notificationId, "read");
      } else if (data.type === "new" && data.notification) {
        // Add new notification
        addNotification(data.notification);

        toast({
          title: "New Notification",
          description:
            data.notification.message || "You have a new notification",
        });
      }

      // Refresh unread count
      fetchUnreadCount(userProfile.id);
    });

    return () => {
      unsubscribeNotification();
      unsubscribeFriendRequestReceived();
      unsubscribeFriendRequestSent();
      unsubscribeNotificationUpdate();
    };
  }, [
    userProfile?.id,
    onNotification,
    onFriendRequestReceived,
    onFriendRequestSent,
    onNotificationUpdate,
    addNotification,
    updateNotificationStatus,
    fetchUnreadCount,
  ]);

  const handleNotificationClick = async (
    notificationId: number,
    actionUrl?: string | null
  ) => {
    // Mark as read if unread
    const notification = notifications.find((n) => n.id === notificationId);
    if (notification?.status === "UNREAD") {
      try {
        await markAsRead(notificationId);
      } catch (error) {
        console.error("Failed to mark as read:", error);
      }
    }

    // Navigate to action URL if exists
    if (actionUrl) {
      window.location.href = actionUrl;
    }

    setIsOpen(false);
  };

  const handleMarkAllRead = async () => {
    if (userProfile?.id && unreadCount > 0) {
      try {
        await markAllAsRead(userProfile.id);
        toast({
          title: "Success",
          description: "All notifications marked as read",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to mark all notifications as read",
          variant: "destructive",
        });
      }
    }
  };

  const handleDelete = async (e: React.MouseEvent, notificationId: number) => {
    e.stopPropagation();
    try {
      await deleteNotification(notificationId);
      toast({
        title: "Success",
        description: "Notification deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    }
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Notification Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-red-500 hover:bg-red-500"
            variant="destructive"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllRead}
                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Mark all read
                </Button>
              )}
            </div>
            {unreadCount > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Notifications List */}
          <ScrollArea className="max-h-96">
            {isLoading ? (
              <div className="px-4 py-8 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">
                  Loading notifications...
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No notifications yet
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {notifications.map((notification, index) => (
                  <div
                    key={index + 1}
                    className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                      notification.status === "UNREAD"
                        ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
                        : ""
                    }`}
                    onClick={() =>
                      handleNotificationClick(
                        notification.id,
                        notification.actionUrl
                      )
                    }
                  >
                    <div className="flex items-start space-x-3">
                      {/* Notification Icon */}
                      <div
                        className={`mt-1 ${getNotificationColor(
                          notification.type,
                          notification.priority
                        )}`}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Notification Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p
                              className={`text-sm ${
                                notification.status === "UNREAD"
                                  ? "font-semibold text-gray-900 dark:text-white"
                                  : "font-medium text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(notification.createdAt)}
                              </span>
                              {notification.priority === "HIGH" && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  High
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-1 ml-2">
                            {notification.status === "UNREAD" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-gray-400 hover:text-blue-600"
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  try {
                                    await markAsRead(notification.id);
                                    toast({
                                      title: "Success",
                                      description:
                                        "Notification marked as read",
                                    });
                                  } catch (error) {
                                    toast({
                                      title: "Error",
                                      description: "Failed to mark as read",
                                      variant: "destructive",
                                    });
                                  }
                                }}
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-gray-400 hover:text-red-600"
                              onClick={(e) => handleDelete(e, notification.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          {notifications.length > 0 && (
            <>
              <Separator />
              <div className="px-4 py-3">
                <Link href="/manage/mentor/notifications">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    onClick={() => setIsOpen(false)}
                  >
                    View all notifications
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
