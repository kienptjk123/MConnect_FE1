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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { kanbanTaskApiRequest } from "@/apiRequests/kanban";
import {
  TaskCreateForm,
  TaskCreateFormType,
  AssigneeTypeInKanBanTask,
} from "@/schemaValidations/kanbanMentor";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  kanbanId: number;
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  onSuccess,
  kanbanId,
}: CreateTaskDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [assignees, setAssignees] = useState<AssigneeTypeInKanBanTask[]>([]);
  const [isLoadingAssignees, setIsLoadingAssignees] = useState(false);

  const form = useForm<TaskCreateFormType>({
    resolver: zodResolver(TaskCreateForm),
    defaultValues: {
      title: "",
      description: "",
      priority: "LOW",
      assigneeId: 0,
      image: "",
    },
  });

  const fetchAssignees = async () => {
    setIsLoadingAssignees(true);
    try {
      const response =
        await kanbanTaskApiRequest.getAllAssigneesInKanbanTasks();
      setAssignees(response?.payload?.data || []);
      console.log(response?.payload?.data || []);
    } catch (error) {
      console.error("Error fetching assignees:", error);
      toast({
        title: "Error",
        description: "Failed to fetch assignees",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAssignees(false);
    }
  };

  const onSubmit = async (data: TaskCreateFormType) => {
    setIsLoading(true);
    try {
      await kanbanTaskApiRequest.createKanbanTask(kanbanId, data);
      toast({
        title: "Success",
        description: "Task created successfully!",
      });
      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
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

  useEffect(() => {
    if (open) {
      fetchAssignees();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Create a new task and assign it to one of your mentees.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter task title..."
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
                      placeholder="Enter task description..."
                      className="min-h-[100px] resize-none"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LOW">Low Priority</SelectItem>
                        <SelectItem value="HIGH">High Priority</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign to Mentee</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      disabled={isLoading || isLoadingAssignees}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoadingAssignees
                                ? "Loading mentees..."
                                : "Select mentee"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {assignees.map((assignee) => (
                          <SelectItem
                            key={assignee.id}
                            value={assignee.id.toString()}
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                                {assignee.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex flex-col items-start">
                                <div className="font-medium">
                                  {assignee.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {assignee.user.email}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter image URL..."
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
                {isLoading ? "Creating..." : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
