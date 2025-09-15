import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Conversation } from "@/schemaValidations/chat.schema";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
  currentUserId: number;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isSelected,
  onClick,
  currentUserId,
}) => {
  // Tìm thành viên khác (không phải current user) để hiển thị
  const otherMember = conversation.members.find(
    (member) => member.userId !== currentUserId
  );

  const lastMessage =
    conversation.messages && conversation.messages.length > 0
      ? conversation.messages.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0]
      : null;

  // Đếm tin nhắn chưa đọc
  const unreadCount =
    conversation.messages?.filter(
      (message) =>
        message.senderId !== currentUserId &&
        !message.readReceipts?.some(
          (receipt) => receipt.userId === currentUserId
        )
    ).length || 0;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: vi,
      });
    }
  };

  const getDisplayName = () => {
    if (conversation.type === "DIRECT" && otherMember) {
      const user = otherMember.user;
      // Ưu tiên name từ profiles
      const mentorName = user.mentorProfiles?.name;
      const menteeName = user.menteeProfiles?.name;
      return mentorName || menteeName || user?.email?.split("@")[0];
    }
    return conversation.title;
  };

  const getDisplayAvatar = () => {
    if (conversation.type === "DIRECT" && otherMember) {
      const user = otherMember.user;
      return user.mentorProfiles?.avatar || user.menteeProfiles?.avatar;
    }
    return null;
  };

  const getUserRole = () => {
    if (otherMember) {
      return otherMember?.user?.role; // "MENTOR" hoặc "MENTEE"
    }
    return null;
  };

  const getUserBio = () => {
    if (otherMember) {
      const user = otherMember.user;
      return user.mentorProfiles?.bio || user.menteeProfiles?.bio;
    }
    return null;
  };

  const getAvatarFallback = () => {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase();
  };

  const truncateMessage = (content: string, maxLength: number = 50) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors ${
        isSelected ? "bg-blue-50 border-r-2 border-blue-500" : ""
      }`}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={getDisplayAvatar() || undefined} />
          <AvatarFallback className="bg-gray-200 text-gray-600">
            {getAvatarFallback()}
          </AvatarFallback>
        </Avatar>
        {/* Online indicator - tạm thời ẩn */}
        {/* <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div> */}
      </div>

      <div className="ml-3 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {getDisplayName()}
            </h3>
            {getUserRole() && (
              <Badge
                variant={getUserRole() === "MENTOR" ? "default" : "secondary"}
                className="text-xs px-1 py-0"
              >
                {getUserRole()?.toLowerCase()}
              </Badge>
            )}
          </div>
          <span className="text-xs text-gray-500 flex-shrink-0">
            {conversation.lastMessageAt &&
              formatTime(conversation.lastMessageAt)}
          </span>
        </div>

        <div className="flex items-center justify-between mt-1">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-600 truncate">
              {lastMessage
                ? truncateMessage(lastMessage.content)
                : getUserBio()
                ? truncateMessage(getUserBio()!)
                : "No messages yet"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
