import React from "react";
import { useProfile } from "@/hooks/useProfile";
import AIAssistantEnhanced from "./AIAssistantEnhanced";

/**
 * AI Assistant Wrapper Component
 *
 * This component wraps the AIAssistantEnhanced and only renders it when:
 * 1. User is authenticated (has a profile)
 * 2. User has a valid role (MENTEE or MENTOR)
 *
 * It automatically floats on all screens for authenticated users.
 */
export const AIAssistantFloat: React.FC = () => {
  const profile = useProfile();

  // Only show AI Assistant for authenticated users with valid roles
  const shouldShowAssistant =
    profile &&
    profile.id &&
    (profile.role === "MENTEE" || profile.role === "MENTOR");

  if (!shouldShowAssistant) {
    return null;
  }

  return <AIAssistantEnhanced className="ai-assistant-float" />;
};

export default AIAssistantFloat;
