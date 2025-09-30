import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const activities = [
  {
    user: "Kevin",
    action:
      'comments on your lecture "What is ux" in "2021 ui/ux design with figma"',
    time: "Just now",
    avatar: "K",
    color: "bg-orange-500",
  },
  {
    user: "John",
    action:
      'gave a 5 star rating on your course "2021 ui/ux design with figma"',
    time: "5 mins ago",
    avatar: "J",
    color: "bg-orange-500",
  },
  {
    user: "Sraboni",
    action: 'purchase your course "2021 ui/ux design with figma"',
    time: "8 mins ago",
    avatar: "S",
    color: "bg-orange-500",
  },
  {
    user: "Arif",
    action: 'purchase your course "2021 ui/ux design with figma"',
    time: "12 mins ago",
    avatar: "A",
    color: "bg-orange-500",
  },
];

export function RecentActivity() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        <Select defaultValue="today">
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback
                  className={`${activity.color} text-white text-xs`}
                >
                  {activity.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{activity.user}</span>{" "}
                  {activity.action}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
