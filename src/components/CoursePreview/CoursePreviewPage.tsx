"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  BookOpen,
  Play,
  Clock,
  Users,
  Star,
  Tag,
  Edit,
  Check,
  AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PreviewModuleForm {
  id: string;
  title: string;
  order: number;
  lessons: PreviewLessonForm[];
}

interface PreviewLessonForm {
  id: string;
  title: string;
  order: number;
  commentsEnabled: boolean;
  durationSec: number;
}

interface CoursePreviewData {
  title: string;
  subtitle: string;
  description: string;
  needToLearn: string[];
  price: number;
  thumbnail: string;
  categories: number[];
  labels: number[];
  modules: PreviewModuleForm[];
}

interface CoursePreviewPageProps {
  courseData: CoursePreviewData;
  onBack: () => void;
  onEdit: () => void;
  onCreateCourse: () => void;
  isCreating?: boolean;
}

export function CoursePreviewPage({
  courseData,
  onBack,
  onEdit,
  onCreateCourse,
  isCreating = false,
}: CoursePreviewPageProps) {
  const router = useRouter();

  const totalLessons = courseData.modules.reduce(
    (total, module) => total + module.lessons.length,
    0
  );

  const totalDuration = courseData.modules.reduce(
    (total, module) =>
      total +
      module.lessons.reduce(
        (lessonTotal, lesson) => lessonTotal + lesson.durationSec,
        0
      ),
    0
  );

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes < 60) {
      return remainingSeconds > 0
        ? `${minutes}m ${remainingSeconds}s`
        : `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ""}`;
  };

  const hasContent = courseData.modules.length > 0;
  const hasCompleteInfo =
    courseData.title && courseData.description && courseData.price > 0;

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      {/* Header */}
      <Card className="rounded-md shadow-sm border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-md">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="rounded-md bg-white/20 p-2 border border-white/20">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">
                Course Preview
              </CardTitle>
              <p className="text-sm opacity-90">
                Review your course before publishing
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={onEdit}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Course
            </Button>
            <Button
              onClick={onCreateCourse}
              disabled={!hasCompleteInfo || !hasContent || isCreating}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Create Course
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Course Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {courseData.thumbnail && (
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={courseData.thumbnail}
                    alt={courseData.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                </div>
              )}

              <div className="space-y-2">
                <h1 className="text-2xl font-bold">{courseData.title}</h1>
                {courseData.subtitle && (
                  <p className="text-lg text-gray-600">{courseData.subtitle}</p>
                )}
                <p className="text-gray-700">{courseData.description}</p>
              </div>

              {courseData.needToLearn.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">What you'll learn:</h3>
                  <ul className="space-y-1">
                    {courseData.needToLearn.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(courseData.categories.length > 0 ||
                courseData.labels.length > 0) && (
                <div className="flex flex-wrap gap-2">
                  {courseData.categories.map((categoryId) => (
                    <Badge key={categoryId} variant="secondary">
                      <Tag className="h-3 w-3 mr-1" />
                      Category {categoryId}
                    </Badge>
                  ))}
                  {courseData.labels.map((labelId) => (
                    <Badge key={labelId} variant="outline">
                      Label {labelId}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Course Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Course Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasContent ? (
                <Accordion type="multiple" className="w-full">
                  {courseData.modules.map((module, moduleIndex) => (
                    <AccordionItem key={module.id} value={module.id}>
                      <AccordionTrigger className="text-left hover:no-underline">
                        <div className="flex items-center gap-3 w-full">
                          <span className="font-medium">
                            Module {module.order}: {module.title}
                          </span>
                          <Badge variant="secondary" className="ml-auto">
                            {module.lessons.length} lessons
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4">
                        <div className="space-y-2">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-3 p-2 rounded-md bg-gray-50"
                            >
                              <Play className="h-4 w-4 text-gray-500" />
                              <span className="flex-1 text-sm">
                                {lesson.order}. {lesson.title}
                              </span>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                {formatDuration(lesson.durationSec)}
                              </div>
                              {lesson.commentsEnabled && (
                                <Badge variant="outline" className="text-xs">
                                  Comments
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h4 className="text-lg font-medium mb-2">
                    No content added yet
                  </h4>
                  <p className="mb-4">
                    Add modules and lessons to your course to get started
                  </p>
                  <Button variant="outline" onClick={onEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Add Content
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Course Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Price</span>
                  <span className="font-semibold text-lg text-green-600">
                    ₫{courseData.price.toLocaleString()}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Modules</span>
                  <span className="font-medium">
                    {courseData.modules.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Lessons</span>
                  <span className="font-medium">{totalLessons}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Duration</span>
                  <span className="font-medium">
                    {formatDuration(totalDuration)}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Categories</span>
                  <span className="font-medium">
                    {courseData.categories.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Labels</span>
                  <span className="font-medium">
                    {courseData.labels.length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Validation Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Publishing Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                {hasCompleteInfo ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                )}
                <span className="text-sm">Basic information complete</span>
              </div>
              <div className="flex items-center gap-2">
                {hasContent ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                )}
                <span className="text-sm">Course content added</span>
              </div>
              <div className="flex items-center gap-2">
                {courseData.thumbnail ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                )}
                <span className="text-sm">Course thumbnail set</span>
              </div>

              {(!hasCompleteInfo || !hasContent) && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-700">
                    Complete all requirements above before publishing your
                    course.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
