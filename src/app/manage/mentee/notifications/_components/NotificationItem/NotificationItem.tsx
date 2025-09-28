"use client";

import {
  Check,
  Trash2,
  Users,
  MessageCircle,
  BookOpen,
  Info,
  UserCheck,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Notification } from "@/schemaValidations/notifications.schema";
import { useFriendRequests } from "@/queries/useFriends";

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "FRIEND_REQUEST":
      return <Users className="w-5 h-5" />;
    case "MESSAGE":
      return <MessageCircle className="w-5 h-5" />;
    case "BLOG":
    case "COURSE":
      return <BookOpen className="w-5 h-5" />;
    default:
      return <Info className="w-5 h-5" />;
  }
};

const getNotificationColor = (type: string, priority: string) => {
  if (priority === "HIGH") return "text-red-500";
  if (priority === "NORMAL") return "text-blue-500";
  return "text-gray-500";
};

const getNotificationBgColor = (type: string) => {
  switch (type) {
    case "FRIEND_REQUEST":
      return "bg-purple-100 dark:bg-purple-900/20";
    case "MESSAGE":
      return "bg-green-100 dark:bg-green-900/20";
    case "BLOG":
      return "bg-blue-100 dark:bg-blue-900/20";
    case "COURSE":
      return "bg-orange-100 dark:bg-orange-900/20";
    default:
      return "bg-gray-100 dark:bg-gray-900/20";
  }
};

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
  onClick: (id: number, actionUrl?: string | null) => void;
  onAcceptFriend?: (notificationId: number, requestId?: number) => void;
  onRejectFriend?: (notificationId: number, requestId?: number) => void;
}

export default function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  onClick,
  onAcceptFriend,
  onRejectFriend,
}: NotificationItemProps) {
  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Recently";
    }
  };
  const request_friend = useFriendRequests();
  const friends = request_friend.data?.payload.result.requests.find(
    (friend) => friend.sender.id === notification.relatedUserId
  );

  return (
    <Card
      className={`p-4 cursor-pointer transition-all hover:shadow-md ${
        notification.status === "UNREAD"
          ? "border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10"
          : ""
      }`}
      onClick={() => onClick(notification.id, notification.actionUrl)}
    >
      <div className="flex items-start space-x-4">
        <div
          className={`p-2 rounded-full ${getNotificationBgColor(
            notification.type
          )}`}
        >
          <div
            className={getNotificationColor(
              notification.type,
              notification.priority
            )}
          >
            {getNotificationIcon(notification.type)}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3
                  className={`font-semibold ${
                    notification.status === "UNREAD"
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {notification.title}
                </h3>
                {notification.status === "UNREAD" && (
                  <Badge variant="secondary" className="text-xs">
                    New
                  </Badge>
                )}
                {notification.priority === "HIGH" && (
                  <Badge variant="destructive" className="text-xs">
                    High
                  </Badge>
                )}
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                {notification.message}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {formatTimeAgo(notification.createdAt)}
                </span>

                <Badge variant="outline" className="text-xs">
                  {notification.type.replace("_", " ")}
                </Badge>
              </div>

              {notification.type === "FRIEND_REQUEST" &&
                friends?.status !== "ACCEPTED" &&
                onAcceptFriend &&
                onRejectFriend && (
                  <div className="flex items-center space-x-2 mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      size="lg"
                      variant="default"
                      className="flex items-center cursor-pointer space-x-1 h-10 text-white px-3 bg-blue-500 hover:bg-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAcceptFriend(
                          notification.id,
                          Number(notification.relatedUserId)
                        );
                      }}
                    >
                      <UserCheck className="w-7 h-7 text-white" />
                      <span className="text-sm text-white">Accept</span>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="flex items-center cursor-pointer space-x-1 h-10 px-3 border-red-300 text-red-600 hover:text-red-600 hover:bg-red-50 hover:border-red-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRejectFriend(
                          notification.id,
                          Number(notification.relatedUserId)
                        );
                      }}
                    >
                      <UserX className="w-7 h-7" />
                      <span className="text-sm">Reject</span>
                    </Button>
                  </div>
                )}
            </div>

            <div className="flex items-center space-x-1 ml-4">
              {notification.status === "UNREAD" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id);
                  }}
                >
                  <Check className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notification.id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
