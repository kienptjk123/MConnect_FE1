"use client";

import MentorCourseInfoPanel from "@/app/manage/mentor/courses/course/_components/MentorCourseInfoPanel/MentorCourseInfoPanel";
import MentorModuleLessons from "@/app/manage/mentor/courses/course/_components/MentorModuleLessons/MentorModuleLessons";
import { Button } from "@/components/ui/button";
import { useByMentorCourseDetail, useCourses } from "@/queries/useCourse";

import { MediaPlayer, MediaProvider, Poster, Track } from "@vidstack/react";
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
import "@vidstack/react/player/styles/default/layouts/audio.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import "@vidstack/react/player/styles/default/theme.css";
import { ArrowLeft, BookOpen, Edit, Star } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export interface Media {
  id: number;
  type: "VIDEO" | "AUDIO" | "PDF" | "IMAGE";
  s3Key: string;
  status: "UPLOADING" | "PROCESSING" | "READY" | "FAILED";
  durationSec: number;
  thumbnailKey: string | null;
  createdAt: string;
}

export interface Lesson {
  id: number;
  moduleId: number;
  title: string;
  order: number;
  mediaId: number | null;
  commentsEnabled: boolean;
  durationSec: number;
  media: Media | null;
}

export interface Module {
  id: number;
  courseId: number;
  title: string;
  order: number;
  lessons: Lesson[];
}

export default function MentorCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: allCourses, isLoading: loadingCourses } = useCourses();
  const courses = allCourses?.payload?.result?.courses?.find(
    (c) => c.slug === params.slug
  );

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const courseId = courses?.id;
  const { data: courseResponse, error } = useByMentorCourseDetail(
    courseId as number
  );
  const course = courseResponse;

  const activeLesson =
    selectedLesson || course?.modules?.[0]?.lessons?.[0] || null;

  const getVideoUrl = () => {
    if (activeLesson?.media?.s3Key) {
      return `https://mconnectv1.s3.ap-southeast-1.amazonaws.com/${activeLesson.media.s3Key}`;
    }
    return null;
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error loading course
          </h1>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : "Something went wrong"}
          </p>
          <Button asChild>
            <Link href="/manage/mentor/courses/course">Back to Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">
            Course not found
          </h1>
          <Button asChild>
            <Link href="/manage/mentor/courses/course">Back to Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(typeof price === "string" ? parseFloat(price) : price);
  };

  const formatRating = (rating: number) => {
    return rating > 0 ? rating.toFixed(1) : "0.0";
  };

  const handleEdit = () => {
    router.push(`/manage/mentor/courses/course/${course.id}/edit`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/manage/mentor/courses/course"
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Courses
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
              <div className="aspect-video bg-gray-900 relative">
                <MediaPlayer
                  src={getVideoUrl() || ""}
                  viewType="video"
                  streamType="on-demand"
                  logLevel="warn"
                  crossOrigin
                  playsInline
                  title="Sprite Fight"
                  style={{ maxWidth: "100%", height: "100%" }}
                  aspectRatio="16:9"
                >
                  <Track src="" label="English" kind="subtitles" default />
                  <Track src="" kind="chapters" default />
                  <MediaProvider>
                    <Poster className="vds-poster" />
                  </MediaProvider>
                  <DefaultVideoLayout
                    thumbnails=""
                    icons={defaultLayoutIcons}
                  />
                </MediaPlayer>
              </div>
            </div>
            ={" "}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {course.title}
                  </h1>
                  {course.subtitle && (
                    <p className="text-lg text-gray-600">{course.subtitle}</p>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>{formatRating(course.avgRating || 0)}</span>
                  </div>
                  <span>•</span>
                  <span>{course._count?.enrollments || 0} students</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h3>
                <div
                  className="text-gray-700 leading-relaxed prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: course.description || "" }}
                />
              </div>

              {course.needToLearn && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    What students will learn
                  </h3>
                  <div
                    className="text-gray-700 leading-relaxed prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: course.needToLearn }}
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {course.categories?.map((category: any) => (
                  <span
                    key={category.id}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {category.name}
                  </span>
                ))}
                {course.labels?.map((label: any) => (
                  <span
                    key={label.id}
                    className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                  >
                    {label.name}
                  </span>
                ))}
              </div>
            </div>
            <MentorModuleLessons
              modules={(course.modules || []) as Module[]}
              onSelectLesson={(lesson) => setSelectedLesson(lesson as any)}
            />
          </div>

          <div className="lg:col-span-1">
            <MentorCourseInfoPanel course={course} />
          </div>
        </div>
      </div>
    </div>
  );
}
