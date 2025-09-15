"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  useCourseProgress,
  useCourses,
  useLessonStream,
} from "@/queries/useCourse";
import { useUpdateCourseProgress } from "@/queries/useMyCourses";
import { MediaPlayer, MediaProvider, Poster, Track } from "@vidstack/react";
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
import "@vidstack/react/player/styles/default/layouts/audio.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import "@vidstack/react/player/styles/default/theme.css";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Play,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useState } from "react";

export default function LearningPage() {
  const params = useParams();
  const { data: allCourses, isLoading: loadingCourses } = useCourses();

  const courses = allCourses?.payload?.result?.courses?.find(
    (c) => c.slug === params.slug
  );

  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(
    new Set([0])
  );

  const {
    data: courseData,
    isLoading,
    error,
  } = useCourseProgress(courses?.id || 0);
  const { mutate: updateProgress } = useUpdateCourseProgress();

  const course = courseData?.payload?.result?.course;
  const progressInfo = courseData?.payload?.result;
  const currentModule = course?.modules[currentModuleIndex];
  const currentLesson = currentModule?.lessons[currentLessonIndex];

  const { data: streamData } = useLessonStream(currentLesson?.mediaId || 0);

  const handleVideoProgress = useCallback(
    (currentTime: number) => {
      if (!currentLesson || !course) return;
      updateProgress({
        courseId: Number(courses?.id),
        data: {
          lessonId: currentLesson.id,
          lastPositionSec: Math.floor(currentTime),
          watchedSec: Math.floor(currentTime),
          completed: true,
        },
      });
    },
    [currentLesson, course, courses?.id, updateProgress]
  );

  const toggleModule = (moduleIndex: number) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleIndex)) {
      newExpanded.delete(moduleIndex);
    } else {
      newExpanded.add(moduleIndex);
    }
    setExpandedModules(newExpanded);
  };

  const selectLesson = (moduleIndex: number, lessonIndex: number) => {
    setCurrentModuleIndex(moduleIndex);
    setCurrentLessonIndex(lessonIndex);

    const newExpanded = new Set(expandedModules);
    newExpanded.add(moduleIndex);
    setExpandedModules(newExpanded);
  };

  const goToNextLesson = () => {
    if (!course) return;

    const currentModuleLessons =
      course.modules[currentModuleIndex]?.lessons || [];

    if (currentLessonIndex < currentModuleLessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else if (currentModuleIndex < course.modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      setCurrentLessonIndex(0);
      const newExpanded = new Set(expandedModules);
      newExpanded.add(currentModuleIndex + 1);
      setExpandedModules(newExpanded);
    }
  };

  const goToPreviousLesson = () => {
    if (!course) return;

    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else if (currentModuleIndex > 0) {
      const prevModuleIndex = currentModuleIndex - 1;
      const prevModuleLessons = course.modules[prevModuleIndex]?.lessons || [];
      setCurrentModuleIndex(prevModuleIndex);
      setCurrentLessonIndex(prevModuleLessons.length - 1);
      const newExpanded = new Set(expandedModules);
      newExpanded.add(prevModuleIndex);
      setExpandedModules(newExpanded);
    }
  };

  const getCurrentVideoUrl = () => {
    return streamData?.payload?.result?.streamUrl;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Course not found
          </h2>
          <p className="text-gray-600 mb-4">
            The course you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link href="/manage/mentee/my-courses">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Courses
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col px-4">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/manage/mentee/my-courses">
              <ArrowLeft className="w-4 h-4 mr-2" />
              My Courses
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 truncate max-w-md">
              {course.title}
            </h1>
            <p className="text-sm text-gray-600">Course ID: {course.id}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 gap-2 flex">
        <div className="flex-1 flex flex-col bg-black">
          <div className="flex-1 flex items-center justify-center rounded-xl">
            <MediaPlayer
              onClick={() => handleVideoProgress(getCurrentVideoUrl() ? 0 : 0)}
              src={getCurrentVideoUrl()}
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
              <DefaultVideoLayout thumbnails="" icons={defaultLayoutIcons} />
            </MediaPlayer>
          </div>

          <div className="bg-white text-gray-900 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-semibold">
                  {currentLesson?.title}
                </h2>
                <p className="text-sm opacity-75">
                  Lesson {currentLessonIndex + 1} of{" "}
                  {currentModule?.lessons.length || 0}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={goToPreviousLesson}
                  disabled={
                    currentModuleIndex === 0 && currentLessonIndex === 0
                  }
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={goToNextLesson}
                  disabled={
                    currentModuleIndex === course.modules.length - 1 &&
                    currentLessonIndex ===
                      (currentModule?.lessons.length || 0) - 1
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-96 bg-white border-l flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {course.modules.map((module: any, moduleIndex: number) => (
              <div key={module.id} className="border-b last:border-b-0">
                <button
                  onClick={() => toggleModule(moduleIndex)}
                  className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {module.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {module.lessons.length} lessons
                      </p>
                    </div>
                    <div className="ml-3 flex items-center gap-2">
                      {moduleIndex === currentModuleIndex && (
                        <Badge variant="secondary">Current</Badge>
                      )}
                      {expandedModules.has(moduleIndex) ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Lessons List */}
                {expandedModules.has(moduleIndex) && (
                  <div className="bg-gray-50">
                    {module.lessons.map((lesson: any, lessonIndex: number) => (
                      <button
                        key={lesson.id}
                        onClick={() => selectLesson(moduleIndex, lessonIndex)}
                        className={`w-full p-3 text-left hover:bg-gray-100 transition-colors border-l-2 ${
                          moduleIndex === currentModuleIndex &&
                          lessonIndex === currentLessonIndex
                            ? "border-blue-500 bg-blue-50"
                            : "border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {lesson.progress?.completed ? (
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                <Play className="w-3 h-3 text-gray-600" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {lesson.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-600">
                                {lesson.durationSec
                                  ? formatDuration(lesson.durationSec)
                                  : "5:00"}
                              </span>
                              {lesson.progress?.watchedSec > 0 &&
                                !lesson.progress?.completed && (
                                  <span className="text-xs text-blue-600">
                                    •{" "}
                                    {formatDuration(lesson.progress.watchedSec)}{" "}
                                    watched
                                  </span>
                                )}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Course Progress
              </span>
              <span className="text-sm font-medium text-gray-900">
                {progressInfo?.progressPercentage || 0}%
              </span>
            </div>
            <Progress
              value={progressInfo?.progressPercentage || 0}
              className="mb-3"
            />
            <div className="text-xs text-gray-600 mb-3">
              {progressInfo?.completedLessons || 0} of{" "}
              {progressInfo?.totalLessons || 0} lessons completed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
