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
  Star,
  ArrowRight,
  Award,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
} from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useAIAssistant } from "./AIAssistantProvider";
import Image from "next/image";
import { motion } from "framer-motion";
import FloatingBee from "@/components/FloatingBee/FloatingBee";
import Link from "next/link";
// ==================== TYPES ====================

interface AIAssistantEnhancedProps {
  className?: string;
}

interface MentorMatch {
  id: number;
  name: string;
  bio: string;
  major: string;
  slug: string;
  avatar: string;
  matchScore: number;
  matchReason: string;
}

interface CourseMatch {
  id: number;
  title: string;
  description: string;
  slug: string;
  price: number;
  avgRating: number;
  mentorName: string;
  matchScore: number;
  matchReason: string;
}

interface ScheduleItem {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

// ==================== HELPER FUNCTIONS ====================

const parseAIResponse = (content: string) => {
  try {
    // Try to parse as JSON array (mentor/course recommendations)
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Check if it's mentors or courses or schedules
      if (parsed[0].major) {
        return { type: "mentors", data: parsed as MentorMatch[] };
      } else if (parsed[0].matchReason) {
        return { type: "courses", data: parsed as CourseMatch[] };
      } else if (parsed[0].startTime && parsed[0].endTime) {
        return { type: "schedules", data: parsed as ScheduleItem[] };
      }
    }
    // Single schedule object
    if (parsed && parsed.startTime && parsed.endTime) {
      return { type: "schedules", data: [parsed] as ScheduleItem[] };
    }
  } catch (e) {
    // Not JSON, regular text
  }
  return { type: "text", data: content };
};

// ==================== MARKDOWN RENDERER ====================

const MentorCard: React.FC<{ mentor: MentorMatch }> = ({ mentor }) => {
  return (
    <Link href={`/manage/mentee/explore-mentor/${mentor.slug}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer mb-3"
      >
        <div className="flex items-start gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={mentor.avatar}
              alt={mentor.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-sm text-foreground truncate">
                {mentor.name}
              </h4>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Award className="w-3 h-3 text-green-600 dark:text-green-400" />
                <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                  {mentor.matchScore}%
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-1">{mentor.bio}</p>
            <p className="text-xs font-medium text-primary">{mentor.major}</p>
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {mentor.matchReason}
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </div>
      </motion.div>
    </Link>
  );
};

const CourseCard: React.FC<{ course: CourseMatch }> = ({ course }) => {
  return (
    <Link href={`/manage/mentee/explore-courses/${course.slug}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer mb-3"
      >
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-sm text-foreground line-clamp-1">
                {course.title}
              </h4>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 rounded-full flex-shrink-0">
                <Award className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {course.matchScore}%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{course.avgRating}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {course.mentorName}
              </span>
              <span className="text-xs font-semibold text-primary">
                {Number(course.price).toLocaleString("vi-VN")} đ
              </span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {course.matchReason}
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </div>
      </motion.div>
    </Link>
  );
};

const ScheduleCard: React.FC<{ schedule: ScheduleItem }> = ({ schedule }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return {
          icon: CheckCircle2,
          color: "text-green-600 dark:text-green-400",
          bg: "bg-green-100 dark:bg-green-900/30",
          label: "Active",
        };
      case "COMPLETED":
        return {
          icon: CheckCircle2,
          color: "text-blue-600 dark:text-blue-400",
          bg: "bg-blue-100 dark:bg-blue-900/30",
          label: "Completed",
        };
      case "CANCELLED":
        return {
          icon: AlertCircle,
          color: "text-red-600 dark:text-red-400",
          bg: "bg-red-100 dark:bg-red-900/30",
          label: "Cancelled",
        };
      case "PENDING":
        return {
          icon: PauseCircle,
          color: "text-yellow-600 dark:text-yellow-400",
          bg: "bg-yellow-100 dark:bg-yellow-900/30",
          label: "Pending",
        };
      default:
        return {
          icon: Clock,
          color: "text-gray-600 dark:text-gray-400",
          bg: "bg-gray-100 dark:bg-gray-900/30",
          label: status,
        };
    }
  };

  const statusConfig = getStatusConfig(schedule.status);
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-all mb-3"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-base text-foreground mb-1">
            {schedule.title}
          </h4>
          <p className="text-sm text-muted-foreground">
            {schedule.description}
          </p>
        </div>
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 ${statusConfig.bg} rounded-full ml-3`}
        >
          <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
          <span className={`text-xs font-semibold ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Date */}
        <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Date</p>
            <p className="text-sm font-semibold text-foreground truncate">
              {formatDate(schedule.date)}
            </p>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Time</p>
            <p className="text-sm font-semibold text-foreground">
              {schedule.startTime} - {schedule.endTime}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-purple-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Location</p>
            <p className="text-sm font-semibold text-foreground truncate">
              {schedule.location}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const EnhancedMarkdownMessage: React.FC<{ content: string }> = ({
  content,
}) => {
  const parsed = parseAIResponse(content);

  // Render mentor recommendations
  if (parsed.type === "mentors") {
    const mentors = parsed.data as MentorMatch[];
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Recommended Mentors for You</h3>
        </div>
        {mentors.map((mentor) => (
          <MentorCard key={mentor.id} mentor={mentor} />
        ))}
      </div>
    );
  }

  // Render course recommendations
  if (parsed.type === "courses") {
    const courses = parsed.data as CourseMatch[];
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Recommended Courses for You</h3>
        </div>
        {courses.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    );
  }

  // Render schedule items
  if (parsed.type === "schedules") {
    const schedules = parsed.data as ScheduleItem[];
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">
            {schedules.length > 1 ? "Your Schedule" : "Schedule Details"}
          </h3>
        </div>
        {schedules.map((schedule) => (
          <ScheduleCard key={schedule.id} schedule={schedule} />
        ))}
      </div>
    );
  }

  // For text content, use MarkdownMessage for full markdown support
  return <MarkdownMessage content={parsed.data as string} />;
};

const MarkdownMessage: React.FC<{ content: string }> = ({ content }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const parseMarkdown = (text: string) => {
    const parts: React.ReactNode[] = [];
    let keyCounter = 0;

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

    // List items and numbered lists
    const lines = remaining.split("\n");
    const result: React.ReactNode[] = [];

    lines.forEach((line, idx) => {
      // Handle bullet list (- item)
      if (line.trim().startsWith("- ")) {
        result.push(
          <div key={`list-${idx}`} className="flex items-start gap-2 my-1">
            <span className="text-primary mt-1">•</span>
            <span>{line.trim().slice(2)}</span>
          </div>
        );
      }
      // Handle numbered list (1. item, 2. item, etc.)
      else if (/^\d+\.\s/.test(line.trim())) {
        const match = line.trim().match(/^(\d+)\.\s(.+)$/);
        if (match) {
          const number = match[1];
          const content = match[2];

          // Process bold text in numbered items
          const contentParts = content.split("**");
          const processedContent = contentParts.map((part, pIdx) => {
            if (pIdx % 2 === 1) {
              return (
                <strong key={`bold-${keyCounter++}`} className="font-semibold">
                  {part}
                </strong>
              );
            }
            return part;
          });

          result.push(
            <div key={`number-${idx}`} className="flex items-start gap-2 my-2">
              <span className="font-semibold text-primary flex-shrink-0">
                {number}.
              </span>
              <span className="text-sm">{processedContent}</span>
            </div>
          );
        }
      }
      // Handle bullet point with * (from AI responses)
      else if (line.trim().startsWith("*") && !line.trim().startsWith("**")) {
        const content = line.trim().substring(1).trim();

        // Process bold text in bullet items
        const contentParts = content.split("**");
        const processedContent = contentParts.map((part, pIdx) => {
          if (pIdx % 2 === 1) {
            return (
              <strong key={`bold-${keyCounter++}`} className="font-semibold">
                {part}
              </strong>
            );
          }
          return part;
        });

        result.push(
          <div
            key={`bullet-${idx}`}
            className="flex items-start gap-2 my-2 ml-2"
          >
            <span className="text-primary mt-1 flex-shrink-0">•</span>
            <span className="text-sm">{processedContent}</span>
          </div>
        );
      }
      // Regular text
      else {
        // Replace placeholders
        let processedLine = line;
        parts.forEach((part) => {
          const key = (part as any).key;
          processedLine = processedLine.replace(`__PLACEHOLDER_${key}__`, "");
        });

        if (processedLine.trim()) {
          result.push(
            <p key={`line-${idx}`} className="my-1">
              {processedLine}
            </p>
          );
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

  const handleNewSession = (
    type: "general" | "mentor_shadow" | "learning" | "business"
  ) => {
    const newSessionId = createNewSession(type);
    switchSession(newSessionId);
  };

  const renderMessage = (message: ChatMessage, index: number) => {
    const isUser = message.role === "user";
    console.log("cjeck", message.content);
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
                  <EnhancedMarkdownMessage content={message.content} />
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

  return (
    <div className={`absolute bottom-0 right-0 z-50 ${className}`}>
      <div
        onClick={showAssistant}
        className={`fixed bottom-0 right-0 transition-all duration-500   ${
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
        className={`fixed bottom-4 right-4 z-50 transition-all duration-500 ${
          isVisible ? "h-[580px] w-[420px]" : "h-[64px] w-[64px] opacity-0"
        }`}
      >
        <Card
          className={`shadow-2xl border-0 bg-background rounded-3xl backdrop-blur-xl transition-all duration-500 overflow-hidden ${
            isVisible
              ? "h-[580px] w-[420px] opacity-100 scale-100"
              : "h-[64px] w-[64px] opacity-90 scale-95 cursor-pointer"
          }`}
        >
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
          {!isMinimized && (
            <CardContent className="p-0 flex flex-col h-[calc(580px-73px)] ">
              <ScrollArea className="flex-1 px-4 overflow-scroll ">
                <div className="py-4">
                  {currentSessionData?.messages.map((message, index) =>
                    renderMessage(message, index)
                  )}

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
