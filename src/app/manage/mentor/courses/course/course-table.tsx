"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { useMentorDeleteCourseMutation } from "@/queries/useMentorCourse";
import { CourseType } from "@/schemaValidations/course.schema";
import { Edit, Eye, Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

interface CourseTableProps {
  data: CourseType[];
}

const getStatusBadge = (status: "PUBLISHED" | "DRAFT" | "ARCHIVED") => {
  const statusConfig = {
    PUBLISHED: {
      label: "Published",
      className: "bg-green-100 text-green-800 border-green-200",
    },
    DRAFT: {
      label: "Draft",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    ARCHIVED: {
      label: "Archived",
      className: "bg-gray-100 text-gray-800 border-gray-200",
    },
  };

  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};

export default function CourseTable({ data }: CourseTableProps) {
  const router = useRouter();
  const deleteCourseMutation = useMentorDeleteCourseMutation();
  const [courses, setCourses] = useState<CourseType[]>(data);

  const handleEdit = (id: number) => {
    router.push(`/manage/mentor/courses/course/${id}/edit`);
  };

  const handleView = (slug: string) => {
    router.push(`/manage/mentor/courses/course/view/${slug}`);
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: `Are you sure to delete course?`,
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
      await deleteCourseMutation.mutateAsync(id);
      toast({
        title: "Course deleted",
        description: `"Course was removed.`,
      });
      setCourses((prev) => prev.filter((course) => course.id !== id));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete tag.",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(parseFloat(price));
  };

  const formatRating = (rating: number) => {
    return rating > 0 ? rating.toFixed(1) : "0.0";
  };

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-500 text-white hover:bg-blue-500 dark:bg-gray-800/50">
              <TableHead className="font-semibold text-white">Course</TableHead>
              <TableHead className="font-semibold text-white">Price</TableHead>
              <TableHead className="font-semibold text-white">
                Students
              </TableHead>
              <TableHead className="font-semibold text-white">
                Modules
              </TableHead>
              <TableHead className="font-semibold text-white">Rating</TableHead>
              <TableHead className="font-semibold text-white">Status</TableHead>
              <TableHead className="font-semibold text-white">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3 text-gray-500">
                    <div className="rounded-md bg-gray-100 p-3">
                      <Eye className="h-5 w-5" />
                    </div>
                    <span>No courses found</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course.id} className="hover:bg-gray-50/50">
                  <TableCell>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {course.title}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(course.price)}
                  </TableCell>

                  <TableCell className="font-medium">
                    {course._count?.enrollments || 0}
                  </TableCell>
                  <TableCell className="font-medium">
                    {course.modules.length || 0}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {formatRating(course?.avgRating || 0)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(course.status)}</TableCell>
                  <TableCell className="text-right flex gap-4">
                    <div
                      onClick={() => handleView(course.slug)}
                      className="cursor-pointer"
                    >
                      <Eye className="mr-2 h-4 w-4 text-blue-500" />
                    </div>
                    <div
                      onClick={() => handleEdit(course.id)}
                      className="cursor-pointer"
                    >
                      <Edit className="mr-2 h-4 w-4 text-green-500" />
                    </div>
                    <div
                      onClick={() => handleDelete(course.id)}
                      className="cursor-pointer text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {courses.length > 0 && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Showing {courses.length} course{courses.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  );
}
