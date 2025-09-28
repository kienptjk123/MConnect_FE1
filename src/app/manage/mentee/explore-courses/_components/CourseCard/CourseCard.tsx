"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useCourseEnrollment } from "@/queries/useCourse";
import { CourseType } from "@/schemaValidations/course.schema";
import {
  BookOpen,
  BookText,
  Clock,
  MoveRight,
  Star,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CourseCardProps {
  course: CourseType;
}

export default function CourseCard({ course }: CourseCardProps) {
  const enrollMutation = useCourseEnrollment();
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const handleEnrollNow = async () => {
    try {
      const enrollmentData = {
        courseId: course.id,
        amount: parseFloat(course.price),
        orderInfo: "a",
      };

      const result = await enrollMutation.mutateAsync({
        id: course.id.toString(),
        body: enrollmentData,
      });

      if (result.payload?.data?.paymentUrl) {
        window.location.href = result.payload.data.paymentUrl;
      } else {
        toast({
          title: "Success",
          description: "Course enrollment initiated successfully!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to enroll in course",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg dark:hover:shadow-none hover:shadow-blue-100 border-0 bg-white dark:bg-[#080808] dark:border-1 dark:border-white rounded-xl overflow-hidden">
      <div className="relative">
        <div className="relative h-56 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
          {course.thumbnail ? (
            <Link href={`/manage/mentee/explore-courses/${course.slug}`}>
              <Image
                src={course.thumbnail}
                alt={course.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
          ) : (
            <Link
              href={`/manage/mentee/explore-courses/${course.slug}`}
              className="w-full h-full flex items-center justify-center"
            >
              <BookOpen className="w-52 h-52 text-white/80" />
            </Link>
          )}

          <div className="absolute top-3 right-3">
            <Badge
              variant="secondary"
              className={`${getStatusColor(course.status)} border-0`}
            >
              {course.status}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="font-medium px-2 py-1 text-sm border-1 border-gray-300 hover:bg-blue-500 transition-all duration-300 ease-in hover:text-white rounded-xs">
              {course.categories?.[0]?.courseCategory?.name || "Learning IT"}
            </div>
            <div className="flex gap-1 items-center justify-center">
              <BookText className="w-4 h-4 text-blue-500" />
              <div className="">
                {course.modules
                  .map((module) => module.lessons.length)
                  .reduce((a, b) => a + b, 0)}{" "}
                Lessons
              </div>
            </div>
          </div>
          <Link
            href={`/manage/mentee/explore-courses/${course.slug}`}
            className="mt-3 font-bold text-xl text-gray-900 dark:text-white mb-3
             relative w-fit transition-colors duration-400 
             hover:text-blue-500
             after:content-[''] after:absolute after:left-0 after:bottom-0
             after:w-0 after:h-[2px] after:bg-blue-500 after:transition-all 
             after:duration-400 hover:after:w-full line-clamp-1"
          >
            {course.title}
          </Link>

          <div className="flex items-center gap-4 mb-3 text-xs dark:text-white text-gray-500">
            <div className="flex items-center gap-1 text-sm">
              <Users className="w-4 h-4" />
              <span>{course._count.enrollments} students</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{course._count.modules} modules</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>1h 30m</span>
            </div>
          </div>

          <div className="flex mt-3 mb-3 items-center justify-between font-semibold dark:text-white">
            <div className="text-xl font-bold">
              {Number(course.price).toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              đ
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= course.avgRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <div className="">{course.avgRating.toFixed(1)}</div>
              <div className="">({course.ratingCount})</div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-gray-200 pt-3">
            <div className="flex items-center gap-2 ">
              <Avatar className="w-9 h-9">
                <AvatarImage
                  width={9}
                  height={9}
                  src={course.mentorProfile?.avatar || ""}
                />
                <AvatarFallback className="text-sm bg-blue-100 text-blue-700 ">
                  {course.mentorProfile.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-base font-medium text-gray-700 capitalize truncate dark:text-white">
                  {course?.mentorProfile?.username}
                </p>
              </div>
            </div>

            <div
              onClick={handleEnrollNow}
              className="flex items-center justify-center gap-2 text-gray-700 dark:text-white font-semibold hover:text-blue-500 transition-colors duration-300"
            >
              <span className="text-base">Enroll Now</span>
              <MoveRight className="w-5 h-5 text-gray-700 hover:text-blue-500" />
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
