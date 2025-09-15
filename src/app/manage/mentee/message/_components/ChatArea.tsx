import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import {
  Conversation,
  Message,
  SendMessageBody,
} from "@/schemaValidations/chat.schema";

interface ChatAreaProps {
  conversation: Conversation | null;
  messages: Message[];
  currentUserId: number;
  onSendMessage: (message: SendMessageBody) => void;
  onArchive?: () => void;
  onLeave?: () => void;
  loading?: boolean;
  replyToMessage?: {
    id: number;
    content: string;
    senderName: string;
  };
  onCancelReply?: () => void;
  onReply?: (messageId: number) => void;
  onEdit?: (messageId: number) => void;
  onDelete?: (messageId: number) => void;
  typingUsers?: { [key: number]: boolean };
  onStartTyping?: () => void;
  onStopTyping?: () => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
}

export interface ChatAreaRef {
  scrollToBottom: () => void;
}

export const ChatArea = forwardRef<ChatAreaRef, ChatAreaProps>(
  (
    {
      conversation,
      messages,
      currentUserId,
      onSendMessage,
      onArchive,
      onLeave,
      loading = false,
      replyToMessage,
      onCancelReply,
      onReply,
      onEdit,
      onDelete,
      typingUsers,
      onStartTyping,
      onStopTyping,
      onLoadMore,
      hasMore = false,
      loadingMore = false,
    },
    ref
  ) => {
    const messageListRef = useRef<any>(null);

    useImperativeHandle(
      ref,
      () => ({
        scrollToBottom: () => {
          if (messageListRef.current?.scrollToBottom) {
            messageListRef.current.scrollToBottom();
          }
        },
      }),
      []
    );
    if (!conversation) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="h-24 w-24 mx-auto"
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome to Messages
            </h2>
            <p className="text-gray-600">
              Select a conversation to start messaging
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col bg-white">
        <ChatHeader
          conversation={conversation}
          currentUserId={currentUserId}
          onArchive={onArchive}
          onLeave={onLeave}
        />

        <MessageList
          ref={messageListRef}
          messages={messages}
          currentUserId={currentUserId}
          loading={loading}
          onEdit={onEdit}
          onDelete={onDelete}
          onReply={onReply}
          onLoadMore={onLoadMore}
          hasMore={hasMore}
          loadingMore={loadingMore}
        />

        <MessageInput
          onSendMessage={onSendMessage}
          disabled={loading}
          replyToMessage={replyToMessage}
          onCancelReply={onCancelReply}
          onStartTyping={onStartTyping}
          onStopTyping={onStopTyping}
        />
      </div>
    );
  }
);

ChatArea.displayName = "ChatArea";
