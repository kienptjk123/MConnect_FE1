"use client";
import React, { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Smile, Mic, X } from "lucide-react";
import { SendMessageBody } from "@/schemaValidations/chat.schema";

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

export const MessageInput: React.FC<MessageInputProps> = ({
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

  const handleInputChange = (value: string) => {
    setMessage(value);

    if (value.length > 0 && !isTyping) {
      setIsTyping(true);
      onStartTyping?.();
    } else if (value.length === 0 && isTyping) {
      setIsTyping(false);
      onStopTyping?.();
    }
  };

  return (
    <div className="border-t bg-white">
      {replyToMessage && (
        <div className="mb-3 p-2 bg-gray-50 border-l-2 border-blue-500 rounded flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-blue-600 font-medium mb-1">
              Replying to {replyToMessage.senderName}
            </div>
            <div className="text-sm text-gray-600 truncate">
              {replyToMessage.content}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancelReply}
            className="h-6 w-6 flex-shrink-0 ml-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex items-end justify-center space-x-2">
        <Button variant="ghost" size="icon" className="flex-shrink-0 mb-1">
          <Paperclip className="h-5 w-5" />
        </Button>

        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[40px] max-h-[120px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            rows={1}
          />

          {/* Emoji button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 bottom-1 h-8 w-8"
          >
            <Smile className="h-4 w-4" />
          </Button>
        </div>

        {/* Send/Voice button */}
        {message.trim() ? (
          <Button
            onClick={handleSend}
            disabled={disabled}
            className="flex-shrink-0 mb-1 bg-blue-500 hover:bg-blue-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="flex-shrink-0 mb-1">
            <Mic className="h-5 w-5" />
          </Button>
        )}
      </div>

      {isTyping && (
        <div className="mt-2 text-xs text-gray-500">Someone is typing...</div>
      )}
    </div>
  );
};
