import React, { useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { UserType } from "@/schemaValidations/friends.schema";
import { Conversation } from "@/schemaValidations/chat.schema";
import { formatDistanceToNow } from "date-fns";
import { fr, vi } from "date-fns/locale";
import {
  useFriends,
  useFriendsLoading,
  useFetchFriends,
  useSetSelectedFriend,
  useSelectedFriend,
} from "@/stores/friendsStore";

// MessageSearch Component
interface MessageSearchProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

export const MessageSearch: React.FC<MessageSearchProps> = ({
  searchValue,
  onSearchChange,
  placeholder = "Search",
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

// FriendsList Component
interface FriendsListProps {
  onSelectFriend?: (friend: UserType) => void;
}

export const FriendsList: React.FC<FriendsListProps> = ({ onSelectFriend }) => {
  const friends = useFriends();
  const isLoading = useFriendsLoading();
  const fetchFriends = useFetchFriends();
  const setSelectedFriend = useSetSelectedFriend();
  const selectedFriend = useSelectedFriend();

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const handleSelectFriend = (friend: UserType) => {
    setSelectedFriend(friend);
    onSelectFriend?.(friend);
  };

  const getFriendName = (friend: UserType) => {
    if (friend.id === friend.menteeProfiles?.userId)
      return friend.menteeProfiles?.name || "Unknown User";
    if (friend.id === friend.mentorProfiles?.userId)
      return friend.mentorProfiles?.name || "Unknown User";
    if (friend.id === friend.adminProfiles?.userId)
      return friend.adminProfiles?.name || "Unknown User";
    if (friend.id === friend.StaffProfile?.userId)
      return friend.StaffProfile?.name || "Unknown User";
  };

  const getFriendAvatar = (friend: UserType) => {
    if (friend.id === friend.menteeProfiles?.userId)
      return friend.menteeProfiles?.avatar || null;
    if (friend.id === friend.mentorProfiles?.userId)
      return friend.mentorProfiles?.avatar || null;
    if (friend.id === friend.adminProfiles?.userId)
      return friend.adminProfiles?.avatar || null;
    if (friend.id === friend.StaffProfile?.userId)
      return friend.StaffProfile?.avatar || null;
  };
  const getFriendRole = (friend: UserType) => {
    return friend.role?.toLowerCase() || "user";
  };

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        <h2 className="text-lg font-semibold mb-4">Friends</h2>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center p-3 animate-pulse">
            <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
            <div className="ml-3 flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center p-4">
        <div className="text-gray-400 mb-4">
          <svg
            className="h-16 w-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No friends yet
        </h3>
        <p className="text-sm text-gray-500">
          Start connecting with other users to chat!
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex">
        <div className="p-2">
          {friends.map((friend) => (
            <div
              key={`${friend.role}-${friend.id}`}
              className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-100 ${
                selectedFriend?.id === friend.id
                  ? "bg-blue-50 border border-blue-200"
                  : ""
              }`}
              onClick={() => handleSelectFriend(friend)}
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={getFriendAvatar(friend) || undefined} />
                <AvatarFallback className="bg-blue-500 text-white">
                  {getFriendName(friend)?.slice(0, 1).toUpperCase() || "??"}
                </AvatarFallback>
              </Avatar>

              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {getFriendName(friend)}
                  </h3>
                  <Badge
                    variant={friend.role === "mentor" ? "default" : "secondary"}
                    className="text-xs capitalize bg-blue-500 text-white"
                  >
                    {getFriendRole(friend)}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
  currentUserId: number;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isSelected,
  onClick,
  currentUserId,
}) => {
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
      return otherMember?.user?.role;
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
    if (content?.length <= maxLength) return content;
    return content?.substring(0, maxLength) + "...";
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
      </div>

      <div className="ml-3 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {getDisplayName()}
            </h3>
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
        </div>
      </div>
    </div>
  );
};

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: number;
  onSelectConversation: (conversationId: number) => void;
  currentUserId: number;
  loading?: boolean;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  currentUserId,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center p-3 animate-pulse">
            <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
            <div className="ml-3 flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-gray-400 mb-2">
          <svg
            className="h-12 w-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-1">
          No conversations
        </h3>
        <p className="text-xs text-gray-500">
          Start a new conversation to get started
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isSelected={selectedConversationId === conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export { ConversationItem };
