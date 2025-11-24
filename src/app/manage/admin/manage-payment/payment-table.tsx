"use client";

import React, { useMemo, useState } from "react";
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
import { cn } from "@/lib/utils";
import { getPaymentColumns } from "./columns";
import {
  RefreshCcw,
  Search,
  SlidersHorizontal,
  Download,
  CreditCard,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentType } from "@/types/payment";
import PaymentViewDialog from "@/app/manage/admin/manage-payment/payment-view-dialog";

interface PaymentTableProps {
  data: PaymentType[];
}

export default function PaymentTable({ data }: PaymentTableProps) {
  // Debug logging
  console.log("PaymentTable received data:", data);
  console.log("PaymentTable data length:", data?.length || 0);

  const [selectedPayment, setSelectedPayment] = useState<PaymentType | null>(
    null
  );
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const onView = (payment: PaymentType) => {
    setSelectedPayment(payment);
    setIsViewDialogOpen(true);
  };

  const columns = useMemo<ColumnDef<PaymentType>[]>(
    () => getPaymentColumns(onView),
    []
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  // simple debounce for search
  const [search, setSearch] = useState("");
  React.useEffect(() => {
    const t = setTimeout(() => setGlobalFilter(search), 220);
    return () => clearTimeout(t);
  }, [search]);

  // Filter data based on status and type
  const filteredData = useMemo(() => {
    return data.filter((payment) => {
      const matchesStatus =
        statusFilter === "ALL" || payment.status === statusFilter;
      const matchesType =
        typeFilter === "ALL" || payment.paymentType === typeFilter;
      return matchesStatus && matchesType;
    });
  }, [data, statusFilter, typeFilter]);

  const table = useReactTable({
    data: filteredData,
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
      const value = row.getValue(columnId);
      const raw = String(value ?? "").toLowerCase();
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
      "txnRef",
      "paymentType",
      "amount",
      "status",
      "orderInfo",
      "createdAt",
    ];
    const csv = [
      header.join(","),
      ...rows.map((r) =>
        [
          r.id,
          JSON.stringify(r.txnRef ?? ""),
          JSON.stringify(r.paymentType ?? ""),
          r.amount,
          JSON.stringify(r.status ?? ""),
          JSON.stringify(r.orderInfo ?? ""),
          JSON.stringify(r.createdAt ?? ""),
        ].join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payments.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <div className="relative w-full sm:w-96">
            <div className="flex items-center gap-2 w-full rounded-md border border-gray-300 px-2 bg-white shadow-sm">
              <Search className="h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search payments..."
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

          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="BOOKING">Booking</SelectItem>
                <SelectItem value="COURSE">Course</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.resetSorting();
              setStatusFilter("ALL");
              setTypeFilter("ALL");
              setSearch("");
            }}
            className="rounded-md border-gray-300 bg-white hover:bg-gray-50"
          >
            <RefreshCcw className="h-4 w-4 mr-2" /> Reset
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
                        <span className="text-green-100">
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
                    "hover:bg-green-50",
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
                      <CreditCard className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-gray-700">
                        No payments found
                      </p>
                      <p className="text-sm text-gray-500 max-w-md">
                        {search || statusFilter || typeFilter
                          ? "Try adjusting your search terms or filters."
                          : "No payment records available."}
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
              className="rounded-md border border-gray-300 px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
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

      <PaymentViewDialog
        payment={selectedPayment}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />
    </div>
  );
}
