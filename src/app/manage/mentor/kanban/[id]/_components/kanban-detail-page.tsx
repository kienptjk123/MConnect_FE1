"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Settings2, Search, Filter, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateTaskDialog } from "../../_components/create-task-dialog";
import { UpdateKanbanDialog } from "../../_components/update-kanban-dialog";
import { MentorKanbanColumn } from "../../_components/mentor-kanban-column";
import { kanbanTaskApiRequest } from "@/apiRequests/kanban";
import {
  KanbanType,
  TaskByKanBanIdType,
} from "@/schemaValidations/kanbanMentor";
import { toast } from "@/components/ui/use-toast";

interface KanbanDetailPageProps {
  kanbanId: string;
}

export function KanbanDetailPage({ kanbanId }: KanbanDetailPageProps) {
  const router = useRouter();
  const [kanban, setKanban] = useState<KanbanType | null>(null);
  const [kanbanData, setKanbanData] = useState<TaskByKanBanIdType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateTaskDialogOpen, setIsCreateTaskDialogOpen] = useState(false);
  const [isUpdateKanbanDialogOpen, setIsUpdateKanbanDialogOpen] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("ALL");

  const fetchKanbanData = async () => {
    setIsLoading(true);
    try {
      const response = await kanbanTaskApiRequest.getAllTasksByKanbanId(
        kanbanId
      );
      const data = (response.payload as any)?.result;

      if (data) {
        // Set kanban basic info
        setKanban({
          id: data.id,
          title: data.title,
          description: data.description,
          mentorProfileId: data.mentorProfileId,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });

        // Set kanban with tasks
        setKanbanData(data);
      }
    } catch (error) {
      console.error("Error fetching kanban data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch kanban data",
        variant: "destructive",
      });
      // Redirect back to kanban list if error
      router.push("/manage/mentor/kanban");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskUpdate = () => {
    fetchKanbanData();
  };

  const handleTaskMove = async (
    taskId: string,
    newStatus: "TODO" | "PROGRESS" | "DONE"
  ) => {
    if (!kanbanData) return;

    // Optimistically update UI
    const updatedTasks = kanbanData.tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );

    setKanbanData({
      ...kanbanData,
      tasks: updatedTasks,
    });

    try {
      await kanbanTaskApiRequest.updateTasks(taskId, {
        status: newStatus,
      });
    } catch (error) {
      console.error("Error updating task status:", error);
      fetchKanbanData();
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  const handleEditKanban = () => {
    setIsUpdateKanbanDialogOpen(true);
  };

  const handleKanbanUpdateSuccess = (updatedKanban: KanbanType) => {
    setKanban(updatedKanban);
    setIsUpdateKanbanDialogOpen(false);
    // Update kanbanData title and description
    if (kanbanData) {
      setKanbanData({
        ...kanbanData,
        title: updatedKanban.title,
        description: updatedKanban.description,
      });
    }
  };

  const handleBackToList = () => {
    router.push("/manage/mentor/kanban");
  };

  useEffect(() => {
    if (kanbanId) {
      fetchKanbanData();
    }
  }, [kanbanId]);

  // Filter tasks based on search query and filter
  const filteredTasks = useMemo(() => {
    if (!kanbanData) return [];

    return kanbanData.tasks
      .map((task) => ({
        ...task,
        assigneeId: task.assigneeId ?? null, // Convert undefined to null
      }))
      .filter((task) => {
        const matchesSearch =
          searchQuery === "" ||
          task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter =
          filter === "ALL" ||
          (filter === "HIGH" && task.priority === "HIGH") ||
          (filter === "LOW" && task.priority === "LOW");

        return matchesSearch && matchesFilter;
      });
  }, [kanbanData, searchQuery, filter]);

  const todoTasks = useMemo(
    () => filteredTasks.filter((task) => task.status === "TODO"),
    [filteredTasks]
  );

  const progressTasks = useMemo(
    () => filteredTasks.filter((task) => task.status === "PROGRESS"),
    [filteredTasks]
  );

  const doneTasks = useMemo(
    () => filteredTasks.filter((task) => task.status === "DONE"),
    [filteredTasks]
  );

  if (isLoading || !kanban) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToList}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Boards
              </Button>

              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">
                  {kanban.title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-muted/50"
                />
              </div>

              {/* Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent"
                  >
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilter("ALL")}>
                    All Tasks
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("HIGH")}>
                    High Priority
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("LOW")}>
                    Low Priority
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                onClick={() => setIsCreateTaskDialogOpen(true)}
                className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600"
              >
                <Plus className="h-3 w-3" />
                Add Task
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="container mx-auto p-6">
        {kanbanData && kanbanData.tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Settings2 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              No tasks yet
            </h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Start by creating your first task for this kanban board
            </p>
            <Button
              onClick={() => setIsCreateTaskDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Your First Task
            </Button>
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto justify-center">
            <MentorKanbanColumn
              title="To Do"
              count={todoTasks.length}
              color="bg-green-100 text-green-800"
              status="TODO"
              tasks={todoTasks}
              onTaskMove={handleTaskMove}
              onTaskUpdate={handleTaskUpdate}
              kanbanId={kanban.id}
            />

            <MentorKanbanColumn
              title="On Progress"
              count={progressTasks.length}
              color="bg-yellow-100 text-yellow-800"
              status="PROGRESS"
              tasks={progressTasks}
              onTaskMove={handleTaskMove}
              onTaskUpdate={handleTaskUpdate}
              kanbanId={kanban.id}
            />

            <MentorKanbanColumn
              title="Done"
              count={doneTasks.length}
              color="bg-blue-100 text-blue-800"
              status="DONE"
              tasks={doneTasks}
              onTaskMove={handleTaskMove}
              onTaskUpdate={handleTaskUpdate}
              kanbanId={kanban.id}
            />
          </div>
        )}
      </div>

      <CreateTaskDialog
        open={isCreateTaskDialogOpen}
        onOpenChange={setIsCreateTaskDialogOpen}
        onSuccess={handleTaskUpdate}
        kanbanId={kanban.id}
      />

      <UpdateKanbanDialog
        open={isUpdateKanbanDialogOpen}
        onOpenChange={setIsUpdateKanbanDialogOpen}
        onSuccess={handleKanbanUpdateSuccess}
        kanban={kanban}
      />
    </div>
  );
}
