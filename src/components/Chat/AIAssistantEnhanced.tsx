"use client";

import type { ChatMessage } from "@/apiRequests/aiAssistant";
import { useSocket } from "@/components/SocketProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useProfile } from "@/hooks/useProfile";
import {
  BookOpen,
  Brain,
  Calendar,
  Check,
  Copy,
  DollarSign,
  Loader2,
  Maximize2,
  Minimize2,
  Plus,
  Send,
  Settings,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useAIAssistant } from "./AIAssistantProvider";
import Image from "next/image";
import { motion } from "framer-motion";
import FloatingBee from "@/components/FloatingBee/FloatingBee";
// ==================== TYPES ====================

interface AIAssistantEnhancedProps {
  className?: string;
}

// ==================== MARKDOWN RENDERER ====================

const MarkdownMessage: React.FC<{ content: string }> = ({ content }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Simple markdown parser
  const parseMarkdown = (text: string) => {
    const parts: React.ReactNode[] = [];
    let keyCounter = 0;

    // Code blocks
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    let lastIndex = 0;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${keyCounter++}`}>
            {parseInlineMarkdown(text.slice(lastIndex, match.index))}
          </span>
        );
      }

      // Add code block
      const language = match[1] || "text";
      const code = match[2].trim();
      const blockIndex = keyCounter;
      parts.push(
        <div
          key={`code-${keyCounter++}`}
          className="my-3 rounded-lg overflow-hidden border border-border bg-muted/30"
        >
          <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
            <span className="text-xs font-mono text-muted-foreground">
              {language}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(code, blockIndex)}
              className="h-6 px-2 text-xs"
            >
              {copiedIndex === blockIndex ? (
                <>
                  <Check className="w-3 h-3 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <pre className="p-3 overflow-x-auto">
            <code className="text-xs font-mono">{code}</code>
          </pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key={`text-${keyCounter++}`}>
          {parseInlineMarkdown(text.slice(lastIndex))}
        </span>
      );
    }

    return parts.length > 0 ? parts : parseInlineMarkdown(text);
  };

  const parseInlineMarkdown = (text: string) => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyCounter = 0;

    // Bold
    remaining = remaining.replace(/\*\*(.+?)\*\*/g, (_, content) => {
      const key = `bold-${keyCounter++}`;
      parts.push(
        <strong key={key} className="font-semibold">
          {content}
        </strong>
      );
      return `__PLACEHOLDER_${key}__`;
    });

    // Inline code
    remaining = remaining.replace(/`(.+?)`/g, (_, content) => {
      const key = `code-${keyCounter++}`;
      parts.push(
        <code
          key={key}
          className="px-1.5 py-0.5 rounded bg-muted/50 text-xs font-mono border border-border"
        >
          {content}
        </code>
      );
      return `__PLACEHOLDER_${key}__`;
    });

    // List items
    const lines = remaining.split("\n");
    const result: React.ReactNode[] = [];

    lines.forEach((line, idx) => {
      if (line.trim().startsWith("- ")) {
        result.push(
          <div key={`list-${idx}`} className="flex items-start gap-2 my-1">
            <span className="text-primary mt-1">•</span>
            <span>{line.trim().slice(2)}</span>
          </div>
        );
      } else {
        // Replace placeholders
        let processedLine = line;
        parts.forEach((part) => {
          const key = (part as any).key;
          processedLine = processedLine.replace(`__PLACEHOLDER_${key}__`, "");
        });

        if (processedLine.trim()) {
          result.push(<span key={`line-${idx}`}>{processedLine}</span>);
        }
      }
    });

    return result.length > 0 ? result : remaining;
  };

  return <div className="space-y-1">{parseMarkdown(content)}</div>;
};

// ==================== COMPONENT ====================

export const AIAssistantEnhanced: React.FC<AIAssistantEnhancedProps> = ({
  className = "",
}) => {
  const profile = useProfile();
  const { socket } = useSocket();
  const {
    isVisible,
    isMinimized,
    isLoading,
    currentSession,
    sessions,
    showAssistant,
    hideAssistant,
    toggleMinimize,
    sendMessage,
    createNewSession,
    switchSession,
    clearSession,
    getUpcomingTasks,
    generateLearningRecommendations,
    generateProgressReport,
    getBusinessAnalytics,
    getRevenueForecast,
  } = useAIAssistant();

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const userRole = profile?.role as "MENTEE" | "MENTOR" | undefined;
  const currentSessionData = currentSession ? sessions[currentSession] : null;

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  // ==================== SOCKET INTEGRATION ====================

  useEffect(() => {
    if (!socket) return;

    // Listen for AI assistant updates
    socket.on(
      "ai_assistant_message",
      (data: { sessionId: string; message: ChatMessage }) => {
        // This would be used if the backend sends real-time AI responses
        console.log("Received AI message:", data);
      }
    );

    socket.on(
      "ai_assistant_typing",
      (data: { sessionId: string; isTyping: boolean }) => {
        if (data.sessionId === currentSession) {
          setIsTyping(data.isTyping);
        }
      }
    );

    return () => {
      socket.off("ai_assistant_message");
      socket.off("ai_assistant_typing");
    };
  }, [socket, currentSession]);

  // ==================== AUTO SCROLL ====================

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentSessionData?.messages]);

  // ==================== INPUT HANDLING ====================

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue.trim();
    setInputValue("");

    // Uncomment when socket is fully configured
    if (socket && currentSession) {
      socket.emit("ai_assistant_typing", {
        sessionId: currentSession,
        isTyping: false,
      });
    }

    await sendMessage(message);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    // Uncomment when socket is fully configured
    if (socket && currentSession && e.target.value) {
      socket.emit("ai_assistant_typing", {
        sessionId: currentSession,
        isTyping: true,
      });
    }
  };

  // ==================== QUICK ACTIONS ====================

  const menteeQuickActions = [
    {
      label: "Upcoming Tasks",
      icon: Calendar,
      action: getUpcomingTasks,
      description: "Get today's tasks and schedule",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      label: "Learning Plan",
      icon: BookOpen,
      action: generateLearningRecommendations,
      description: "Get personalized learning recommendations",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      label: "Progress Report",
      icon: TrendingUp,
      action: generateProgressReport,
      description: "View your learning progress",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      label: "Find Mentors",
      icon: Brain,
      action: () =>
        sendMessage("Help me find suitable mentors based on my learning goals"),
      description: "Get mentor recommendations",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  const mentorQuickActions = [
    {
      label: "Business Analytics",
      icon: TrendingUp,
      action: getBusinessAnalytics,
      description: "View your business performance",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      label: "Revenue Forecast",
      icon: DollarSign,
      action: getRevenueForecast,
      description: "Get revenue predictions",
      gradient: "from-green-500 to-teal-500",
    },
    {
      label: "Progress Report",
      icon: Target,
      action: generateProgressReport,
      description: "View mentoring progress",
      gradient: "from-purple-500 to-violet-500",
    },
    {
      label: "Student Insights",
      icon: Brain,
      action: () =>
        sendMessage(
          "Give me insights about my students' learning patterns and engagement"
        ),
      description: "Analyze student engagement",
      gradient: "from-orange-500 to-amber-500",
    },
  ];

  const quickActions =
    userRole === "MENTOR" ? mentorQuickActions : menteeQuickActions;

  // ==================== SESSION MANAGEMENT ====================

  const handleNewSession = (
    type: "general" | "mentor_shadow" | "learning" | "business"
  ) => {
    const newSessionId = createNewSession(type);
    switchSession(newSessionId);
  };

  // ==================== RENDER HELPERS ====================

  const renderMessage = (message: ChatMessage, index: number) => {
    const isUser = message.role === "user";

    return (
      <div
        key={index}
        className={`flex ${
          isUser ? "justify-end" : "justify-start"
        } mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500`}
      >
        <div
          className={`flex ${
            isUser ? "flex-row-reverse" : "flex-row"
          } items-start gap-3 max-w-[85%]`}
        >
          {/* Avatar */}
          <div
            className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-lg ${
              isUser
                ? "bg-gradient-to-br from-blue-500 to-blue-600"
                : "bg-gradient-to-br from-purple-500 to-pink-500"
            }`}
          >
            {isUser ? (
              <User className="w-4 h-4 text-white" />
            ) : (
              <Sparkles className="w-4 h-4 text-white" />
            )}
          </div>

          {/* Message Content */}
          <div className="flex flex-col gap-1 min-w-0">
            <div
              className={`rounded-2xl px-4 py-3 shadow-sm ${
                isUser
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-sm"
                  : "bg-card border border-border rounded-tl-sm"
              }`}
            >
              {isUser ? (
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              ) : (
                <div className="text-sm leading-relaxed text-foreground">
                  <MarkdownMessage content={message.content} />
                </div>
              )}
            </div>

            {/* Timestamp */}
            <p
              className={`text-xs text-muted-foreground px-1 ${
                isUser ? "text-right" : "text-left"
              }`}
            >
              {message.timestamp
                ? new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "now"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderQuickActions = () => {
    if (!currentSessionData || currentSessionData.messages.length > 2)
      return null;

    return (
      <div className="p-4 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-semibold text-foreground">
            Quick Actions
          </h4>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={action.action}
                    disabled={isLoading}
                    className="flex items-center gap-2 h-auto p-3 hover:scale-105 transition-all duration-200 hover:shadow-md group bg-transparent"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}
                    >
                      <action.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-medium text-left flex-1">
                      {action.label}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">{action.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    );
  };

  // ==================== FLOATING TRIGGER ====================

  return (
    <div className={`fixed bottom-0 right-0 z-[9999] ${className}`}>
      <div
        onClick={showAssistant}
        className={`absolute bottom-0 right-0 transition-all duration-500  ${
          isVisible
            ? "opacity-0 scale-75 pointer-events-none"
            : "opacity-100 scale-100 cursor-pointer"
        }`}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div onClick={showAssistant}>
                <FloatingBee />
              </div>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="font-medium">AI Assistant</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div
        className={`transition-all relative duration-500 rounded-2xl ${
          isVisible
            ? "opacity-100 scale-100"
            : "opacity-0 scale-90 pointer-events-none"
        }`}
      >
        <Card className="w-[420px] h-[680px] shadow-2xl border-0 bg-background  rounded-3xl backdrop-blur-xl animate-in slide-in-from-bottom-8 duration-500">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r  rounded-t-3xl  from-blue-500 via-purple-500 to-pink-500 text-white relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse" />

            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">
                  {userRole === "MENTOR"
                    ? "Business Assistant"
                    : "Learning Assistant"}
                </h3>
                {currentSessionData && (
                  <p className="text-xs opacity-90 font-medium">
                    {currentSessionData.title}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 relative z-10">
              {/* Session Management */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 backdrop-blur-sm"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => handleNewSession("general")}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Chat
                  </DropdownMenuItem>
                  {userRole === "MENTEE" && (
                    <DropdownMenuItem
                      onClick={() => handleNewSession("learning")}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Learning Session
                    </DropdownMenuItem>
                  )}
                  {userRole === "MENTOR" && (
                    <>
                      <DropdownMenuItem
                        onClick={() => handleNewSession("business")}
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Business Session
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleNewSession("mentor_shadow")}
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        Mentor Shadow
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  {currentSession && (
                    <DropdownMenuItem
                      onClick={() => clearSession(currentSession)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear Session
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Minimize/Maximize */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMinimize}
                className="text-white hover:bg-white/20 backdrop-blur-sm"
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4" />
                ) : (
                  <Minimize2 className="w-4 h-4" />
                )}
              </Button>

              {/* Close */}
              <Button
                variant="ghost"
                size="sm"
                onClick={hideAssistant}
                className="text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          {!isMinimized && (
            <CardContent className="p-0 flex flex-col h-[calc(680px-73px)] ">
              {/* Quick Actions */}
              {renderQuickActions()}

              {/* Messages */}
              <ScrollArea className="flex-1 px-4 overflow-scroll ">
                <div className="py-4">
                  {currentSessionData?.messages.map((message, index) =>
                    renderMessage(message, index)
                  )}

                  {/* Typing Indicator */}
                  {(isLoading || isTyping) && (
                    <div className="flex justify-start mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                          <div className="flex items-center gap-1">
                            <div
                              className="w-2 h-2 rounded-full bg-primary animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            />
                            <div
                              className="w-2 h-2 rounded-full bg-primary animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            />
                            <div
                              className="w-2 h-2 rounded-full bg-primary animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-border bg-muted/30 backdrop-blur-sm">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder={`Ask your AI ${
                      userRole === "MENTOR" ? "business" : "learning"
                    } assistant...`}
                    value={inputValue}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="flex-1 bg-background border-border focus-visible:ring-2 focus-visible:ring-primary"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AIAssistantEnhanced;
