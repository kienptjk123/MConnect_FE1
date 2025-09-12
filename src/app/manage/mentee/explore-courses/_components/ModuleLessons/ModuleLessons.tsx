"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseDetailType } from "@/schemaValidations/course.schema";
import { Clock, Lock, Video } from "lucide-react";
import { useState } from "react";

interface ModuleLessonsProps {
  course: CourseDetailType;
  selectedLessonId?: number | null;
  onLessonSelect?: (lessonId: number) => void;
}

export default function ModuleLessons({ course }: ModuleLessonsProps) {
  const [expandedModules, setExpandedModules] = useState<Set<number>>(
    new Set([1])
  );

  const accordionValue = Array.from(expandedModules).map(String);
  const onAccordionChange = (vals: string[]) => {
    setExpandedModules(new Set(vals.map(Number)));
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getModuleDuration = (moduleId: number) => {
    const moduleData = course.modules.find((m) => m.id === moduleId);
    if (!moduleData) return 0;
    return moduleData.lessons.reduce(
      (total, lesson) => total + lesson.durationSec,
      0
    );
  };

  return (
    <>
      <Card className="bg-white border-0 shadow-none">
        <CardHeader className="p-0">
          <CardTitle className="text-xl font-bold text-gray-900">
            Course Content
          </CardTitle>
          <p className="text-sm text-gray-600">
            {course.modules.length} modules •{" "}
            {course.modules.reduce(
              (total, module) => total + module.lessons.length,
              0
            )}{" "}
            lessons
          </p>
        </CardHeader>

        <CardContent className="space-y-3 p-0 mt-4">
          <Accordion
            type="multiple"
            value={accordionValue}
            onValueChange={onAccordionChange}
            className="space-y-3"
          >
            {course.modules.map((module, moduleIndex) => {
              const moduleDuration = getModuleDuration(module.id);
              return (
                <AccordionItem
                  value={String(module.id)}
                  key={module.id}
                  className={`border border-gray-200 rounded-lg overflow-hidden`}
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline transition-colors duration-500">
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2 text-left">
                        <span className="font-semibold text-gray-900">
                          {module.order}. {module.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>{module.lessons.length} lessons</span>
                        <span>•</span>
                        <span>{formatDuration(moduleDuration)}</span>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="border-t border-gray-200 bg-gray-50 overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    {module.lessons.map((lesson, lessonIndex) => {
                      const hasVideo =
                        lesson.media && lesson.media.type === "VIDEO";
                      return (
                        <div
                          key={lesson.id}
                          className="flex cursor-not-allowed items-center justify-between gap-3 p-3 border-b border-gray-200 last:border-b-0 hover:bg-white transition-colors "
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                              {lesson.order}
                            </div>

                            <div className="flex-shrink-0">
                              {hasVideo && (
                                <Video className="w-4 h-4 text-gray-600" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate text-gray-900">
                                {lesson.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  <span>
                                    {formatDuration(lesson.durationSec)}
                                  </span>
                                </div>
                                {hasVideo && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs py-0 px-1"
                                  >
                                    Video
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <Lock className="w-4 h-4 text-gray-600" />
                        </div>
                      );
                    })}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    </>
  );
}
