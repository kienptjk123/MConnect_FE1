import React from "react";
import { Conversation } from "@/schemaValidations/chat.schema";
import { ConversationItem } from "./ConversationItem";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: number;
  onSelectConversation: (conversationId: number) => void;
  currentUserId: number;
  loading?: boolean;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  currentUserId,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center p-3 animate-pulse">
            <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
            <div className="ml-3 flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-gray-400 mb-2">
          <svg
            className="h-12 w-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-1">
          No conversations
        </h3>
        <p className="text-xs text-gray-500">
          Start a new conversation to get started
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isSelected={selectedConversationId === conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
