"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateToLocaleString } from "@/lib/utils";
import type { StaffType } from "@/schemaValidations/staff.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";

export function getStaffColumns(
  onDelete: (row: StaffType) => void
): ColumnDef<StaffType>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            {row.original.avatar ? (
              <img
                src={row.original.avatar}
                alt={row.original.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-4 h-4 text-gray-400" />
              </div>
            )}
            <span className="text-gray-800 font-medium max-w-[20ch] truncate">
              {row.original.name}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-700">@{row.original.username}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-700 max-w-[25ch] truncate">
            {row.original.email}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <Badge
          variant="secondary"
          className={`text-xs ${
            row.original.role === "ADMIN"
              ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
          }`}
        >
          {row.original.role}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant="secondary"
          className={`text-xs ${
            row.original.status === "ACTIVE"
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : row.original.status === "INACTIVE"
              ? "bg-red-100 text-red-700 hover:bg-red-200"
              : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
          }`}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "phone_number",
      header: "Phone",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-600">
            {row.original.phone_number || "Not provided"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-600 max-w-[20ch] truncate">
            {row.original.location || "Not provided"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Joined",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-sm">
            {formatDateToLocaleString(row.original.created_at)}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const staff = row.original;

        return (
          <StaffActionButtons staff={staff} onDelete={() => onDelete(staff)} />
        );
      },
      size: 120,
      minSize: 100,
      maxSize: 150,
    },
  ];
}

function StaffActionButtons({
  staff,
  onDelete,
}: {
  staff: StaffType;
  onDelete: () => void;
}) {
  const router = useRouter();

  const handleView = () => {
    router.push(`/manage/admin/manage-staff/${staff.id}`);
  };

  const handleEdit = () => {
    router.push(`/manage/admin/manage-staff/${staff.id}/edit`);
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
        title="Edit Staff"
      >
        <Edit className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="text-red-600 hover:text-red-700 hover:bg-red-100 p-1 rounded-full"
        title="Delete Staff"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
