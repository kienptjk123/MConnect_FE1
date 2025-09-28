"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, PhoneOff, Video } from "lucide-react";
import { CallType } from "@/schemaValidations/call.schema";
import {
  useAcceptCallMutation,
  useDeclineCallMutation,
} from "@/queries/useCall";

interface IncomingCallModalProps {
  call: CallType;
  onAccept: () => void;
  onDecline: () => void;
}

export const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
  call,
  onAccept,
  onDecline,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const acceptCallMutation = useAcceptCallMutation();
  const declineCallMutation = useDeclineCallMutation();

  const caller = call.caller;

  useEffect(() => {
    setIsVisible(true);

    // Auto decline after 60 seconds
    const timeout = setTimeout(() => {
      handleDecline("Không trả lời");
    }, 60000);

    return () => clearTimeout(timeout);
  }, []);

  const handleAccept = async () => {
    try {
      console.log("📞 [IncomingCallModal] Call details:", {
        callerId: call.callerId,
        receiverId: call.receiverId,
        status: call.status,
      });
      const result = await acceptCallMutation.mutateAsync(call.id);
      console.log(
        "📞 [IncomingCallModal] Backend should emit to callerId:",
        result.payload?.result.callerId
      );

      // Call onAccept immediately - don't wait for socket event
      // The socket event should update the call status later
      onAccept();

      // Also emit a manual event as backup
      setTimeout(() => {
        console.log(
          "📞 [IncomingCallModal] Manual backup - notifying call accepted"
        );
        // This will be handled by CallManager
      }, 100);
    } catch (error) {
      console.error("Failed to accept call:", error);
    }
  };

  const handleDecline = async (reason?: string) => {
    try {
      await declineCallMutation.mutateAsync({
        callId: call.id,
        reason: reason || "Từ chối",
      });
      onDecline();
    } catch (error) {
      console.error("Failed to decline call:", error);
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl"
      >
        {/* Incoming call animation */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="mb-6"
        >
          <Avatar className="w-32 h-32 mx-auto mb-4">
            <AvatarImage src={caller.avatar || undefined} />
            <AvatarFallback className="text-4xl">
              {caller.username?.[0] || caller.email[0]}
            </AvatarFallback>
          </Avatar>
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {caller.username || caller.email}
        </h2>

        <div className="flex items-center justify-center text-gray-600 mb-8">
          {call.callType === "VIDEO" ? (
            <Video className="w-5 h-5 mr-2" />
          ) : (
            <Phone className="w-5 h-5 mr-2" />
          )}
          <span>
            Cuộc gọi {call.callType === "VIDEO" ? "video" : "thoại"} đến...
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center space-x-8">
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              variant="destructive"
              size="lg"
              onClick={() => handleDecline("Từ chối")}
              className="rounded-full w-16 h-16"
              disabled={declineCallMutation.isPending}
            >
              <PhoneOff className="w-8 h-8" />
            </Button>
          </motion.div>

          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              variant="default"
              size="lg"
              onClick={handleAccept}
              className="rounded-full w-16 h-16 bg-green-500 hover:bg-green-600"
              disabled={acceptCallMutation.isPending}
            >
              <Phone className="w-8 h-8" />
            </Button>
          </motion.div>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          {acceptCallMutation.isPending
            ? "Đang chấp nhận cuộc gọi..."
            : declineCallMutation.isPending
            ? "Đang từ chối cuộc gọi..."
            : "Vuốt lên để trả lời, vuốt xuống để từ chối"}
        </div>
      </motion.div>
    </motion.div>
  );
};
