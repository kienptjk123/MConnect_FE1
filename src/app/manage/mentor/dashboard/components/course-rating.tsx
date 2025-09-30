import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const ratingData = [
  { stars: 5, percentage: 56, count: "5 Star" },
  { stars: 4, percentage: 37, count: "4 Star" },
  { stars: 3, percentage: 8, count: "3 Star" },
  { stars: 2, percentage: 1, count: "2 Star" },
  { stars: 1, percentage: 1, count: "1 Star" },
];

const trendData = [
  { value: 4.2 },
  { value: 4.4 },
  { value: 4.1 },
  { value: 4.6 },
  { value: 4.3 },
  { value: 4.5 },
  { value: 4.6 },
];

export function CourseRating() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          Overall Course Rating
        </CardTitle>
        <Select defaultValue="week">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This week</SelectItem>
            <SelectItem value="month">This month</SelectItem>
            <SelectItem value="year">This year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-6">
          <div className="bg-orange-50 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-foreground mb-2">4.6</div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= 4
                      ? "fill-orange-400 text-orange-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Overall Rating</p>
          </div>

          <div className="flex-1">
            <div className="space-y-3">
              {ratingData.map((rating) => (
                <div key={rating.stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= rating.stars
                            ? "fill-orange-400 text-orange-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex-1">
                    <Progress value={rating.percentage} className="h-2" />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">
                    {rating.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-24 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
