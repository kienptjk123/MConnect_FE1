"use client";

import ImageUpload from "@/components/ImageUpload/ImageUpload";
import RichTextEditor from "@/components/RichTextEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useCreateBlogMutation } from "@/queries/useBlog";
import { useTagsQuery } from "@/queries/useTag";
import {
  BlogCreateFormSchema,
  type BlogCreateFormType,
} from "@/schemaValidations/blog.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Calendar, Save, Tag, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function CreateBlogFormPage() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateBlogMutation();
  const { data: tagsData, isLoading: tagsLoading } = useTagsQuery();
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const form = useForm<BlogCreateFormType>({
    resolver: zodResolver(BlogCreateFormSchema),
    defaultValues: {
      title: "",
      content: "",
      date: new Date().toISOString().split("T")[0],
      tags: [],
    },
  });

  const onSubmit = async (values: BlogCreateFormType) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", values.content);
      formData.append("date", values.date);

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      if (selectedTags.length > 0) {
        formData.append("tags", JSON.stringify(selectedTags));
      }

      await mutateAsync(formData as any);
      toast({
        title: "Blog created",
        description: `"${values.title}" was created successfully.`,
      });
      router.push("/manage/staff/manage-blog");
    } catch (error: any) {
      toast({
        title: "Failed to create blog",
        description: error?.message ?? "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTagToggle = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const availableTags = tagsData?.payload?.data || [];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Create Blog
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-sm font-medium text-gray-700"
              >
                Blog Title *
              </Label>
              <Input
                id="title"
                placeholder="Enter your blog title..."
                {...form.register("title")}
                className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
              {form.formState.errors.title && (
                <p className="text-xs text-red-500 font-medium">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Content *
              </Label>
              <Controller
                name="content"
                control={form.control}
                render={({ field }) => (
                  <RichTextEditor
                    content={field.value}
                    onChange={field.onChange}
                    placeholder=""
                  />
                )}
              />
              {form.formState.errors.content && (
                <p className="text-xs text-red-500 font-medium">
                  {form.formState.errors.content.message}
                </p>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </Label>

              {tagsLoading ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent"></div>
                  Loading tags...
                </div>
              ) : availableTags.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableTags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center space-x-2 p-2 rounded-md border border-gray-200 hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        id={`tag-${tag.id}`}
                        checked={selectedTags.includes(tag.id)}
                        onChange={() => handleTagToggle(tag.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Label
                        htmlFor={`tag-${tag.id}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {tag.name}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No tags available</p>
              )}

              {/* Selected Tags Preview */}
              {selectedTags.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-600 mb-2">Selected tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tagId) => {
                      const tag = availableTags.find((t) => t.id === tagId);
                      return tag ? (
                        <Badge
                          key={tagId}
                          variant="secondary"
                          className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center gap-1"
                        >
                          {tag.name}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-blue-900"
                            onClick={() => handleTagToggle(tagId)}
                          />
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
            {/* Date */}
            <div className="space-y-2">
              <Label
                htmlFor="date"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Publish Date *
              </Label>
              <Input
                id="date"
                type="date"
                {...form.register("date")}
                className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
              {form.formState.errors.date && (
                <p className="text-xs text-red-500 font-medium">
                  {form.formState.errors.date.message}
                </p>
              )}
            </div>
            {/* Image Upload */}
            <ImageUpload
              onImageSelect={setSelectedImage}
              className="space-y-2"
            />

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="rounded-md hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-md bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 flex items-center gap-2"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Create Blog
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
