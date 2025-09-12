"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useCourseDetail } from "@/queries/useCourse";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";
import CourseInfoPanel from "@/app/manage/mentee/explore-courses/_components/CourseInfoPanel/CourseInfoPanel";
import ModuleLessons from "@/app/manage/mentee/explore-courses/_components/ModuleLessons/ModuleLessons";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, Heart, BookOpen } from "lucide-react";
import Link from "next/link";

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

export default function CourseDetailPages() {
  const params = useParams();
  const courseId = parseInt(params.id as string);

  const { data: courseResponse, isLoading, error } = useCourseDetail(courseId);

  const course = courseResponse?.payload?.result;

  // State for currently selected lesson
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);

  if (isLoading) {
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
            <Link href="/course">Back to Courses</Link>
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
            <Link href="/course">Back to Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Get currently selected lesson or default to first lesson
  const currentLesson = selectedLessonId
    ? course.modules
        .flatMap((moduleData: ModuleData) => moduleData.lessons)
        .find((lessonData: Lesson) => lessonData.id === selectedLessonId)
    : course.modules[0]?.lessons[0];

  const handleLessonSelect = (lessonId: number) => {
    setSelectedLessonId(lessonId);
  };

  // Get video URL for current lesson
  const getVideoUrl = (lesson: Lesson) => {
    // if (lesson.media && lesson.media.s3Key) {
    //   // Convert S3 key to video URL - this depends on your S3 setup
    //   return `https://your-bucket.s3.amazonaws.com/${lesson.media.s3Key}`;
    // }
    // Fallback video URL
    return "https://files.vidstack.io/sprite-fight/720p.mp4";
  };

  // Calculate total lessons
  const totalLessons = course.modules.reduce(
    (total: number, moduleData: ModuleData) =>
      total + moduleData.lessons.length,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/course" className="flex items-center">
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

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player and Content - Left Side (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {currentLesson ? (
                <>
                  <VideoPlayer
                    videoUrl={getVideoUrl(currentLesson)}
                    title={currentLesson.title}
                  />

                  {/* Lesson Info */}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {currentLesson.title}
                    </h2>

                    {/* Lesson Meta */}
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span>
                        Duration: {Math.floor(currentLesson.durationSec / 60)}{" "}
                        minutes
                      </span>
                      <span>•</span>
                      <span>Lesson {currentLesson.order}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500">No lessons available</p>
                </div>
              )}
            </div>

            {/* Course Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                About this course
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {course.description}
              </p>
            </div>
          </div>

          {/* Sidebar - Right Side (1/3 width) */}
          <div className="space-y-6">
            {/* Course Info Panel */}
            <CourseInfoPanel course={course} />

            {/* Module Lessons */}
            <ModuleLessons
              course={course}
              selectedLessonId={selectedLessonId}
              onLessonSelect={handleLessonSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
