"use client";
import React, { useState } from "react";
import { AppProvider } from "@/components/app-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { SocketProvider } from "@/components/SocketProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <SocketProvider>
          {children}
          <Toaster />
        </SocketProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}
