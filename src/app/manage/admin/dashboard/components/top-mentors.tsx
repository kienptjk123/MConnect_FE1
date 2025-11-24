"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { useEffect, useState } from "react";
import dashboardApiRequest, {
  TopMentorData,
  TrendData,
} from "@/apiRequests/dashboard";

export function TopMentors() {
  const [mentors, setMentors] = useState<TopMentorData[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [growthPercentage, setGrowthPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<"week" | "month">("month");

  useEffect(() => {
    const fetchTopMentorsData = async () => {
      setIsLoading(true);
      try {
        const response = await dashboardApiRequest.getTopMentors(period);
        const {
          mentors: mentorsList,
          trendData: trend,
          totalSpent: spent,
          growthPercentage: growth,
        } = response.payload.result;

        setMentors(mentorsList);
        setTrendData(trend);
        setTotalSpent(spent);
        setGrowthPercentage(growth);
      } catch (error) {
        console.error("Failed to fetch top mentors data:", error);
        // Fallback to sample data
        const fallbackMentors = [
          { name: "@maddison_c21", courses: 9821, rating: 85, avatar: "MC" },
          { name: "@karl.will02", courses: 7032, rating: 78, avatar: "KW" },
          { name: "@andreea.1z", courses: 5204, rating: 92, avatar: "AZ" },
          { name: "@abraham47y", courses: 4309, rating: 88, avatar: "AB" },
          { name: "@simmmple.web", courses: 3871, rating: 76, avatar: "SW" },
          { name: "@venus.sys", courses: 3152, rating: 82, avatar: "VS" },
        ];

        const fallbackTrendData = [
          { name: "Sep", value: 30 },
          { name: "Oct", value: 45 },
          { name: "Nov", value: 35 },
          { name: "Dec", value: 50 },
          { name: "Jan", value: 40 },
          { name: "Feb", value: 55 },
        ];

        setMentors(fallbackMentors);
        setTrendData(fallbackTrendData);
        setTotalSpent(37500);
        setGrowthPercentage(2.45);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopMentorsData();
  }, [period]);

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod as "week" | "month");
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[400px] bg-gray-200 rounded animate-pulse" />
        <div className="h-[400px] bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Top Mentors Table */}
      <Card className="lg:col-span-2 border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Top Mentor</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary"
          >
            See all
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm font-medium text-muted-foreground pb-2 border-b border-border">
              <div>Name</div>
              <div>Courses</div>
              <div>Rating</div>
            </div>
            {mentors.map((mentor) => (
              <div
                key={mentor.name}
                className="grid grid-cols-3 gap-4 items-center py-2"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {mentor.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-foreground">
                    {mentor.name}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {mentor.courses.toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={mentor.rating} className="h-2 w-16" />
                  <span className="text-xs text-muted-foreground w-8">
                    {mentor.rating}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {period === "week" ? "This week" : "This month"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="text-2xl font-bold text-foreground">
              {(totalSpent / 1000).toFixed(1)}K
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Total Spent</span>
              <span
                className={
                  growthPercentage >= 0 ? "text-success" : "text-destructive"
                }
              >
                {growthPercentage >= 0 ? "+" : ""}
                {growthPercentage.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                growthPercentage >= 0 ? "bg-success" : "bg-destructive"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                growthPercentage >= 0 ? "text-success" : "text-destructive"
              }`}
            >
              {growthPercentage >= 0 ? "On track" : "Below target"}
            </span>
          </div>

          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>
                </defs>
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
                          <p className="text-xs font-medium">{`${label}: $${payload[0].value}K`}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTrend)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-4 border-t border-border">
            <Select value={period} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">This month</SelectItem>
                <SelectItem value="week">This week</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
