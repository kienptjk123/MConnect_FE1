import http from "@/lib/http";
import {
  CallHistoryResType,
  CallResType,
  CallStatsResType,
  InitiateCallType,
  CallResponseType,
} from "@/schemaValidations/call.schema";

const callApiRequest = {
  // Initiate a call
  initiateCall: (body: InitiateCallType) =>
    http.post<CallResType>("/calls", body),

  // Get call history
  getCallHistory: (params?: {
    page?: number;
    limit?: number;
    callType?: string;
    status?: string;
    partnerId?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.callType) searchParams.set("callType", params.callType);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.partnerId)
      searchParams.set("partnerId", params.partnerId.toString());

    const query = searchParams.toString();
    return http.get<CallHistoryResType>(`/calls${query ? `?${query}` : ""}`);
  },

  // Get call stats
  getCallStats: () => http.get<CallStatsResType>("/calls/stats"),

  // Get call details
  getCall: (callId: number) => http.get<CallResType>(`/calls/${callId}`),

  // Accept call
  acceptCall: (callId: number) =>
    http.put<CallResType>(`/calls/${callId}/accept`, {}),

  // Decline call
  declineCall: (callId: number, body?: { reason?: string }) =>
    http.put<CallResType>(`/calls/${callId}/decline`, body || {}),

  // End call
  endCall: (callId: number, body?: { reason: string }) =>
    http.put<CallResType>(`/calls/${callId}/end`, body || {}),
};

export default callApiRequest;
