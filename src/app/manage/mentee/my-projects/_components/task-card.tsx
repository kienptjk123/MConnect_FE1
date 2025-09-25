"use client";

import type React from "react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Paperclip, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskType } from "@/schemaValidations/kanban.schema";

interface TaskCardProps {
  task: TaskType;
}

export function TaskCard({ task }: TaskCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", task.id);
    e.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
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
        {/* Priority Badge */}
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
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Task Title */}
        <h3 className="font-semibold text-card-foreground mb-2 text-balance">
          {task.title}
        </h3>

        {/* Task Description */}
        {task.description && (
          <p className="text-sm text-muted-foreground mb-4 text-pretty leading-relaxed">
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

        <div className="flex items-center justify-between">
          {/* Metadata */}
          <div className="flex items-center gap-3 text-muted-foreground">
            {task.comments >= 0 && (
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                <span className="text-xs">{task.comments}</span>
              </div>
            )}
            {task.files >= 0 && (
              <div className="flex items-center gap-1">
                <Paperclip className="h-3 w-3" />
                <span className="text-xs">{task.files}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
