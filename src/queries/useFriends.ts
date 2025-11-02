"use client";

import { friendsApiRequest } from "@/apiRequests/friends";
import { notificationsApiRequest } from "@/apiRequests/notifications";
import { useSocket } from "@/components/SocketProvider";
import { useProfile } from "@/stores/profileStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();
  const profile = useProfile();
  const { sendFriendRequest: socketSendFriendRequest } = useSocket();

  return useMutation({
    mutationFn: async (data: { receiverId: number; message: string }) => {
      const response = await friendsApiRequest.sendFriendRequest(data);
      return response;
    },
    onSuccess: (data, variables) => {
      toast.success("Friend request sent successfully!");
      socketSendFriendRequest(variables.receiverId, variables.message);
      if (profile?.id) {
        notificationsApiRequest
          .sendFriendRequestNotification({
            senderId: profile.id,
            receiverId: variables.receiverId,
            message: variables.message,
          })
          .catch(console.error);
      }

      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to send friend request");
      console.error("Send friend request error:", error);
    },
  });
};

export const useHandleFriendRequest = () => {
  const queryClient = useQueryClient();
  const { acceptFriendRequest, declineFriendRequest } = useSocket();

  return useMutation({
    mutationFn: async (data: {
      requestId: number;
      action: "accept" | "decline";
    }) => {
      const response = await friendsApiRequest.handleFriendRequest(
        data.requestId,
        { action: data.action }
      );
      return response;
    },
    onSuccess: (data, variables) => {
      const actionText =
        variables.action === "accept" ? "accepted" : "declined";
      toast.success(`Friend request ${actionText} successfully!`);

      // Emit socket event
      if (variables.action === "accept") {
        acceptFriendRequest(variables.requestId);
      } else {
        declineFriendRequest(variables.requestId);
      }

      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to handle friend request");
      console.error("Handle friend request error:", error);
    },
  });
};

export const useNotifications = (limit = 20, offset = 0) => {
  const profile = useProfile();

  return useQuery({
    queryKey: ["notifications", profile?.id, limit, offset],
    queryFn: async () => {
      if (!profile?.id) {
        throw new Error("User ID not available");
      }
      const response = await notificationsApiRequest.getUserNotifications(
        profile.id
      );
      return response.payload;
    },
    enabled: !!profile?.id,
  });
};

export const useFriendActions = () => {
  const profile = useProfile();
  const sendFriendRequest = useSendFriendRequest();
  const handleFriendRequest = useHandleFriendRequest();
  const notifications = useNotifications();

  const sendRequest = async (
    receiverId: number,
    message = "Hi, let's connect!"
  ) => {
    if (!profile?.id) {
      toast.error("Please login to send friend requests");
      return;
    }

    if (receiverId === profile.id) {
      toast.error("You cannot send a friend request to yourself");
      return;
    }

    return sendFriendRequest.mutateAsync({ receiverId, message });
  };

  const acceptRequest = async (requestId: number) => {
    return handleFriendRequest.mutateAsync({ requestId, action: "accept" });
  };

  const declineRequest = async (requestId: number) => {
    return handleFriendRequest.mutateAsync({ requestId, action: "decline" });
  };

  return {
    notifications: notifications.data,
    notificationsLoading: notifications.isLoading,
    notificationsError: notifications.error,

    sendRequest,
    acceptRequest,
    declineRequest,

    isSending: sendFriendRequest.isPending,
    isHandling: handleFriendRequest.isPending,

    refetchNotifications: notifications.refetch,
  };
};

export const useFriendRequests = () => {
  return useQuery({
    queryKey: ["friendRequests"],
    queryFn: friendsApiRequest.getFriendRequests,
  });
};

export const useFriends = () => {
  return useQuery({
    queryKey: ["friends"],
    queryFn: friendsApiRequest.getFriends,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
