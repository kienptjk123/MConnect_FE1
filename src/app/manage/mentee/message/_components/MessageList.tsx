import React, {
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Message } from "@/schemaValidations/chat.schema";
import { MessageItem } from "./MessageItem";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MessageListProps {
  messages: Message[];
  currentUserId: number;
  loading?: boolean;
  onEdit?: (messageId: number) => void;
  onDelete?: (messageId: number) => void;
  onReply?: (messageId: number) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
}

export interface MessageListRef {
  scrollToBottom: () => void;
}

export const MessageList = forwardRef<MessageListRef, MessageListProps>(
  (
    {
      messages,
      currentUserId,
      loading = false,
      onEdit,
      onDelete,
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

    // Expose scrollToBottom function to parent
    useImperativeHandle(
      ref,
      () => ({
        scrollToBottom: () => {
          if (scrollRef.current) {
            shouldScrollToBottom.current = true;
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          }
        },
      }),
      []
    );

    // Auto scroll to bottom when new messages arrive (only if user is at bottom)
    useEffect(() => {
      if (scrollRef.current && shouldScrollToBottom.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, [messages]);

    // Scroll to bottom function (called when sending new message)
    const scrollToBottom = useCallback(() => {
      if (scrollRef.current) {
        shouldScrollToBottom.current = true;
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, []);

    // Handle mouse wheel scrolling
    const handleWheel = useCallback(
      (e: React.WheelEvent) => {
        if (scrollRef.current) {
          const container = scrollRef.current;
          const scrollTop = container.scrollTop;
          const scrollHeight = container.scrollHeight;
          const clientHeight = container.clientHeight;

          // Determine if user should be at bottom for auto-scroll
          const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;
          shouldScrollToBottom.current = isNearBottom;

          // Load more messages when scrolling to top
          if (scrollTop === 0 && hasMore && !loadingMore && onLoadMore) {
            prevScrollHeight.current = scrollHeight;
            onLoadMore();
          }
        }
      },
      [hasMore, loadingMore, onLoadMore]
    );

    // Maintain scroll position when loading more messages
    useEffect(() => {
      if (scrollRef.current && prevScrollHeight.current > 0) {
        const newScrollHeight = scrollRef.current.scrollHeight;
        const scrollDiff = newScrollHeight - prevScrollHeight.current;
        scrollRef.current.scrollTop = scrollDiff;
        prevScrollHeight.current = 0;
      }
    }, [messages.length]);

    // Handle scroll events
    const handleScroll = useCallback(
      (e: React.UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;

        // Update auto-scroll behavior based on scroll position
        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;
        shouldScrollToBottom.current = isNearBottom;

        // Load more when scrolling to top
        if (scrollTop === 0 && hasMore && !loadingMore && onLoadMore) {
          prevScrollHeight.current = scrollHeight;
          onLoadMore();
        }
      },
      [hasMore, loadingMore, onLoadMore]
    );

    if (loading) {
      return (
        <div className="flex-1 p-4 space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex gap-3 animate-pulse">
              <div className="h-8 w-8 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-16 bg-gray-200 rounded-lg w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (messages.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-gray-400 mb-2">
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
              No messages yet
            </h3>
            <p className="text-gray-500">
              Start the conversation by sending a message
            </p>
          </div>
        </div>
      );
    }

    const sortedMessages = [...messages].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return (
      <ScrollArea
        className="flex-1 px-4 h-full  overflow-y-auto"
        ref={scrollRef}
        onWheel={handleWheel}
        onScroll={handleScroll}
      >
        <div className="space-y-2 py-4">
          {loadingMore && (
            <div className="flex justify-center py-2">
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-sm">Loading more messages...</span>
              </div>
            </div>
          )}

          {sortedMessages.map((message, index) => (
            <MessageItem
              key={message.id || `message-${index}-${message.createdAt}`}
              message={message}
              currentUserId={currentUserId}
              isOwnMessage={message.senderId === currentUserId}
              onEdit={onEdit}
              onDelete={onDelete}
              onReply={onReply}
            />
          ))}
        </div>
      </ScrollArea>
    );
  }
);

MessageList.displayName = "MessageList";
