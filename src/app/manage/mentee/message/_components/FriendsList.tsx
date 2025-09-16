import React, { useEffect } from "react";
import { UserType } from "@/schemaValidations/friends.schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  useFriends,
  useFriendsLoading,
  useFetchFriends,
  useSetSelectedFriend,
  useSelectedFriend,
} from "@/stores/friendsStore";

interface FriendsListProps {
  onSelectFriend?: (friend: UserType) => void;
}

export const FriendsList: React.FC<FriendsListProps> = ({ onSelectFriend }) => {
  const friends = useFriends();
  const isLoading = useFriendsLoading();
  const fetchFriends = useFetchFriends();
  const setSelectedFriend = useSetSelectedFriend();
  const selectedFriend = useSelectedFriend();

  // Fetch friends when component mounts
  useEffect(() => {
    if (friends.length === 0 && !isLoading) {
      console.log("🚀 [FriendsList] Fetching friends on mount...");
      fetchFriends();
    }
  }, [friends.length, isLoading, fetchFriends]);

  const handleSelectFriend = (friend: UserType) => {
    setSelectedFriend(friend);
    onSelectFriend?.(friend);
  };

  const getFriendName = (friend: UserType) => {
    return (
      friend.menteeProfiles?.name ||
      friend.mentorProfiles?.name ||
      "Unknown User"
    );
  };

  const getFriendAvatar = (friend: UserType) => {
    return (
      friend.menteeProfiles?.avatar || friend.mentorProfiles?.avatar || null
    );
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
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Friends ({friends.length})</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-100 ${
                selectedFriend?.id === friend.id
                  ? "bg-blue-50 border border-blue-200"
                  : ""
              }`}
              onClick={() => handleSelectFriend(friend)}
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={getFriendAvatar(friend) || undefined} />
                <AvatarFallback className="bg-blue-500 text-white">
                  {getFriendName(friend).slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {getFriendName(friend)}
                  </h3>
                  <Badge
                    variant={
                      getFriendRole(friend) === "mentor"
                        ? "default"
                        : "secondary"
                    }
                    className="text-xs"
                  >
                    {getFriendRole(friend)}
                  </Badge>
                </div>

                <p className="text-xs text-gray-500 truncate mt-1">
                  {friend.mentorProfiles?.bio ||
                    friend.menteeProfiles?.bio ||
                    "No bio available"}
                </p>

                {/* Online status indicator */}
                <div className="flex items-center mt-2">
                  <div className="h-2 w-2 bg-green-400 rounded-full mr-1"></div>
                  <span className="text-xs text-gray-400">Online</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
