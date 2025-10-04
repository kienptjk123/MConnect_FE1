"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateToLocaleString } from "@/lib/utils";
import type { WorkExperiencePackage } from "@/schemaValidations/work-exp-package.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function getWorkExperiencePackageColumns(
  onDelete: (row: WorkExperiencePackage) => void
): ColumnDef<WorkExperiencePackage>[] {
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
      accessorKey: "packageType",
      header: "Package Type",
      cell: ({ row }) => {
        const type = row.original.packageType;
        const displayType =
          type === "SANDBOX_ONLY" ? "Sandbox Only" : "Course + Sandbox";
        const variant = type === "SANDBOX_ONLY" ? "secondary" : "default";

        return (
          <Badge variant={variant} className="text-xs">
            {displayType}
          </Badge>
        );
      },
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-600">{row.original.duration} hours</span>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = row.original.price;
        const formattedPrice = new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(price);

        return (
          <div className="flex items-center gap-2">
            <span className="text-gray-600 font-medium">{formattedPrice}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        let variant: "default" | "secondary" | "destructive" = "default";
        let className = "";

        switch (status) {
          case "ACTIVE":
            variant = "default";
            className = "bg-green-100 text-green-700 hover:bg-green-200";
            break;
          case "INACTIVE":
            variant = "secondary";
            className = "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
            break;
          case "ARCHIVED":
            variant = "destructive";
            className = "bg-red-100 text-red-700 hover:bg-red-200";
            break;
        }

        return (
          <Badge variant={variant} className={`text-xs ${className}`}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "_count.bookings",
      header: "Bookings",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-600">{row.original._count.bookings}</span>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-sm">
            {formatDateToLocaleString(row.original.createdAt)}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const workPackage = row.original;

        return (
          <WorkExperiencePackageActionButtons
            workPackage={workPackage}
            onDelete={() => onDelete(workPackage)}
          />
        );
      },
      size: 120,
      minSize: 100,
      maxSize: 150,
    },
  ];
}

function WorkExperiencePackageActionButtons({
  workPackage,
  onDelete,
}: {
  workPackage: WorkExperiencePackage;
  onDelete: () => void;
}) {
  const router = useRouter();

  const handleView = () => {
    router.push(`/manage/mentor/work-experience-package/${workPackage.id}`);
  };

  const handleEdit = () => {
    router.push(
      `/manage/mentor/work-experience-package/${workPackage.id}/edit`
    );
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
        title="Edit Package"
      >
        <Edit className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="text-red-600 hover:text-red-700 hover:bg-red-100 p-1 rounded-full"
        title="Delete Package"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
