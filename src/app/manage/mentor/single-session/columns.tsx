"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateToLocaleString } from "@/lib/utils";
import type { SingleSessionType } from "@/schemaValidations/singleSession.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";

export function getSingleSessionColumns(
  onEdit: (row: SingleSessionType) => void,
  onDelete: (row: SingleSessionType) => void
): ColumnDef<SingleSessionType>[] {
  return [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-800 truncate max-w-[30ch] font-medium">
            {row.original.title}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "topic",
      header: "Topic",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-700 truncate max-w-[20ch]">
            {row.original.topic}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.original.description;
        const preview =
          description.length > 50
            ? description.substring(0, 50) + "..."
            : description;

        return (
          <span className="text-gray-600 text-sm truncate max-w-[40ch]">
            {preview}
          </span>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <span className="text-green-600 font-medium">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(row.original.price)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const getStatusVariant = (status: string) => {
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

        return (
          <Badge variant={getStatusVariant(status)} className="text-xs">
            {status.replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-sm">
            {formatDateToLocaleString(row.original.createdAt)}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const session = row.original;

        return (
          <SingleSessionActionButtons
            session={session}
            onEdit={() => onEdit(session)}
            onDelete={() => onDelete(session)}
          />
        );
      },
      size: 120,
      minSize: 100,
      maxSize: 150,
    },
  ];
}

function SingleSessionActionButtons({
  session,
  onEdit,
  onDelete,
}: {
  session: SingleSessionType;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-start gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={onEdit}
        className="text-green-600 hover:text-green-700 hover:bg-green-100 p-1 rounded-full"
        title="Edit Session"
      >
        <Edit className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="text-red-600 hover:text-red-700 hover:bg-red-100 p-1 rounded-full"
        title="Delete Session"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
