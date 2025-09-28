"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, PhoneOff, Video, Minimize2 } from "lucide-react";
import { CallType } from "@/schemaValidations/call.schema";
import { useSocket } from "@/components/SocketProvider";

interface OutgoingCallScreenProps {
  call: CallType;
  onEndCall: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
  isRinging?: boolean;
}

export const OutgoingCallScreen: React.FC<OutgoingCallScreenProps> = ({
  call,
  onEndCall,
  onMinimize,
  isMinimized = false,
  isRinging = false,
}) => {
  const { endCall: socketEndCall } = useSocket();
  const [callDuration, setCallDuration] = useState(0);

  const receiver = call.receiver;

  // Call duration timer (for ringing time)
  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleEndCall = () => {
    socketEndCall(call.id);
    onEndCall();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 rounded-lg overflow-hidden shadow-2xl cursor-pointer"
        style={{ width: 200, height: 150 }}
        onClick={onMinimize}
      >
        <div className="relative w-full h-full">
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
            <Avatar className="w-16 h-16">
              <AvatarImage src={receiver.avatar || undefined} />
              <AvatarFallback>
                {receiver.username?.[0] || receiver.email[0]}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-between p-2">
            <div className="flex justify-between items-start">
              <div className="text-white text-xs">
                Đang gọi... {formatDuration(callDuration)}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onMinimize?.();
                }}
                className="text-white p-1 h-auto"
              >
                <Minimize2 className="w-3 h-3" />
              </Button>
            </div>

            <div className="flex justify-center">
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEndCall();
                }}
                className="rounded-full p-1 h-auto"
              >
                <PhoneOff className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-black bg-opacity-30 text-white">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {call.callType === "VIDEO" ? (
              <Video className="w-5 h-5" />
            ) : (
              <Phone className="w-5 h-5" />
            )}
            <span className="text-sm">
              Cuộc gọi {call.callType === "VIDEO" ? "video" : "thoại"}
            </span>
          </div>
        </div>

        {onMinimize && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMinimize}
            className="text-white"
          >
            <Minimize2 className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-white">
          {/* Animated Avatar */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 1, -1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mb-8"
          >
            <Avatar className="w-48 h-48 mx-auto border-4 border-white border-opacity-30">
              <AvatarImage src={receiver.avatar || undefined} />
              <AvatarFallback className="text-6xl bg-white bg-opacity-20">
                {receiver.username?.[0] || receiver.email[0]}
              </AvatarFallback>
            </Avatar>
          </motion.div>

          {/* Receiver Info */}
          <div className="mb-8">
            <h2 className="text-3xl font-semibold mb-2">
              {receiver.username || receiver.email}
            </h2>
            <div className="text-lg text-blue-100">
              {call.status === "RINGING" || isRinging
                ? "Đang đổ chuông..."
                : "Đang gọi..."}
            </div>
            <div className="text-sm text-blue-200 mt-1">
              {formatDuration(callDuration)}
            </div>
          </div>

          {/* Ringing Animation */}
          <div className="mb-8">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-16 h-16 mx-auto bg-white bg-opacity-20 rounded-full flex items-center justify-center"
            >
              {call.callType === "VIDEO" ? (
                <Video className="w-8 h-8 text-white" />
              ) : (
                <Phone className="w-8 h-8 text-white" />
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6">
        <div className="flex justify-center">
          <Button
            variant="destructive"
            size="lg"
            onClick={handleEndCall}
            className="rounded-full w-16 h-16 bg-red-500 hover:bg-red-600 shadow-lg"
          >
            <PhoneOff className="w-8 h-8" />
          </Button>
        </div>

        <div className="text-center mt-4">
          <p className="text-white text-sm opacity-75">Nhấn để hủy cuộc gọi</p>
        </div>
      </div>
    </motion.div>
  );
};
