import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Phone, Video } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Conversation } from "@/schemaValidations/chat.schema";

interface ChatHeaderProps {
  conversation: Conversation;
  currentUserId: number;
  onArchive?: () => void;
  onLeave?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  currentUserId,
  onArchive,
  onLeave,
}) => {
  // Tìm thành viên khác (không phải current user) để hiển thị
  const otherMember = conversation.members.find(
    (member) => member.userId !== currentUserId
  );

  const getDisplayName = () => {
    if (conversation.type === "DIRECT" && otherMember) {
      return otherMember?.user?.email?.split("@")[0] || "Unknown";
    }
    return conversation.title;
  };

  const getAvatarFallback = () => {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase();
  };

  const getLastSeen = () => {
    if (conversation.type === "DIRECT" && otherMember) {
      // Tạm thời hiển thị static, sau này có thể thêm online status
      return "Last seen 7h ago";
    }
    return `${conversation.members.length} members`;
  };

  return (
    <div className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src="" />
          <AvatarFallback className="bg-gray-200 text-gray-600">
            {getAvatarFallback()}
          </AvatarFallback>
        </Avatar>

        <div>
          <h2 className="font-semibold text-gray-900">{getDisplayName()}</h2>
          <p className="text-sm text-gray-500">{getLastSeen()}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Phone className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Video className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onArchive}>
              {conversation.isArchived ? "Unarchive" : "Archive"} conversation
            </DropdownMenuItem>
            {conversation.type === "GROUP" && (
              <DropdownMenuItem onClick={onLeave} className="text-red-600">
                Leave conversation
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
