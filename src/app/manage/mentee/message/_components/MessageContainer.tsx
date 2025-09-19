"use client";

import React, { useState, useEffect } from "react";
import { FriendsList } from "./FriendsList";
import { ConversationList } from "./ConversationList";
import { ChatArea } from "./ChatArea";
import { MessageSearch } from "./MessageSearch";
import { UserType } from "@/schemaValidations/friends.schema";
import {
  Conversation,
  Message,
  SendMessageBody,
} from "@/schemaValidations/chat.schema";

import {
  useGetConversations,
  useGetMessages,
  useGetInfiniteMessages,
  useSendMessage,
  useCreateConversation,
} from "@/queries/useChat";
import { useSocket } from "@/components/SocketProvider";
import {
  useProfile,
  useFetchProfile,
  useProfileLoading,
} from "@/stores/profileStore";
import { useSelectedFriend } from "@/stores/friendsStore";

export const MessageContainer: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Unread" | "Unresolved">(
    "All"
  );
  const [selectedConversationId, setSelectedConversationId] =
    useState<number>();
  const [replyToMessage, setReplyToMessage] = useState<{
    id: number;
    content: string;
    senderName: string;
  }>();
  const [showFriends, setShowFriends] = useState(true);
  const [realTimeMessages, setRealTimeMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [profileError, setProfileError] = useState<string | null>(null);

  const profile = useProfile();
  const fetchProfile = useFetchProfile();
  const isProfileLoading = useProfileLoading();
  const currentUserId = profile?.id || 0;
  const selectedFriend = useSelectedFriend();

  // Fetch profile when component mounts
  useEffect(() => {
    if (!profile && !isProfileLoading) {
      setProfileError(null);
      fetchProfile().catch((error) => {
        setProfileError("Failed to load profile. Please refresh the page.");
      });
    }
  }, [profile, isProfileLoading, fetchProfile]);

  useEffect(() => {
    const retryTimer = setTimeout(() => {
      if (!profile && !isProfileLoading && !profileError) {
        fetchProfile().catch((error) => {
          setProfileError(
            "Unable to load profile. Please check your connection and refresh."
          );
        });
      }
    }, 3000);

    return () => clearTimeout(retryTimer);
  }, []); // Run only once on mount

  const {
    socket,
    connected,
    joinConversation,
    leaveConversation,
    sendMessage: sendSocketMessage,
    onMessageReceived,
    onMessageRead,
    onTypingStart,
    onTypingStop,
    markMessageAsRead,
    startTyping,
    stopTyping,
  } = useSocket();

  const {
    data: conversationsData,
    isLoading: conversationsLoading,
    refetch: refetchConversations,
  } = useGetConversations({
    page: 1,
    limit: 20,
    search: searchValue || undefined,
  });

  const conversations = conversationsData?.payload?.result?.conversations || [];

  const {
    data: infiniteMessagesData,
    isLoading: messagesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error: messagesError,
  } = useGetInfiniteMessages(selectedConversationId || 0, 20);

  const allApiMessages =
    infiniteMessagesData?.pages.flatMap((page: any) => {
      try {
        const result = page?.payload?.result || page?.result;
        const messages = result?.messages || [];

        return Array.isArray(messages) ? messages : [];
      } catch (error) {
        console.error("❌ [MessageContainer] Error processing page:", error);
        return [];
      }
    }) || [];

  // Clean up real-time messages that are now included in API response
  useEffect(() => {
    if (allApiMessages.length > 0) {
      const apiMessageIds = new Set(allApiMessages.map((msg) => msg.id));
      setRealTimeMessages((prev) => {
        const filtered = prev.filter((msg) => !apiMessageIds.has(msg.id));
        if (filtered.length !== prev.length) {
        }
        return filtered;
      });
    }
  }, [allApiMessages.length, selectedConversationId]);

  const combinedMessages = [...allApiMessages, ...realTimeMessages];

  const uniqueMessagesMap = new Map();
  const messagesWithoutId: any[] = [];

  combinedMessages.forEach((message, index) => {
    if (message && message.id) {
      // If message already exists, prefer the one with more recent updatedAt or the API version
      const existingMessage = uniqueMessagesMap.get(message.id);
      if (
        !existingMessage ||
        new Date(message.updatedAt || message.createdAt).getTime() >=
          new Date(
            existingMessage.updatedAt || existingMessage.createdAt
          ).getTime()
      ) {
        uniqueMessagesMap.set(message.id, message);
      }
    } else if (message) {
      // Handle messages without ID (shouldn't happen but just in case)
      messagesWithoutId.push({ ...message, id: `temp-${Date.now()}-${index}` });
    }
  });

  const allMessages = [
    ...Array.from(uniqueMessagesMap.values()),
    ...messagesWithoutId,
  ].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );

  const messageListRef = React.useRef<any>(null);
  const scrollToBottom = () => {
    if (messageListRef.current?.scrollToBottom) {
      messageListRef.current.scrollToBottom();
    }
  };

  const sendMessageMutation = useSendMessage(
    selectedConversationId || 0,
    scrollToBottom
  );
  const createConversationMutation = useCreateConversation();

  const handleSendMessage = (message: SendMessageBody) => {
    if (!selectedConversationId) return;
    sendMessageMutation.mutate(message, {
      onSuccess: () => {
        setReplyToMessage(undefined);

        refetchConversations();
        setRealTimeMessages([]);
      },
    });
  };

  const handleSelectFriend = (friend: UserType) => {
    const existingConversation = conversations.find(
      (c) =>
        c.type === "DIRECT" && c.members.some((m) => m.userId === friend.id)
    );

    if (existingConversation) {
      setSelectedConversationId(existingConversation.id);
      setShowFriends(false);
    } else {
      const friendName =
        friend.menteeProfiles?.name ||
        friend.mentorProfiles?.name ||
        `User ${friend.id}`;

      createConversationMutation.mutate(
        {
          type: "DIRECT",
          title: `Chat with ${friendName}`,
          participantIds: [friend.id],
        },
        {
          onSuccess: (response) => {
            const newConversation = response.payload.result;
            setSelectedConversationId(newConversation.id);
            setShowFriends(false);
          },
          onError: (error) => {
            console.error("Failed to create conversation:", error);
          },
        }
      );
    }
  };

  const handleReply = (messageId: number) => {
    const message = allMessages.find((m: any) => m.id === messageId);
    if (message) {
      setReplyToMessage({
        id: messageId,
        content: message.content,
        senderName: message?.sender?.email?.split("@")[0] || "Unknown",
      });
    }
  };

  const handleCancelReply = () => setReplyToMessage(undefined);

  useEffect(() => {
    setRealTimeMessages([]);
  }, [selectedConversationId]);

  useEffect(() => {
    if (!connected || !selectedConversationId) return;

    joinConversation(selectedConversationId);

    const unsubscribeNewMessage = onMessageReceived((data: any) => {
      if (data.conversationId === selectedConversationId && data.message) {
        setRealTimeMessages((prev) => {
          const existingIndex = prev.findIndex((m) => m.id === data.message.id);
          if (existingIndex !== -1) {
            const updated = [...prev];
            const existingMessage = prev[existingIndex];
            const newMessageTime = new Date(
              data.message.updatedAt || data.message.createdAt
            ).getTime();
            const existingMessageTime = new Date(
              existingMessage.updatedAt || existingMessage.createdAt
            ).getTime();

            if (newMessageTime >= existingMessageTime) {
              updated[existingIndex] = data.message;
            }
            return updated;
          }

          return [...prev, data.message];
        });

        refetchConversations();
      } else if (data.conversationId !== selectedConversationId) {
        refetchConversations();
      }
    });

    let socketCleanup: (() => void) | null = null;
    if (socket) {
      const handleNewMessage = (data: any) => {
        console.log("🆕 [Socket] Direct new_message event:", data);
        refetchConversations();

        if (data.conversationId === selectedConversationId && data.message) {
          setRealTimeMessages((prev) => {
            // Check if message already exists
            const existingIndex = prev.findIndex(
              (m) => m.id === data.message.id
            );
            if (existingIndex !== -1) {
              // Update existing message if this one is newer
              const updated = [...prev];
              const existingMessage = prev[existingIndex];
              const newMessageTime = new Date(
                data.message.updatedAt || data.message.createdAt
              ).getTime();
              const existingMessageTime = new Date(
                existingMessage.updatedAt || existingMessage.createdAt
              ).getTime();

              if (newMessageTime >= existingMessageTime) {
                updated[existingIndex] = data.message;
              }
              return updated;
            }

            // Add new message
            console.log(
              "➕ [Socket] Adding new direct real-time message:",
              data.message.id
            );
            return [...prev, data.message];
          });
        }
      };

      socket.on("new_message", handleNewMessage);

      socketCleanup = () => {
        socket.off("new_message", handleNewMessage);
      };
    }

    // Listen for message read receipts
    const unsubscribeMessageRead = onMessageRead((data: any) => {
      console.log("👁️ [Socket] Message read:", data);
      // Handle read receipts - could update message read status
    });

    // Listen for typing events
    const unsubscribeTypingStart = onTypingStart((data: any) => {
      console.log("✏️ [Socket] User started typing:", data);
      if (
        data.conversationId === selectedConversationId &&
        data.userId !== currentUserId
      ) {
        setTypingUsers((prev) => ({ ...prev, [data.userId]: true }));
      }
    });

    const unsubscribeTypingStop = onTypingStop((data: any) => {
      console.log("✏️ [Socket] User stopped typing:", data);
      if (
        data.conversationId === selectedConversationId &&
        data.userId !== currentUserId
      ) {
        setTypingUsers((prev) => ({ ...prev, [data.userId]: false }));
      }
    });

    // Cleanup on unmount or conversation change
    return () => {
      leaveConversation(selectedConversationId);
      unsubscribeNewMessage();
      unsubscribeMessageRead();
      unsubscribeTypingStart();
      unsubscribeTypingStop();

      // Cleanup direct socket listener
      if (socketCleanup) {
        socketCleanup();
      }
    };
  }, [
    connected,
    selectedConversationId,
    currentUserId,
    socket,
    refetchConversations,
  ]);

  // Handle sending message via socket
  const handleSendMessageSocket = (messageBody: SendMessageBody) => {
    if (!selectedConversationId || !connected) return;

    console.log("📤 [Socket] Sending message via socket:", messageBody);

    sendSocketMessage(
      selectedConversationId,
      messageBody.content,
      messageBody.type
    );

    setReplyToMessage(undefined);
    refetchConversations();
  };

  // Auto select first conversation
  useEffect(() => {
    if (!selectedConversationId && conversations.length > 0) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  // Join/leave conversations via socket
  useEffect(() => {
    if (selectedConversationId && connected) {
      joinConversation(selectedConversationId);
      return () => leaveConversation(selectedConversationId);
    }
  }, [selectedConversationId, connected, joinConversation, leaveConversation]);

  // Filter conversations
  const filteredConversations = conversations.filter((conversation) => {
    switch (activeTab) {
      case "Unread":
        return conversation.messages?.some(
          (msg) =>
            msg.senderId !== currentUserId &&
            !msg.readReceipts?.some((r) => r.userId === currentUserId)
        );
      case "Unresolved":
        return false; // TODO: logic unresolved
      default:
        return true;
    }
  });

  // Count unread
  const unreadCount = conversations.filter((c) =>
    c.messages?.some(
      (msg) =>
        msg.senderId !== currentUserId &&
        !msg.readReceipts?.some((r) => r.userId === currentUserId)
    )
  ).length;

  // Show error state if profile failed to load
  if (profileError) {
    return (
      <div className="flex bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Profile Load Failed
          </h3>
          <p className="text-gray-600 mb-4">{profileError}</p>
          <button
            onClick={() => {
              setProfileError(null);
              fetchProfile();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show loading if profile is not loaded yet or is loading
  if (isProfileLoading || !profile || currentUserId === 0) {
    return (
      <div className="h-screen flex bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isProfileLoading ? "Loading profile..." : "Initializing..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Messages</h1>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShowFriends(true)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                showFriends
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Friends
            </button>
            <button
              onClick={() => setShowFriends(false)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                !showFriends
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Conversations
            </button>
          </div>

          <MessageSearch
            searchValue={searchValue}
            onSearchChange={setSearchValue}
          />
        </div>

        <div className="flex-1 overflow-hidden">
          {showFriends ? (
            <FriendsList onSelectFriend={handleSelectFriend} />
          ) : (
            <ConversationList
              conversations={filteredConversations as any}
              selectedConversationId={selectedConversationId}
              onSelectConversation={(conversationId) => {
                setSelectedConversationId(conversationId);
                // Auto switch to chat view when selecting conversation
                if (conversationId) {
                  console.log("Selected conversation:", conversationId);
                }
              }}
              currentUserId={currentUserId}
              loading={conversationsLoading}
            />
          )}
        </div>
      </div>

      {/* Right Area - Chat */}
      <div className="flex-1 flex flex-col">
        {selectedConversationId ? (
          <>
            <ChatArea
              ref={messageListRef}
              conversation={(selectedConversation as any) || null}
              messages={allMessages as any}
              currentUserId={currentUserId}
              onSendMessage={
                connected ? handleSendMessageSocket : handleSendMessage
              }
              loading={messagesLoading || sendMessageMutation.isPending}
              replyToMessage={replyToMessage}
              onCancelReply={handleCancelReply}
              onReply={handleReply}
              onEdit={(id) => console.log("Edit message:", id)}
              onDelete={(id) => console.log("Delete message:", id)}
              typingUsers={typingUsers}
              onStartTyping={() =>
                selectedConversationId && startTyping(selectedConversationId)
              }
              onStopTyping={() =>
                selectedConversationId && stopTyping(selectedConversationId)
              }
              onLoadMore={() => fetchNextPage()}
              hasMore={hasNextPage}
              loadingMore={isFetchingNextPage}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a friend to start chatting
              </h3>
              <p className="text-gray-500">
                Choose a friend from the sidebar to begin your conversation
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
