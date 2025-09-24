"use client";
import { UpdateTagForm } from "@/app/manage/admin/manage-tag/update-tag-form";
import type { TagType } from "@/schemaValidations/tag.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";

export function getTagColumns(
  onDelete: (row: TagType) => void
): ColumnDef<TagType>[] {
  return [
    {
      accessorKey: "name",
      header: "Tag Name",

      cell: ({ row }) => (
        <span className=" text-gray-800 truncate max-w-[28ch] ml-2">
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
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
      header: "Actions",
      cell: ({ row }) => {
        const tag = row.original;
        return (
          <div className="flex items-center justify-start gap-1 ">
            <UpdateTagForm tag={tag} />

            <div
              className="text-red-600 hover:text-red-700 focus:text-red-700 hover:bg-red-100 p-1 rounded-full font-medium"
              onClick={() => onDelete(tag)}
            >
              <Trash2 className=" h-4 w-4 text-red-600" />
            </div>
          </div>
        );
      },
    },
  ];
}
