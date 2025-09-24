"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useCategoryQuery, useUpdateCategoryMutation } from "@/queries/useCategories";
import {
  CategoryUpdateSchema,
  type CategoryUpdateType,
} from "@/schemaValidations/category.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, FolderOpen, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

export default function EditCategoryForm() {
  const router = useRouter();
  const params = useParams();
  const categoryId = parseInt(params.id as string);
  
  const { data: categoryData, isLoading } = useCategoryQuery(categoryId);
  const { mutateAsync, isPending } = useUpdateCategoryMutation();

  const form = useForm<CategoryUpdateType>({
    resolver: zodResolver(CategoryUpdateSchema),
    defaultValues: {
      name: "",
    },
  });

  // Update form when data is loaded
  useEffect(() => {
    if (categoryData?.payload?.data) {
      form.reset({
        name: categoryData.payload.data.name,
      });
    }
  }, [categoryData, form]);

  const onSubmit = async (values: CategoryUpdateType) => {
    try {
      await mutateAsync({ id: categoryId, body: values });
      toast({
        title: "Category updated",
        description: `"${values.name}" was updated successfully.`,
      });
      router.push("/manage/staff/manage-categories");
    } catch (error: any) {
      toast({
        title: "Failed to update category",
        description: error?.message ?? "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent"></div>
            Loading category...
          </div>
        </div>
      </div>
    );
  }

  if (!categoryData?.payload?.data) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="flex items-center justify-center py-16">
          <div className="text-center text-red-600">
            Category not found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
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
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-blue-100 p-2">
              <FolderOpen className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Edit Category
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Category Name *
              </Label>
              <Input
                id="name"
                placeholder="Enter category name"
                {...form.register("name")}
                className="w-full"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Updating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Update Category
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}