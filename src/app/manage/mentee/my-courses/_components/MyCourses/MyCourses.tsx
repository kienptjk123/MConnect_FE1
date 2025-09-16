"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLearningCourses } from "@/queries/useMyCourses";
import { BookOpen, Download, Play, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function MyCourses() {
  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">(
    "all"
  );
  const { data, isLoading, error } = useLearningCourses();

  const enrollments = data?.payload?.result?.enrollments || [];

  const filterCourses = (enrollments: any[]) => {
    switch (activeTab) {
      case "active":
        return enrollments.filter(
          (enrollment) =>
            enrollment.progressPercentage > 0 &&
            enrollment.progressPercentage < 100
        );
      case "completed":
        return enrollments.filter(
          (enrollment) => enrollment.progressPercentage >= 100
        );
      default:
        return enrollments;
    }
  };

  const filteredCourses = filterCourses(enrollments);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br bg-white">
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl shadow-xl bg-white border border-blue-100">
          <div className="mb-6">
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="40" cy="40" r="40" fill="#E0E7FF" />
              <path
                d="M25 55V50C25 46.6863 27.6863 44 31 44H49C52.3137 44 55 46.6863 55 50V55"
                stroke="#6366F1"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="40" cy="34" r="8" stroke="#6366F1" strokeWidth="3" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-blue-700 mb-2">
            Bạn chưa tham gia khóa học nào
          </h2>
          <p className="text-gray-600 mb-6 max-w-xs text-center">
            Hãy khám phá các khóa học hấp dẫn và bắt đầu hành trình học tập của
            bạn ngay hôm nay!
          </p>
          <Button
            asChild
            className="bg-gradient-to-r bg-blue-500 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-600"
          >
            <Link href="/manage/mentee/explore-courses">Khám phá khóa học</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
          <p className="text-gray-600">Continue your learning journey</p>
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("all")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "all"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Enrolled Courses ({enrollments.length})
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "active"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Active Courses
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "completed"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Completed Courses
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {isLoading && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-80 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        )}

        {!isLoading && filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {activeTab === "all"
                ? "No courses enrolled yet"
                : activeTab === "active"
                ? "No active courses"
                : "No completed courses"}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === "all"
                ? "Start your learning journey by enrolling in a course"
                : "Complete some lessons to see courses here"}
            </p>
            {activeTab === "all" && (
              <Button asChild>
                <Link href="/manage/mentee/explore-courses">
                  Explore Courses
                </Link>
              </Button>
            )}
          </div>
        )}

        {!isLoading && filteredCourses.length > 0 && (
          <>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((enrollment) => (
                <CourseCard key={enrollment.id} enrollment={enrollment} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CourseCard({ enrollment }: { enrollment: any }) {
  const { course } = enrollment;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 bg-gradient-to-r from-purple-500 to-blue-600">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="bg-white/20 rounded-lg p-4 mb-2 inline-flex">
                <span className="text-2xl">📚</span>
              </div>
              <div className="px-4">
                <p className="text-sm font-medium opacity-90">
                  {course?.title}
                </p>
                <p className="text-xs opacity-70 mt-1">
                  by {course?.mentorProfile?.name || "Unknown Mentor"}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="absolute top-3 right-3">
          <Badge
            variant={
              enrollment.progressPercentage === 100 ? "default" : "secondary"
            }
          >
            {enrollment.progressPercentage}%
          </Badge>
        </div>
      </div>

      <div className="p-6">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex text-yellow-400">
            {"★".repeat(Math.floor(course?.avgRating || 0))}
            {"☆".repeat(5 - Math.floor(course?.avgRating || 0))}
          </div>
          <span className="text-sm text-gray-600">
            {course?.avgRating?.toFixed(1) || "0.0"} ({course?.ratingCount || 0}{" "}
            Reviews)
          </span>
        </div>

        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{enrollment.totalLessons} Lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>${course.price}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">COMPLETE</span>
            <span className="text-sm font-medium text-gray-900">
              {enrollment.progressPercentage}%
            </span>
          </div>
          <Progress value={enrollment.progressPercentage} className="h-2" />
        </div>

        <div className="flex gap-2">
          {enrollment.progressPercentage === 100 ? (
            <Button
              variant="outline"
              size="lg"
              className="flex-1 bg-blue-500 hover:bg-blue-600"
            >
              <Download className="w-4 h-4 mr-1" />
              Download Certificate
            </Button>
          ) : (
            <Button
              asChild
              size="lg"
              className="flex-1 bg-blue-500 hover:bg-blue-600"
            >
              <Link href={`/manage/mentee/my-courses/${course.slug}`}>
                <Play className="w-4 h-4 mr-1" />
                {enrollment.progressPercentage === 0
                  ? "Start Learning"
                  : "Continue Learning"}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
