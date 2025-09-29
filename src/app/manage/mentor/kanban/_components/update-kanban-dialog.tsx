"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { kanbanTaskApiRequest } from "@/apiRequests/kanban";
import {
  KanBanUpdateForm,
  KanBanUpdateFormType,
  KanbanType,
} from "@/schemaValidations/kanbanMentor";

interface UpdateKanbanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updatedKanban: KanbanType) => void;
  kanban: KanbanType | null;
}

export function UpdateKanbanDialog({
  open,
  onOpenChange,
  onSuccess,
  kanban,
}: UpdateKanbanDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<KanBanUpdateFormType>({
    resolver: zodResolver(KanBanUpdateForm),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (kanban && open) {
      form.reset({
        title: kanban.title,
        description: kanban.description || "",
      });
    }
  }, [kanban, open, form]);

  const onSubmit = async (data: KanBanUpdateFormType) => {
    if (!kanban) return;

    setIsLoading(true);
    try {
      await kanbanTaskApiRequest.updateKanban(kanban.id.toString(), data);

      const updatedKanban = {
        ...kanban,
        title: data.title || kanban.title,
        description: data.description || kanban.description,
        updatedAt: new Date().toISOString(),
      };

      toast({
        title: "Success",
        description: "Kanban board updated successfully!",
      });
      onSuccess(updatedKanban);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating kanban:", error);
      toast({
        title: "Error",
        description: "Failed to update kanban board. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Kanban Board</DialogTitle>
          <DialogDescription>
            Update your kanban board information.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Board Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter board title..."
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter board description..."
                      className="min-h-[100px] resize-none"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isLoading ? "Updating..." : "Update Board"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
