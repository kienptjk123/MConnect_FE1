"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NotificationFiltersProps {
  selectedType: string;
  selectedStatus: string;
  onTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export default function NotificationFilters({
  selectedType,
  selectedStatus,
  onTypeChange,
  onStatusChange,
}: NotificationFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex items-center space-x-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="FRIEND_REQUEST">Friend Requests</SelectItem>
            <SelectItem value="MESSAGE">Messages</SelectItem>
            <SelectItem value="BLOG">Blog Updates</SelectItem>
            <SelectItem value="COURSE">Course Updates</SelectItem>
            <SelectItem value="SYSTEM">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Select value={selectedStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="unread">Unread</SelectItem>
          <SelectItem value="read">Read</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
