import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/schemaValidations/chat.schema";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Check, CheckCheck, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MessageItemProps {
  message: Message;
  currentUserId: number;
  isOwnMessage: boolean;
  onEdit?: (messageId: number) => void;
  onDelete?: (messageId: number) => void;
  onReply?: (messageId: number) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  currentUserId,
  isOwnMessage,
  onEdit,
  onDelete,
  onReply,
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAvatarFallback = () => {
    const name = message?.sender?.email?.split("@")[0] || "U";
    return name.charAt(0).toUpperCase();
  };

  const isRead =
    message.readReceipts?.some(
      (receipt) => receipt.userId !== message.senderId
    ) || false;
  const isDelivered =
    message.status === "DELIVERED" || message.status === "READ";

  return (
    <div
      className={`flex gap-3 p-2 group hover:bg-gray-50 rounded-lg ${
        isOwnMessage ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {!isOwnMessage && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src="" />
          <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
            {getAvatarFallback()}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={`flex flex-col max-w-[70%] ${
          isOwnMessage ? "items-end" : "items-start"
        }`}
      >
        {message.replyToId && (
          <div
            className={`text-xs text-gray-500 mb-1 p-2 bg-gray-100 rounded border-l-2 border-gray-300 ${
              isOwnMessage ? "bg-blue-100 border-blue-300" : ""
            }`}
          >
            Replying to: {message.replyTo || "Previous message"}
          </div>
        )}

        <div
          className={`relative group/message p-3 rounded-lg max-w-full break-words ${
            isOwnMessage
              ? "bg-blue-500 text-white rounded-br-sm"
              : "bg-white border border-gray-200 rounded-bl-sm"
          }`}
        >
          {message.content}

          {/* Message options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`absolute top-1 right-1 h-6 w-6 opacity-0 group-hover/message:opacity-100 transition-opacity ${
                  isOwnMessage
                    ? "text-white hover:bg-blue-600"
                    : "text-gray-400 hover:bg-gray-100"
                }`}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onReply?.(message.id)}>
                Reply
              </DropdownMenuItem>
              {isOwnMessage && (
                <>
                  <DropdownMenuItem onClick={() => onEdit?.(message.id)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete?.(message.id)}
                    className="text-red-600"
                  >
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div
          className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
            isOwnMessage ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <span>{formatTime(message.createdAt)}</span>
          {message.editedAt && <span className="italic">(edited)</span>}
          {isOwnMessage && (
            <div className="flex items-center">
              {isRead ? (
                <CheckCheck className="h-3 w-3 text-blue-500" />
              ) : isDelivered ? (
                <CheckCheck className="h-3 w-3" />
              ) : (
                <Check className="h-3 w-3" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
