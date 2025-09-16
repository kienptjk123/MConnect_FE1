"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { useProfile } from "@/stores/profileStore";

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  connectionStatus: "disconnected" | "connecting" | "connected" | "error";
  lastError: string | null;
  reinitializeSocket: () => void;
  sendFriendRequest: (receiverId: number, message: string) => void;
  acceptFriendRequest: (requestId: number) => void;
  declineFriendRequest: (requestId: number) => void;
  joinConversation: (conversationId: number) => void;
  leaveConversation: (conversationId: number) => void;
  sendMessage: (conversationId: number, content: string, type?: string) => void;
  markMessageAsRead: (conversationId: number, messageId: number) => void;
  startTyping: (conversationId: number) => void;
  stopTyping: (conversationId: number) => void;
  onMessageReceived: (callback: (data: any) => void) => () => void;
  onMessageRead: (callback: (data: any) => void) => () => void;
  onTypingStart: (callback: (data: any) => void) => () => void;
  onTypingStop: (callback: (data: any) => void) => () => void;
  onUserOnline: (callback: (data: any) => void) => () => void;
  onUserOffline: (callback: (data: any) => void) => () => void;
  onFriendRequestSent: (callback: (data: any) => void) => () => void;
  onFriendRequestReceived: (callback: (data: any) => void) => () => void;
  onNewFriendAdded: (callback: (data: any) => void) => () => void;
  onNotificationUpdate: (callback: (data: any) => void) => () => void;
  onNotification: (callback: (data: any) => void) => () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "connecting" | "connected" | "error"
  >("disconnected");
  const [lastError, setLastError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const profile = useProfile();

  const initializeSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken") ||
          document.cookie
            .split("; ")
            .find((row) => row.startsWith("accessToken"))
            ?.split("=")[1]
        : null;

    if (!token) {
      console.warn(
        "⚠️ [Socket] No token found, socket will remain disconnected"
      );
      setConnected(false);
      setConnectionStatus("disconnected");
      setLastError("Authentication required for real-time features");
      return;
    }
    if (!profile?.id) {
      console.warn(
        "⚠️ [Socket] Profile not loaded yet, skipping socket connection"
      );
      setConnected(false);
      setConnectionStatus("disconnected");
      setLastError("Profile not loaded yet");
      return;
    }

    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
    setConnectionStatus("connecting");
    setLastError(null);

    const socket = io(socketUrl, {
      auth: { token },
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000, // 20 seconds timeout
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket Successfully connected!");
      setConnected(true);
      setConnectionStatus("connected");
      setLastError(null);
    });

    socket.on("disconnect", (reason) => {
      console.warn("Socket Disconnected:", {
        reason: reason,
        socketId: socket.id,
        timestamp: new Date().toISOString(),
      });
      setConnected(false);
      setConnectionStatus("disconnected");
      setLastError(`Disconnected: ${reason}`);
    });

    socket.on("connect_error", (error: any) => {
      setConnected(false);
      setConnectionStatus("error");
      setLastError(`Connection error: ${error.message || error}`);
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log("🔄 [Socket] Reconnected after", attemptNumber, "attempts");
    });

    socket.on("reconnect_attempt", (attemptNumber) => {
      console.log("🔄 [Socket] Reconnection attempt #", attemptNumber);
    });

    socket.on("reconnect_error", (error) => {
      console.error("❌ [Socket] Reconnection error:", error);
    });

    socket.on("reconnect_failed", () => {
      console.error("❌ [Socket] Reconnection failed - all attempts exhausted");
    });
    return socket;
  };

  const reinitializeSocket = () => {
    console.log("🔄 [Socket] Manual reinitialize requested");
    initializeSocket();
  };

  useEffect(() => {
    console.log("🔌 [Socket] useEffect triggered, profile state:", {
      hasProfile: !!profile,
      profileId: profile?.id,
      timestamp: new Date().toISOString(),
    });

    initializeSocket();

    return () => {
      console.log("🔌 [Socket] Cleanup - disconnecting socket");
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [profile?.id]); // Chỉ init khi profile.id thay đổi

  const sendFriendRequest = (receiverId: number, message: string) => {
    if (socketRef.current && connected) {
      socketRef.current.emit("send_friend_request", { receiverId, message });
      console.log(`Sending friend request to user: ${receiverId}`);
    }
  };

  const acceptFriendRequest = (requestId: number) => {
    if (socketRef.current && connected) {
      socketRef.current.emit("accept_friend_request", { requestId });
      console.log(`Accepting friend request: ${requestId}`);
    }
  };

  const declineFriendRequest = (requestId: number) => {
    if (socketRef.current && connected) {
      socketRef.current.emit("decline_friend_request", { requestId });
      console.log(`Declining friend request: ${requestId}`);
    }
  };

  const joinConversation = (conversationId: number) => {
    console.log("💬 [Socket] Joining conversation:", conversationId, {
      connected,
    });
    if (socketRef.current && connected) {
      socketRef.current.emit("join_conversation", { conversationId });
      console.log("✅ [Socket] Join conversation event emitted");
    } else {
      console.warn("⚠️ [Socket] Cannot join conversation - not connected");
    }
  };

  const leaveConversation = (conversationId: number) => {
    console.log("💬 [Socket] Leaving conversation:", conversationId, {
      connected,
    });
    if (socketRef.current && connected) {
      socketRef.current.emit("leave_conversation", { conversationId });
      console.log("✅ [Socket] Leave conversation event emitted");
    } else {
      console.warn("⚠️ [Socket] Cannot leave conversation - not connected");
    }
  };

  const sendMessage = (
    conversationId: number,
    content: string,
    type: string = "TEXT"
  ) => {
    console.log("💬 [Socket] Sending message:", {
      conversationId,
      content,
      type,
      connected,
    });
    if (socketRef.current && connected) {
      socketRef.current.emit("send_message", { conversationId, content, type });
      console.log("✅ [Socket] Send message event emitted");
    } else {
      console.warn("⚠️ [Socket] Cannot send message - not connected");
    }
  };

  const markMessageAsRead = (conversationId: number, messageId: number) => {
    if (socketRef.current && connected) {
      socketRef.current.emit("mark_message_as_read", {
        conversationId,
        messageId,
      });
      console.log(`Marking message as read: ${messageId}`);
    }
  };

  const startTyping = (conversationId: number) => {
    if (socketRef.current && connected) {
      socketRef.current.emit("start_typing", { conversationId });
    }
  };

  const stopTyping = (conversationId: number) => {
    if (socketRef.current && connected) {
      socketRef.current.emit("stop_typing", { conversationId });
    }
  };

  // Event listeners
  const onMessageReceived = (callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on("message_received", callback);
      return () => {
        socketRef.current?.off("message_received", callback);
      };
    }
    return () => {};
  };

  const onMessageRead = (callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on("message_read", callback);
      return () => {
        socketRef.current?.off("message_read", callback);
      };
    }
    return () => {};
  };

  const onTypingStart = (callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on("typing_start", callback);
      return () => {
        socketRef.current?.off("typing_start", callback);
      };
    }
    return () => {};
  };

  const onTypingStop = (callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on("typing_stop", callback);
      return () => {
        socketRef.current?.off("typing_stop", callback);
      };
    }
    return () => {};
  };

  const onUserOnline = (callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on("user_online", callback);
      return () => {
        socketRef.current?.off("user_online", callback);
      };
    }
    return () => {};
  };

  const onUserOffline = (callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on("user_offline", callback);
      return () => {
        socketRef.current?.off("user_offline", callback);
      };
    }
    return () => {};
  };

  // Notification event listeners
  const onFriendRequestSent = (callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on("friend_request_sent", callback);
      return () => {
        socketRef.current?.off("friend_request_sent", callback);
      };
    }
    return () => {};
  };

  const onFriendRequestReceived = (callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on("friend_request_received", callback);
      return () => {
        socketRef.current?.off("friend_request_received", callback);
      };
    }
    return () => {};
  };

  const onNewFriendAdded = (callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on("new_friend_added", callback);
      return () => {
        socketRef.current?.off("new_friend_added", callback);
      };
    }
    return () => {};
  };

  const onNotificationUpdate = (callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on("notification_update", callback);
      return () => {
        socketRef.current?.off("notification_update", callback);
      };
    }
    return () => {};
  };

  const onNotification = (callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on("notification", callback);
      return () => {
        socketRef.current?.off("notification", callback);
      };
    }
    return () => {};
  };

  const value: SocketContextType = {
    socket: socketRef.current,
    connected,
    connectionStatus,
    lastError,
    reinitializeSocket,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    joinConversation,
    leaveConversation,
    sendMessage,
    markMessageAsRead,
    startTyping,
    stopTyping,
    onMessageReceived,
    onMessageRead,
    onTypingStart,
    onTypingStop,
    onUserOnline,
    onUserOffline,
    onFriendRequestSent,
    onFriendRequestReceived,
    onNewFriendAdded,
    onNotificationUpdate,
    onNotification,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
