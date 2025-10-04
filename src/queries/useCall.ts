import callApiRequest from "@/apiRequests/call";
import {
  InitiateCallType,
  CallResponseType,
} from "@/schemaValidations/call.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCallHistoryQuery = (params?: {
  page?: number;
  limit?: number;
  callType?: string;
  status?: string;
  partnerId?: number;
}) => {
  return useQuery({
    queryKey: ["calls", "history", params],
    queryFn: () => callApiRequest.getCallHistory(params),
  });
};

export const useCallStatsQuery = () => {
  return useQuery({
    queryKey: ["calls", "stats"],
    queryFn: callApiRequest.getCallStats,
  });
};

export const useCallByIdQuery = (callId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["calls", callId],
    queryFn: () => callApiRequest.getCall(callId),
    enabled: enabled && callId > 0,
    staleTime: 0,
    refetchOnMount: "always",
  });
};

export const useInitiateCallMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: callApiRequest.initiateCall,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["calls"] });
      toast.success("Đang gọi...");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Không thể khởi tạo cuộc gọi"
      );
    },
  });
};

export const useAcceptCallMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (callId: number) => {
      return callApiRequest.acceptCall(callId);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["calls"] });
      toast.success("Đã chấp nhận cuộc gọi");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Không thể chấp nhận cuộc gọi"
      );
    },
  });
};

export const useDeclineCallMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ callId, reason }: { callId: number; reason?: string }) =>
      callApiRequest.declineCall(callId, reason ? { reason } : undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calls"] });
      toast.success("Đã từ chối cuộc gọi");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Không thể từ chối cuộc gọi"
      );
    },
  });
};

export const useEndCallMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ callId, reason }: { callId: number; reason?: string }) =>
      callApiRequest.endCall(callId, reason ? { reason } : undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calls"] });
      toast.success("Đã kết thúc cuộc gọi");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Không thể kết thúc cuộc gọi"
      );
    },
  });
};
