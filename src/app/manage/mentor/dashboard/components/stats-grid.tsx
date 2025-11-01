import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Users,
  GraduationCap,
  Globe,
  CreditCard,
  BarChart3,
  Award,
} from "lucide-react";

const stats = [
  {
    title: "Enrolled Courses",
    value: "957",
    icon: BookOpen,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    title: "Active Courses",
    value: "19",
    icon: Globe,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    title: "Course Instructors",
    value: "241",
    icon: GraduationCap,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
  },
  {
    title: "Completed Courses",
    value: "951",
    icon: Award,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    title: "Students",
    value: "1,674,767",
    icon: Users,
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    title: "Online Courses",
    value: "3",
    icon: BookOpen,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    title: "USD Total Earning",
    value: "7,461,767đ",
    icon: CreditCard,
    color: "text-gray-500",
    bgColor: "bg-gray-50",
  },
  {
    title: "Course Sold",
    value: "56,489",
    icon: BarChart3,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
];

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
