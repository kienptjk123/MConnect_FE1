"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";
import dashboardApiRequest, {
  CourseOverviewData,
  CourseSalesData,
} from "@/apiRequests/dashboard";

export function AnalyticsCharts() {
  const [courseData, setCourseData] = useState<CourseOverviewData[]>([]);
  const [salesData, setSalesData] = useState<CourseSalesData[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<"week" | "month">("week");

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      try {
        const response = await dashboardApiRequest.getAnalyticsCharts(period);
        const { courseOverview, courseSales } = response.payload.result;

        setCourseData(courseOverview);
        setSalesData(courseSales.data);
        setTotalEarnings(courseSales.totalEarnings);
      } catch (error) {
        console.error("Failed to fetch analytics charts data:", error);
        // Fallback to sample data
        const fallbackCourseData = [
          { name: "Sun", value1: 30, value2: 20 },
          { name: "Mon", value1: 25, value2: 35 },
          { name: "Tue", value1: 40, value2: 30 },
          { name: "Wed", value1: 35, value2: 25 },
          { name: "Thu", value1: 20, value2: 40 },
          { name: "Fri", value1: 30, value2: 35 },
          { name: "Sat", value1: 25, value2: 30 },
        ];

        const fallbackSalesData = [
          { name: "Jan", value: 65 },
          { name: "Feb", value: 85 },
          { name: "Mar", value: 75 },
          { name: "Apr", value: 90 },
          { name: "May", value: 70 },
          { name: "Jun", value: 95 },
          { name: "Jul", value: 80 },
          { name: "Aug", value: 85 },
          { name: "Sep", value: 75 },
          { name: "Oct", value: 90 },
          { name: "Nov", value: 85 },
          { name: "Dec", value: 100 },
        ];

        setCourseData(fallbackCourseData);
        setSalesData(fallbackSalesData);
        setTotalEarnings(7443);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [period]);

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod as "week" | "month");
  };
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[400px] bg-gray-200 rounded animate-pulse" />
        <div className="h-[400px] bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Course Overview */}
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Course Overview
            </CardTitle>
          </div>
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="month">This month</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={courseData}>
                <defs>
                  <linearGradient
                    id="lineGradient1"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>
                  <linearGradient
                    id="lineGradient2"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="100%" stopColor="#2563EB" />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                          <p className="text-sm font-medium mb-1">{label}</p>
                          {payload.map((entry, index) => (
                            <p
                              key={index}
                              className="text-xs"
                              style={{ color: entry.color }}
                            >
                              {`Series ${index + 1}: ${entry.value}`}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value1"
                  stroke="url(#lineGradient1)"
                  strokeWidth={4}
                  dot={{ fill: "#3B82F6", strokeWidth: 3, r: 5 }}
                  activeDot={{
                    r: 8,
                    fill: "#1D4ED8",
                    stroke: "white",
                    strokeWidth: 3,
                  }}
                  filter="drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))"
                />
                <Line
                  type="monotone"
                  dataKey="value2"
                  stroke="url(#lineGradient2)"
                  strokeWidth={4}
                  dot={{ fill: "#60A5FA", strokeWidth: 3, r: 5 }}
                  activeDot={{
                    r: 8,
                    fill: "#2563EB",
                    stroke: "white",
                    strokeWidth: 3,
                  }}
                  filter="drop-shadow(0 0 8px rgba(96, 165, 250, 0.5))"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Course Sales */}
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Course Sales
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              {period === "week" ? "This Week" : "This Month"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="text-2xl font-bold text-foreground">
              {totalEarnings.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">VND you earned</div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="25%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#2563EB" />
                    <stop offset="75%" stopColor="#1D4ED8" />
                    <stop offset="100%" stopColor="#1E40AF" />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis hide />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                          <p className="text-sm font-medium">{`${label}: $${
                            payload[0].value * 10
                          }`}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="url(#barGradient)"
                  radius={[6, 6, 0, 0]}
                  filter="drop-shadow(0 4px 12px rgba(59, 130, 246, 0.4))"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
