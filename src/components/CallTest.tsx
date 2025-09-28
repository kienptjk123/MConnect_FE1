"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Phone, Video } from "lucide-react";
import { CallType } from "@/schemaValidations/call.schema";

export const CallTest: React.FC = () => {
  const testOutgoingCall = (callType: "VOICE" | "VIDEO") => {
    // Mock call data for testing
    const mockCall: CallType = {
      id: 999,
      callerId: 1,
      receiverId: 2,
      callType: callType,
      status: "PENDING",
      conversationId: 1,
      startedAt: new Date().toISOString(),
      ringingAt: null,
      acceptedAt: null,
      endedAt: null,
      duration: null,
      endReason: null,
      caller: {
        id: 1,
        email: "caller@example.com",
        username: "Caller User",
        avatar: null,
        menteeProfiles: [],
        mentorProfiles: [],
        adminProfiles: [],
        StaffProfile: [],
      },
      receiver: {
        id: 2,
        email: "receiver@example.com",
        username: "Receiver User",
        avatar: null,
        menteeProfiles: [],
        mentorProfiles: [],
        adminProfiles: [],
        StaffProfile: [],
      },
    };

    // Call the global CallManager method
    if ((window as any).callManager) {
      (window as any).callManager.initiateOutgoingCall(mockCall);
    } else {
      console.error("CallManager not found on window");
    }
  };

  return (
    <div className="fixed top-4 left-4 z-50 bg-white p-4 rounded-lg shadow-lg border">
      <h3 className="text-sm font-semibold mb-2">Call Test</h3>
      <div className="flex flex-col space-y-2">
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={() => testOutgoingCall("VOICE")}
            className="flex items-center space-x-1"
          >
            <Phone className="w-4 h-4" />
            <span>Test Voice Call</span>
          </Button>
          <Button
            size="sm"
            onClick={() => testOutgoingCall("VIDEO")}
            className="flex items-center space-x-1"
          >
            <Video className="w-4 h-4" />
            <span>Test Video Call</span>
          </Button>
        </div>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => {
            // Simulate call ended event
            if ((window as any).callManager) {
              console.log("📞 [Test] Simulating call ended");
            }
          }}
          className="text-xs"
        >
          Test Call End Event
        </Button>
      </div>
    </div>
  );
};
