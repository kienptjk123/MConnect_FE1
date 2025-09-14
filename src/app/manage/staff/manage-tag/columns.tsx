"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Hash, FileText, Edit } from "lucide-react";
import type { TagType } from "@/schemaValidations/tag.schema";
import { UpdateTagForm } from "@/app/manage/staff/manage-tag/update-tag-form";

export function getTagColumns(
  onDelete: (row: TagType) => void
): ColumnDef<TagType>[] {
  return [
    {
      accessorKey: "name",
      header: () => (
        <span className="text-sm font-semibold text-white ml-2">Tag Name</span>
      ),
      cell: ({ row }) => (
        <span className=" text-gray-800 truncate max-w-[28ch] ml-2">
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: "description",
      header: () => (
        <span className="text-sm font-semibold text-white">Description</span>
      ),
      cell: ({ getValue }) => {
        const v = (getValue<string | undefined>() ?? "").trim();
        return (
          <div className="group">
            {v ? (
              <span className="text-gray-600 truncate block max-w-[40ch] group-hover:text-gray-800 transition-colors">
                {v}
              </span>
            ) : (
              <span className="text-gray-400 italic text-sm">
                No description
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <span>Actions</span>,
      cell: ({ row }) => {
        const tag = row.original;
        return (
          <div className="flex items-center justify-start gap-1 ">
            <UpdateTagForm tag={tag} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-md h-8 w-8  hover:bg-gray-200 hover:cursor-pointer transition-colors"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="rounded-md  border-gray-200 "
              >
                <DropdownMenuItem
                  className="text-red-600 hover:text-red-700 focus:text-red-700 hover:bg-red-50 rounded-md font-medium"
                  onClick={() => onDelete(tag)}
                >
                  <Trash2 className=" h-4 w-4 text-red-600" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      size: 80,
      minSize: 70,
      maxSize: 120,
    },
  ];
}
