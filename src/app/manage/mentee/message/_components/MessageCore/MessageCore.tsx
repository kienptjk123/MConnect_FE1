"use client";

import chatApiRequest from "@/apiRequests/chat";
import { AddMembersDialog } from "@/app/manage/mentee/message/_components/AddMemberDialog/AddMembersDialog";
import { ChatArea } from "@/app/manage/mentee/message/_components/ChatComponents/ChatComponents";
import { CreateGroupDialog } from "@/app/manage/mentee/message/_components/CreateGroupDialog/CreateGroupDialog";
import {
  ConversationList,
  FriendsList,
  MessageSearch,
} from "@/app/manage/mentee/message/_components/SidebarComponents/SidebarComponents";
import { useSocket } from "@/components/SocketProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useCreateConversation,
  useGetConversations,
  useGetInfiniteMessages,
  useSendMessage,
} from "@/queries/useChat";
import {
  CreateConversationBody,
  Message,
  SendMessageBody,
} from "@/schemaValidations/chat.schema";
import { UserType } from "@/schemaValidations/friends.schema";
import { useSelectedFriend } from "@/stores/friendsStore";
import {
  useFetchProfile,
  useProfile,
  useProfileLoading,
} from "@/stores/profileStore";
import { MoreHorizontal, UserPlus } from "lucide-react";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

// MessageItem Component
interface MessageItemProps {
  message: Message;
  currentUserId: number;
  isOwnMessage: boolean;
  isGroupChat?: boolean;
  onEdit?: (messageId: number) => void;
  onDelete?: (messageId: number) => void;
  editingMessage?: {
    id: number;
    content: string;
  } | null;
  onSaveEdit?: (newContent: string) => void;
  onCancelEdit?: () => void;
  onReply?: (messageId: number) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  currentUserId,
  isOwnMessage,
  isGroupChat = false,
  onEdit,
  onDelete,
  editingMessage,
  onSaveEdit,
  onCancelEdit,
  onReply,
}) => {
  const [editContent, setEditContent] = useState("");
  const isEditing = editingMessage?.id === message.id;

  useEffect(() => {
    if (isEditing && editingMessage) {
      setEditContent(editingMessage.content);
    }
  }, [isEditing, editingMessage]);

  const handleSaveEdit = () => {
    if (editContent.trim() && onSaveEdit) {
      onSaveEdit(editContent.trim());
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAvatarFallback = () => {
    const name = message?.sender?.email?.split("@")[0] || "U";
    return name.charAt(0).toUpperCase();
  };

  const getSenderName = () => {
    if (!message?.sender) return "Unknown User";

    // Check different profile types for the sender name
    if (message.sender.menteeProfiles?.name) {
      return message.sender.menteeProfiles.name;
    }
    if (message.sender.mentorProfiles?.name) {
      return message.sender.mentorProfiles.name;
    }
    if (message.sender.adminProfiles?.name) {
      return message.sender.adminProfiles.name;
    }
    if (message.sender.StaffProfile?.name) {
      return message.sender.StaffProfile.name;
    }

    // Fallback to email username
    return message.sender.email?.split("@")[0] || "Unknown User";
  };

  const isRead =
    message.readReceipts?.some(
      (receipt) => receipt.userId !== message.senderId
    ) || false;
  const isDelivered =
    message.status === "DELIVERED" || message.status === "READ";

  return (
    <div
      className={`flex gap-3 p-2 items-center  group hover:bg-gray-50 rounded-lg ${
        isOwnMessage ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {!isOwnMessage && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src="" />
          <AvatarFallback className="bg-gray-200 light:text-gray-600 text-xs">
            {getAvatarFallback()}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={`flex flex-col max-w-[70%] ${
          isOwnMessage ? "items-end" : "items-start"
        }`}
      >
        {message.replyToId && (
          <div
            className={`text-xs light:text-gray-500 mb-1 p-2 bg-gray-100 rounded border-l-2 border-gray-300 ${
              isOwnMessage ? "bg-blue-100 border-blue-300" : ""
            }`}
          >
            Replying to: {message.replyTo || "Previous message"}
          </div>
        )}

        {!isOwnMessage ? (
          <>
            {isGroupChat && (
              <div className="text-xs font-medium text-gray-600 mb-1 ml-1">
                {getSenderName()}
              </div>
            )}
            <div className="flex group/message items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="p-3 rounded-lg max-w-full break-words bg-white border border-gray-200 rounded-bl-sm">
                      {message.content}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    className="bg-white text-gray-800 border border-gray-200 shadow-md rounded px-2 py-1"
                    side="left"
                  >
                    <p className="text-xs  text-gray-800">
                      {formatTime(message.createdAt)}
                      {message.editedAt && " (edited)"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 mr-2 opacity-0 group-hover/message:opacity-100 transition-opacity light:text-gray-400 hover:bg-gray-100"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onReply?.(message.id)}>
                    Reply
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        ) : (
          <>
            <div className="flex group/message items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover/message:opacity-100 transition-opacity light:text-gray-400 hover:bg-gray-100"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onReply?.(message.id)}>
                    Reply
                  </DropdownMenuItem>
                  <>
                    <DropdownMenuItem onClick={() => onEdit?.(message.id)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete?.(message.id)}
                      className="text-red-600"
                    >
                      Delete
                    </DropdownMenuItem>
                  </>
                </DropdownMenuContent>
              </DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {isEditing ? (
                      <div className="p-3 rounded-lg max-w-full bg-blue-500 text-white rounded-br-sm">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="min-h-[60px] bg-blue-400 border-blue-300 text-white placeholder-blue-200 resize-none"
                          placeholder="Edit your message..."
                        />
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={handleSaveEdit}
                            className="bg-white text-blue-500 hover:bg-gray-100"
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={onCancelEdit}
                            className="text-white hover:bg-blue-400"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg max-w-full break-words bg-blue-500 text-white rounded-br-sm">
                        {message.content}
                      </div>
                    )}
                  </TooltipTrigger>
                  <TooltipContent
                    className="bg-white text-gray-800 border border-gray-200 shadow-md rounded px-2 py-1"
                    side="bottom"
                  >
                    <p className="text-xs  text-gray-800">
                      {formatTime(message.createdAt)}
                      {message.editedAt && " (edited)"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// MessageList Component
interface MessageListProps {
  messages: Message[];
  currentUserId: number;
  isGroupChat?: boolean;
  loading?: boolean;
  onEdit?: (messageId: number) => void;
  onDelete?: (messageId: number) => void;
  editingMessage?: {
    id: number;
    content: string;
  } | null;
  onSaveEdit?: (newContent: string) => void;
  onCancelEdit?: () => void;
  onReply?: (messageId: number) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
}

export interface MessageListRef {
  scrollToBottom: () => void;
}

const MessageList = forwardRef<MessageListRef, MessageListProps>(
  (
    {
      messages,
      currentUserId,
      isGroupChat = false,
      loading = false,
      onEdit,
      onDelete,
      editingMessage,
      onSaveEdit,
      onCancelEdit,
      onReply,
      onLoadMore,
      hasMore = false,
      loadingMore = false,
    },
    ref
  ) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const prevScrollHeight = useRef<number>(0);
    const shouldScrollToBottom = useRef<boolean>(true);

    useImperativeHandle(
      ref,
      () => ({
        scrollToBottom: () => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          }
        },
      }),
      []
    );

    const scrollToBottom = useCallback(() => {
      if (scrollRef.current && shouldScrollToBottom.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, []);

    const handleScroll = useCallback(() => {
      if (!scrollRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 100;
      shouldScrollToBottom.current = isAtBottom;

      if (scrollTop === 0 && hasMore && !loadingMore && onLoadMore) {
        prevScrollHeight.current = scrollHeight;
        onLoadMore();
      }
    }, [hasMore, loadingMore, onLoadMore]);

    useEffect(() => {
      const scrollElement = scrollRef.current;
      if (scrollElement) {
        scrollElement.addEventListener("scroll", handleScroll);
        return () => scrollElement.removeEventListener("scroll", handleScroll);
      }
    }, [handleScroll]);

    useEffect(() => {
      if (loadingMore && scrollRef.current) {
        const currentScrollHeight = scrollRef.current.scrollHeight;
        const heightDifference = currentScrollHeight - prevScrollHeight.current;
        scrollRef.current.scrollTop = heightDifference;
      } else {
        scrollToBottom();
      }
    }, [messages.length, loadingMore, scrollToBottom]);

    if (loading && messages.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    const shouldShowTimestamp = (current: Date, previous?: Date) => {
      if (!previous) return true;
      const diff = current.getTime() - previous.getTime();
      const diffMinutes = diff / (1000 * 60);
      return diffMinutes >= 30;
    };

    const isDifferentDay = (current: Date, previous?: Date) => {
      if (!previous) return true;
      return (
        current.getFullYear() !== previous.getFullYear() ||
        current.getMonth() !== previous.getMonth() ||
        current.getDate() !== previous.getDate()
      );
    };

    return (
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2"
        style={{ scrollBehavior: "smooth" }}
      >
        {loadingMore && (
          <div className="flex justify-center py-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        )}

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="light:text-gray-400 mb-4">
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
            <h3 className="text-lg font-medium light:text-gray-900 mb-2">
              No messages yet
            </h3>
            <p className="light:text-gray-500">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const prevMsg = index > 0 ? messages[index - 1] : undefined;
            const currentDate = new Date(msg.updatedAt);
            const prevDate = prevMsg ? new Date(prevMsg.updatedAt) : undefined;

            const showDateDivider = isDifferentDay(currentDate, prevDate);
            const showTime = shouldShowTimestamp(currentDate, prevDate);

            return (
              <div key={msg.id} className="flex flex-col">
                {showDateDivider && (
                  <div className="text-center text-xs text-gray-500 my-4">
                    {currentDate.toLocaleDateString("vi-VN", {
                      weekday: "short",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </div>
                )}

                {showTime && !showDateDivider && (
                  <div className="text-xs text-gray-400 text-center mt-1">
                    {currentDate.toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                )}

                <MessageItem
                  message={msg}
                  currentUserId={currentUserId}
                  isOwnMessage={msg.senderId === currentUserId}
                  isGroupChat={isGroupChat}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  editingMessage={editingMessage}
                  onSaveEdit={onSaveEdit}
                  onCancelEdit={onCancelEdit}
                  onReply={onReply}
                />
              </div>
            );
          })
        )}
      </div>
    );
  }
);

MessageList.displayName = "MessageList";

export const MessageContainer = () => {
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

  // Dialog states
  const [createGroupDialogOpen, setCreateGroupDialogOpen] = useState(false);
  const [addMembersDialogOpen, setAddMembersDialogOpen] = useState(false);

  // Edit message state
  const [editingMessage, setEditingMessage] = useState<{
    id: number;
    content: string;
  } | null>(null);

  const profile = useProfile();
  const fetchProfile = useFetchProfile();
  const isProfileLoading = useProfileLoading();
  const currentUserId = profile?.id || 0;
  const selectedFriend = useSelectedFriend();

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
  }, []);

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
    refetch: refetchMessages,
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
        return filtered;
      });
    }
  }, [allApiMessages.length, selectedConversationId]);

  const combinedMessages = [...allApiMessages, ...realTimeMessages];

  const uniqueMessagesMap = new Map();
  const messagesWithoutId: any[] = [];

  combinedMessages.forEach((message, index) => {
    if (message && message.id) {
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

  // Edit and Delete handlers
  const handleEditMessage = (messageId: number) => {
    const message = allMessages.find((m: any) => m.id === messageId);
    if (message) {
      setEditingMessage({
        id: messageId,
        content: message.content,
      });
    }
  };

  const handleSaveEdit = async (newContent: string) => {
    if (!editingMessage || !selectedConversationId) return;

    try {
      await chatApiRequest.editMessage(
        selectedConversationId,
        editingMessage.id,
        { content: newContent }
      );
      refetchMessages(); // Refetch messages to update the UI
      setEditingMessage(null); // Clear editing state
    } catch (error) {
      console.error("Failed to edit message:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (!selectedConversationId) return;

    try {
      await chatApiRequest.deleteMessage(selectedConversationId, messageId);
      refetchMessages(); // Refetch messages to update the UI
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  // Dialog handlers
  const handleCreateGroup = () => {
    setCreateGroupDialogOpen(true);
  };

  const handleAddMembers = () => {
    setAddMembersDialogOpen(true);
  };

  const handleCreateGroupSubmit = (data: CreateConversationBody) => {
    createConversationMutation.mutate(data, {
      onSuccess: (response) => {
        setCreateGroupDialogOpen(false);
        refetchConversations();
        // Auto-select the new conversation
        if (response.payload.result?.id) {
          setSelectedConversationId(response.payload.result.id);
        }
      },
    });
  };

  const handleAddMembersSubmit = (memberIds: number[]) => {
    if (!selectedConversationId) return;

    // We need to use the API directly here since we can't call hooks inside handlers
    chatApiRequest
      .addMembers(selectedConversationId, memberIds)
      .then(() => {
        setAddMembersDialogOpen(false);
        refetchConversations();
      })
      .catch((error: any) => {
        console.error("Failed to add members:", error);
      });
  };

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
            const existingIndex = prev.findIndex(
              (m) => m.id === data.message.id
            );
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

    const unsubscribeMessageRead = onMessageRead((data: any) => {
      console.log("👁️ [Socket] Message read:", data);
    });

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

    return () => {
      leaveConversation(selectedConversationId);
      unsubscribeNewMessage();
      unsubscribeMessageRead();
      unsubscribeTypingStart();
      unsubscribeTypingStop();

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

  const handleSendMessageSocket = (messageBody: SendMessageBody) => {
    if (!selectedConversationId || !connected) return;
    sendSocketMessage(
      selectedConversationId,
      messageBody.content,
      messageBody.type
    );

    setReplyToMessage(undefined);
    refetchConversations();
  };

  useEffect(() => {
    if (!selectedConversationId && conversations.length > 0) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  useEffect(() => {
    if (selectedConversationId && connected) {
      joinConversation(selectedConversationId);
      return () => leaveConversation(selectedConversationId);
    }
  }, [selectedConversationId, connected, joinConversation, leaveConversation]);

  const filteredConversations = conversations.filter((conversation) => {
    switch (activeTab) {
      case "Unread":
        return conversation.messages?.some(
          (msg) =>
            msg.senderId !== currentUserId &&
            !msg.readReceipts?.some((r) => r.userId === currentUserId)
        );
      case "Unresolved":
        return false;
      default:
        return true;
    }
  });

  if (profileError) {
    return (
      <div className="flex light:bg-gray-50 items-center justify-center">
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
          <h3 className="text-lg font-medium light:text-gray-900 mb-2">
            Profile Load Failed
          </h3>
          <p className="light:text-gray-600 mb-4">{profileError}</p>
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

  if (isProfileLoading || !profile || currentUserId === 0) {
    return (
      <div className="h-screen flex light:bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="light:text-gray-600">
            {isProfileLoading ? "Loading profile..." : "Initializing..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex light:bg-gray-50 overflow-hidden h-full">
      <div className="w-80 light:bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold light:text-gray-900">Messages</h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 hover:bg-blue-50 hover:text-blue-600"
                    onClick={handleCreateGroup}
                    title="Create New Group"
                  >
                    <UserPlus size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create New Group</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShowFriends(true)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                showFriends
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 light:text-gray-600 hover:bg-gray-200"
              }`}
            >
              Friends
            </button>
            <button
              onClick={() => setShowFriends(false)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                !showFriends
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 light:text-gray-600 hover:bg-gray-200"
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
              onSelectConversation={(conversationId: number) => {
                setSelectedConversationId(conversationId);
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

      <div className="flex-1 flex flex-col overflow-hidden h-full">
        {selectedConversationId ? (
          <ChatArea
            ref={messageListRef}
            conversation={(selectedConversation as any) || null}
            messages={allMessages as any}
            currentUserId={currentUserId}
            onSendMessage={
              connected ? handleSendMessageSocket : handleSendMessage
            }
            onCreateGroup={handleCreateGroup}
            onAddMembers={handleAddMembers}
            loading={messagesLoading || sendMessageMutation.isPending}
            replyToMessage={replyToMessage}
            onCancelReply={handleCancelReply}
            onReply={handleReply}
            onEdit={handleEditMessage}
            onDelete={handleDeleteMessage}
            editingMessage={editingMessage}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
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
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="light:text-gray-400 mb-4">
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
              <h3 className="text-lg font-medium light:text-gray-900 mb-2">
                Select a friend to start chatting
              </h3>
              <p className="light:text-gray-500">
                Choose a friend from the sidebar to begin your conversation
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <CreateGroupDialog
        open={createGroupDialogOpen}
        onOpenChange={setCreateGroupDialogOpen}
        onCreateGroup={handleCreateGroupSubmit}
        isLoading={createConversationMutation.isPending}
      />

      {selectedConversation && (
        <AddMembersDialog
          open={addMembersDialogOpen}
          onOpenChange={setAddMembersDialogOpen}
          conversation={selectedConversation as any}
          onAddMembers={handleAddMembersSubmit}
          isLoading={false}
        />
      )}
    </div>
  );
};

// Export MessageList for use in ChatComponents
export { MessageItem, MessageList };
