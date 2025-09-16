import React from "react";
import { Button } from "@/components/ui/button";

interface MessageTabsProps {
  activeTab: "All" | "Unread" | "Unresolved";
  onTabChange: (tab: "All" | "Unread" | "Unresolved") => void;
  unreadCount?: number;
  unresolvedCount?: number;
}

export const MessageTabs: React.FC<MessageTabsProps> = ({
  activeTab,
  onTabChange,
  unreadCount = 0,
  unresolvedCount = 0,
}) => {
  const tabs = [
    { key: "All" as const, label: "All" },
    { key: "Unread" as const, label: "Unread", count: unreadCount },
    { key: "Unresolved" as const, label: "Unresolved", count: unresolvedCount },
  ];

  return (
    <div className="flex space-x-1 mb-6">
      {tabs.map((tab) => (
        <Button
          key={tab.key}
          variant={activeTab === tab.key ? "default" : "ghost"}
          size="sm"
          onClick={() => onTabChange(tab.key)}
          className={`relative ${
            activeTab === tab.key
              ? "bg-blue-500 text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {tab.label}
          {tab.count && tab.count > 0 && (
            <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
              {tab.count}
            </span>
          )}
        </Button>
      ))}
    </div>
  );
};
