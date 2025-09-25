"use client";

import { useState, useEffect } from "react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Plus,
  GripVertical,
  Edit2,
  Trash2,
  Save,
  X,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  useCreateModuleMutation,
  useCreateLessonMutation,
  useUpdateModuleOrderMutation,
  useUpdateLessonOrderMutation,
} from "@/queries/useMentorCourse";
import { CourseType } from "@/schemaValidations/mentorCourse.schema";

interface Module {
  id: number;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  order: number;
  moduleId: number;
  durationSec: number;
  commentsEnabled: boolean;
}

interface CourseBuilderProps {
  mode?: "create" | "edit";
  courseId?: number | null;
  initialData?: CourseType;
  onBack?: () => void;
}

interface SortableModuleProps {
  module: Module;
  onAddLesson: (moduleId: number) => void;
  onUpdateModule: (moduleId: number, title: string) => void;
  onDeleteModule: (moduleId: number) => void;
  onUpdateLesson: (lessonId: number, title: string) => void;
  onDeleteLesson: (lessonId: number) => void;
}

function SortableModule({
  module,
  onAddLesson,
  onUpdateModule,
  onDeleteModule,
  onUpdateLesson,
  onDeleteLesson,
}: SortableModuleProps) {
  const [isEditingModule, setIsEditingModule] = useState(false);
  const [moduleTitle, setModuleTitle] = useState(module.title);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleModuleEdit = () => {
    if (isEditingModule) {
      onUpdateModule(module.id, moduleTitle);
      setIsEditingModule(false);
    } else {
      setIsEditingModule(true);
      setModuleTitle(module.title);
    }
  };

  const handleLessonEdit = (lesson: Lesson) => {
    if (editingLessonId === lesson.id) {
      onUpdateLesson(lesson.id, lessonTitle);
      setEditingLessonId(null);
    } else {
      setEditingLessonId(lesson.id);
      setLessonTitle(lesson.title);
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
      <AccordionItem value={String(module.id)} className="border rounded-lg">
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing"
              >
                <GripVertical className="h-4 w-4 text-gray-400" />
              </div>

              {isEditingModule ? (
                <Input
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  className="w-64 h-8"
                  onClick={(e) => e.stopPropagation()}
                  onKeyPress={(e) => {
                    e.stopPropagation();
                    if (e.key === "Enter") handleModuleEdit();
                  }}
                />
              ) : (
                <span className="font-semibold text-left">
                  {module.order}. {module.title}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary">{module.lessons.length} lessons</Badge>

              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleModuleEdit();
                }}
              >
                {isEditingModule ? (
                  <Save className="h-4 w-4" />
                ) : (
                  <Edit2 className="h-4 w-4" />
                )}
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteModule(module.id);
                }}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent className="border-t bg-gray-50 p-4">
          <div className="space-y-2">
            {module.lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="flex items-center justify-between p-3 bg-white rounded border"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">
                    {lesson.order}.
                  </span>

                  {editingLessonId === lesson.id ? (
                    <Input
                      value={lessonTitle}
                      onChange={(e) => setLessonTitle(e.target.value)}
                      className="flex-1 h-8"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleLessonEdit(lesson);
                      }}
                    />
                  ) : (
                    <span className="flex-1">{lesson.title}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {Math.floor(lesson.durationSec / 60)}min
                  </Badge>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleLessonEdit(lesson)}
                  >
                    {editingLessonId === lesson.id ? (
                      <Save className="h-3 w-3" />
                    ) : (
                      <Edit2 className="h-3 w-3" />
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDeleteLesson(lesson.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}

            <Button
              onClick={() => onAddLesson(module.id)}
              variant="outline"
              size="sm"
              className="w-full border-dashed"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Lesson
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </div>
  );
}

export function CourseBuilder({
  mode = "create",
  courseId,
  initialData,
  onBack,
}: CourseBuilderProps) {
  const [modules, setModules] = useState<Module[]>([]);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [addingLessonToModule, setAddingLessonToModule] = useState<
    number | null
  >(null);

  const createModuleMutation = useCreateModuleMutation();
  const createLessonMutation = useCreateLessonMutation();
  const updateModuleOrderMutation = useUpdateModuleOrderMutation();
  const updateLessonOrderMutation = useUpdateLessonOrderMutation();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addModule = async () => {
    if (!newModuleTitle.trim() || !courseId) return;

    try {
      const response = await createModuleMutation.mutateAsync({
        courseId,
        body: {
          title: newModuleTitle.trim(),
          order: modules.length + 1,
        },
      });

      const newModule: Module = {
        id: response.payload.result.id,
        title: response.payload.result.title,
        order: response.payload.result.order,
        lessons: [],
      };

      setModules([...modules, newModule]);
      setNewModuleTitle("");
      toast({
        title: "Module added",
        description: `"${newModuleTitle}" was added successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to add module",
        description: error?.message ?? "Please try again.",
        variant: "destructive",
      });
    }
  };

  const addLesson = async (moduleId: number) => {
    if (!newLessonTitle.trim()) return;

    const module = modules.find((m) => m.id === moduleId);
    if (!module) return;

    try {
      const response = await createLessonMutation.mutateAsync({
        moduleId,
        body: {
          title: newLessonTitle.trim(),
          order: module.lessons.length + 1,
          commentsEnabled: true,
          durationSec: 0,
        },
      });

      const newLesson: Lesson = {
        id: response.payload.result.id,
        title: response.payload.result.title,
        order: response.payload.result.order,
        moduleId: response.payload.result.moduleId,
        durationSec: response.payload.result.durationSec,
        commentsEnabled: response.payload.result.commentsEnabled,
      };

      setModules(
        modules.map((m) =>
          m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m
        )
      );

      setNewLessonTitle("");
      setAddingLessonToModule(null);
      toast({
        title: "Lesson added",
        description: `"${newLessonTitle}" was added successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to add lesson",
        description: error?.message ?? "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = modules.findIndex((m) => m.id === active.id);
      const newIndex = modules.findIndex((m) => m.id === over.id);

      const newModules = arrayMove(modules, oldIndex, newIndex).map(
        (module, index) => ({
          ...module,
          order: index + 1,
        })
      );

      setModules(newModules);

      // Update order on server
      if (courseId) {
        updateModuleOrderMutation.mutate({
          courseId,
          modules: newModules.map((m) => ({ id: m.id, order: m.order })),
        });
      }
    }
  };

  if (!courseId) {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="bg-blue-500 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-white hover:bg-blue-600"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-xl font-semibold">
                Course Builder
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Add Module Section */}
            <div className="flex gap-2">
              <Input
                placeholder="Enter module title"
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addModule()}
              />
              <Button
                onClick={addModule}
                disabled={createModuleMutation.isPending}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Module
              </Button>
            </div>

            {/* Modules List with Drag and Drop */}
            {modules.length > 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={modules.map((m) => m.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <Accordion
                    type="multiple"
                    defaultValue={modules.map((m) => String(m.id))}
                  >
                    {modules.map((module) => (
                      <SortableModule
                        key={module.id}
                        module={module}
                        onAddLesson={(moduleId) =>
                          setAddingLessonToModule(moduleId)
                        }
                        onUpdateModule={(moduleId, title) => {
                          setModules(
                            modules.map((m) =>
                              m.id === moduleId ? { ...m, title } : m
                            )
                          );
                        }}
                        onDeleteModule={(moduleId) => {
                          setModules(modules.filter((m) => m.id !== moduleId));
                        }}
                        onUpdateLesson={(lessonId, title) => {
                          setModules(
                            modules.map((m) => ({
                              ...m,
                              lessons: m.lessons.map((l) =>
                                l.id === lessonId ? { ...l, title } : l
                              ),
                            }))
                          );
                        }}
                        onDeleteLesson={(lessonId) => {
                          setModules(
                            modules.map((m) => ({
                              ...m,
                              lessons: m.lessons.filter(
                                (l) => l.id !== lessonId
                              ),
                            }))
                          );
                        }}
                      />
                    ))}
                  </Accordion>
                </SortableContext>
              </DndContext>
            )}

            {/* Add Lesson Dialog */}
            {addingLessonToModule && (
              <Card className="border-dashed">
                <CardContent className="p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter lesson title"
                      value={newLessonTitle}
                      onChange={(e) => setNewLessonTitle(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && addLesson(addingLessonToModule)
                      }
                    />
                    <Button onClick={() => addLesson(addingLessonToModule)}>
                      Add
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setAddingLessonToModule(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {modules.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No modules yet. Add your first module to get started.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
