"use client";
import React, { useState } from "react";
import { AppProvider } from "@/components/app-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        {children}
        <Toaster />
      </AppProvider>
    </QueryClientProvider>
  );
}
