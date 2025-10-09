"use client";
import React, { useState } from "react";
import { AppProvider } from "@/components/app-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { SocketProvider } from "@/components/SocketProvider";
import { AIAssistantProvider } from "@/components/Chat/AIAssistantProvider";
import AIAssistantFloat from "@/components/Chat/AIAssistantFloat";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <SocketProvider>
          <AIAssistantProvider>
            {children}
            <Toaster />
            {/* AI Assistant floats on all screens for authenticated users */}
            <AIAssistantFloat />
          </AIAssistantProvider>
        </SocketProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}
