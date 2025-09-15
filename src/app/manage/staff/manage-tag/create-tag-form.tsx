"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateTagMutation } from "@/queries/useTag";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, TagIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  CreateTagSchema,
  type CreateTagType,
} from "@/schemaValidations/tag.schema";

export function CreateTagDialog() {
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useCreateTagMutation();

  const form = useForm<CreateTagType>({
    resolver: zodResolver(CreateTagSchema),
    defaultValues: { name: "", description: "" },
  });

  const onSubmit = async (values: CreateTagType) => {
    try {
      await mutateAsync(values as any);
      toast({
        title: "Tag created",
        description: `"${values.name}" was added successfully.`,
      });
      form.reset();
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Failed to create tag",
        description: error?.message ?? "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="gap-2 rounded-md bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          <span className="font-medium">New Tag</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-md bg-white border-gray-200 shadow-lg">
        <DialogHeader className="space-y-3 pb-2">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-gray-800">
            <div className="rounded-md bg-blue-400 p-2 text-white">
              <TagIcon className="h-5 w-5" />
            </div>
            Create New Tag
          </DialogTitle>
          <p className="text-sm text-gray-600">
            Add a new tag to organize and categorize your content.
          </p>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 pt-2"
        >
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Tag Name *
            </Label>
            <Input
              id="name"
              placeholder="e.g. Performance, UI/UX, Backend"
              {...form.register("name")}
              className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
            {form.formState.errors.name && (
              <p className="text-xs text-red-500 font-medium">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Brief description to help identify this tag's purpose..."
              {...form.register("description")}
              className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 min-h-[80px] resize-none"
            />
            {form.formState.errors.description && (
              <p className="text-xs text-red-500 font-medium">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="rounded-md hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-md bg-blue-400 hover:bg-blue-500 text-white disabled:opacity-50"
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Creating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Tag
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
