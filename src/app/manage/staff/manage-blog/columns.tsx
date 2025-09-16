"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateToLocaleString } from "@/lib/utils";
import type { BlogType } from "@/schemaValidations/blog.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function getBlogColumns(
  onDelete: (row: BlogType) => void
): ColumnDef<BlogType>[] {
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
      accessorKey: "staff.name",
      header: "Author",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-700">{row.original.staff.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-600">
            {formatDateToLocaleString(row.original.date)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "content",
      header: "Content",
      cell: ({ row }) => {
        const content = row.original.content;
        const preview =
          content.length > 50 ? content.substring(0, 50) + "..." : content;
        return (
          <span className="text-gray-600 text-sm truncate max-w-[40ch]">
            {preview}
          </span>
        );
      },
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.tags.length > 0 ? (
            row.original.tags.slice(0, 2).map((blogTag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200"
              >
                {blogTag.tag.name}
              </Badge>
            ))
          ) : (
            <span className="text-gray-400 italic text-sm">No tags</span>
          )}
          {row.original.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{row.original.tags.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const blog = row.original;

        return (
          <BlogActionButtons blog={blog} onDelete={() => onDelete(blog)} />
        );
      },
      size: 120,
      minSize: 100,
      maxSize: 150,
    },
  ];
}

function BlogActionButtons({
  blog,
  onDelete,
}: {
  blog: BlogType;
  onDelete: () => void;
}) {
  const router = useRouter();

  const handleView = () => {
    router.push(`/manage/staff/manage-blog/${blog.id}`);
  };

  const handleEdit = () => {
    router.push(`/manage/staff/manage-blog/${blog.id}/edit`);
  };

  return (
    <div className="flex items-center justify-start gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleView}
        className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 p-1 rounded-full"
        title="View Details"
      >
        <Eye className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleEdit}
        className="text-green-600 hover:text-green-700 hover:bg-green-100 p-1 rounded-full"
        title="Edit Blog"
      >
        <Edit className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="text-red-600 hover:text-red-700 hover:bg-red-100 p-1 rounded-full"
        title="Delete Blog"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
