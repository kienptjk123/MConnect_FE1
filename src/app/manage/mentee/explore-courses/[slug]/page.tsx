"use client";

import CourseInfoPanel from "@/app/manage/mentee/explore-courses/_components/CourseInfoPanel/CourseInfoPanel";
import ModuleLessons from "@/app/manage/mentee/explore-courses/_components/ModuleLessons/ModuleLessons";
import { Button } from "@/components/ui/button";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";
import {
  useCourseDetail,
  useCoursePublicStream,
  useCourses,
} from "@/queries/useCourse";
import { ArrowLeft, BookOpen, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Lesson {
  id: number;
  moduleId: number;
  title: string;
  order: number;
  mediaId: number | null;
  commentsEnabled: boolean;
  durationSec: number;
  media: {
    id: number;
    type: string;
    s3Key: string;
    status: string;
    durationSec: number;
    thumbnailKey: string | null;
    createdAt: string;
  } | null;
}

interface ModuleData {
  id: number;
  courseId: number;
  title: string;
  order: number;
  lessons: Lesson[];
}

export default function CourseDetailPage() {
  const params = useParams();
  const { data: allCourses, isLoading: loadingCourses } = useCourses();
  const courses = allCourses?.payload?.result?.courses?.find(
    (c) => c.slug === params.slug
  );

  const {
    data: courseResponse,
    isLoading,
    error,
  } = useCourseDetail(courses?.id as number);

  const lesson = courseResponse?.payload?.result?.modules?.[0].lessons?.[0];
  const course = courseResponse?.payload?.result;
  const video = useCoursePublicStream(lesson?.id as number);
  if (isLoading && loadingCourses) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error loading course
          </h1>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : "Something went wrong"}
          </p>
          <Button asChild>
            <Link href="/manage/mentee/explore-courses">Back to Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">
            Course not found
          </h1>
          <Button asChild>
            <Link href="/manage/mentee/explore-courses">Back to Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getVideoUrl = () => {
    return video?.data?.payload.result.streamUrl;
  };

  const totalLessons = course?.modules.reduce(
    (total: number, moduleData: ModuleData) =>
      total + moduleData.lessons.length,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href="/manage/mentee/explore-courses"
                  className="flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Courses
                </Link>
              </Button>
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-gray-900 truncate max-w-md">
                  {course.title}
                </h1>
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {course.modules.length} modules • {totalLessons} lessons
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <VideoPlayer
                videoUrl={getVideoUrl()}
                title={lesson?.title as string}
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-4xl font-semibold text-gray-900 mb-3">
                {course.title}
              </h1>

              <div className="flex items-center gap-3">
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
                </div>
                <div className="">({course.ratingCount} reviews)</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center">
                <div className="">
                  {course.mentorProfile && (
                    <div className="">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                          {course.mentorProfile.avatar ? (
                            <Image
                              src={course.mentorProfile.avatar}
                              alt={course.mentorProfile.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-blue-600 font-semibold text-lg">
                              {course.mentorProfile.name
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-400">
                            Created by
                          </p>
                          <p className="text-lg text-gray-900">
                            {course.mentorProfile.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="w-[1px] h-10 bg-gray-400"></div>
                <div className="">
                  <div>
                    <p className="font-medium text-sm text-gray-400">
                      Total Enrolled
                    </p>
                    <p className="text-lg text-gray-900">
                      {course._count.enrollments}
                    </p>
                  </div>
                </div>

                <div className="w-[1px] h-10 bg-gray-400"></div>

                <div className="">
                  <div>
                    <p className="font-medium text-sm text-gray-400">
                      Last Update
                    </p>
                    <p className="text-lg text-gray-900">
                      {course.updatedAt.split("T")[0]}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div>
                  <p className="font-medium text-sm text-gray-400">Category</p>
                  <p className="text-lg text-gray-900 mt-2">
                    {course.categories?.[0]?.courseCategory?.name || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                About this course
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {course.description}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <ModuleLessons course={course} />
            </div>
          </div>

          <div className="space-y-6">
            <CourseInfoPanel course={course} />
          </div>
        </div>
      </div>
    </div>
  );
}
