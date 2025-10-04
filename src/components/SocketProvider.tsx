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
  initiateCall: (
    receiverId: number,
    callType: "VOICE" | "VIDEO",
    conversationId?: number
  ) => void;
  respondToCall: (
    callId: number,
    action: "accept" | "decline",
    reason?: string
  ) => void;
  endCall: (callId: number, reason?: string) => void;
  sendWebRTCSignal: (
    callId: number,
    type: "offer" | "answer" | "ice-candidate",
    data: any
  ) => void;

  onIncomingCall: (callback: (data: any) => void) => () => void;
  onCallAccepted: (callback: (data: any) => void) => () => void;
  onCallDeclined: (callback: (data: any) => void) => () => void;
  onCallEnded: (callback: (data: any) => void) => () => void;
  onCallMissed: (callback: (data: any) => void) => () => void;
  onWebRTCSignaling: (callback: (data: any) => void) => () => void;
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
      setConnected(true);
      setConnectionStatus("connected");
      setLastError(null);

      // Debug: Listen to ALL socket events
      socket.onAny((eventName, ...args) => {
        if (eventName.includes("call")) {
        }
      });
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
    return socket;
  };

  const reinitializeSocket = () => {
    initializeSocket();
  };

  useEffect(() => {
    initializeSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [profile?.id]);

  const sendFriendRequest = (receiverId: number, message: string) => {
    if (socketRef.current && connected) {
      socketRef.current.emit("send_friend_request", { receiverId, message });
    }
  };

  const acceptFriendRequest = (requestId: number) => {
    if (socketRef.current && connected) {
      socketRef.current.emit("accept_friend_request", { requestId });
    }
  };

  const declineFriendRequest = (requestId: number) => {
    if (socketRef.current && connected) {
      socketRef.current.emit("decline_friend_request", { requestId });
    }
  };

  const joinConversation = (conversationId: number) => {
    if (socketRef.current && connected) {
      socketRef.current.emit("join_conversation", { conversationId });
    } else {
      console.warn("⚠️ [Socket] Cannot join conversation - not connected");
    }
  };

  const leaveConversation = (conversationId: number) => {
    if (socketRef.current && connected) {
      socketRef.current.emit("leave_conversation", { conversationId });
    } else {
      console.warn("⚠️ [Socket] Cannot leave conversation - not connected");
    }
  };

  const sendMessage = (
    conversationId: number,
    content: string,
    type: string = "TEXT"
  ) => {
    if (socketRef.current && connected) {
      socketRef.current.emit("send_message", { conversationId, content, type });
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
    }
  };

  const startTyping = (conversationId: number) => {
    if (socketRef.current && connected) {
      socketRef.current.emit("typing_start", { conversationId }); // ✅
    }
  };
  const stopTyping = (conversationId: number) => {
    if (socketRef.current && connected) {
      socketRef.current.emit("typing_stop", { conversationId }); // ✅
    }
  };

  // Event listeners
  const onMessageReceived = (callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on("new_message", callback); // ✅ đúng với server
      return () => socketRef.current?.off("new_message", callback);
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
    initiateCall: (
      receiverId: number,
      callType: "VOICE" | "VIDEO",
      conversationId?: number
    ) => {
      if (socketRef.current && connected) {
        socketRef.current.emit("call_initiate", {
          receiverId,
          callType,
          conversationId,
        });
      }
    },

    respondToCall: (
      callId: number,
      action: "accept" | "decline",
      reason?: string
    ) => {
      if (socketRef.current && connected) {
        socketRef.current.emit("call_response", { callId, action, reason });
      }
    },

    endCall: (callId: number, reason?: string) => {
      if (socketRef.current && connected) {
        socketRef.current.emit("call_end", { callId, reason });
      }
    },

    sendWebRTCSignal: (callId, type, data) => {
      if (socketRef.current && connected) {
        socketRef.current.emit("webrtc_signaling", { callId, type, data });
      }
    },

    // Call event listeners
    onIncomingCall: (callback: (data: any) => void) => {
      if (socketRef.current) {
        socketRef.current.on("incoming_call", (data) => {
          callback(data);
        });
        return () => {
          socketRef.current?.off("incoming_call", callback);
        };
      }
      return () => {};
    },

    onCallAccepted: (callback: (data: any) => void) => {
      if (socketRef.current) {
        socketRef.current.on("call_accepted", (data) => {
          callback(data);
        });
        return () => {
          socketRef.current?.off("call_accepted", callback);
        };
      }
      return () => {};
    },

    onCallDeclined: (callback: (data: any) => void) => {
      if (socketRef.current) {
        socketRef.current.on("call_declined", callback);
        return () => {
          socketRef.current?.off("call_declined", callback);
        };
      }
      return () => {};
    },

    onCallEnded: (callback: (data: any) => void) => {
      if (socketRef.current) {
        socketRef.current.on("call_ended", callback);
        return () => {
          socketRef.current?.off("call_ended", callback);
        };
      }
      return () => {};
    },

    onCallMissed: (callback: (data: any) => void) => {
      if (socketRef.current) {
        socketRef.current.on("call_missed", callback);
        return () => {
          socketRef.current?.off("call_missed", callback);
        };
      }
      return () => {};
    },

    onWebRTCSignaling: (callback: (data: any) => void) => {
      if (socketRef.current) {
        socketRef.current.on("webrtc_signaling", callback);
        socketRef.current.on("webrtc_offer", (d) =>
          console.log("⬅️ webrtc_offer", d)
        );
        socketRef.current.on("webrtc_answer", (d) =>
          console.log("⬅️ webrtc_answer", d)
        );
        socketRef.current.on("webrtc_ice_candidate", (d) =>
          console.log("⬅️ webrtc_ice_candidate", d)
        );
        return () => {
          socketRef.current?.off("webrtc_signaling", callback);
        };
      }
      return () => {};
    },
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
