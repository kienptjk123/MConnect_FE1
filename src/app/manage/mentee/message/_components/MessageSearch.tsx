import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MessageSearchProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

export const MessageSearch: React.FC<MessageSearchProps> = ({
  searchValue,
  onSearchChange,
  placeholder = "Search",
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};
