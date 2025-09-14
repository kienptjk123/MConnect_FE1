"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CourseDetailType } from "@/schemaValidations/course.schema";
import {
  Bookmark,
  BookOpen,
  CarTaxiFront,
  Clock,
  Globe,
  Heart,
  Play,
  ShieldCheck,
  ShoppingCart,
  Star,
  Stars,
  Users,
} from "lucide-react";
import Image from "next/image";

interface CourseInfoPanelProps {
  course: CourseDetailType;
}

export default function CourseInfoPanel({ course }: CourseInfoPanelProps) {
  const totalDuration = course.modules.reduce((total, moduleData) => {
    return (
      total +
      moduleData.lessons.reduce(
        (moduleTotal, lesson) => moduleTotal + lesson.durationSec,
        0
      )
    );
  }, 0);

  const totalHours = Math.floor(totalDuration / 3600);
  const totalMinutes = Math.floor((totalDuration % 3600) / 60);

  const totalLessons = course.modules.reduce(
    (total, moduleData) => total + moduleData.lessons.length,
    0
  );

  return (
    <Card className="p-6 top-6 sticky dark:bg-[#080808]">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-3xl font-bold  light:text-gray-900">
              {Number(course.price).toLocaleString("vi-VN")} VND
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between border-b pb-3 light:text-gray-600">
          <div className="flex items-center justify-center">
            <Clock className="h-5 w-5 mr-3" />
            <span>Duration</span>
          </div>

          <span>
            {totalHours > 0 && `${totalHours}h `}
            {totalMinutes}m
          </span>
        </div>

        <div className="flex items-center justify-between border-b pb-3 light:text-gray-600">
          <div className="flex items-center justify-center">
            <BookOpen className="h-5 w-5 mr-3" />
            <span>Lesson</span>
          </div>
          <span>{totalLessons} lessons</span>
        </div>

        <div className="flex items-center justify-between border-b pb-3 light:text-gray-600">
          <div className="flex items-center justify-center">
            <BookOpen className="h-5 w-5 mr-3" />
            <span>Category</span>
          </div>
          <span>{course.categories?.[0]?.courseCategory?.name}</span>
        </div>

        <div className="flex items-center justify-between border-b pb-3 light:text-gray-600">
          <div className="flex items-center justify-center">
            <Globe className="h-5 w-5 mr-3" />
            <span>Language</span>
          </div>
          <span>Vietnamese</span>
        </div>

        <div className="flex items-center justify-between border-b pb-3 light:text-gray-600">
          <div className="flex items-center justify-center">
            <Bookmark className="h-5 w-5 mr-3" />
            <span>Access</span>
          </div>
          <span>Full Lifetime</span>
        </div>

        <div className="flex items-center justify-between border-b pb-3 light:text-gray-600">
          <div className="flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 mr-3" />
            <span>Certificate</span>
          </div>
          <span>Yes</span>
        </div>

        <div className="flex items-center justify-between border-b pb-3 light:text-gray-600">
          <div className="flex items-center justify-center">
            <Users className="h-5 w-5 mr-3" />
            <span>Students Enrolled</span>
          </div>
          <span>{course._count.enrollments}</span>
        </div>

        <div className="flex items-center justify-between border-b pb-3 light:text-gray-600">
          <div className="flex items-center justify-center">
            <Stars className="h-5 w-5 mr-3" />
            <span>Average Rating</span>
          </div>
          <span>
            {course.avgRating} ({course.ratingCount} reviews)
          </span>
        </div>
      </div>

      <div className="pt-4 mt-4">
        <Button
          className="w-full bg-blue-500 hover:bg-blue-400 dark:text-white"
          size="lg"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add To Cart
        </Button>
      </div>

      <div className="pt-4">
        <Button
          className="w-full bg-white border text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
          size="lg"
        >
          <Heart className="h-5 w-5 mr-2" />
          Add To Wishlist
        </Button>
      </div>
    </Card>
  );
}
