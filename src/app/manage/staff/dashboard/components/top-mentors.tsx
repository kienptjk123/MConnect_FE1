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

const mentors = [
  { name: "@maddison_c21", artworks: "9821", rating: 85, avatar: "MC" },
  { name: "@karl.will02", artworks: "7032", rating: 78, avatar: "KW" },
  { name: "@andreea.1z", artworks: "5204", rating: 92, avatar: "AZ" },
  { name: "@abraham47y", artworks: "4309", rating: 88, avatar: "AB" },
  { name: "@simmmple.web", artworks: "3871", rating: 76, avatar: "SW" },
  { name: "@venus.sys", artworks: "3152", rating: 82, avatar: "VS" },
];

const trendData = [
  { name: "Sep", value: 30 },
  { name: "Oct", value: 45 },
  { name: "Nov", value: 35 },
  { name: "Dec", value: 50 },
  { name: "Jan", value: 40 },
  { name: "Feb", value: 55 },
];

export function TopMentors() {
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
              <div>Artworks</div>
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
                  {mentor.artworks}
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
            <span className="text-sm text-muted-foreground">This month</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="text-2xl font-bold text-foreground">$37.5K</div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Total Spent</span>
              <span className="text-success">+2.45%</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success" />
            <span className="text-sm font-medium text-success">On track</span>
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
            <Select defaultValue="this-month">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">This month</SelectItem>
                <SelectItem value="last-month">Last month</SelectItem>
                <SelectItem value="this-year">This year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
