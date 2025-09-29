"use client";

import { Badge } from "@/components/ui/badge";
import { MentorTaskCard } from "./mentor-task-card";
import { useState } from "react";

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

interface MentorKanbanColumnProps {
  title: string;
  count: number;
  color: string;
  status: "TODO" | "PROGRESS" | "DONE";
  tasks: TaskInKanban[];
  onTaskMove: (taskId: string, newStatus: "TODO" | "PROGRESS" | "DONE") => void;
  onTaskUpdate: () => void;
  kanbanId: number;
}

export function MentorKanbanColumn({
  title,
  count,
  color,
  status,
  tasks,
  onTaskMove,
  onTaskUpdate,
  kanbanId,
}: MentorKanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setIsDragOver(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) {
      await onTaskMove(taskId, status);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  return (
    <div className="flex-shrink-0 w-96 bg-gray-50 p-4 rounded-2xl">
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                title === "To Do"
                  ? "bg-green-500"
                  : title === "On Progress"
                  ? "bg-yellow-500"
                  : "bg-blue-500"
              }`}
            ></div>
            <h2 className="font-semibold text-foreground">{title}</h2>
          </div>
          <Badge variant="secondary" className={color}>
            {count}
          </Badge>
        </div>
      </div>

      <div
        className={`min-h-[600px] rounded-lg p-2 transition-all duration-200 ${
          isDragOver
            ? "bg-primary/10 border-2 border-dashed border-primary shadow-lg"
            : "bg-transparent border-2 border-transparent"
        } `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDragEnter={handleDragEnter}
        onDrop={handleDrop}
      >
        {isDragOver && tasks.length === 0 && (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            Drop task here
          </div>
        )}

        {tasks.map((task) => (
          <MentorTaskCard
            key={task.id}
            task={task}
            onTaskUpdate={onTaskUpdate}
          />
        ))}

        {!isDragOver && tasks.length === 0 && <div></div>}
      </div>
    </div>
  );
}
