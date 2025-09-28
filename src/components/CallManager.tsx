"use client";

import React, { useEffect, useState } from "react";
import { useSocket } from "@/components/SocketProvider";
import { CallScreen } from "@/components/CallScreen";
import { IncomingCallModal } from "@/components/IncomingCallModal";
import { OutgoingCallScreen } from "@/components/OutgoingCallScreen";
import { CallType } from "@/schemaValidations/call.schema";
import { useProfile } from "@/hooks/useProfile";
import { AnimatePresence } from "framer-motion";
import { useEndCallMutation } from "@/queries/useCall";

export const CallManager: React.FC = () => {
  const profile = useProfile();
  const endCallMutation = useEndCallMutation();
  const {
    onIncomingCall,
    onCallAccepted,
    onCallDeclined,
    onCallEnded,
    onCallMissed,
    connected,
  } = useSocket();

  console.log(
    "📞 [CallManager] Socket connected:",
    connected,
    "Profile:",
    profile?.id
  );

  const [currentCall, setCurrentCall] = useState<CallType | null>(null);
  const [incomingCall, setIncomingCall] = useState<CallType | null>(null);
  const [outgoingCall, setOutgoingCall] = useState<CallType | null>(null);
  const [callState, setCallState] = useState<
    "idle" | "incoming" | "outgoing" | "ringing" | "active" | "minimized"
  >("idle");

  // Listen for incoming calls
  useEffect(() => {
    console.log("📞 [CallManager] Setting up socket listeners...");

    const unsubscribeIncoming = onIncomingCall((data) => {
      console.log("📞 [Call] Incoming call:", data);
      if (data.call) {
        setIncomingCall(data.call);
        setCallState("incoming");
      }
    });

    const unsubscribeAccepted = onCallAccepted((data) => {
      if (data.call) {
        const updatedCall = { ...data.call, status: "ACCEPTED" };
        console.log("📞 [CallManager] Setting current call to:", updatedCall);
        setCurrentCall(updatedCall);
        setIncomingCall(null);
        setOutgoingCall(null);
        setCallState("active");
      }
    });

    const unsubscribeDeclined = onCallDeclined((data) => {
      console.log("📞 [Call] Call declined:", data);
      if (data.call) {
        setTimeout(() => {
          setCurrentCall(null);
          setIncomingCall(null);
          setOutgoingCall(null);
          setCallState("idle");
        }, 100);
      } else {
        setCurrentCall(null);
        setIncomingCall(null);
        setOutgoingCall(null);
        setCallState("idle");
      }
    });

    const unsubscribeEnded = onCallEnded((data) => {
      if (data.call) {
        setCurrentCall({ ...data.call, status: "ENDED" });
        setTimeout(() => {
          setCurrentCall(null);
          setIncomingCall(null);
          setOutgoingCall(null);
          setCallState("idle");
        }, 100);
      } else {
        setCurrentCall(null);
        setIncomingCall(null);
        setOutgoingCall(null);
        setCallState("idle");
      }
    });

    const unsubscribeMissed = onCallMissed((data) => {
      setCurrentCall(null);
      setIncomingCall(null);
      setOutgoingCall(null);
      setCallState("idle");
    });

    return () => {
      unsubscribeIncoming();
      unsubscribeAccepted();
      unsubscribeDeclined();
      unsubscribeEnded();
      unsubscribeMissed();
    };
  }, [
    onIncomingCall,
    onCallAccepted,
    onCallDeclined,
    onCallEnded,
    onCallMissed,
  ]);

  const handleAcceptCall = () => {
    if (incomingCall) {
      setCurrentCall(incomingCall);
      setIncomingCall(null);
      setCallState("active");
    }
  };

  const handleDeclineCall = () => {
    setIncomingCall(null);
    setCallState("idle");
  };

  const handleEndCall = async () => {
    if (currentCall) {
      try {
        await endCallMutation.mutateAsync({
          callId: currentCall.id,
          reason: "Người dùng kết thúc cuộc gọi",
        });
      } catch (error) {
        console.error("Error ending call via API:", error);
      }
    }

    setCurrentCall(null);
    setIncomingCall(null);
    setOutgoingCall(null);
    setCallState("idle");
  };

  const handleMinimize = () => {
    setCallState("minimized");
  };

  const handleMaximize = () => {
    setCallState("active");
  };

  useEffect(() => {
    if (
      currentCall &&
      (currentCall.status === "ENDED" ||
        currentCall.status === "DECLINED" ||
        currentCall.status === "MISSED")
    ) {
      handleEndCall();
    }
  }, [currentCall?.status]);

  const initiateOutgoingCall = (call: CallType) => {
    setOutgoingCall(call);
    setCurrentCall(call);
    setCallState("active");
  };

  // Expose method to window for access from other components
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).callManager = {
        initiateOutgoingCall,
      };
    }
  }, []);

  if (!profile) return null;

  return (
    <AnimatePresence>
      {callState === "incoming" && incomingCall && (
        <IncomingCallModal
          call={incomingCall}
          onAccept={handleAcceptCall}
          onDecline={handleDeclineCall}
        />
      )}

      {(callState === "outgoing" || callState === "ringing") &&
        outgoingCall && (
          <OutgoingCallScreen
            call={outgoingCall}
            onEndCall={handleEndCall}
            onMinimize={handleMinimize}
            isMinimized={false}
            isRinging={callState === "ringing"}
          />
        )}

      {(callState === "active" || callState === "minimized") && currentCall && (
        <CallScreen
          call={currentCall}
          isInitiator={currentCall.callerId === profile.id}
          onEndCall={handleEndCall}
          onMinimize={callState === "active" ? handleMinimize : handleMaximize}
          isMinimized={callState === "minimized"}
        />
      )}
    </AnimatePresence>
  );
};
