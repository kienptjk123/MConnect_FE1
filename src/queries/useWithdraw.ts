import withdrawApiRequest from "@/apiRequests/withdraw";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useMentorEarningsQuery = () => {
  return useQuery({
    queryKey: ["mentorEarnings"],
    queryFn: () => withdrawApiRequest.getMentorEarnings(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  });
};

export const useMentorWithdrawRequestsQuery = (params?: {
  page?: number;
  limit?: number;
  status?: "PENDING" | "APPROVED" | "REJECTED";
}) => {
  return useQuery({
    queryKey: ["mentorWithdrawRequests", params],
    queryFn: () => withdrawApiRequest.getMentorWithdrawRequests(params),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useWithdrawRequestByIdQuery = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["withdrawRequest", id],
    queryFn: () => withdrawApiRequest.getWithdrawRequestById(id),
    enabled,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useAllWithdrawRequestsQuery = (params?: {
  page?: number;
  limit?: number;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  mentor_id?: number;
  sort_by?: "created_at" | "updated_at" | "amount";
  sort_order?: "asc" | "desc";
}) => {
  return useQuery({
    queryKey: ["allWithdrawRequests", params],
    queryFn: () => withdrawApiRequest.getAllWithdrawRequests(params),
    staleTime: 1 * 60 * 1000,
    gcTime: 3 * 60 * 1000,
  });
};

export const useCreateWithdrawRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: withdrawApiRequest.createWithdrawRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentorEarnings"] });
      queryClient.invalidateQueries({ queryKey: ["mentorWithdrawRequests"] });
      queryClient.invalidateQueries({ queryKey: ["allWithdrawRequests"] });
    },
  });
};

export const useReviewWithdrawRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
      transactionImage,
    }: {
      id: number;
      body: { status: "APPROVED" | "REJECTED"; admin_note?: string };
      transactionImage?: File;
    }) => withdrawApiRequest.reviewWithdrawRequest(id, body, transactionImage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allWithdrawRequests"] });
      queryClient.invalidateQueries({ queryKey: ["mentorWithdrawRequests"] });
      queryClient.invalidateQueries({ queryKey: ["withdrawRequest"] });
    },
  });
};

