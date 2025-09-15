"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  type TagType,
  UpdateTagSchema,
  type UpdateTagType,
} from "@/schemaValidations/tag.schema";
import { useEffect, useState } from "react";
import { useUpdateTagMutation } from "@/queries/useTag";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function UpdateTagForm({
  tag,
  trigger,
}: {
  tag: TagType;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useUpdateTagMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateTagType>({
    resolver: zodResolver(UpdateTagSchema),
    defaultValues: { name: tag.name ?? "", description: tag.description ?? "" },
  });

  useEffect(() => {
    if (open) {
      reset({ name: tag.name ?? "", description: tag.description ?? "" });
    }
  }, [open, tag, reset]);

  const onSubmit = async (values: UpdateTagType) => {
    try {
      await mutateAsync({ id: tag.id, ...values });
      toast({
        title: "Tag updated",
        description: `"${values.name}" was updated.`,
      });
      setOpen(false);
    } catch (err: any) {
      const detail =
        err?.payload?.errors?.map((e: any) => e?.message).join("; ") ||
        err?.message ||
        "Please try again.";
      toast({
        title: "Failed to update tag",
        description: detail,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-md"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-md bg-white border-gray-200 shadow-lg">
        <DialogHeader className="space-y-3 pb-2">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-gray-800">
            <div className="rounded-md bg-blue-400 p-2 text-white">
              <Pencil className="h-4 w-4" />
            </div>
            Edit Tag
          </DialogTitle>
          <p className="text-sm text-gray-600">
            Update the tag information below.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 pt-2">
          <div className="grid gap-2">
            <Label
              htmlFor={`name-${tag.id}`}
              className="text-sm font-medium text-gray-700"
            >
              Tag Name *
            </Label>
            <Input
              id={`name-${tag.id}`}
              {...register("name")}
              className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
            {errors.name && (
              <p className="text-xs text-red-500 font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor={`description-${tag.id}`}
              className="text-sm font-medium text-gray-700"
            >
              Description{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </Label>
            <Textarea
              id={`description-${tag.id}`}
              {...register("description")}
              className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 min-h-[80px] resize-none"
            />
            {errors.description && (
              <p className="text-xs text-red-500 font-medium">
                {errors.description.message}
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
              disabled={isPending || !isDirty}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
