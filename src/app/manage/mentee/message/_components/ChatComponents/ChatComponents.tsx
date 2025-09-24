import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  KeyboardEvent,
} from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  MoreHorizontal,
  Phone,
  Video,
  Send,
  Paperclip,
  Smile,
  Mic,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Conversation,
  Message,
  SendMessageBody,
} from "@/schemaValidations/chat.schema";
import {
  MessageList,
  MessageListRef,
} from "@/app/manage/mentee/message/_components/MessageCore/MessageCore";

interface ChatHeaderProps {
  conversation: Conversation;
  currentUserId: number;
  onArchive?: () => void;
  onLeave?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  currentUserId,
  onArchive,
  onLeave,
}) => {
  const otherMember = conversation.members.find(
    (member) => member.userId !== currentUserId
  );

  const getDisplayName = () => {
    if (conversation.type === "DIRECT" && otherMember) {
      return otherMember?.user?.email?.split("@")[0] || "Unknown";
    }
    return conversation.title;
  };

  const getAvatarFallback = () => {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase();
  };

  const getLastSeen = () => {
    if (conversation.type === "DIRECT" && otherMember) {
      return "Last seen 7h ago";
    }
    return `${conversation.members.length} members`;
  };

  return (
    <div className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src="" />
          <AvatarFallback className="bg-gray-200 text-gray-600">
            {getAvatarFallback()}
          </AvatarFallback>
        </Avatar>

        <div>
          <h2 className="font-semibold text-gray-900">{getDisplayName()}</h2>
          <p className="text-sm text-gray-500">{getLastSeen()}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Phone className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Video className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onArchive}>
              {conversation.isArchived ? "Unarchive" : "Archive"} conversation
            </DropdownMenuItem>
            {conversation.type === "GROUP" && (
              <DropdownMenuItem onClick={onLeave} className="text-red-600">
                Leave conversation
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

interface MessageInputProps {
  onSendMessage: (message: SendMessageBody) => void;
  placeholder?: string;
  disabled?: boolean;
  replyToMessage?: {
    id: number;
    content: string;
    senderName: string;
  };
  onCancelReply?: () => void;
  onStartTyping?: () => void;
  onStopTyping?: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  placeholder = "Write your message...",
  disabled = false,
  replyToMessage,
  onCancelReply,
  onStartTyping,
  onStopTyping,
}) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage({
        content: message.trim(),
        type: "TEXT",
        replyToId: replyToMessage?.id,
      });
      setMessage("");
      onCancelReply?.();
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);

    if (value.trim() && !isTyping) {
      setIsTyping(true);
      onStartTyping?.();
    } else if (!value.trim() && isTyping) {
      setIsTyping(false);
      onStopTyping?.();
    }
  };

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isTyping) {
      timeout = setTimeout(() => {
        setIsTyping(false);
        onStopTyping?.();
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [message, isTyping, onStopTyping]);

  return (
    <div className="p-4 bg-white border-t">
      {replyToMessage && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 mb-1">
                Replying to {replyToMessage.senderName}
              </p>
              <p className="text-sm text-gray-600 truncate">
                {replyToMessage.content}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancelReply}
              className="h-6 w-6 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-end space-x-2">
        <div className="flex-1 min-w-0">
          <Textarea
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[44px] max-h-32 resize-none border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            rows={1}
            style={{
              height: "auto",
              minHeight: "44px",
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = Math.min(target.scrollHeight, 128) + "px";
            }}
          />
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-gray-400 hover:text-gray-600"
            disabled={disabled}
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-gray-400 hover:text-gray-600"
            disabled={disabled}
          >
            <Smile className="h-4 w-4" />
          </Button>

          {message.trim() ? (
            <Button
              onClick={handleSend}
              disabled={disabled}
              className="h-10 w-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-gray-400 hover:text-gray-600"
              disabled={disabled}
            >
              <Mic className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

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
    const messageListRef = useRef<MessageListRef>(null);

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
      <div className="flex flex-col bg-white h-full">
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

export { ChatHeader, MessageInput };
