"use client";
import React, { createContext, useContext, useState } from "react";

type Role = "MENTOR" | "MENTEE" | "STAFF" | "ADMIN" | undefined;

interface AppContextType {
  role: Role;
  setRole: (role?: Role) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(undefined);

  return (
    <AppContext.Provider value={{ role, setRole }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
