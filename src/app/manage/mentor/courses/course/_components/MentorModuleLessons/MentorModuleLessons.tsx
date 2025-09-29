"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Video, FileText, Edit, Plus } from "lucide-react";
import { useState } from "react";

interface Lesson {
  id: number;
  title: string;
  order: number;
  durationSec: number;
  commentsEnabled: boolean;
  media: {
    id: number;
    type: string;
    s3Key: string;
    status: string;
    durationSec: number;
    thumbnailKey: string | null;
  } | null;
}

interface Module {
  id: number;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface MentorModuleLessonsProps {
  modules: Module[];
  onSelectLesson?: (lesson: Lesson) => void;
}

export default function MentorModuleLessons({
  modules,
  onSelectLesson,
}: MentorModuleLessonsProps) {
  const [expandedModules, setExpandedModules] = useState<Set<number>>(
    new Set([modules[0]?.id].filter(Boolean))
  );

  const accordionValue = Array.from(expandedModules).map(String);
  const onAccordionChange = (vals: string[]) => {
    setExpandedModules(new Set(vals.map(Number)));
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return "0m";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m ${remainingSeconds > 0 ? ` ${remainingSeconds}s` : ""}`;
  };

  const getModuleDuration = (module: Module) => {
    return module.lessons.reduce(
      (total, lesson) => total + (lesson.durationSec || 0),
      0
    );
  };

  const getTotalCourseDuration = () => {
    return modules.reduce(
      (total, module) => total + getModuleDuration(module),
      0
    );
  };

  const getTotalLessons = () => {
    return modules.reduce((total, module) => total + module.lessons.length, 0);
  };

  if (!modules || modules.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Course Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No modules found</p>
            <p className="text-sm text-gray-500">
              Add modules and lessons to your course
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Course Content</CardTitle>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>
              {modules.length} module{modules.length !== 1 ? "s" : ""}
            </span>
            <span>•</span>
            <span>
              {getTotalLessons()} lesson{getTotalLessons() !== 1 ? "s" : ""}
            </span>
            <span>•</span>
            <span>{formatDuration(getTotalCourseDuration())} total</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion
          type="multiple"
          value={accordionValue}
          onValueChange={onAccordionChange}
          className="w-full"
        >
          {modules
            .sort((a, b) => a.order - b.order)
            .map((module) => (
              <AccordionItem key={module.id} value={module.id.toString()}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-left">
                        {module.title}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mr-2">
                      <span>
                        {module.lessons.length} lesson
                        {module.lessons.length !== 1 ? "s" : ""}
                      </span>
                      <span>•</span>
                      <span>{formatDuration(getModuleDuration(module))}</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-4 space-y-2">
                    {module.lessons
                      .sort((a, b) => a.order - b.order)
                      .map((lesson, index) => (
                        <div
                          key={lesson.id}
                          onClick={() => onSelectLesson?.(lesson)}
                          className="flex items-center justify-between p-3 rounded-lg border bg-gray-50 hover:bg-gray-100"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              {lesson.media ? (
                                <Video className="h-4 w-4 text-blue-500" />
                              ) : (
                                <FileText className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {lesson.title}
                              </h4>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {formatDuration(lesson.durationSec || 0)}
                                </span>
                                {lesson.media && (
                                  <>
                                    <span>•</span>
                                    <Badge
                                      variant={
                                        lesson.media.status === "PROCESSED"
                                          ? "default"
                                          : "secondary"
                                      }
                                      className="text-xs"
                                    >
                                      {lesson.media.status}
                                    </Badge>
                                  </>
                                )}
                                {lesson.commentsEnabled && (
                                  <>
                                    <span>•</span>
                                    <span className="text-green-600">
                                      Comments enabled
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                    {module.lessons.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        <FileText className="h-6 w-6 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No lessons in this module</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
