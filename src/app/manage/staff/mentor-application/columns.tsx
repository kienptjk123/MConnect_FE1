"use client";
import { Button } from "@/components/ui/button";
import { formatDateToLocaleString } from "@/lib/utils";
import { UpgradeRequestType } from "@/schemaValidations/upgradeRequest";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";

export function getUpdateRequestColumns(): ColumnDef<UpgradeRequestType>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-800 truncate max-w-[30ch] font-medium">
            {row.original.name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "major",
      header: "Major",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-700">{row.original.major}</span>
        </div>
      ),
    },

    {
      id: "created_at",
      header: "Created At",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-600">
            {formatDateToLocaleString(row.original.created_at)}
          </span>
        </div>
      ),
    },
    {
      id: "phone_number",
      header: "Phone Number",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-600">
            {row.original.phone_number ? row.original.phone_number : "N/A"}
          </span>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-600">
            {row.original.status ? row.original.status : "N/A"}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const request = row.original;

        return <RequestActionButtons request={request} />;
      },
      size: 120,
      minSize: 100,
      maxSize: 150,
    },
  ];
}

function RequestActionButtons({ request }: { request: UpgradeRequestType }) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/manage/staff/mentor-application/${request.id}`);
  };

  return (
    <div className="flex items-center justify-start gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleEdit}
        className="text-green-600 hover:text-green-700 hover:bg-green-100 p-1 rounded-full"
        title="Edit Blog"
      >
        <Edit className="h-4 w-4" />
      </Button>
    </div>
  );
}
