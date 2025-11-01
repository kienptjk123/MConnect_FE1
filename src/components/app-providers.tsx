"use client";
import { AppProvider } from "@/components/app-provider";
import AIAssistantFloat from "@/components/Chat/AIAssistantFloat";
import { AIAssistantProvider } from "@/components/Chat/AIAssistantProvider";
import { SocketProvider } from "@/components/SocketProvider";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const pathName = usePathname();
  const hiddenAIPaths = [
    "/",
    "/blog",
    "/contact",
    "/course",
    "/forum",
    "/about",
    "/manage/mentee/message",
    "/manage/mentor/message",
  ];

  const isPublicRoute = hiddenAIPaths.includes(pathName);
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <SocketProvider>
          {isPublicRoute ? (
            <>
              {children}
              <Toaster />
            </>
          ) : (
            <AIAssistantProvider>
              {children}
              <Toaster />
              <AIAssistantFloat />
            </AIAssistantProvider>
          )}
        </SocketProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}
