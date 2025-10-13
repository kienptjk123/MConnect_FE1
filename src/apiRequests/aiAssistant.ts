import http from "@/lib/http";

// ==================== TYPES ====================

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

export interface ChatResponse {
  response: string;
  timestamp: Date;
  sessionId: string;
  metadata?: any;
  mentorName?: string;
}

export interface ScheduleData {
  id: number;
  title: string;
  description?: string;
  location?: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: string;
}

export interface TaskData {
  id: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  kanbanTitle?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MentorSuggestion {
  id: number;
  name?: string;
  bio?: string;
  major?: string;
  description?: string;
  avatar?: string;
  specialties: string[];
  matchScore: number;
  matchReason: string;
  compatibilityScore?: number;
  skillAlignment?: any;
}

export interface CourseSuggestion {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  avgRating: number;
  mentorName?: string;
  matchScore: number;
  matchReason: string;
}

export interface WorkExperienceSuggestion {
  id: number;
  title: string;
  description: string;
  skills: string[];
  duration: number;
  price: number;
  mentorName?: string;
  packageType: string;
  matchScore: number;
  matchReason: string;
}

export interface LearningRecommendation {
  id: number;
  recommendationType: string;
  entityId: number;
  entityType: string;
  title: string;
  description: string;
  reason: string;
  priority: string;
  matchScore: number;
  status: string;
  createdAt: Date;
}

export interface ProgressReport {
  id: number;
  reportType: string;
  period: string;
  startDate: Date;
  endDate: Date;
  summary: string;
  completionRate: number;
  strengthAreas: string[];
  improvementAreas: string[];
  achievements: any;
  recommendations: any;
  chartData?: any;
  createdAt: Date;
}

export interface BusinessAnalytics {
  id: number;
  period: string;
  totalRevenue: number;
  projectedRevenue: number;
  enrollmentCount: number;
  averageRating: number;
  completionRate: number;
  studentRetention: number;
  trendingTopics: string[];
  marketDemand: any;
  pricingRecommendation: any;
  growthOpportunities: any;
  competitorAnalysis?: any;
  createdAt: Date;
}

export interface ConversationHistory {
  id: number;
  userId: number;
  sessionId: string;
  role: string;
  content: string;
  metadata?: any;
  createdAt: Date;
}

// ==================== REQUEST TYPES ====================

export interface ChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
  sessionId?: string;
}

export interface MentorShadowChatRequest {
  message: string;
  sessionId?: string;
}

export interface MatchingProfileData {
  skills?: string[];
  interests?: string[];
  careerGoals?: string[];
  learningStyle?: string;
  preferredIndustries?: string[];
  workExperience?: any;
  educationBackground?: any;
  availability?: any;
  personalityTraits?: any;
  communicationStyle?: string;
}

export interface IntelligentMatchingRequest {
  skills?: string[];
  industries?: string[];
  learningStyle?: string;
  limit?: number;
}

export interface MentorSuggestionsRequest {
  preferences?: string;
  limit?: number;
}

export interface CourseSuggestionsRequest {
  learningGoals?: string;
  limit?: number;
}

export interface ComprehensiveRecommendationsRequest {
  mentorPreferences?: string;
  learningGoals?: string;
  careerGoals?: string;
}

export interface ProgressReportRequest {
  period?: "week" | "month" | "quarter";
}

export interface BusinessAnalyticsRequest {
  period?: "month" | "quarter" | "year";
}

// ==================== RESPONSE TYPES ====================

export interface ApiResponse<T> {
  message: string;
  result: T;
  timestamp: Date;
}

export interface UpcomingTasksResponse {
  tasks: TaskData[];
  schedules: ScheduleData[];
}

export interface ComprehensiveRecommendationsResponse {
  mentors: MentorSuggestion[];
  courses: CourseSuggestion[];
  workExperience: WorkExperienceSuggestion[];
  timestamp: Date;
}

export interface DeadlinesResponse {
  schedules: ScheduleData[];
  tasks: TaskData[];
  milestones: any[];
  recommendations: LearningRecommendation[];
}

export interface RevenueForecast {
  forecast: Array<{ month: string; predicted: number; confidence: number }>;
  growthRate: number;
  trends: {
    direction: "UP" | "DOWN" | "STABLE";
    seasonality: string;
  };
  risks: string[];
}

// ==================== AI ASSISTANT API FUNCTIONS ====================

const aiAssistantApiRequest = {
  // ==================== GENERAL AI CHAT ====================

  // Chat with AI virtual mentor
  chatWithAI: (body: ChatRequest) =>
    http.post<ApiResponse<ChatResponse>>("/ai/chat", body),

  // Get conversation history
  getConversationHistory: (sessionId: string) =>
    http.get<ApiResponse<ConversationHistory[]>>(
      `/ai/chat/history/${sessionId}`
    ),

  // Chat with mentor shadow AI
  chatWithMentorShadow: (
    mentorProfileId: number,
    body: MentorShadowChatRequest
  ) =>
    http.post<ApiResponse<ChatResponse>>(
      `/ai/chat/mentor-shadow/${mentorProfileId}`,
      body
    ),

  // ==================== MENTEE AI FEATURES ====================

  // AI Learning Companion
  getUpcomingTasksToday: () =>
    http.get<ApiResponse<UpcomingTasksResponse>>(
      "/mentee/ai/upcoming-tasks-today"
    ),

  testUpcomingTasksSocket: () =>
    http.post<ApiResponse<UpcomingTasksResponse>>(
      "/mentee/ai/test-upcoming-tasks-socket",
      {}
    ),

  generateLearningRecommendations: () =>
    http.post<ApiResponse<LearningRecommendation[]>>(
      "/mentee/ai/learning-recommendations",
      {}
    ),

  generateProgressReport: (body: ProgressReportRequest = {}) =>
    http.post<ApiResponse<ProgressReport>>("/mentee/ai/progress-report", body),

  getUpcomingDeadlines: () =>
    http.get<ApiResponse<DeadlinesResponse>>("/mentee/ai/upcoming-deadlines"),

  // AI Matching Assistant
  updateMatchingProfile: (body: MatchingProfileData) =>
    http.put<ApiResponse<any>>("/mentee/ai/matching-profile", body),

  intelligentMentorMatching: (body: IntelligentMatchingRequest) =>
    http.post<ApiResponse<MentorSuggestion[]>>(
      "/mentee/ai/intelligent-matching",
      body
    ),

  updateBehaviorScores: () =>
    http.post<ApiResponse<any>>("/mentee/ai/update-behavior-scores", {}),

  suggestMentors: (body: MentorSuggestionsRequest) =>
    http.post<ApiResponse<MentorSuggestion[]>>(
      "/mentee/ai/suggest-mentors",
      body
    ),

  suggestCourses: (body: CourseSuggestionsRequest) =>
    http.post<ApiResponse<CourseSuggestion[]>>(
      "/mentee/ai/suggest-courses",
      body
    ),

  getComprehensiveRecommendations: (
    body: ComprehensiveRecommendationsRequest
  ) =>
    http.post<ApiResponse<ComprehensiveRecommendationsResponse>>(
      "/mentee/ai/comprehensive-recommendations",
      body
    ),

  // ==================== MENTOR AI FEATURES ====================

  // AI Revenue & Growth Analyst
  generateBusinessAnalytics: (body: BusinessAnalyticsRequest = {}) =>
    http.post<ApiResponse<BusinessAnalytics>>(
      "/mentor/ai/business-analytics",
      body
    ),

  getRevenueForecast: () =>
    http.get<ApiResponse<RevenueForecast>>("/mentor/ai/revenue-forecast"),

  // Mentor Shadow AI Training
  trainMentorShadow: () =>
    http.post<ApiResponse<any>>("/mentor/ai/train-shadow", {}),
};

export default aiAssistantApiRequest;
