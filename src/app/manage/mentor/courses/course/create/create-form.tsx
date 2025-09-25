"use client";

import { useState } from "react";
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
  Clock,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import {
  MentorCreateCourseSchema,
  MentorCreateCourseType,
} from "@/schemaValidations/mentorCourse.schema";
import { useCreateCourseWithContentMutation } from "@/queries/useMentorCourse";
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
import { CategoryMultiSelect } from "@/components/ui/category-multi-select";
import { LabelMultiSelect } from "@/components/ui/label-multi-select";
import { CoursePreviewPage } from "@/components/CoursePreview/CoursePreviewPage";
import { VideoUpload } from "@/components/VideoUpload/VideoUpload";
import videoApiRequest from "@/apiRequests/video";
import axios from "axios";
import RichTextEditor from "@/components/RichTextEditor";

interface ModuleForm {
  id: string;
  title: string;
  order: number;
  lessons: LessonForm[];
}

interface LessonForm {
  id: string;
  title: string;
  order: number;
  commentsEnabled: boolean;
  durationSec: number;
  createdLessonId?: number;
  pendingVideoFile?: File;
  videoUploadStatus?: "idle" | "uploading" | "success" | "error";
}

interface CourseFormData extends Omit<MentorCreateCourseType, "needToLearn"> {
  needToLearn: string;
  modules: ModuleForm[];
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
  onVideoFileSelect,
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
  onVideoFileSelect?: (
    moduleIndex: number,
    lessonIndex: number,
    file: File | null
  ) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div ref={setNodeRef} style={style}>
      <AccordionItem
        value={`module-${module.id}`}
        className="border border-gray-200 rounded-lg mb-4"
      >
        <div className="flex items-center justify-between">
          <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 rounded-t-lg flex items-center gap-3 flex-1">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab hover:cursor-grabbing p-1 hover:bg-gray-100 rounded"
            >
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
            <span className="font-medium">
              Module {module.order}: {module.title || "Untitled Module"}
            </span>
            <Badge variant="secondary" className="text-xs ml-2">
              {module.lessons.length} lessons
            </Badge>
          </AccordionTrigger>

          {/* Delete button outside trigger */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onDeleteModule(moduleIndex)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
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

            {/* Lessons Section */}
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
                  sensors={sensors}
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
                          onVideoFileSelect={onVideoFileSelect}
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

// Sortable Lesson Component
function SortableLesson({
  lesson,
  lessonIndex,
  moduleIndex,
  onUpdateLesson,
  onDeleteLesson,
  onVideoFileSelect,
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
  onVideoFileSelect?: (
    moduleIndex: number,
    lessonIndex: number,
    file: File | null
  ) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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

        <div className="flex-1">
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
            value={lesson.durationSec === 0 ? "" : lesson.durationSec}
            onChange={(e) => {
              const value = e.target.value;
              const parsed = value === "" ? 0 : parseInt(value, 10);
              onUpdateLesson(moduleIndex, lessonIndex, {
                durationSec: isNaN(parsed) ? 0 : parsed,
              });
            }}
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

      {/* Video Upload Section */}
      <div className="ml-8 mt-4">
        <div className="space-y-2">
          <Label className="text-xs">Video Upload</Label>
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                onVideoFileSelect?.(moduleIndex, lessonIndex, file);
              }}
              className="text-xs file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
            />
            {lesson.pendingVideoFile && (
              <Badge variant="secondary" className="text-xs">
                {lesson.pendingVideoFile.name}
              </Badge>
            )}
            {lesson.videoUploadStatus === "uploading" && (
              <Badge variant="outline" className="text-xs text-blue-600">
                Uploading...
              </Badge>
            )}
            {lesson.videoUploadStatus === "success" && (
              <Badge variant="outline" className="text-xs text-green-600">
                ✓ Uploaded
              </Badge>
            )}
            {lesson.videoUploadStatus === "error" && (
              <Badge variant="outline" className="text-xs text-red-600">
                ✗ Failed
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateForm() {
  const router = useRouter();
  const [modules, setModules] = useState<ModuleForm[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [courseCreated, setCourseCreated] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const form = useForm<Omit<CourseFormData, "modules">>({
    resolver: zodResolver(
      MentorCreateCourseSchema.extend({
        needToLearn: MentorCreateCourseSchema.shape.needToLearn
          .transform((val) => (Array.isArray(val) ? val.join("\n") : val))
          .pipe(MentorCreateCourseSchema.shape.needToLearn.element),
      })
        .omit({ needToLearn: true })
        .extend({
          needToLearn: MentorCreateCourseSchema.shape.needToLearn.element,
        })
    ),
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

  const createCourseMutation = useCreateCourseWithContentMutation();

  const preparePreviewData = () => {
    const formData = form.getValues();
    return {
      ...formData,
      categories: formData.categories || [],
      labels: formData.labels || [],
      needToLearn: formData.needToLearn
        ? formData.needToLearn.split("\n").filter((item) => item.trim())
        : [],
      modules: modules.map((module) => ({
        ...module,
        lessons: module.lessons.map((lesson) => ({
          ...lesson,
        })),
      })),
    };
  };

  const validateCourseData = () => {
    const errors: string[] = [];

    // Validate form fields first
    const formData = form.getValues();

    // Required course fields
    if (!formData.title?.trim()) errors.push("Course title is required");
    if (!formData.subtitle?.trim()) errors.push("Course subtitle is required");
    if (!formData.description?.trim())
      errors.push("Course description is required");
    if (!formData.thumbnail?.trim())
      errors.push("Course thumbnail is required");
    if (formData.price <= 0) errors.push("Course price must be greater than 0");

    // Validate modules
    if (modules.length === 0) {
      errors.push("At least one module is required");
    } else {
      modules.forEach((module, moduleIndex) => {
        if (!module.title?.trim()) {
          errors.push(`Module ${moduleIndex + 1}: Title is required`);
        }

        // Validate lessons in each module
        if (module.lessons.length === 0) {
          errors.push(
            `Module ${moduleIndex + 1}: At least one lesson is required`
          );
        } else {
          module.lessons.forEach((lesson, lessonIndex) => {
            if (!lesson.title?.trim()) {
              errors.push(
                `Module ${moduleIndex + 1}, Lesson ${
                  lessonIndex + 1
                }: Title is required`
              );
            }
          });
        }
      });
    }

    setValidationErrors(errors);
    return errors;
  };

  const handlePreview = async () => {
    // Validate course data first
    const validationErrors = validateCourseData();
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: validationErrors.join(", "),
        variant: "destructive",
      });
      return;
    }

    // Trigger form validation
    const isValid = await form.trigger();
    if (isValid) {
      setShowPreview(true);
    }
  };

  const handleVideoFileSelect = (
    moduleIndex: number,
    lessonIndex: number,
    file: File | null
  ) => {
    const updated = [...modules];
    updated[moduleIndex].lessons[lessonIndex] = {
      ...updated[moduleIndex].lessons[lessonIndex],
      pendingVideoFile: file || undefined,
      videoUploadStatus: file ? "idle" : undefined,
    };
    setModules(updated);
  };

  const uploadAllVideos = async (modulesWithIds: ModuleForm[]) => {
    const videoUploads: Promise<void>[] = [];

    // Collect all lessons that have pending video files
    const lessonsToUpload: Array<{
      moduleIndex: number;
      lessonIndex: number;
      lessonId: number;
      file: File;
    }> = [];

    modulesWithIds.forEach((module, moduleIndex) => {
      module.lessons.forEach((lesson, lessonIndex) => {
        if (lesson.pendingVideoFile && lesson.createdLessonId) {
          lessonsToUpload.push({
            moduleIndex,
            lessonIndex,
            lessonId: lesson.createdLessonId,
            file: lesson.pendingVideoFile,
          });
        }
      });
    });

    // Upload all videos concurrently
    for (const {
      moduleIndex,
      lessonIndex,
      lessonId,
      file,
    } of lessonsToUpload) {
      const uploadPromise = (async () => {
        try {
          // Update status to uploading
          setModules((prev) => {
            const updated = [...prev];
            updated[moduleIndex].lessons[lessonIndex].videoUploadStatus =
              "uploading";
            return updated;
          });

          // Get presigned URL
          const response = await videoApiRequest.getVideoUploadUrl({
            lessonId,
            filename: file.name,
            contentType: file.type,
          });

          // Upload to S3
          await axios.put(response.payload.result.uploadUrl, file, {
            headers: { "Content-Type": file.type },
          });

          // Update status to success
          setModules((prev) => {
            const updated = [...prev];
            updated[moduleIndex].lessons[lessonIndex].videoUploadStatus =
              "success";
            return updated;
          });

          console.log(`Video uploaded successfully for lesson ${lessonId}`);
        } catch (error) {
          // Update status to error
          setModules((prev) => {
            const updated = [...prev];
            updated[moduleIndex].lessons[lessonIndex].videoUploadStatus =
              "error";
            return updated;
          });

          console.error(`Video upload failed for lesson ${lessonId}:`, error);
        }
      })();

      videoUploads.push(uploadPromise);
    }

    // Wait for all uploads to complete
    await Promise.allSettled(videoUploads);
  };

  const handleBack = () => {
    router.back();
  };

  const addModule = () => {
    const newModule: ModuleForm = {
      id: `module-${Date.now()}`,
      title: "",
      order: modules.length + 1,
      lessons: [],
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
      id: `lesson-${Date.now()}`,
      title: "",
      order: updated[moduleIndex].lessons.length + 1,
      commentsEnabled: true,
      durationSec: 0,
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

  const onSubmit = async (data: Omit<CourseFormData, "modules">) => {
    try {
      // Validate all course data first
      const validationErrors = validateCourseData();
      if (validationErrors.length > 0) {
        toast({
          title: "Validation Error",
          description: validationErrors.join(", "),
          variant: "destructive",
        });
        return;
      }

      const courseData = {
        ...data,
        needToLearn: data.needToLearn.split("\n").filter((item) => item.trim()),
      };

      const moduleData = modules.map((module) => ({
        title: module.title,
        order: module.order,
        lessons: module.lessons.map((lesson) => ({
          title: lesson.title,
          order: lesson.order,
          commentsEnabled: lesson.commentsEnabled,
          durationSec: lesson.durationSec,
        })),
      }));

      const response = await createCourseMutation.mutateAsync({
        course: courseData,
        modules: moduleData,
      });

      let updatedModules = modules;
      if (response && response.modules) {
        const createdModules = response.modules;
        updatedModules = modules.map((module, moduleIndex) => ({
          ...module,
          lessons: module.lessons.map((lesson, lessonIndex) => {
            const createdLesson =
              createdModules[moduleIndex]?.lessons[lessonIndex];
            return {
              ...lesson,
              createdLessonId: createdLesson?.payload?.result?.id || undefined,
            };
          }),
        }));
        setModules(updatedModules);
      }

      setCourseCreated(true);

      toast({
        title: "Course Created Successfully!",
        description: "Now uploading videos for lessons with video files...",
      });

      await uploadAllVideos(updatedModules);

      const totalVideos = updatedModules.reduce(
        (acc, module) =>
          acc +
          module.lessons.filter((lesson) => lesson.pendingVideoFile).length,
        0
      );

      const successfulUploads = updatedModules.reduce(
        (acc, module) =>
          acc +
          module.lessons.filter(
            (lesson) => lesson.videoUploadStatus === "success"
          ).length,
        0
      );

      toast({
        title: "Upload Complete!",
        description: `Course created successfully! ${successfulUploads}/${totalVideos} videos uploaded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create course. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (showPreview) {
    return (
      <CoursePreviewPage
        courseData={preparePreviewData()}
        onBack={() => setShowPreview(false)}
        onEdit={() => setShowPreview(false)}
        onCreateCourse={form.handleSubmit(onSubmit)}
        isCreating={createCourseMutation.isPending}
      />
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
                Create New Course
              </CardTitle>
              <p className="text-sm opacity-90">
                Build your complete course with modules and lessons
              </p>
            </div>
          </div>
        </CardHeader>

        <Separator />
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        content={field.value}
                        onChange={field.onChange}
                        placeholder=""
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
                          min={0}
                          value={field.value === 0 ? "" : field.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            const parsed = value === "" ? 0 : parseInt(value);
                            field.onChange(parsed);
                          }}
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
                        content={field.value}
                        onChange={field.onChange}
                        placeholder=""
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Course Content</h3>
                    <p className="text-sm text-gray-600">
                      Add modules and lessons to your course
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
                            onVideoFileSelect={handleVideoFileSelect}
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

              {validationErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-800 mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">
                      Please fix the following errors:
                    </span>
                  </div>
                  <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Cancel
                </Button>
                {!courseCreated ? (
                  <>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handlePreview}
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Preview Course
                    </Button>
                    <Button
                      type="submit"
                      disabled={createCourseMutation.isPending}
                      onClick={() => {
                        setTimeout(() => validateCourseData(), 100);
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {createCourseMutation.isPending && (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      )}
                      <Save className="h-4 w-4 mr-2" />
                      Create Course
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={() => router.push("/manage/mentor/courses/course")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Finish & Go to Courses
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
