import http from "@/lib/http";

export interface DashboardStatsResponse {
  message: string;
  result: {
    totalUsers: {
      value: string;
      change: string;
      changeText: string;
      trend: "up" | "down";
    };
    totalCourses: {
      value: string;
      change: string;
      changeText: string;
      trend: "up" | "down";
    };
    totalRevenue: {
      value: string;
      change: string;
      changeText: string;
      trend: "up" | "down";
    };
    totalMentors: {
      value: string;
      change: string;
      changeText: string;
      trend: "up" | "down";
    };
  };
}

export interface RevenueChartData {
  name: string;
  value: number;
}

export interface RevenueChartResponse {
  message: string;
  result: RevenueChartData[];
}

export interface CourseOverviewData {
  name: string;
  value1: number;
  value2: number;
}

export interface CourseSalesData {
  name: string;
  value: number;
}

export interface AnalyticsChartsResponse {
  message: string;
  result: {
    courseOverview: CourseOverviewData[];
    courseSales: {
      data: CourseSalesData[];
      totalEarnings: number;
    };
  };
}

export interface TopMentorData {
  name: string;
  courses: number;
  rating: number;
  avatar: string;
}

export interface TrendData {
  name: string;
  value: number;
}

export interface FinancialSummaryData {
  totalSpent: string;
  change: string;
  status: string;
  trendData: Array<{
    name: string;
    value: number;
  }>;
  currentAmount: number;
}

export interface TopMentorsResponse {
  message: string;
  result: {
    mentors: TopMentorData[];
    trendData: TrendData[];
    totalSpent: number;
    growthPercentage: number;
  };
}

export interface RecentActivity {
  id: number;
  studentName: string;
  amount: number;
  date: string;
}

export interface DashboardOverviewResponse {
  message: string;
  result: {
    recentActivities: {
      enrollments: Array<RecentActivity & { courseName: string }>;
      payments: RecentActivity[];
    };
    growthMetrics: {
      userGrowth: string;
      newUsersThisMonth: number;
      totalActiveUsers: number;
    };
  };
}

const dashboardApiRequest = {
  /**
   * Get dashboard statistics (total users, courses, revenue, mentors)
   */
  getStats: () => http.get<DashboardStatsResponse>("/dashboard/stats"),

  /**
   * Get revenue chart data
   * @param period - 'month' or 'year'
   */
  getRevenueChart: (period?: "month" | "year") =>
    http.get<RevenueChartResponse>(
      `/dashboard/revenue-chart${period ? `?period=${period}` : ""}`
    ),

  /**
   * Get analytics charts data (course overview & sales)
   * @param period - 'week' or 'month'
   */
  getAnalyticsCharts: (period?: "week" | "month") =>
    http.get<AnalyticsChartsResponse>(
      `/dashboard/analytics-charts${period ? `?period=${period}` : ""}`
    ),

  /**
   * Get top mentors data and financial summary
   */
  getTopMentors: (period?: "week" | "month") =>
    http.get<TopMentorsResponse>(
      `/dashboard/top-mentors${period ? `?period=${period}` : ""}`
    ),

  /**
   * Get dashboard overview with recent activities
   */
  getOverview: () => http.get<DashboardOverviewResponse>("/dashboard/overview"),
};

export default dashboardApiRequest;
