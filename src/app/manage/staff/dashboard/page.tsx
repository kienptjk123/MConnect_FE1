import { AnalyticsCharts } from "@/app/manage/staff/dashboard/components/analytics-charts";
import { RevenueChart } from "@/app/manage/staff/dashboard/components/revenue-chart";
import { StatsCards } from "@/app/manage/staff/dashboard/components/stats-cards";
import { TopMentors } from "@/app/manage/staff/dashboard/components/top-mentors";

export default function DashboardPage() {
  return (
    <>
      <div className="space-y-6 p-6">
        {/* Stats Cards */}
        <StatsCards />

        {/* Revenue Chart */}
        <RevenueChart />

        {/* Analytics Charts */}
        <AnalyticsCharts />

        {/* Top Mentors */}
        <TopMentors />
      </div>
    </>
  );
}
