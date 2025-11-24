"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, CreditCard } from "lucide-react";
import { PaymentType } from "@/types/payment";

const getStatusBadge = (status: string) => {
  const statusConfig = {
    PENDING: {
      variant: "secondary" as const,
      color: "bg-yellow-100 text-yellow-800",
    },
    PAID: {
      variant: "default" as const,
      color: "bg-green-100 text-green-800",
    },
    FAILED: {
      variant: "destructive" as const,
      color: "bg-red-100 text-red-800",
    },
    CANCELLED: {
      variant: "outline" as const,
      color: "bg-gray-100 text-gray-800",
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

  return (
    <Badge variant={config.variant} className={config.color}>
      {status}
    </Badge>
  );
};

const getPaymentTypeBadge = (type: string) => {
  const typeConfig = {
    BOOKING: { color: "bg-blue-100 text-blue-800" },
    COURSE: { color: "bg-purple-100 text-purple-800" },
  };

  const config =
    typeConfig[type as keyof typeof typeConfig] || typeConfig.BOOKING;

  return (
    <Badge variant="outline" className={config.color}>
      {type}
    </Badge>
  );
};

export const getPaymentColumns = (
  onView: (payment: PaymentType) => void
): ColumnDef<PaymentType>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "paymentType",
    header: "Type",
    cell: ({ row }) => getPaymentTypeBadge(row.getValue("paymentType")),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return (
        <div className="font-semibold">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(amount)}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.getValue("status")),
  },
  {
    id: "customer",
    header: "Customer",
    cell: ({ row }) => {
      const payment = row.original;
      let customer = null;
      let profile = null;

      if (payment.singleSessionBooking?.menteeProfile) {
        profile = payment.singleSessionBooking.menteeProfile;
        customer = profile.user;
      } else if (payment.workExperienceBooking?.menteeProfile) {
        profile = payment.workExperienceBooking.menteeProfile;
        customer = profile.user;
      } else if (payment.menteeProfile) {
        profile = payment.menteeProfile;
        customer = profile.user;
      }

      if (!customer || !profile)
        return <span className="text-gray-400">N/A</span>;

      return (
        <div className="space-y-1">
          <div className="font-medium">{profile.name || "Unknown"}</div>
          <div className="text-sm text-gray-500">{customer.email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "providerRef",
    header: "ProviderRef",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate text-sm">
        {row.getValue("providerRef") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-sm">
          {date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
          <br />
          <span className="text-gray-500">
            {date.toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(payment)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
