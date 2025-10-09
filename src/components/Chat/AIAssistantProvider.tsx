import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useProfile } from "@/hooks/useProfile";
import aiAssistantApiRequest, {
  ChatMessage,
  ConversationHistory,
} from "@/apiRequests/aiAssistant";

// API Status tracking
interface APIStatus {
  isOnline: boolean;
  lastChecked: Date;
  error?: string;
}

// ==================== TYPES ====================

interface AIAssistantContextType {
  // State
  isVisible: boolean;
  isMinimized: boolean;
  isLoading: boolean;
  currentSession: string | null;
  sessions: Record<string, AISession>;

  // Actions
  showAssistant: () => void;
  hideAssistant: () => void;
  toggleMinimize: () => void;
  sendMessage: (message: string, sessionId?: string) => Promise<void>;
  createNewSession: (
    type: "general" | "mentor_shadow" | "learning" | "business"
  ) => string;
  switchSession: (sessionId: string) => void;
  clearSession: (sessionId: string) => void;

  // Quick Actions
  getUpcomingTasks: () => Promise<void>;
  generateLearningRecommendations: () => Promise<void>;
  generateProgressReport: () => Promise<void>;
  getBusinessAnalytics: () => Promise<void>;
  getRevenueForecast: () => Promise<void>;
}

interface AISession {
  id: string;
  title: string;
  type: "general" | "mentor_shadow" | "learning" | "business";
  messages: ChatMessage[];
  createdAt: Date;
  lastActivity: Date;
  metadata?: any;
}

interface AIAssistantProviderProps {
  children: React.ReactNode;
}

// ==================== CONTEXT ====================

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(
  undefined
);

export const useAIAssistant = () => {
  const context = useContext(AIAssistantContext);
  if (context === undefined) {
    throw new Error(
      "useAIAssistant must be used within an AIAssistantProvider"
    );
  }
  return context;
};

// ==================== PROVIDER ====================

export const AIAssistantProvider: React.FC<AIAssistantProviderProps> = ({
  children,
}) => {
  const profile = useProfile();
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Record<string, AISession>>({});
  const [apiStatus, setApiStatus] = useState<APIStatus>({
    isOnline: true,
    lastChecked: new Date(),
  });

  const userRole = profile?.role as "MENTEE" | "MENTOR" | undefined;

  // ==================== API STATUS CHECKING ====================

  const checkAPIStatus = useCallback(async () => {
    try {
      // Simple test call - just check if we can reach the AI chat endpoint
      const testResponse = await aiAssistantApiRequest.chatWithAI({
        message: "test",
        conversationHistory: [],
        sessionId: "status-check",
      });

      setApiStatus({
        isOnline: true,
        lastChecked: new Date(),
      });
      return true;
    } catch (error: any) {
      console.warn("AI API status check failed:", error);

      setApiStatus({
        isOnline: false,
        lastChecked: new Date(),
        error: error.message || "Service temporarily unavailable",
      });
      return false;
    }
  }, []);

  // ==================== INITIALIZATION ====================

  useEffect(() => {
    // Initialize default session when user profile is loaded
    if (userRole && !currentSession && Object.keys(sessions).length === 0) {
      const defaultSessionId = createNewSession("general");
      setCurrentSession(defaultSessionId);

      // Add welcome message based on role
      const welcomeMessage: ChatMessage = {
        role: "assistant",
        content:
          userRole === "MENTOR"
            ? "Hello! I'm your AI business assistant. I can help you with analytics, revenue forecasting, student engagement insights, and growing your mentoring business. What would you like to explore today?\n\n💡 Try asking: 'Show me my business analytics' or 'Generate revenue forecast'"
            : "Hi there! I'm your AI learning companion. I can help you with course recommendations, mentor matching, progress tracking, study planning, and achieving your learning goals. How can I assist you today?\n\n💡 Try asking: 'What are my upcoming tasks?' or 'Help me find mentors'",
        timestamp: new Date(),
      };
      updateSession(defaultSessionId, {
        messages: [welcomeMessage],
        lastActivity: new Date(),
      });
    }
  }, [userRole, currentSession, sessions]);

  // ==================== SESSION MANAGEMENT ====================

  const createNewSession = useCallback(
    (type: "general" | "mentor_shadow" | "learning" | "business"): string => {
      const sessionId = `session_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      let title = "AI Assistant";
      switch (type) {
        case "mentor_shadow":
          title = "Mentor Shadow";
          break;
        case "learning":
          title = "Learning Assistant";
          break;
        case "business":
          title = "Business Assistant";
          break;
        default:
          title = "AI Assistant";
      }

      const newSession: AISession = {
        id: sessionId,
        title,
        type,
        messages: [],
        createdAt: new Date(),
        lastActivity: new Date(),
        metadata: {},
      };

      setSessions((prev) => ({
        ...prev,
        [sessionId]: newSession,
      }));

      return sessionId;
    },
    []
  );

  const updateSession = useCallback(
    (sessionId: string, updates: Partial<AISession>) => {
      setSessions((prev) => ({
        ...prev,
        [sessionId]: {
          ...prev[sessionId],
          ...updates,
          lastActivity: new Date(),
        },
      }));
    },
    []
  );

  const switchSession = useCallback((sessionId: string) => {
    setCurrentSession(sessionId);
  }, []);

  const clearSession = useCallback(
    (sessionId: string) => {
      setSessions((prev) => {
        const newSessions = { ...prev };
        delete newSessions[sessionId];
        return newSessions;
      });

      if (currentSession === sessionId) {
        const remainingSessions = Object.keys(sessions).filter(
          (id) => id !== sessionId
        );
        setCurrentSession(
          remainingSessions.length > 0 ? remainingSessions[0] : null
        );
      }
    },
    [currentSession, sessions]
  );

  // ==================== MESSAGE HANDLING ====================

  const sendMessage = useCallback(
    async (message: string, sessionId?: string) => {
      const targetSessionId = sessionId || currentSession;
      if (!targetSessionId || !message.trim()) return;

      const session = sessions[targetSessionId];
      if (!session) return;

      setIsLoading(true);

      try {
        // Add user message
        const userMessage: ChatMessage = {
          role: "user",
          content: message,
          timestamp: new Date(),
        };

        const updatedMessages = [...session.messages, userMessage];
        updateSession(targetSessionId, { messages: updatedMessages });

        // Call the appropriate AI endpoint based on the message content and user role
        let apiResponse: any;

        if (
          session.type === "mentor_shadow" &&
          session.metadata?.mentorProfileId
        ) {
          // Keep mentor shadow functionality as is
          apiResponse = await aiAssistantApiRequest.chatWithMentorShadow(
            session.metadata.mentorProfileId,
            { message, sessionId: targetSessionId }
          );
        } else {
          // Determine which AI endpoint to use based on message content
          try {
            if (
              message.toLowerCase().includes("task") ||
              message.toLowerCase().includes("schedule")
            ) {
              apiResponse = await aiAssistantApiRequest.getUpcomingTasksToday();
            } else if (
              message.toLowerCase().includes("mentor") &&
              userRole === "MENTEE"
            ) {
              apiResponse = await aiAssistantApiRequest.suggestMentors({
                preferences: message,
              });
            } else if (
              message.toLowerCase().includes("course") &&
              userRole === "MENTEE"
            ) {
              apiResponse = await aiAssistantApiRequest.suggestCourses({
                learningGoals: message,
              });
            } else if (
              (message.toLowerCase().includes("business") ||
                message.toLowerCase().includes("analytics")) &&
              userRole === "MENTOR"
            ) {
              apiResponse =
                await aiAssistantApiRequest.generateBusinessAnalytics();
            } else if (
              message.toLowerCase().includes("revenue") &&
              userRole === "MENTOR"
            ) {
              apiResponse = await aiAssistantApiRequest.getRevenueForecast();
            } else {
              // For general questions, use the chat API
              apiResponse = await aiAssistantApiRequest.chatWithAI({
                message,
                conversationHistory: session.messages,
                sessionId: targetSessionId,
              });
            }
          } catch (error) {
            console.warn(
              "AI endpoint error, falling back to general chat:",
              error
            );
            // Fallback to general chat if specific endpoints fail
            apiResponse = await aiAssistantApiRequest.chatWithAI({
              message,
              conversationHistory: session.messages,
              sessionId: targetSessionId,
            });
          }
        }

        // Add AI response - handle different response formats
        let responseContent = "";
        if (apiResponse.payload?.result?.response) {
          // General chat response format
          responseContent = apiResponse.payload.result.response;
        } else if (apiResponse.payload?.result) {
          // AI-processed data response format (tasks, analytics, etc.)
          responseContent =
            typeof apiResponse.payload.result === "string"
              ? apiResponse.payload.result
              : JSON.stringify(apiResponse.payload.result, null, 2);
        } else {
          responseContent = "Sorry, I couldn't process your request right now.";
        }

        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: responseContent,
          timestamp: new Date(),
        };

        updateSession(targetSessionId, {
          messages: [...updatedMessages, assistantMessage],
        });
      } catch (error: any) {
        console.error("Error sending message:", error);

        // Update API status
        setApiStatus({
          isOnline: false,
          lastChecked: new Date(),
          error: error.message || "Connection failed",
        });

        // Provide a helpful fallback response based on user role, message content, and error type
        let fallbackContent = "";

        if (error.message && error.message.includes("<!DOCTYPE")) {
          fallbackContent =
            "🔧 It looks like the AI service is not properly configured. The backend server might not be running or the routes may not be set up correctly.";
        } else if (
          error.message &&
          (error.message.includes("404") || error.message.includes("Not Found"))
        ) {
          fallbackContent =
            "🚧 The AI service endpoint was not found. This might be a temporary issue with the server configuration.";
        } else if (
          error.message &&
          (error.message.includes("401") || error.message.includes("403"))
        ) {
          fallbackContent =
            "🔐 Authentication issue detected. Please try logging out and logging back in.";
        } else {
          // Provide context-specific help
          if (message.toLowerCase().includes("task") && userRole === "MENTEE") {
            fallbackContent =
              "📋 I can't access your tasks right now due to a service issue. You can check your dashboard for current tasks while I get back online.";
          } else if (
            message.toLowerCase().includes("mentor") &&
            userRole === "MENTEE"
          ) {
            fallbackContent =
              "👥 I'm unable to suggest mentors at the moment. You can browse available mentors in the 'Find Mentors' section while the AI service is being restored.";
          } else if (
            message.toLowerCase().includes("business") &&
            userRole === "MENTOR"
          ) {
            fallbackContent =
              "📊 I can't generate your business analytics right now. Please check your dashboard for basic metrics while the service is being restored.";
          } else if (userRole === "MENTOR") {
            fallbackContent =
              "🤖 I'm your business assistant, but I'm currently experiencing technical difficulties. I help with analytics, revenue forecasting, and student insights. Please try again in a few minutes.";
          } else if (userRole === "MENTEE") {
            fallbackContent =
              "🤖 I'm your learning companion, but I'm currently experiencing technical difficulties. I help with study planning, mentor matching, and progress tracking. Please try again in a few minutes.";
          } else {
            fallbackContent =
              "🤖 I'm currently unable to process your request due to a technical issue. Please try again later or contact support if this persists.";
          }
        }

        // Add helpful error message first
        const errorMessage: ChatMessage = {
          role: "assistant",
          content:
            fallbackContent +
            "\n\n🎭 **Demo Mode Activated**: I'll provide sample responses to help you explore the features!",
          timestamp: new Date(),
        };

        // Get the current session messages including the user message that was just added
        const currentMessages = sessions[targetSessionId]?.messages || [];
        updateSession(targetSessionId, {
          messages: [...currentMessages, errorMessage],
        });

        // After showing error, provide a demo response
        setTimeout(async () => {
          await addDemoResponse(message, targetSessionId);
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    },
    [currentSession, sessions, userRole, updateSession]
  );

  // ==================== QUICK ACTIONS ====================

  const getUpcomingTasks = useCallback(async () => {
    if (userRole !== "MENTEE") return;

    try {
      const response = await aiAssistantApiRequest.getUpcomingTasksToday();
      const tasksSummary = `Here are your upcoming tasks: ${JSON.stringify(
        response.payload.result,
        null,
        2
      )}`;
      await sendMessage(
        `Please analyze my tasks and provide insights: ${tasksSummary}`
      );
    } catch (error) {
      console.error("Error fetching tasks:", error);

      // Add error message to chat
      if (currentSession) {
        const errorMessage: ChatMessage = {
          role: "assistant",
          content:
            "I'm sorry, I couldn't fetch your tasks right now. The AI assistant service might be temporarily unavailable. Please try again later or check if you're connected to the internet.",
          timestamp: new Date(),
        };

        updateSession(currentSession, {
          messages: [
            ...(sessions[currentSession]?.messages || []),
            errorMessage,
          ],
        });
      }
    }
  }, [userRole, sendMessage, currentSession, sessions, updateSession]);

  const generateLearningRecommendations = useCallback(async () => {
    if (userRole !== "MENTEE") return;

    try {
      const response =
        await aiAssistantApiRequest.generateLearningRecommendations();
      const recommendations = `Here are my learning recommendations: ${JSON.stringify(
        response.payload.result,
        null,
        2
      )}`;
      await sendMessage(
        `Please explain these learning recommendations: ${recommendations}`
      );
    } catch (error) {
      console.error("Error generating recommendations:", error);

      if (currentSession) {
        const errorMessage: ChatMessage = {
          role: "assistant",
          content:
            "I couldn't generate your learning recommendations at the moment. This might be due to a temporary service issue. Please try again later or ask me a general question instead.",
          timestamp: new Date(),
        };

        updateSession(currentSession, {
          messages: [
            ...(sessions[currentSession]?.messages || []),
            errorMessage,
          ],
        });
      }
    }
  }, [userRole, sendMessage, currentSession, sessions, updateSession]);

  const generateProgressReport = useCallback(async () => {
    try {
      const response = await aiAssistantApiRequest.generateProgressReport();
      const report = `Here is my progress report: ${JSON.stringify(
        response.payload.result,
        null,
        2
      )}`;
      await sendMessage(
        `Please analyze and explain my progress report: ${report}`
      );
    } catch (error) {
      console.error("Error generating progress report:", error);

      if (currentSession) {
        const errorMessage: ChatMessage = {
          role: "assistant",
          content:
            "I'm unable to generate your progress report right now. The service might be temporarily unavailable. You can try again later or ask me other questions about your learning journey.",
          timestamp: new Date(),
        };

        updateSession(currentSession, {
          messages: [
            ...(sessions[currentSession]?.messages || []),
            errorMessage,
          ],
        });
      }
    }
  }, [sendMessage, currentSession, sessions, updateSession]);

  const getBusinessAnalytics = useCallback(async () => {
    if (userRole !== "MENTOR") return;

    try {
      const response = await aiAssistantApiRequest.generateBusinessAnalytics();
      const analytics = `Here are my business analytics: ${JSON.stringify(
        response.payload.result,
        null,
        2
      )}`;
      await sendMessage(`Please analyze my business performance: ${analytics}`);
    } catch (error) {
      console.error("Error getting business analytics:", error);

      if (currentSession) {
        const errorMessage: ChatMessage = {
          role: "assistant",
          content:
            "I couldn't retrieve your business analytics at the moment. This might be due to a service interruption. Please try again later or ask me other business-related questions.",
          timestamp: new Date(),
        };

        updateSession(currentSession, {
          messages: [
            ...(sessions[currentSession]?.messages || []),
            errorMessage,
          ],
        });
      }
    }
  }, [userRole, sendMessage, currentSession, sessions, updateSession]);

  const getRevenueForecast = useCallback(async () => {
    if (userRole !== "MENTOR") return;

    try {
      const response = await aiAssistantApiRequest.getRevenueForecast();
      const forecast = `Here is my revenue forecast: ${JSON.stringify(
        response.payload.result,
        null,
        2
      )}`;
      await sendMessage(
        `Please explain my revenue forecast and provide insights: ${forecast}`
      );
    } catch (error) {
      console.error("Error getting revenue forecast:", error);

      if (currentSession) {
        const errorMessage: ChatMessage = {
          role: "assistant",
          content:
            "I'm unable to generate your revenue forecast right now. The forecasting service might be temporarily down. Please try again later or ask me other business questions.",
          timestamp: new Date(),
        };

        updateSession(currentSession, {
          messages: [
            ...(sessions[currentSession]?.messages || []),
            errorMessage,
          ],
        });
      }
    }
  }, [userRole, sendMessage, currentSession, sessions, updateSession]);

  // ==================== UI ACTIONS ====================

  const showAssistant = useCallback(() => {
    setIsVisible(true);
    setIsMinimized(false);
  }, []);

  const hideAssistant = useCallback(() => {
    setIsVisible(false);
  }, []);

  const toggleMinimize = useCallback(() => {
    setIsMinimized((prev) => !prev);
  }, []);

  // ==================== DEMO MODE RESPONSES ====================

  const getDemoResponse = useCallback(
    (message: string): string => {
      const lowerMessage = message.toLowerCase();

      if (lowerMessage.includes("task") || lowerMessage.includes("schedule")) {
        return "📋 **Demo Response**: Here are some example upcoming tasks:\n• Complete React project (Due: Tomorrow)\n• Study for algorithm exam (Due: Friday)\n• Meet with mentor Sarah (Today, 3 PM)\n\n*Note: This is a demo response. Connect to the backend to see your real tasks.*";
      }

      if (lowerMessage.includes("mentor") && userRole === "MENTEE") {
        return "👥 **Demo Response**: Based on your profile, here are some mentor suggestions:\n• John Smith - React & Node.js Expert\n• Sarah Johnson - Data Science Specialist\n• Mike Chen - Full-Stack Developer\n\n*Note: This is a demo response. Connect to the backend for real mentor recommendations.*";
      }

      if (lowerMessage.includes("business") && userRole === "MENTOR") {
        return "📊 **Demo Response**: Your business metrics:\n• Monthly Revenue: $2,400\n• Active Students: 12\n• Course Completion Rate: 85%\n• Average Rating: 4.8/5\n\n*Note: This is a demo response. Connect to the backend for real analytics.*";
      }

      if (lowerMessage.includes("revenue") && userRole === "MENTOR") {
        return "💰 **Demo Response**: Revenue forecast:\n• This Month: $2,400 (projected)\n• Next Month: $2,800 (15% growth)\n• Quarter Goal: $8,000\n\n*Note: This is a demo response. Connect to the backend for real forecasting.*";
      }

      if (userRole === "MENTOR") {
        return "👋 I'm your AI business assistant! I can help you with:\n• 📊 Business analytics and performance metrics\n• 💰 Revenue forecasting and growth insights\n• 👥 Student engagement analysis\n• 🎯 Goal setting and tracking\n\nTry asking me about your business performance or revenue forecast!\n\n*Note: Demo mode active. Connect to backend for full functionality.*";
      } else {
        return "👋 I'm your AI learning companion! I can help you with:\n• 📚 Personalized study recommendations\n• 👥 Finding the perfect mentor for your goals\n• 📅 Task planning and schedule optimization\n• 📈 Progress tracking and insights\n\nTry asking about your upcoming tasks or finding mentors!\n\n*Note: Demo mode active. Connect to backend for full functionality.*";
      }
    },
    [userRole]
  );

  // Add demo response when API is offline
  const addDemoResponse = useCallback(
    async (message: string, sessionId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate thinking time

      const demoResponse: ChatMessage = {
        role: "assistant",
        content: getDemoResponse(message),
        timestamp: new Date(),
      };

      const session = sessions[sessionId];
      if (session) {
        updateSession(sessionId, {
          messages: [...session.messages, demoResponse],
        });
      }
    },
    [getDemoResponse, sessions, updateSession]
  );

  // ==================== CONTEXT VALUE ====================

  const contextValue: AIAssistantContextType = {
    // State
    isVisible,
    isMinimized,
    isLoading,
    currentSession,
    sessions,

    // Actions
    showAssistant,
    hideAssistant,
    toggleMinimize,
    sendMessage,
    createNewSession,
    switchSession,
    clearSession,

    // Quick Actions
    getUpcomingTasks,
    generateLearningRecommendations,
    generateProgressReport,
    getBusinessAnalytics,
    getRevenueForecast,
  };

  return (
    <AIAssistantContext.Provider value={contextValue}>
      {children}
    </AIAssistantContext.Provider>
  );
};

export default AIAssistantProvider;
