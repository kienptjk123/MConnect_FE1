"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Paperclip,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { kanbanTaskApiRequest } from "@/apiRequests/kanban";
import { UpdateTaskDialog } from "./update-task-dialog";
import Swal from "sweetalert2";

interface TaskInKanban {
  id: string;
  title: string;
  description: string;
  priority: "LOW" | "HIGH";
  status: "TODO" | "PROGRESS" | "DONE";
  image: string;
  kanbanId: number;
  assigneeId: number | null;
  createdAt: string;
  assignee: {
    id: number;
    name: string;
    avatar: string | null;
  };
  _count: {
    comments: number;
    files: number;
  };
  comments: number;
  files: number;
}

interface MentorTaskCardProps {
  task: TaskInKanban;
  onTaskUpdate: () => void;
}

export function MentorTaskCard({ task, onTaskUpdate }: MentorTaskCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", task.id);
    e.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDeleteTask = async () => {
    const result = await Swal.fire({
      title: `Are you sure to delete?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;
    setIsDeleting(true);
    try {
      await kanbanTaskApiRequest.deleteKanbanTask(task.id);
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
      onTaskUpdate();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditTask = () => {
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateSuccess = () => {
    setIsUpdateDialogOpen(false);
    onTaskUpdate();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Card
      className={`mb-4 cursor-move bg-card hover:shadow-md transition-all duration-200 ${
        isDragging ? "opacity-50 rotate-2 scale-105" : "opacity-100"
      }`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <CardContent className="p-4">
        {/* Priority Badge and Actions */}
        <div className="flex items-center justify-between mb-3">
          <Badge
            variant={task.priority === "HIGH" ? "destructive" : "secondary"}
            className={`text-xs font-medium ${
              task.priority === "HIGH"
                ? "bg-red-100 text-red-700 hover:bg-red-100"
                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
            }`}
          >
            {task.priority === "HIGH" ? "HIGH" : "LOW"}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEditTask}>
                <Edit className="h-4 w-4 " />
                Edit Task
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={(e) => e.preventDefault()}
                onClick={() => handleDeleteTask()}
              >
                <Trash2 className="h-4 w-4  text-red-600" />
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Task Title */}
        <h3 className="font-semibold text-card-foreground mb-2 text-balance">
          {task.title}
        </h3>

        {/* Task Description */}
        {task.description && (
          <p className="text-sm text-muted-foreground mb-4 text-pretty leading-relaxed line-clamp-3">
            {task.description}
          </p>
        )}

        {/* Task Image */}
        {task.image && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img
              src={task.image || "/placeholder.svg"}
              alt={task.title}
              className="w-full h-32 object-cover"
            />
          </div>
        )}

        {/* Assignee Info */}
        <div className="flex items-center gap-2 mb-4 p-2 bg-muted/30 rounded-md">
          <Avatar className="h-6 w-6">
            <AvatarImage src={task.assignee.avatar || undefined} />
            <AvatarFallback className="text-xs">
              {task.assignee.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {task.assignee.name}
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            Assignee
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          {/* Metadata */}
          <div className="flex items-center gap-3 text-muted-foreground">
            {(task.comments >= 0 || task._count?.comments >= 0) && (
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                <span className="text-xs">
                  {task._count?.comments ?? task.comments}
                </span>
              </div>
            )}
            {(task.files >= 0 || task._count?.files >= 0) && (
              <div className="flex items-center gap-1">
                <Paperclip className="h-3 w-3" />
                <span className="text-xs">
                  {task._count?.files ?? task.files}
                </span>
              </div>
            )}
          </div>

          {/* Created Date */}
          <span className="text-xs text-muted-foreground">
            {formatDate(task.createdAt)}
          </span>
        </div>
      </CardContent>

      <UpdateTaskDialog
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        onSuccess={handleUpdateSuccess}
        task={task}
      />
    </Card>
  );
}
