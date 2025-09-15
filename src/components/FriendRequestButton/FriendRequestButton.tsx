"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useFriendActions } from "@/queries/useFriends";
import {
  UserPlus,
  UserCheck,
  Clock,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useProfileStore } from "@/stores";
import profile from "@/apiRequests/profile";

interface FriendRequestButtonProps {
  targetUserId: number;
  targetUserName: string;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

export const FriendRequestButton: React.FC<FriendRequestButtonProps> = ({
  targetUserId,
  targetUserName,
  className = "",
  size = "default",
  variant = "default",
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [message, setMessage] = useState(
    `Hi ${targetUserName}, I'd like to connect with you!`
  );

  const { profile } = useProfileStore();
  const { sendRequest, isSending } = useFriendActions();
  if (profile?.id === targetUserId) {
    return null;
  }

  const handleSendRequest = async () => {
    if (!profile?.id) {
      toast.error("Please login to send friend requests");
      return;
    }

    try {
      await sendRequest(
        targetUserId,
        message.trim() || `Hi ${targetUserName}, let's connect!`
      );
      setIsDialogOpen(false);
      toast.success(`Friend request sent to ${targetUserName}!`);
    } catch (error) {
      console.error("Failed to send friend request:", error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className={className}
          size={size}
          variant={variant}
          disabled={isSending || !profile?.id}
        >
          {isSending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Connect
            </>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Send Friend Request
          </DialogTitle>
          <DialogDescription>
            Send a connection request to {targetUserName}. Include a personal
            message to introduce yourself.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="message" className="text-sm font-medium">
              Personal Message
            </Label>
            <Textarea
              id="message"
              placeholder={`Hi ${targetUserName}, I'd like to connect with you!`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1"
              rows={3}
              maxLength={200}
            />
            <div className="text-xs text-gray-500 mt-1">
              {message.length}/200 characters
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSendRequest}
              disabled={isSending}
              className="flex-1"
            >
              {isSending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Send Request
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Alternative simple button without dialog
export const SimpleFriendRequestButton: React.FC<FriendRequestButtonProps> = ({
  targetUserId,
  targetUserName,
  className = "",
  size = "default",
  variant = "default",
}) => {
  const { profile } = useProfileStore();
  const { sendRequest, isSending } = useFriendActions();

  // Don't show button for own profile
  if (profile?.id === targetUserId) {
    return null;
  }

  const handleSendRequest = async () => {
    if (!profile?.id) {
      toast.error("Please login to send friend requests");
      return;
    }

    try {
      await sendRequest(targetUserId, `Hi ${targetUserName}, let's connect!`);
      toast.success(`Friend request sent to ${targetUserName}!`);
    } catch (error) {
      console.error("Failed to send friend request:", error);
    }
  };

  return (
    <Button
      onClick={handleSendRequest}
      className={className}
      size={size}
      variant={variant}
      disabled={isSending || !profile?.id}
    >
      {isSending ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Sending...
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4 mr-2" />
          Connect
        </>
      )}
    </Button>
  );
};
