"use client";

import React, { useEffect, useState, useRef } from "react";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useSocket } from "@/components/SocketProvider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { CallType } from "@/schemaValidations/call.schema";
import { motion, AnimatePresence } from "framer-motion";

interface CallScreenProps {
  call: CallType;
  isInitiator: boolean;
  onEndCall: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
}

export const CallScreen: React.FC<CallScreenProps> = ({
  call,
  isInitiator,
  onEndCall,
  onMinimize,
  isMinimized = false,
}) => {
  const { endCall: socketEndCall } = useSocket();
  const [isCameraOn, setIsCameraOn] = useState(call.callType === "VIDEO");
  const [isMicOn, setIsMicOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<
    "connecting" | "ringing" | "connected" | "calling"
  >("connecting");

  const partner = isInitiator ? call.receiver : call.caller;

  const {
    localVideoRef,
    remoteVideoRef,
    localStream,
    remoteStream,
    isConnecting,
    isConnected,
    error,
    startCall,
    endCall,
    toggleCamera,
    toggleMicrophone,
  } = useWebRTC({
    callId: call.id,
    isInitiator,
    callType: call.callType,
    onCallEnd: onEndCall,
  });

  useEffect(() => {
    if (isConnected) {
      setCallStatus("connected");
    } else if (call.status === "ACCEPTED") {
      setCallStatus("connecting");
    } else if (call.status === "RINGING") {
      setCallStatus(isInitiator ? "calling" : "ringing");
    } else {
      setCallStatus("connecting");
    }
  }, [isConnected, call.status, isInitiator]);

  const hasStartedCallRef = useRef(false);

  useEffect(() => {
    if (hasStartedCallRef.current) return;

    const shouldStart = isInitiator ? call.status === "ACCEPTED" : true;

    if (shouldStart) {
      hasStartedCallRef.current = true;
      startCall();
    }
  }, [call.status, isInitiator, startCall]);
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (callStatus === "connected") {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callStatus]);

  const handleEndCall = () => {
    console.log("📞 [CallScreen] Ending call:", call.id);
    endCall();
    socketEndCall(call.id);
    onEndCall();
  };

  const handleToggleCamera = () => {
    toggleCamera();
    setIsCameraOn((prev) => !prev);
  };

  const handleToggleMic = () => {
    toggleMicrophone();
    setIsMicOn((prev) => !prev);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-4 right-4 z-50 bg-black rounded-lg overflow-hidden shadow-2xl"
        style={{ width: 200, height: 150 }}
      >
        <div className="relative w-full h-full">
          {call.callType === "VIDEO" && localStream ? (
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <Avatar className="w-16 h-16">
                <AvatarImage src={partner.avatar || undefined} />
                <AvatarFallback>
                  {partner.username?.[0] || partner.email[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          )}

          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-between p-2">
            <div className="flex justify-between items-start">
              <div className="text-white text-xs">
                {callStatus === "connected"
                  ? formatDuration(callDuration)
                  : "Đang gọi..."}
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
                <Maximize2 className="w-3 h-3" />
              </Button>
            </div>

            <div className="flex justify-center space-x-2">
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gray-900 flex flex-col"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-black bg-opacity-50 text-white">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={partner.avatar || undefined} />
            <AvatarFallback>
              {partner.username?.[0] || partner.email[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">
              {partner.username || partner.email}
            </div>
            <div className="text-sm text-gray-300">
              {callStatus === "connected"
                ? formatDuration(callDuration)
                : callStatus === "ringing"
                ? "Đang đổ chuông..."
                : callStatus === "calling"
                ? "Đang gọi..."
                : "Đang kết nối..."}
            </div>
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

      {/* Video Area */}
      <div className="flex-1 relative">
        {call.callType === "VIDEO" ? (
          <>
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              {remoteStream ? (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-white">
                  <Avatar className="w-32 h-32 mx-auto mb-4">
                    <AvatarImage src={partner.avatar || undefined} />
                    <AvatarFallback className="text-4xl">
                      {partner.username?.[0] || partner.email[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-lg">
                    {callStatus === "connecting"
                      ? "Đang kết nối..."
                      : "Đang chờ video..."}
                  </div>
                </div>
              )}
            </div>

            {/* Local video (picture-in-picture) */}
            <div className="absolute top-4 right-4 w-32 h-24 bg-black rounded-lg overflow-hidden border-2 border-white shadow-lg">
              {localStream && isCameraOn ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover transform scale-x-[-1]"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <VideoOff className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
          </>
        ) : (
          /* Voice call UI */
          <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
            <div className="text-center text-white">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Avatar className="w-48 h-48 mx-auto mb-8">
                  <AvatarImage src={partner.avatar || undefined} />
                  <AvatarFallback className="text-6xl">
                    {partner.username?.[0] || partner.email[0]}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <div className="text-2xl font-semibold mb-2">
                {partner.username || partner.email}
              </div>
              <div className="text-lg text-gray-300">
                {callStatus === "connected"
                  ? `Cuộc gọi thoại • ${formatDuration(callDuration)}`
                  : callStatus === "ringing"
                  ? "Đang đổ chuông..."
                  : callStatus === "calling"
                  ? "Đang gọi..."
                  : "Đang kết nối..."}
              </div>
            </div>
          </div>
        )}

        {/* Error overlay */}
        {error && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <div className="bg-red-600 text-white p-4 rounded-lg text-center">
              <div className="font-medium mb-2">Lỗi cuộc gọi</div>
              <div className="text-sm">{error}</div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 bg-black bg-opacity-75">
        <div className="flex justify-center space-x-6">
          {call.callType === "VIDEO" && (
            <Button
              variant={isCameraOn ? "secondary" : "destructive"}
              size="lg"
              onClick={handleToggleCamera}
              className="rounded-full w-14 h-14"
            >
              {isCameraOn ? (
                <Video className="w-6 h-6" />
              ) : (
                <VideoOff className="w-6 h-6" />
              )}
            </Button>
          )}

          <Button
            variant={isMicOn ? "secondary" : "destructive"}
            size="lg"
            onClick={handleToggleMic}
            className="rounded-full w-14 h-14"
          >
            {isMicOn ? (
              <Mic className="w-6 h-6" />
            ) : (
              <MicOff className="w-6 h-6" />
            )}
          </Button>

          <Button
            variant="destructive"
            size="lg"
            onClick={handleEndCall}
            className="rounded-full w-14 h-14"
          >
            <PhoneOff className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
