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

    const unsubscribeMessage = onMessageReceived((data) => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.conversations(),
      });

      if (data.conversationId) {
        queryClient.invalidateQueries({
          queryKey: chatKeys.messages(data.conversationId),
        });

        queryClient.invalidateQueries({
          queryKey: chatKeys.conversation(data.conversationId),
        });
      }
    });

    const unsubscribeRead = onMessageRead((data) => {
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
      // TODO: Update UI to show typing indicator
    });

    const unsubscribeTypingStop = onTypingStop((data) => {
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
