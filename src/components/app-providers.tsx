"use client";
import React, { useState } from "react";
import { AppProvider } from "@/components/app-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { SocketProvider } from "@/components/SocketProvider";
import { AIAssistantProvider } from "@/components/Chat/AIAssistantProvider";
import AIAssistantFloat from "@/components/Chat/AIAssistantFloat";
import { usePathname } from "next/navigation";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const pathName = usePathname();
  const isPublicRoute =
    /^\/($|blog|contact|course|forum|about|message)(\/.*)?$/.test(pathName);
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
