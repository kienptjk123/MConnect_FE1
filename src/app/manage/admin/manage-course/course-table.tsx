"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  type VisibilityState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { CourseType } from "@/schemaValidations/course.schema";
import { getCourseColumns } from "./columns";
import { useDeleteCourseMutation } from "@/queries/useCourseAdmin";
import {
  RefreshCcw,
  Search,
  SlidersHorizontal,
  Download,
  BookOpen,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import CourseEditDialog from "@/app/manage/admin/manage-course/course-edit-dialog";
import Swal from "sweetalert2";

interface CourseTableProps {
  data: CourseType[];
}

export default function CourseTable({ data }: CourseTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [editingCourse, setEditingCourse] = useState<CourseType | null>(null);
  const [search, setSearch] = useState("");
  const [density, setDensity] = useState<"compact" | "comfortable">(
    "comfortable"
  );

  const deleteCourseMutation = useDeleteCourseMutation();
  const router = useRouter();

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredData = useMemo(() => {
    if (!debouncedSearch) return data;
    return data.filter(
      (course) =>
        course.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        course.mentorProfile?.name
          ?.toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        course.categories?.[0]?.courseCategory?.name
          ?.toLowerCase()
          .includes(debouncedSearch.toLowerCase())
    );
  }, [data, debouncedSearch]);

  const onDelete = async (course: CourseType) => {
    const result = await Swal.fire({
      title: `Are you sure to delete "${course.title}"?`,
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
      await deleteCourseMutation.mutateAsync(course.id.toString());
      toast({
        title: "Course deleted",
        description: `"${course.title}" was removed.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete course.",
        variant: "destructive",
      });
    }
  };

  const onEdit = (course: CourseType) => {
    setEditingCourse(course);
  };

  const columns = useMemo<ColumnDef<CourseType>[]>(
    () => getCourseColumns(onDelete, onEdit),
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, columnVisibility },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  const exportCsv = () => {
    const rows = table.getFilteredRowModel().rows.map((r) => r.original);
    const header = [
      "id",
      "title",
      "mentor",
      "status",
      "price",
      "rating",
      "enrollments",
      "created",
    ];
    const csv = [
      header.join(","),
      ...rows.map((r) =>
        [
          r.id,
          JSON.stringify(r.title ?? ""),
          JSON.stringify(r.mentorProfile?.name ?? ""),
          JSON.stringify(r.status ?? ""),
          JSON.stringify(r.price ?? ""),
          JSON.stringify(r.avgRating ?? ""),
          JSON.stringify(r._count?.enrollments ?? ""),
          JSON.stringify(r.createdAt ?? ""),
        ].join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "courses.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:w-96">
          <div className="flex items-center gap-2 w-full rounded-md border border-gray-300 px-2 bg-white shadow-sm">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 shadow-none focus-visible:ring-0 bg-transparent placeholder:text-gray-400"
            />
            {search && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearch("")}
                className="h-5 w-5 p-0 hover:bg-gray-100 rounded-full"
              >
                ×
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.resetSorting()}
            className="rounded-md border-gray-300 bg-white hover:bg-gray-50"
          >
            <RefreshCcw className="h-4 w-4 mr-2" /> Reset Sort
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-md border-gray-300 bg-white hover:bg-gray-50"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" /> View Options
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded-md w-56 bg-white border-gray-200 shadow-lg"
            >
              <DropdownMenuLabel className="font-medium text-gray-700">
                Visible Columns
              </DropdownMenuLabel>
              {table.getAllLeafColumns().map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={col.getIsVisible()}
                  onCheckedChange={(val) => col.toggleVisibility(Boolean(val))}
                >
                  {col.columnDef.header as any}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <Button
                onClick={exportCsv}
                variant="ghost"
                size="sm"
                className="w-full justify-start hover:bg-gray-100"
              >
                <Download className="h-4 w-4 mr-2" /> Export CSV
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-gray-200 hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="bg-blue-400 text-white font-semibold py-3 first:rounded-tl-md last:rounded-tr-md"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                          "select-none flex items-center gap-2",
                          header.column.getCanSort() &&
                            "cursor-pointer hover:text-blue-100"
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <span className="text-blue-100">
                          {{ asc: "↑↑", desc: "↓↓" }[
                            header.column.getIsSorted() as string
                          ] ?? null}
                        </span>
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "transition-colors border-gray-200",
                    density === "compact" ? "h-10" : "h-12",
                    "hover:bg-blue-50",
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllLeafColumns().length}
                  className="p-12"
                >
                  <div className="flex flex-col items-center justify-center gap-4 text-center">
                    <div className="rounded-md bg-gray-100 p-4">
                      <BookOpen className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-gray-700">
                        No courses found
                      </p>
                      <p className="text-sm text-gray-500 max-w-md">
                        {search
                          ? "Try adjusting your search terms to find courses."
                          : "No courses available in the system."}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>
            {table.getFilteredRowModel().rows.length} result
            {table.getFilteredRowModel().rows.length !== 1 ? "s" : ""} found
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Rows per page</span>
            <select
              className="rounded-md border border-gray-300 px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {[5, 10, 20, 50].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="rounded-md border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </Button>
            <Button
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="rounded-md bg-blue-400 hover:bg-blue-500 text-white disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <CourseEditDialog
        course={editingCourse}
        open={!!editingCourse}
        onOpenChange={(open: boolean) => !open && setEditingCourse(null)}
      />
    </div>
  );
}
