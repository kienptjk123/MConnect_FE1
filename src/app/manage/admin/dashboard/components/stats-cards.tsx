"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  DollarSign,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import dashboardApiRequest from "@/apiRequests/dashboard";

interface StatData {
  title: string;
  value: string;
  change: string;
  changeText: string;
  trend: "up" | "down";
  icon: any;
  color: string;
}

export function StatsCards() {
  const [stats, setStats] = useState<StatData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardApiRequest.getStats();
        const { totalUsers, totalCourses, totalRevenue, totalMentors } =
          response.payload.result;

        const statsData: StatData[] = [
          {
            title: "Total User",
            value: totalUsers.value,
            change: totalUsers.change,
            changeText: totalUsers.changeText,
            trend: totalUsers.trend,
            icon: Users,
            color: "bg-blue-500/10 text-blue-400",
          },
          {
            title: "Total Courses",
            value: totalCourses.value,
            change: totalCourses.change,
            changeText: totalCourses.changeText,
            trend: totalCourses.trend,
            icon: BookOpen,
            color: "bg-yellow-500/10 text-yellow-400",
          },
          {
            title: "Total Revenue",
            value: totalRevenue.value,
            change: totalRevenue.change,
            changeText: totalRevenue.changeText,
            trend: totalRevenue.trend,
            icon: DollarSign,
            color: "bg-green-500/10 text-green-400",
          },
          {
            title: "Total Mentor",
            value: totalMentors.value,
            change: totalMentors.change,
            changeText: totalMentors.changeText,
            trend: totalMentors.trend,
            icon: UserCheck,
            color: "bg-pink-500/10 text-pink-400",
          },
        ];

        setStats(statsData);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        // Fallback to default stats if API fails
        setStats([
          {
            title: "Total User",
            value: "402",
            change: "+8.5%",
            changeText: "Up from yesterday",
            trend: "up",
            icon: Users,
            color: "bg-blue-500/10 text-blue-400",
          },
          {
            title: "Total Courses",
            value: "102",
            change: "+1.3%",
            changeText: "Up from past week",
            trend: "up",
            icon: BookOpen,
            color: "bg-yellow-500/10 text-yellow-400",
          },
          {
            title: "Total Revenue",
            value: "$10900",
            change: "-4.3%",
            changeText: "Down from yesterday",
            trend: "down",
            icon: DollarSign,
            color: "bg-green-500/10 text-green-400",
          },
          {
            title: "Total Mentor",
            value: "40",
            change: "+1.8%",
            changeText: "Up from yesterday",
            trend: "up",
            icon: UserCheck,
            color: "bg-pink-500/10 text-pink-400",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              <div className="h-8 w-8 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.color}`}>
              <stat.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stat.value}
            </div>
            <div className="flex items-center gap-1 text-xs">
              {stat.trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-success" />
              ) : (
                <TrendingDown className="h-3 w-3 text-destructive" />
              )}
              <span
                className={cn(
                  "font-medium",
                  stat.trend === "up" ? "text-success" : "text-destructive"
                )}
              >
                {stat.change}
              </span>
              <span className="text-muted-foreground">{stat.changeText}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
