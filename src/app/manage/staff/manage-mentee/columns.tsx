"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDateToLocaleString } from "@/lib/utils";
import type { MenteeType } from "@/schemaValidations/mentee.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Trash2, MapPin, Phone, Globe, Mail } from "lucide-react";

export function getMenteeColumns(
  onDelete: (row: MenteeType) => void
): ColumnDef<MenteeType>[] {
  return [
    {
      accessorKey: "avatar",
      header: "Avatar",
      cell: ({ row }) => (
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={row.original.avatar || ""}
            alt={row.original.name}
          />
          <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
            {row.original.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ),
      size: 80,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex flex-col ">
          <span className="text-gray-800 font-medium truncate max-w-[20ch]">
            {row.original.name}
          </span>
          <span className="text-sm text-gray-500">
            @{row.original.username}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-700 truncate max-w-[25ch]">
            {row.original.email}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "phone_number",
      header: "Phone",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.phone_number ? (
            <>
              <span className="text-gray-700">{row.original.phone_number}</span>
            </>
          ) : (
            <span className="text-gray-400 italic text-sm">No phone</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.location ? (
            <>
              <span className="text-gray-700 truncate max-w-[15ch]">
                {row.original.location}
              </span>
            </>
          ) : (
            <span className="text-gray-400 italic text-sm">No location</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const getStatusColor = (status: string) => {
          switch (status.toLowerCase()) {
            case "verified":
              return "bg-green-100 text-green-800 border-green-200";
            case "inactive":
              return "bg-red-100 text-red-800 border-red-200";
            case "pending":
              return "bg-yellow-100 text-yellow-800 border-yellow-200";
            default:
              return "bg-gray-100 text-gray-800 border-gray-200";
          }
        };

        return (
          <Badge className={`${getStatusColor(status)} text-xs`}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "website",
      header: "Website",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.website ? (
            <>
              <a
                href={row.original.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm truncate max-w-[20ch]"
              >
                {row.original.website.replace(/^https?:\/\//, "")}
              </a>
            </>
          ) : (
            <span className="text-gray-400 italic text-sm">No website</span>
          )}
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
        const mentee = row.original;

        return (
          <MenteeActionButtons
            mentee={mentee}
            onDelete={() => onDelete(mentee)}
          />
        );
      },
      size: 80,
      minSize: 70,
      maxSize: 100,
    },
  ];
}

function MenteeActionButtons({
  mentee,
  onDelete,
}: {
  mentee: MenteeType;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-start gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="text-red-600 hover:text-red-700 hover:bg-red-100 p-1 rounded-full"
        title="Delete Mentee"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
