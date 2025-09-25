"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SingleSessionCreateType,
  SingleSessionCreateSchema,
  SingleSessionType,
  SingleSessionUpdateType,
} from "@/schemaValidations/singleSession.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import {
  useCreateSingleSession,
  useUpdateSingleSession,
} from "@/queries/useSingleSession";

interface SingleSessionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingSession?: SingleSessionType;
}

export function SingleSessionForm({
  open,
  onOpenChange,
  editingSession,
}: SingleSessionFormProps) {
  const isEditing = !!editingSession;
  const [selectedStatus, setSelectedStatus] = useState<string>("SHOW");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(SingleSessionCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      topic: "",
      price: 0,
      status: "SHOW" as const,
    },
  });

  const createMutation = useCreateSingleSession();
  const updateMutation = useUpdateSingleSession();

  useEffect(() => {
    if (editingSession) {
      reset({
        title: editingSession.title,
        description: editingSession.description,
        topic: editingSession.topic,
        price: editingSession.price,
        status: editingSession.status,
      });
      setSelectedStatus(editingSession.status);
    } else {
      reset({
        title: "",
        description: "",
        topic: "",
        price: 0,
        status: "SHOW",
      });
      setSelectedStatus("SHOW");
    }
  }, [editingSession, reset]);

  const onSubmit = async (data: SingleSessionCreateType) => {
    try {
      if (isEditing && editingSession) {
        await updateMutation.mutateAsync({
          id: editingSession.id,
          body: data as SingleSessionUpdateType,
        });
        toast({
          title: "Success",
          description: "Single session updated successfully",
        });
      } else {
        await createMutation.mutateAsync(data);
        toast({
          title: "Success",
          description: "Single session created successfully",
        });
      }
      onOpenChange(false);
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setValue("status", value as "SHOW" | "NO_SHOW" | "ADVANCED");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="">
            {isEditing ? "Edit Single Session" : "Create Single Session"}
          </DialogTitle>
          <DialogDescription className="">
            {isEditing
              ? "Update the single session details"
              : "Create a new single session"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Enter title"
              className="focus:border-blue-500 focus:ring-blue-500"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter description"
              className="min-h-24 focus:border-blue-500 focus:ring-blue-500"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic" className="">
              Topic
            </Label>
            <Input
              id="topic"
              placeholder="Enter topic"
              className="focus:border-blue-500 focus:ring-blue-500"
              {...register("topic")}
            />
            {errors.topic && (
              <p className="text-sm text-red-500">{errors.topic.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="">
              Price
            </Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter price"
              className="focus:border-blue-500 focus:ring-blue-500"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="">
              Status
            </Label>
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SHOW">SHOW</SelectItem>
                <SelectItem value="NO_SHOW">NO_SHOW</SelectItem>
                <SelectItem value="ADVANCED">ADVANCED</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : isEditing
                ? "Update"
                : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
