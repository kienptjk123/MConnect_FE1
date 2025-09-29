"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateToLocaleString } from "@/lib/utils";
import type { CourseType } from "@/schemaValidations/course.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Trash2, Star, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export function getCourseColumns(
  onDelete: (row: CourseType) => void,
  onEdit: (row: CourseType) => void
): ColumnDef<CourseType>[] {
  return [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 border">
            {row.original.thumbnail ? (
              <img
                src={row.original.thumbnail}
                alt={row.original.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-xs">
                  {row.original.title.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div>
            <span className="text-gray-800 truncate max-w-[25ch] font-medium block">
              {row.original.title}
            </span>
            <span className="text-gray-500 text-xs">ID: {row.original.id}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "mentorProfile.name",
      header: "Mentor",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-700">
            {row.original.mentorProfile.name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const statusColors = {
          PUBLISHED: "bg-green-100 text-green-800",
          DRAFT: "bg-yellow-100 text-yellow-800",
          ARCHIVED: "bg-red-100 text-red-800",
        };

        return (
          <Badge
            className={statusColors[status] || "bg-gray-100 text-gray-800"}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = parseFloat(row.original.price);
        return (
          <span className="font-medium text-green-600">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(price)}
          </span>
        );
      },
    },
    {
      accessorKey: "avgRating",
      header: "Rating",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">
            {row.original.avgRating.toFixed(1)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "_count.enrollments",
      header: "Enrollments",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-blue-600" />
          <span className="font-medium">{row.original._count.enrollments}</span>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => (
        <span className="text-gray-600 text-sm">
          {formatDateToLocaleString(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const course = row.original;
        return (
          <CourseActionButtons
            course={course}
            onDelete={() => onDelete(course)}
            onEdit={() => onEdit(course)}
          />
        );
      },
      size: 120,
      minSize: 100,
      maxSize: 150,
    },
  ];
}

function CourseActionButtons({
  course,
  onDelete,
  onEdit,
}: {
  course: CourseType;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const router = useRouter();

  const handleView = () => {
    router.push(`/manage/admin/manage-course/${course.id}`);
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
        onClick={onEdit}
        className="text-green-600 hover:text-green-700 hover:bg-green-100 p-1 rounded-full"
        title="Edit Course Status"
      >
        <Edit className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="text-red-600 hover:text-red-700 hover:bg-red-100 p-1 rounded-full"
        title="Delete Course"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
