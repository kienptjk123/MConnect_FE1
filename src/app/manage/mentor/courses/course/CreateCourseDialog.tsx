"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useMentorCreateCourseMutation } from "@/queries/useMentorCourse";
import { useCategoriesQuery } from "@/queries/useCategories";
import { useLabelsQuery } from "@/queries/useLabel";
import {
  MentorCreateCourseSchema,
  type MentorCreateCourseType,
} from "@/schemaValidations/mentorCourse.schema";

interface CreateCourseDialogProps {
  open: boolean;
  onClose: () => void;
  onCourseCreated: (courseId: number) => void;
}

export function CreateCourseDialog({
  open,
  onClose,
  onCourseCreated,
}: CreateCourseDialogProps) {
  const [needToLearnItems, setNeedToLearnItems] = useState<string[]>([]);
  const [currentItem, setCurrentItem] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<number[]>([]);

  const { mutateAsync, isPending } = useMentorCreateCourseMutation();
  const { data: categoriesData } = useCategoriesQuery();
  const { data: labelsData } = useLabelsQuery();

  const form = useForm<MentorCreateCourseType>({
    resolver: zodResolver(MentorCreateCourseSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      needToLearn: [],
      price: 0,
      thumbnail: "",
      categories: [],
      labels: [],
    },
  });

  const addNeedToLearnItem = () => {
    if (currentItem.trim() && !needToLearnItems.includes(currentItem.trim())) {
      const newItems = [...needToLearnItems, currentItem.trim()];
      setNeedToLearnItems(newItems);
      setCurrentItem("");
      form.setValue("needToLearn", newItems);
    }
  };

  const removeNeedToLearnItem = (item: string) => {
    const newItems = needToLearnItems.filter((i) => i !== item);
    setNeedToLearnItems(newItems);
    form.setValue("needToLearn", newItems);
  };

  const toggleCategory = (categoryId: number) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];
    setSelectedCategories(newCategories);
    form.setValue("categories", newCategories);
  };

  const toggleLabel = (labelId: number) => {
    const newLabels = selectedLabels.includes(labelId)
      ? selectedLabels.filter((id) => id !== labelId)
      : [...selectedLabels, labelId];
    setSelectedLabels(newLabels);
    form.setValue("labels", newLabels);
  };

  const onSubmit = async (values: MentorCreateCourseType) => {
    try {
      const response = await mutateAsync(values);
      toast({
        title: "Course created",
        description: `"${values.title}" was created successfully.`,
      });
      onCourseCreated(response.payload.result.id);
      handleClose();
    } catch (error: any) {
      toast({
        title: "Failed to create course",
        description: error?.message ?? "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    form.reset();
    setNeedToLearnItems([]);
    setCurrentItem("");
    setSelectedCategories([]);
    setSelectedLabels([]);
    onClose();
  };

  const categories = categoriesData?.payload?.data || [];
  const labels = labelsData?.payload?.data || [];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                {...form.register("title")}
                placeholder="Enter course title"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle *</Label>
              <Input
                id="subtitle"
                {...form.register("subtitle")}
                placeholder="Enter course subtitle"
              />
              {form.formState.errors.subtitle && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.subtitle.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Enter course description"
              rows={4}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-600">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                {...form.register("price", { valueAsNumber: true })}
                placeholder="0"
                min="0"
                step="0.01"
              />
              {form.formState.errors.price && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail URL *</Label>
              <Input
                id="thumbnail"
                {...form.register("thumbnail")}
                placeholder="Enter thumbnail URL"
              />
              {form.formState.errors.thumbnail && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.thumbnail.message}
                </p>
              )}
            </div>
          </div>

          {/* Need to Learn Section */}
          <div className="space-y-2">
            <Label>What students will learn</Label>
            <div className="flex gap-2">
              <Input
                value={currentItem}
                onChange={(e) => setCurrentItem(e.target.value)}
                placeholder="Add learning outcome"
                onKeyPress={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(), addNeedToLearnItem())
                }
              />
              <Button type="button" onClick={addNeedToLearnItem} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {needToLearnItems.map((item, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {item}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeNeedToLearnItem(item)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Categories Section */}
          {categories.length > 0 && (
            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant={
                      selectedCategories.includes(category.id)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => toggleCategory(category.id)}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Labels Section */}
          {labels.length > 0 && (
            <div className="space-y-2">
              <Label>Labels</Label>
              <div className="flex flex-wrap gap-2">
                {labels.map((label) => (
                  <Badge
                    key={label.id}
                    variant={
                      selectedLabels.includes(label.id) ? "default" : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => toggleLabel(label.id)}
                  >
                    {label.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Course"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
