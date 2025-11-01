"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  BookOpen,
  Plus,
  Trash2,
  Save,
  GripVertical,
  Play,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import {
  MentorUpdateCourseSchema,
  MentorUpdateCourseType,
} from "@/schemaValidations/mentorCourse.schema";
import {
  useMentorCourseDetail,
  useMentorUpdateCourseMutation,
  useCreateModuleMutation,
  useCreateLessonMutation,
} from "@/queries/useMentorCourse";
import { CategoryMultiSelect } from "@/components/ui/category-multi-select";
import { LabelMultiSelect } from "@/components/ui/label-multi-select";
import { VideoUpload } from "@/components/VideoUpload/VideoUpload";
import RichTextEditor from "@/components/RichTextEditor";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ModuleForm {
  id: number | string;
  title: string;
  order: number;
  lessons: LessonForm[];
  isNew?: boolean;
}

interface LessonForm {
  id: number | string;
  title: string;
  order: number;
  commentsEnabled: boolean;
  durationSec: number;
  moduleId?: number;
  isNew?: boolean;
  media?: {
    id: number;
    type: string;
    s3Key: string;
    status: string;
    durationSec: number;
    thumbnailKey: string | null;
    createdAt: string;
  } | null;
}

interface CourseFormData extends Omit<MentorUpdateCourseType, "needToLearn"> {
  needToLearn: string;
}

interface EditFormProps {
  courseId: number;
}

// Sortable Module Component
function SortableModule({
  module,
  moduleIndex,
  onUpdateModule,
  onDeleteModule,
  onAddLesson,
  onUpdateLesson,
  onDeleteLesson,
  onLessonDragEnd,
}: {
  module: ModuleForm;
  moduleIndex: number;
  onUpdateModule: (index: number, title: string) => void;
  onDeleteModule: (index: number) => void;
  onAddLesson: (moduleIndex: number) => void;
  onUpdateLesson: (
    moduleIndex: number,
    lessonIndex: number,
    data: Partial<LessonForm>
  ) => void;
  onDeleteLesson: (moduleIndex: number, lessonIndex: number) => void;
  onLessonDragEnd: (moduleIndex: number, event: DragEndEvent) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <AccordionItem
        value={`module-${module.id}`}
        className="border border-gray-200 rounded-lg mb-4"
      >
        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50 rounded-t-lg">
          <div className="flex items-center gap-3 w-full">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab hover:cursor-grabbing p-1 hover:bg-gray-100 rounded"
            >
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>

            <div className="flex-1 text-left">
              <div className="flex items-center gap-3">
                <span className="font-medium">
                  Module {module.order}: {module.title || "Untitled Module"}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {module.lessons.length} lessons
                </Badge>
                {module.isNew && (
                  <Badge
                    variant="outline"
                    className="text-xs text-green-600 border-green-200 bg-green-50"
                  >
                    New
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              onDeleteModule(moduleIndex);
            }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-4 pb-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor={`module-title-${module.id}`}>Module Title</Label>
              <Input
                id={`module-title-${module.id}`}
                value={module.title}
                onChange={(e) => onUpdateModule(moduleIndex, e.target.value)}
                placeholder="Enter module title..."
                className="mt-1"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Lessons</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onAddLesson(moduleIndex)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Lesson
                </Button>
              </div>

              {module.lessons.length > 0 ? (
                <DndContext
                  sensors={useSensors(
                    useSensor(PointerSensor),
                    useSensor(KeyboardSensor, {
                      coordinateGetter: sortableKeyboardCoordinates,
                    })
                  )}
                  collisionDetection={closestCenter}
                  onDragEnd={(event) => onLessonDragEnd(moduleIndex, event)}
                >
                  <SortableContext
                    items={module.lessons.map((lesson) => lesson.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <SortableLesson
                          key={lesson.id}
                          lesson={lesson}
                          lessonIndex={lessonIndex}
                          moduleIndex={moduleIndex}
                          onUpdateLesson={onUpdateLesson}
                          onDeleteLesson={onDeleteLesson}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                  <Play className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No lessons yet. Add your first lesson!</p>
                </div>
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </div>
  );
}

function SortableLesson({
  lesson,
  lessonIndex,
  moduleIndex,
  onUpdateLesson,
  onDeleteLesson,
}: {
  lesson: LessonForm;
  lessonIndex: number;
  moduleIndex: number;
  onUpdateLesson: (
    moduleIndex: number,
    lessonIndex: number,
    data: Partial<LessonForm>
  ) => void;
  onDeleteLesson: (moduleIndex: number, lessonIndex: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const baseUrl = "https://mconnectv1.s3.ap-southeast-1.amazonaws.com/";

  const currentVideoUrl = lesson?.media?.s3Key
    ? `${baseUrl}${lesson.media.s3Key}`
    : undefined;

  console.log("currentVideoUrl", currentVideoUrl);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-3 bg-white border border-gray-200 rounded-lg space-y-3"
    >
      <div className="flex items-center gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab hover:cursor-grabbing p-1 hover:bg-gray-100 rounded"
        >
          <GripVertical className="h-3 w-3 text-gray-400" />
        </div>

        <Play className="h-4 w-4 text-blue-500" />

        <div className="flex-1 flex items-center gap-2">
          <Input
            value={lesson.title}
            onChange={(e) =>
              onUpdateLesson(moduleIndex, lessonIndex, {
                title: e.target.value,
              })
            }
            placeholder={`Lesson ${lesson.order} title...`}
            className="border-0 p-0 font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {lesson.isNew && (
            <Badge
              variant="outline"
              className="text-xs text-green-600 border-green-200 bg-green-50"
            >
              New
            </Badge>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onDeleteLesson(moduleIndex, lessonIndex)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 ml-8">
        <div>
          <Label className="text-xs">Duration (seconds)</Label>
          <Input
            type="number"
            value={lesson.durationSec}
            onChange={(e) =>
              onUpdateLesson(moduleIndex, lessonIndex, {
                durationSec: parseInt(e.target.value) || 0,
              })
            }
            placeholder="0"
            className="mt-1"
            min="0"
          />
        </div>
        <div className="flex items-center space-x-2 mt-5">
          <input
            type="checkbox"
            id={`comments-${lesson.id}`}
            checked={lesson.commentsEnabled}
            onChange={(e) =>
              onUpdateLesson(moduleIndex, lessonIndex, {
                commentsEnabled: e.target.checked,
              })
            }
            className="rounded"
          />
          <Label htmlFor={`comments-${lesson.id}`} className="text-xs">
            Enable Comments
          </Label>
        </div>
      </div>

      {typeof lesson.id === "number" && (
        <div className="ml-8 mt-4">
          <VideoUpload
            lessonId={lesson.id}
            currentVideoUrl={
              lesson.media?.s3Key
                ? `https://mconnectv1.s3.ap-southeast-1.amazonaws.com/${lesson.media.s3Key}`
                : undefined
            }
            onUploadSuccess={(videoKey) => {
              console.log(`Video uploaded for lesson ${lesson.id}:`, videoKey);
              toast({
                title: "Video uploaded successfully",
                description: "The video has been uploaded and processed.",
              });
            }}
            onUploadError={(error) => {
              console.error(
                `Video upload failed for lesson ${lesson.id}:`,
                error
              );
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function EditForm({ courseId }: EditFormProps) {
  const router = useRouter();
  const {
    data: course,
    isLoading,
    isError,
    refetch,
  } = useMentorCourseDetail(courseId);
  const [modules, setModules] = useState<ModuleForm[]>([]);

  const form = useForm<CourseFormData>({
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      needToLearn: "",
      price: 0,
      thumbnail: "",
      categories: [],
      labels: [],
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const updateCourseMutation = useMentorUpdateCourseMutation();
  const createModuleMutation = useCreateModuleMutation();
  const createLessonMutation = useCreateLessonMutation();

  useEffect(() => {
    if (course) {
      form.reset({
        title: course.title || "",
        subtitle: course.subtitle || "",
        description: course.description || "",
        needToLearn: Array.isArray((course as any).needToLearn)
          ? (course as any).needToLearn.join("\n")
          : "",
        price: course.price ? parseFloat(course.price.toString()) : 0,
        thumbnail: course.thumbnail || "",
        categories:
          course.categories
            ?.map((cat: any) => cat.courseCategory?.id)
            .filter(Boolean) || [],
        labels:
          course.labels
            ?.map((label: any) => label.courseLabel?.id)
            .filter(Boolean) || [],
      });

      const initialModules =
        course.modules?.map((module: any) => ({
          id: module.id,
          title: module.title,
          order: module.order,
          lessons:
            module.lessons?.map((lesson: any) => ({
              id: lesson.id,
              title: lesson.title,
              order: lesson.order,
              commentsEnabled: lesson.commentsEnabled,
              durationSec: lesson.durationSec,
              moduleId: lesson.moduleId,
              media: lesson.media || null,
            })) || [],
        })) || [];

      setModules(initialModules);
    }
  }, [course, form]);

  const handleBack = () => {
    router.back();
  };

  const addModule = () => {
    const newModule: ModuleForm = {
      id: `new-module-${Date.now()}`,
      title: "",
      order: modules.length + 1,
      lessons: [],
      isNew: true,
    };
    setModules([...modules, newModule]);
  };

  const updateModule = (index: number, title: string) => {
    const updated = [...modules];
    updated[index] = { ...updated[index], title };
    setModules(updated);
  };

  const deleteModule = (index: number) => {
    const updated = modules.filter((_, i) => i !== index);
    const reordered = updated.map((module, i) => ({
      ...module,
      order: i + 1,
    }));
    setModules(reordered);
  };

  const addLesson = (moduleIndex: number) => {
    const updated = [...modules];
    const newLesson: LessonForm = {
      id: `new-lesson-${Date.now()}`,
      title: "",
      order: updated[moduleIndex].lessons.length + 1,
      commentsEnabled: true,
      durationSec: 0,
      isNew: true,
    };
    updated[moduleIndex].lessons.push(newLesson);
    setModules(updated);
  };

  const updateLesson = (
    moduleIndex: number,
    lessonIndex: number,
    data: Partial<LessonForm>
  ) => {
    const updated = [...modules];
    updated[moduleIndex].lessons[lessonIndex] = {
      ...updated[moduleIndex].lessons[lessonIndex],
      ...data,
    };
    setModules(updated);
  };

  const deleteLesson = (moduleIndex: number, lessonIndex: number) => {
    const updated = [...modules];
    updated[moduleIndex].lessons = updated[moduleIndex].lessons
      .filter((_, i) => i !== lessonIndex)
      .map((lesson, i) => ({ ...lesson, order: i + 1 }));
    setModules(updated);
  };

  const handleModuleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = modules.findIndex((m) => m.id === active.id);
      const newIndex = modules.findIndex((m) => m.id === over.id);

      const reordered = arrayMove(modules, oldIndex, newIndex);
      const withUpdatedOrder = reordered.map((module, index) => ({
        ...module,
        order: index + 1,
      }));
      setModules(withUpdatedOrder);
    }
  };

  const handleLessonDragEnd = (moduleIndex: number, event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const updated = [...modules];
      const lessons = updated[moduleIndex].lessons;

      const oldIndex = lessons.findIndex((l) => l.id === active.id);
      const newIndex = lessons.findIndex((l) => l.id === over.id);

      updated[moduleIndex].lessons = arrayMove(lessons, oldIndex, newIndex).map(
        (lesson, index) => ({ ...lesson, order: index + 1 })
      );

      setModules(updated);
    }
  };

  const onSubmit = async (data: CourseFormData) => {
    try {
      // Update course basic info
      const courseData = {
        ...data,
        needToLearn: data.needToLearn
          ? data.needToLearn.split("\n").filter((item) => item.trim())
          : undefined,
      };

      await updateCourseMutation.mutateAsync({
        id: courseId,
        body: courseData,
      });

      // Create new modules and lessons
      for (const module of modules) {
        if (module.isNew && typeof module.id === "string") {
          const createdModule = await createModuleMutation.mutateAsync({
            courseId,
            body: {
              title: module.title,
              order: module.order,
            },
          });

          // Create lessons for the new module
          for (const lesson of module.lessons) {
            if (lesson.isNew) {
              await createLessonMutation.mutateAsync({
                moduleId: createdModule.payload.result.id,
                body: {
                  title: lesson.title,
                  order: lesson.order,
                  commentsEnabled: lesson.commentsEnabled,
                  durationSec: lesson.durationSec,
                },
              });
            }
          }
        } else if (typeof module.id === "number") {
          // Create new lessons for existing modules
          for (const lesson of module.lessons) {
            if (lesson.isNew && typeof lesson.id === "string") {
              await createLessonMutation.mutateAsync({
                moduleId: module.id,
                body: {
                  title: lesson.title,
                  order: lesson.order,
                  commentsEnabled: lesson.commentsEnabled,
                  durationSec: lesson.durationSec,
                },
              });
            }
          }
        }
      }

      toast({
        title: "Success",
        description: "Course updated successfully!",
      });

      router.push("/manage/mentor/courses/course");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update course. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto min-w-7xl p-6">
        <Card className="rounded-md shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="py-16 text-center">
              <div className="inline-flex items-center gap-3 text-gray-600">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent"></div>
                Loading course details...
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="mx-auto min-w-7xl p-6">
        <Card className="rounded-md shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="py-16 text-center">
              <div className="inline-flex flex-col items-center gap-3 text-red-600">
                <div className="rounded-md bg-red-50 p-3">
                  <BookOpen className="h-5 w-5" />
                </div>
                <span>Failed to load course details. Please try again.</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto min-w-7xl p-6">
      <Card className="rounded-md shadow-sm border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between bg-blue-500 text-white dark:bg-black p-6 rounded-t-md">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="rounded-md bg-white/20 p-2 border border-white/20">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">
                Edit Course: {course.title}
              </CardTitle>
              <p className="text-sm opacity-90">
                Update course content and structure
              </p>
            </div>
          </div>
        </CardHeader>

        <Separator />
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Course Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter course title..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter course subtitle..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        content={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Enter course description..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (VND)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="needToLearn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What students will learn</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        content={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Enter what students will learn from this course..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Categories and Labels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="categories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categories</FormLabel>
                      <FormControl>
                        <CategoryMultiSelect
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select categories..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="labels"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Labels</FormLabel>
                      <FormControl>
                        <LabelMultiSelect
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select labels..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Modules and Lessons Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Course Content</h3>
                    <p className="text-sm text-gray-600">
                      Manage modules and lessons
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addModule}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Module
                  </Button>
                </div>

                {modules.length > 0 ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleModuleDragEnd}
                  >
                    <SortableContext
                      items={modules.map((module) => module.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <Accordion type="multiple" className="w-full">
                        {modules.map((module, index) => (
                          <SortableModule
                            key={module.id}
                            module={module}
                            moduleIndex={index}
                            onUpdateModule={updateModule}
                            onDeleteModule={deleteModule}
                            onAddLesson={addLesson}
                            onUpdateLesson={updateLesson}
                            onDeleteLesson={deleteLesson}
                            onLessonDragEnd={handleLessonDragEnd}
                          />
                        ))}
                      </Accordion>
                    </SortableContext>
                  </DndContext>
                ) : (
                  <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h4 className="text-lg font-medium mb-2">No modules yet</h4>
                    <p className="mb-4">
                      Start building your course by adding the first module
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addModule}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Module
                    </Button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateCourseMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {updateCourseMutation.isPending && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  )}
                  <Save className="h-4 w-4 mr-2" />
                  Update Course
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
