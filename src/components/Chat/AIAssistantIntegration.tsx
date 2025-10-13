// AI Assistant Integration Example
// This file shows how to integrate the AI Assistant into your MConnect app

import React from "react";
import {
  AIAssistantProvider,
  useAIAssistant,
} from "@/components/Chat/AIAssistantProvider";
import AIAssistantEnhanced from "@/components/Chat/AIAssistantEnhanced";

// 1. Basic integration - wrap your app with the provider
export function MainLayoutWithAI({ children }: { children: React.ReactNode }) {
  return (
    <AIAssistantProvider>
      <div className="min-h-screen bg-gray-50">
        {children}
        <AIAssistantEnhanced />
      </div>
    </AIAssistantProvider>
  );
}

// 2. Provider only (if you want to use context elsewhere)
export function AppWithAIProvider({ children }: { children: React.ReactNode }) {
  return <AIAssistantProvider>{children}</AIAssistantProvider>;
}

// 3. Custom trigger component
export function CustomAITrigger() {
  const { showAssistant, isVisible } = useAIAssistant();

  return (
    <button
      onClick={showAssistant}
      className="fixed bottom-4 left-4 bg-green-500 text-white px-4 py-2 rounded-lg"
      style={{ display: isVisible ? "none" : "block" }}
    >
      💡 Ask AI
    </button>
  );
}

// 4. Programmatic usage example
export function ProgrammaticExample() {
  const {
    sendMessage,
    createNewSession,
    getUpcomingTasks,
    generateProgressReport,
    getBusinessAnalytics,
  } = useAIAssistant();

  const handleQuickHelp = async () => {
    const sessionId = createNewSession("learning");
    await sendMessage("I need help with my study plan", sessionId);
  };

  const handleTaskAnalysis = async () => {
    await getUpcomingTasks();
  };

  const handleReports = async () => {
    await generateProgressReport();
  };

  const handleBusinessAnalytics = async () => {
    await getBusinessAnalytics();
  };

  return (
    <div className="p-4 space-x-2">
      <button
        onClick={handleQuickHelp}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Quick Help
      </button>
      <button
        onClick={handleTaskAnalysis}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Analyze Tasks
      </button>
      <button
        onClick={handleReports}
        className="px-4 py-2 bg-purple-500 text-white rounded"
      >
        Generate Report
      </button>
      <button
        onClick={handleBusinessAnalytics}
        className="px-4 py-2 bg-orange-500 text-white rounded"
      >
        Business Analytics
      </button>
    </div>
  );
}

export default MainLayoutWithAI;
