import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/components/SocketProvider";
import { chatKeys } from "./useChat";

export function useChatSocket() {
  const {
    connected,
    onMessageReceived,
    onMessageRead,
    onTypingStart,
    onTypingStop,
    joinConversation,
    leaveConversation,
    markMessageAsRead,
  } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!connected) return;

    // Listen for new messages
    const unsubscribeMessage = onMessageReceived((data) => {
      console.log("New message received:", data);

      // Invalidate conversations list to update last message
      queryClient.invalidateQueries({
        queryKey: chatKeys.conversations(),
      });

      // Invalidate specific conversation messages
      if (data.conversationId) {
        queryClient.invalidateQueries({
          queryKey: chatKeys.messages(data.conversationId),
        });

        // Invalidate conversation detail
        queryClient.invalidateQueries({
          queryKey: chatKeys.conversation(data.conversationId),
        });
      }
    });

    // Listen for message read receipts
    const unsubscribeRead = onMessageRead((data) => {
      console.log("Message read:", data);

      if (data.conversationId) {
        queryClient.invalidateQueries({
          queryKey: chatKeys.messages(data.conversationId),
        });

        queryClient.invalidateQueries({
          queryKey: chatKeys.conversations(),
        });
      }
    });

    // Listen for typing indicators
    const unsubscribeTypingStart = onTypingStart((data) => {
      console.log("User started typing:", data);
      // TODO: Update UI to show typing indicator
    });

    const unsubscribeTypingStop = onTypingStop((data) => {
      console.log("User stopped typing:", data);
      // TODO: Update UI to hide typing indicator
    });

    // Cleanup listeners
    return () => {
      unsubscribeMessage();
      unsubscribeRead();
      unsubscribeTypingStart();
      unsubscribeTypingStop();
    };
  }, [
    connected,
    onMessageReceived,
    onMessageRead,
    onTypingStart,
    onTypingStop,
    queryClient,
  ]);

  return {
    connected,
    joinConversation,
    leaveConversation,
    markMessageAsRead,
  };
}
