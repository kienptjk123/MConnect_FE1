"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  MoreVertical,
  Calendar,
  FolderOpen,
  Edit,
  Trash2,
} from "lucide-react";
import { CreateKanbanDialog } from "./create-kanban-dialog";
import { UpdateKanbanDialog } from "./update-kanban-dialog";
import { kanbanTaskApiRequest } from "@/apiRequests/kanban";
import { KanbanType } from "@/schemaValidations/kanbanMentor";
import { toast } from "@/components/ui/use-toast";
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
import Swal from "sweetalert2";

export function KanbanList() {
  const router = useRouter();
  const [kanbans, setKanbans] = useState<KanbanType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedKanbanForUpdate, setSelectedKanbanForUpdate] =
    useState<KanbanType | null>(null);

  const fetchKanbans = async () => {
    setIsLoading(true);
    try {
      const response = await kanbanTaskApiRequest.getListKanbans();
      setKanbans((response.payload as any)?.result.kanbans || []);
    } catch (error) {
      console.error("Error fetching kanbans:", error);
      toast({
        title: "Error",
        description: "Failed to fetch kanban boards",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteKanban = async (kanbanId: number) => {
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
    try {
      await kanbanTaskApiRequest.deleteKanban(kanbanId.toString());
      toast({
        title: "Success",
        description: "Kanban board deleted successfully",
      });
      fetchKanbans();
    } catch (error) {
      console.error("Error deleting kanban:", error);
      toast({
        title: "Error",
        description: "Failed to delete kanban board",
        variant: "destructive",
      });
    }
  };

  const handleKanbanSelect = (kanban: KanbanType) => {
    router.push(`/manage/mentor/kanban/${kanban.id}`);
  };

  const handleEditKanban = (kanban: KanbanType) => {
    setSelectedKanbanForUpdate(kanban);
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateSuccess = (updatedKanban: KanbanType) => {
    setKanbans((prev) =>
      prev.map((k) => (k.id === updatedKanban.id ? updatedKanban : k))
    );
    setIsUpdateDialogOpen(false);
    setSelectedKanbanForUpdate(null);
  };

  useEffect(() => {
    fetchKanbans();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl text-blue-500 font-bold ">Kanban Boards</h1>
          <p className="text-muted-foreground mt-2">
            Manage your project boards and assign tasks to mentees
          </p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          <Plus className="h-4 w-4" />
          Create New Kanban
        </Button>
      </div>

      {kanbans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">
            No kanban boards yet
          </h3>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            Create your first kanban board to start organizing and assigning
            tasks to your mentees
          </p>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            <Plus className="h-4 w-4" />
            Create Your First Board
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kanbans.map((kanban) => (
            <Card
              key={kanban.id}
              className="hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div
                    className="flex-1"
                    onClick={() => handleKanbanSelect(kanban)}
                  >
                    <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {kanban.title}
                    </CardTitle>
                    {kanban.description && (
                      <CardDescription className="mt-2 line-clamp-2">
                        {kanban.description}
                      </CardDescription>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleEditKanban(kanban)}
                      >
                        <Edit className="h-4 w-4 " />
                        Edit Kanban
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            className="text-red-600 "
                            onClick={() => handleDeleteKanban(kanban.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                            Delete Kanban
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent onClick={() => handleKanbanSelect(kanban)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Created {formatDate(kanban.createdAt)}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    ID: {kanban.id}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateKanbanDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={fetchKanbans}
      />

      <UpdateKanbanDialog
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        onSuccess={handleUpdateSuccess}
        kanban={selectedKanbanForUpdate}
      />
    </div>
  );
}
