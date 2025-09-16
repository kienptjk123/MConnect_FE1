"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import React, { useMemo, useState } from "react";

import { getUpdateRequestColumns } from "@/app/manage/staff/mentor-application/columns";
import { UpgradeRequestType } from "@/schemaValidations/upgradeRequest";
import {
  Download,
  FileText,
  Plus,
  RefreshCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function MentorApplicationTable({
  data,
}: {
  data: UpgradeRequestType[];
}) {
  const router = useRouter();

  const columns = useMemo<ColumnDef<UpgradeRequestType>[]>(
    () => getUpdateRequestColumns(),
    []
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // simple debounce for search
  const [search, setSearch] = useState("");
  React.useEffect(() => {
    const t = setTimeout(() => setGlobalFilter(search), 220);
    return () => clearTimeout(t);
  }, [search]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, columnVisibility },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const raw = String(row.getValue(columnId) ?? "").toLowerCase();
      return raw.includes(String(filterValue).toLowerCase());
    },
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  const exportCsv = () => {
    const rows = table.getFilteredRowModel().rows.map((r) => r.original);
    const header = [
      "id",
      "name",
      "bio",
      "major",
      "cv_url",
      "description",
      "website",
      "created_at",
      "phone_number",
      "status",
      "review_comment",
      "created_at",
      "updated_at",
    ];
    const csv = [
      header.join(","),
      ...rows.map((r) =>
        [
          r.id,
          JSON.stringify(r.id ?? ""),
          JSON.stringify(r.name ?? ""),
          JSON.stringify(r.bio ?? ""),
          JSON.stringify(r.major ?? ""),
          JSON.stringify(r.cv_url ?? ""),
          JSON.stringify(r.description ?? ""),
          JSON.stringify(r.website ?? ""),
          JSON.stringify(r.phone_number ?? ""),
          JSON.stringify(r.status ?? ""),
          JSON.stringify(r.review_comment ?? ""),
          JSON.stringify(r.created_at ?? ""),
          JSON.stringify(r.updated_at ?? ""),
        ].join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "requests.csv";
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
              placeholder="Search requests by name or major..."
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
                    "transition-colors border-gray-200 h-10",
                    "hover:bg-blue-50",
                    "bg-white"
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
                      <FileText className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-gray-700">
                        No requests found
                      </p>
                      <p className="text-sm text-gray-500 max-w-md">
                        {search
                          ? "Try adjusting your search terms or create a new request."
                          : "Create your first request to get started."}
                      </p>
                    </div>
                    <Button
                      onClick={() =>
                        router.push("/manage/staff/manage-request/create")
                      }
                      className="gap-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="h-4 w-4" />
                      Create request
                    </Button>
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
    </div>
  );
}
