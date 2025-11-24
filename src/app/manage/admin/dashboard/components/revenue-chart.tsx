"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";
import dashboardApiRequest, { RevenueChartData } from "@/apiRequests/dashboard";

export function RevenueChart() {
  const [data, setData] = useState<RevenueChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<"month" | "year">("month");

  useEffect(() => {
    const fetchRevenueData = async () => {
      setIsLoading(true);
      try {
        const response = await dashboardApiRequest.getRevenueChart(period);
        setData(response.payload.result);
      } catch (error) {
        console.error("Failed to fetch revenue chart data:", error);
        // Fallback to sample data
        const fallbackData = [
          { name: "5k", value: 20 },
          { name: "10k", value: 35 },
          { name: "15k", value: 45 },
          { name: "20k", value: 40 },
          { name: "25k", value: 55 },
          { name: "30k", value: 60 },
          { name: "35k", value: 25 },
          { name: "40k", value: 70 },
          { name: "45k", value: 65 },
          { name: "50k", value: 60 },
          { name: "55k", value: 55 },
          { name: "60k", value: 50 },
        ];
        setData(fallbackData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRevenueData();
  }, [period]);

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod as "month" | "year");
  };
  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">
            Revenue Details
          </CardTitle>
        </div>
        <Select value={period} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="year">Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse text-muted-foreground">
                Loading...
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="30%" stopColor="#1D4ED8" stopOpacity={0.6} />
                    <stop offset="60%" stopColor="#1E40AF" stopOpacity={0.4} />
                    <stop offset="80%" stopColor="#1E3A8A" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#172554" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient
                    id="strokeGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
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
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                          <p className="text-sm font-medium">{`${label}: ${payload[0].value}%`}</p>
                          <p className="text-xs text-muted-foreground">
                            Revenue percentage
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="url(#strokeGradient)"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  filter="drop-shadow(0 0 12px rgba(59, 130, 246, 0.4))"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
