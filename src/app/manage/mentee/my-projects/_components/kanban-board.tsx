"use client";

import { kanbanTaskApiRequest } from "@/apiRequests/kanban";
import { TaskCard } from "@/app/manage/mentee/my-projects/_components/task-card";
import { toast } from "@/components/ui/use-toast";
import { TaskType } from "@/schemaValidations/kanban.schema";
import { useEffect, useMemo, useState } from "react";
import { KanbanColumn } from "./kanban-column";
import { KanbanHeader } from "./kanban-header";
import { useKanbanTasks } from "@/queries/useKanban";

export function KanbanBoard() {
  // All hooks must be at the top level
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  async function fetchTasks() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await kanbanTaskApiRequest.getAllTasks();
      setTasks(res.payload.result.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError(
        error instanceof Error ? error : new Error("Failed to fetch tasks")
      );
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  // Update task status with API call
  const moveTask = useMemo(() => {
    return async (taskId: string, newStatus: TaskType["status"]) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) {
        toast({
          title: "Error",
          description: "Task not found",
          variant: "destructive",
        });
        return;
      }
      setTasks((prevTasks) => {
        if (!Array.isArray(prevTasks)) return [];
        return prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        );
      });
      setUpdatingTaskId(taskId);
      try {
        await kanbanTaskApiRequest.updateTasks(task.id, {
          status: newStatus,
        });
      } catch (error) {
        setTasks((prevTasks) => {
          if (!Array.isArray(prevTasks)) return [];
          return prevTasks.map((task) =>
            task.id === taskId ? { ...task, status: task.status } : task
          );
        });
        console.error("Error updating task status:", error);
        toast({
          title: "Error",
          description: "Failed to update task status",
          variant: "destructive",
        });
      } finally {
        setUpdatingTaskId(null);
      }
    };
  }, [tasks]);

  // const addTask = useMemo(() => {
  //   return (newTask: Omit<TaskType, "id">) => {
  //     const task: TaskType = {
  //       ...newTask,
  //       id: Date.now().toString(),
  //     };
  //     setTasks((prevTasks) => {
  //       if (!Array.isArray(prevTasks)) return [task];
  //       return [...prevTasks, task];
  //     });
  //   };
  // }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
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
  }, [tasks, searchQuery, filter]);

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

  if (isLoading) {
    return (
      <div className="bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-bold mb-2">Error Loading Tasks</h2>
          <p>{error.message}</p>
          <button
            onClick={fetchTasks}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <KanbanHeader onSearch={setSearchQuery} onFilterChange={setFilter} />
      <div className="flex gap-6 p-6 overflow-x-auto justify-center">
        <KanbanColumn
          title="To Do"
          count={todoTasks.length}
          color="bg-green-100 text-green-800"
          status="TODO"
          onDrop={moveTask}
        >
          {todoTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </KanbanColumn>

        <KanbanColumn
          title="On Progress"
          count={progressTasks.length}
          color="bg-yellow-100 text-yellow-800"
          status="PROGRESS"
          onDrop={moveTask}
        >
          {progressTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </KanbanColumn>

        <KanbanColumn
          title="Done"
          count={doneTasks.length}
          color="bg-blue-100 text-blue-800"
          status="DONE"
          onDrop={moveTask}
        >
          {doneTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </KanbanColumn>
      </div>
    </div>
  );
}
