"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/components/SocketProvider";
import { UserPlus, UserMinus } from "lucide-react";

interface FollowButtonProps {
  targetUserId: string | number;
  initialFollowState?: boolean;
  className?: string;
}

export function FollowButton({
  targetUserId,
  initialFollowState = false,
  className = "",
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowState);
  const [isLoading, setIsLoading] = useState(false);
  const { socket } = useSocket();

  console.log(socket ? "Socket connected" : "Socket not connected");
  useEffect(() => {
    if (socket) {
      socket.on("follow_status_updated", (data: any) => {
        if (data.targetUserId === targetUserId) {
          setIsFollowing(data.isFollowing);
        }
      });

      // Listen for new followers
      socket.on("new_follower", (data: any) => {
        if (data.followedUserId === targetUserId) {
          console.log(`New follower for user ${targetUserId}:`, data);
        }
      });

      return () => {
        socket.off("follow_status_updated");
        socket.off("new_follower");
      };
    }
  }, [socket, targetUserId]);

  const handleFollowToggle = async () => {
    if (!socket || isLoading) return;

    setIsLoading(true);

    try {
      if (isFollowing) {
        // Unfollow
        socket.emit("unfollow_user", { targetUserId });
        console.log(`Attempting to unfollow user: ${targetUserId}`);
      } else {
        // Follow
        socket.emit("follow_user", { targetUserId });
        console.log(`Attempting to follow user: ${targetUserId}`);
      }

      // Optimistically update the state
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error toggling follow status:", error);
      // Revert state if error occurs
      setIsFollowing(isFollowing);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleFollowToggle}
      disabled={isLoading || !socket}
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      className={className}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
      ) : (
        <>
          {isFollowing ? (
            <>
              <UserMinus className="w-4 h-4 mr-1" />
              Unfollow
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-1" />
              Follow
            </>
          )}
        </>
      )}
    </Button>
  );
}
