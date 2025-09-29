"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CourseType } from "@/schemaValidations/mentorCourse.schema";
import {
  BookOpen,
  Clock,
  Globe,
  Users,
  Star,
  Edit,
  Eye,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface MentorCourseInfoPanelProps {
  course: CourseType;
}

export default function MentorCourseInfoPanel({
  course,
}: MentorCourseInfoPanelProps) {
  const router = useRouter();

  const totalDuration =
    course.modules?.reduce((total, moduleData) => {
      return (
        total +
        (moduleData.lessons?.reduce(
          (moduleTotal, lesson) => moduleTotal + (lesson.durationSec || 0),
          0
        ) || 0)
      );
    }, 0) || 0;

  const totalHours = Math.floor(totalDuration / 3600);
  const totalMinutes = Math.floor((totalDuration % 3600) / 60);

  const totalLessons =
    course.modules?.reduce(
      (total, moduleData) => total + (moduleData.lessons?.length || 0),
      0
    ) || 0;

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(typeof price === "string" ? parseFloat(price) : price);
  };

  const formatRating = (rating: number) => {
    return rating > 0 ? rating.toFixed(1) : "0.0";
  };

  const getStatusBadge = (status: "PUBLISHED" | "DRAFT" | "ARCHIVED") => {
    const statusConfig = {
      PUBLISHED: {
        label: "Published",
        className: "bg-green-100 text-green-800 border-green-200",
      },
      DRAFT: {
        label: "Draft",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      ARCHIVED: {
        label: "Archived",
        className: "bg-gray-100 text-gray-800 border-gray-200",
      },
    };

    const config = statusConfig[status];
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const handleEdit = () => {
    router.push(`/manage/mentor/courses/course/${course.id}/edit`);
  };

  const handleViewPublic = () => {
    window.open(`/courses/${course.slug}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Course Statistics</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Students Enrolled</span>
            </div>
            <span className="font-semibold">
              {course._count?.enrollments || 0}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-gray-600">Average Rating</span>
            </div>
            <span className="font-semibold">
              {formatRating(course.avgRating || 0)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Total Lessons</span>
            </div>
            <span className="font-semibold">{totalLessons}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Total Duration</span>
            </div>
            <span className="font-semibold">
              {totalHours > 0 && `${totalHours}h `}
              {totalMinutes}m
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Pricing</h3>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {formatPrice(course.price)}
          </div>
          <p className="text-sm text-gray-600">Current Price</p>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Course Information</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Modules</span>
            <span className="font-medium">{course.modules?.length || 0}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Language</span>
            <div className="flex items-center space-x-1">
              <Globe className="h-3 w-3 text-gray-400" />
              <span className="text-sm">Vietnamese</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Created</span>
            <span className="text-sm">
              {new Date(course.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Last Updated</span>
            <span className="text-sm">
              {new Date(course.updatedAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
        </div>
      </Card>

      {(course.categories?.length || course.labels?.length) && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Tags</h3>
          <div className="space-y-3">
            {course.categories && course.categories.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {course.categories.map((category: any) => (
                    <Badge key={category.id} variant="secondary">
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {course.labels && course.labels.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Labels</p>
                <div className="flex flex-wrap gap-2">
                  {course.labels.map((label: any) => (
                    <Badge key={label.id} variant="outline">
                      {label.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
