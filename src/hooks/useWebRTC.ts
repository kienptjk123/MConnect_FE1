import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "@/components/SocketProvider";

interface UseWebRTCProps {
  callId: number | null;
  isInitiator: boolean;
  callType: "VOICE" | "VIDEO";
  onCallEnd?: () => void;
}

export const useWebRTC = ({
  callId,
  isInitiator,
  callType,
  onCallEnd,
}: UseWebRTCProps) => {
  const { sendWebRTCSignal, onWebRTCSignaling } = useSocket();

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const isCallInitializedRef = useRef<boolean>(false);
  const pendingCandidates = useRef<any[]>([]);

  const configuration: RTCConfiguration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      {
        urls: "turn:turn.mconnect.io.vn:3478?transport=udp",
        username: "turnuser",
        credential: "turnpass",
      },
      {
        urls: "turn:turn.developgenderhealth.io.vn:3478?transport=tcp",
        username: "turnuser",
        credential: "turnpass",
      },
    ],
  };

  // Init media
  const initializeMedia = useCallback(async () => {
    try {
      const constraints: MediaStreamConstraints = {
        audio: true,
        video:
          callType === "VIDEO"
            ? {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                frameRate: { ideal: 30 },
              }
            : false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);

      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      return stream;
    } catch (err: any) {
      setError(`Không thể truy cập camera/microphone: ${err.message}`);
      return null;
    }
  }, [callType]);

  // Init peer connection
  const initializePeerConnection = useCallback(async () => {
    if (!callId || peerConnectionRef.current) return peerConnectionRef.current;

    const pc = new RTCPeerConnection(configuration);
    peerConnectionRef.current = pc;

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current)
        remoteVideoRef.current.srcObject = event.streams[0];
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && callId) {
        console.log("📡 New ICE candidate:", event.candidate.candidate);
        sendWebRTCSignal(callId, "ice-candidate", event.candidate);
      }
    };

    pc.onconnectionstatechange = () => {
      setIsConnected(pc.connectionState === "connected");
      if (pc.connectionState === "connected") setIsConnecting(false);

      if (["failed", "disconnected", "closed"].includes(pc.connectionState)) {
        setError("Cuộc gọi đã kết thúc");
        onCallEnd?.();
      }
    };

    return pc;
  }, [callId, sendWebRTCSignal, onCallEnd]);

  const createOffer = useCallback(async () => {
    const pc = peerConnectionRef.current;
    if (!pc || !callId || isCallInitializedRef.current) return;

    try {
      isCallInitializedRef.current = true;
      setIsConnecting(true);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      sendWebRTCSignal(callId, "offer", offer);
    } catch (err: any) {
      setError(`Không thể tạo offer: ${err.message}`);
      isCallInitializedRef.current = false;
    }
  }, [callId, sendWebRTCSignal]);

  const createAnswer = useCallback(
    async (offer: RTCSessionDescriptionInit) => {
      const pc = peerConnectionRef.current;
      if (!pc || !callId) return;

      try {
        if (!pc.remoteDescription) {
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          sendWebRTCSignal(callId, "answer", answer);
        }

        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        sendWebRTCSignal(callId, "answer", answer);

        // Flush queued ICE
        for (const c of pendingCandidates.current) {
          await pc.addIceCandidate(new RTCIceCandidate(c));
        }
        pendingCandidates.current = [];
      } catch (err: any) {
        setError(`Không thể tạo answer: ${err.message}`);
      }
    },
    [callId, sendWebRTCSignal]
  );

  // Handle signaling
  useEffect(() => {
    if (!callId) return;

    const unsubscribe = onWebRTCSignaling(async (data) => {
      if (data.callId !== callId) return;
      const pc = peerConnectionRef.current;

      try {
        switch (data.type) {
          case "offer":
            if (pc && pc.signalingState === "stable") {
              await createAnswer(data.data);
            } else {
              console.log(
                "⚠️ [WebRTC] Offer ignored, state:",
                pc?.signalingState
              );
            }
            break;

          case "answer":
            if (pc && pc.signalingState === "have-local-offer") {
              await pc.setRemoteDescription(
                new RTCSessionDescription(data.data)
              );
              setIsConnecting(false);
            } else {
              console.log(
                "⚠️ [WebRTC] Ignored duplicate answer, state:",
                pc?.signalingState
              );
            }
            break;
          case "ice-candidate":
            if (pc?.remoteDescription) {
              await pc.addIceCandidate(new RTCIceCandidate(data.data));
            } else {
              console.log(
                "⏳ [WebRTC] Queue ICE until remoteDescription ready"
              );
              pendingCandidates.current.push(data.data);
            }
            break;
        }
      } catch (err: any) {
        console.error("❌ [WebRTC] Signaling error:", err);
        setError(`Lỗi WebRTC: ${err.message}`);
      }
    });

    return unsubscribe;
  }, [callId, onWebRTCSignaling, createAnswer]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      isCallInitializedRef.current = false;
    };
  }, [callId]);

  // Start call
  const startCall = useCallback(async () => {
    if (isCallInitializedRef.current) {
      return true;
    }

    console.log("🚀 [WebRTC] Starting call...");
    const stream = await initializeMedia();
    if (!stream) return false;

    const pc = await initializePeerConnection();
    if (!pc) return false;

    // ✅ Add tracks once
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    if (isInitiator) {
      await createOffer();
    }

    return true;
  }, [initializeMedia, initializePeerConnection, isInitiator, createOffer]);

  // End call
  const endCall = useCallback(() => {
    console.log("🛑 [WebRTC] Ending call...");
    localStream?.getTracks().forEach((track) => track.stop());
    setLocalStream(null);
    setRemoteStream(null);

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    isCallInitializedRef.current = false;
    setIsConnecting(false);
    setIsConnected(false);
    setError(null);
  }, [localStream]);

  const toggleCamera = useCallback(() => {
    if (localStream && callType === "VIDEO") {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) videoTrack.enabled = !videoTrack.enabled;
    }
  }, [localStream, callType]);

  const toggleMicrophone = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) audioTrack.enabled = !audioTrack.enabled;
    }
  }, [localStream]);

  return {
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
  };
};
