"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SingleSessionType } from "@/schemaValidations/singleSession.schema";
import { Edit, Trash2, DollarSign, Calendar, BookOpen } from "lucide-react";
import { useDeleteSingleSession } from "@/queries/useSingleSession";
import { toast } from "@/components/ui/use-toast";
import Swal from "sweetalert2";

interface SingleSessionListProps {
  sessions: SingleSessionType[];
  onEdit: (session: SingleSessionType) => void;
}

export function SingleSessionList({
  sessions,
  onEdit,
}: SingleSessionListProps) {
  const deleteMutation = useDeleteSingleSession();

  const handleDelete = async (sessionId: number, sessionTitle: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete "${sessionTitle}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6", // blue-500
      cancelButtonColor: "#6b7280", // gray-500
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteMutation.mutateAsync(sessionId);
        toast({
          title: "Success",
          description: "Single session deleted successfully",
        });
        Swal.fire({
          title: "Deleted!",
          text: "The single session has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete single session",
          variant: "destructive",
        });
      }
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "SHOW":
        return "default";
      case "NO_SHOW":
        return "destructive";
      case "ADVANCED":
        return "secondary";
      default:
        return "outline";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (sessions.length === 0) {
    return (
      <div className="text-center py-8">
        <BookOpen className="mx-auto h-12 w-12 text-blue-400" />
        <h3 className="mt-2 text-sm font-medium text-blue-600">No sessions</h3>
        <p className="mt-1 text-sm text-blue-500">
          Get started by creating a new single session.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sessions.map((session) => (
        <Card key={session.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <CardTitle className="text-lg font-semibold line-clamp-2">
                  {session.title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {session.topic}
                  </div>
                </CardDescription>
              </div>
              <Badge variant={getStatusBadgeVariant(session.status)}>
                {session.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-3">
              <p className="text-sm text-gray-600 line-clamp-3">
                {session.description}
              </p>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  <span className="font-medium text-blue-600">
                    {formatPrice(session.price)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(session.createdAt)}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(session)}
                  className="flex-1 border-blue-500 text-blue-500 hover:bg-blue-50"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(session.id, session.title)}
                  className="flex-1 border-red-500 text-red-600 hover:text-red-700 hover:bg-red-50"
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
