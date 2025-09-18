import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import chatApiRequest from "@/apiRequests/chat";
import { toast } from "@/components/ui/use-toast";
import {
  CreateConversationBody,
  SendMessageBody,
  EditMessageBody,
  GetConversationsQuery,
  GetMessagesQuery,
  AddMembersBody,
} from "@/schemaValidations/chat.schema";
import { useProfile } from "@/stores/profileStore";

// Query keys
export const chatKeys = {
  all: ["chat"] as const,
  conversations: () => [...chatKeys.all, "conversations"] as const,
  conversation: (id: number) => [...chatKeys.all, "conversation", id] as const,
  messages: (conversationId: number) =>
    [...chatKeys.all, "messages", conversationId] as const,
};

// Hook để lấy danh sách cuộc hội thoại
export function useGetConversations(params?: GetConversationsQuery) {
  return useQuery({
    queryKey: [...chatKeys.conversations(), params],
    queryFn: () => chatApiRequest.getConversations(params),
  });
}

// Hook để lấy chi tiết cuộc hội thoại
export function useGetConversation(conversationId: number) {
  return useQuery({
    queryKey: chatKeys.conversation(conversationId),
    queryFn: () => chatApiRequest.getConversation(conversationId),
    enabled: !!conversationId,
  });
}

// Hook để lấy tin nhắn trong cuộc hội thoại
export function useGetMessages(
  conversationId: number,
  params?: GetMessagesQuery
) {
  return useQuery({
    queryKey: [...chatKeys.messages(conversationId), params],
    queryFn: () => chatApiRequest.getMessages(conversationId, params),
    enabled: !!conversationId,
  });
}

// Hook để lấy tin nhắn với infinite scroll
export function useGetInfiniteMessages(
  conversationId: number,
  limit: number = 20
) {
  return useInfiniteQuery({
    queryKey: [...chatKeys.messages(conversationId), "infinite", limit],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      try {
        const response = await chatApiRequest.getMessages(conversationId, {
          page: pageParam,
          limit: limit,
        });
        console.log("📡 [useGetInfiniteMessages] API Response:", response);
        return response;
      } catch (error) {
        console.error("❌ [useGetInfiniteMessages] API Error:", error);
        throw error;
      }
    },
    getNextPageParam: (lastPage: any) => {
      console.log("🔍 [useGetInfiniteMessages] Checking lastPage:", lastPage);

      try {
        // Handle different response structures safely
        const result = lastPage?.payload?.result || lastPage?.result;
        console.log("📦 [useGetInfiniteMessages] Result structure:", result);

        if (!result) {
          console.warn(
            "⚠️ [useGetInfiniteMessages] No result found in response"
          );
          return undefined;
        }

        const pagination = result.pagination;
        console.log("📄 [useGetInfiniteMessages] Pagination info:", pagination);

        if (!pagination) {
          console.warn(
            "⚠️ [useGetInfiniteMessages] No pagination found in result"
          );
          return undefined;
        }

        // Ensure pagination properties exist and are numbers
        const currentPage =
          typeof pagination.page === "number" ? pagination.page : 1;
        const totalPages =
          typeof pagination.totalPages === "number" ? pagination.totalPages : 1;

        const hasNextPage = currentPage < totalPages;
        const nextPage = hasNextPage ? currentPage + 1 : undefined;

        console.log("➡️ [useGetInfiniteMessages] Next page:", {
          currentPage,
          totalPages,
          hasNextPage,
          nextPage,
        });

        return nextPage;
      } catch (error) {
        console.error(
          "❌ [useGetInfiniteMessages] Error in getNextPageParam:",
          error
        );
        return undefined;
      }
    },
    initialPageParam: 1,
    enabled: !!conversationId,
    retry: (failureCount, error) => {
      console.log(
        "🔄 [useGetInfiniteMessages] Retry attempt:",
        failureCount,
        error
      );
      // Retry up to 2 times for network errors
      if (
        failureCount < 2 &&
        error instanceof Error &&
        error.message.includes("fetch")
      ) {
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook để tạo cuộc hội thoại mới
export function useCreateConversation() {
  const queryClient = useQueryClient();
  const profile = useProfile();

  return useMutation({
    mutationFn: chatApiRequest.createConversation,
    onSuccess: (data) => {
      // Invalidate conversations list
      queryClient.invalidateQueries({
        queryKey: chatKeys.conversations(),
      });
      toast({
        title: "Thành công",
        description: "Tạo cuộc hội thoại thành công",
        variant: "default",
      });
      return data;
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description:
          error?.payload?.message || "Có lỗi xảy ra khi tạo cuộc hội thoại",
        variant: "destructive",
      });
    },
  });
}

// Hook để tạo cuộc hội thoại DIRECT với một người (helper function)
export function useCreateDirectConversation() {
  const queryClient = useQueryClient();
  const profile = useProfile();

  return useMutation({
    mutationFn: async ({
      participantId,
      title,
    }: {
      participantId: number;
      title?: string;
    }) => {
      const body: CreateConversationBody = {
        type: "DIRECT",
        title: title || "Direct Message",
        participantIds: [participantId],
      };
      return chatApiRequest.createConversation(body);
    },
    onSuccess: (data) => {
      // Invalidate conversations list
      queryClient.invalidateQueries({
        queryKey: chatKeys.conversations(),
      });
      toast({
        title: "Thành công",
        description: "Tạo cuộc hội thoại thành công",
        variant: "default",
      });
      return data;
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description:
          error?.payload?.message || "Có lỗi xảy ra khi tạo cuộc hội thoại",
        variant: "destructive",
      });
    },
  });
}

// Hook để gửi tin nhắn
export function useSendMessage(
  conversationId: number,
  onMessageSent?: () => void
) {
  const queryClient = useQueryClient();
  const profile = useProfile();

  return useMutation({
    mutationFn: (body: SendMessageBody) =>
      chatApiRequest.sendMessage(conversationId, body),
    onSuccess: (data) => {
      // Invalidate messages list
      queryClient.invalidateQueries({
        queryKey: chatKeys.messages(conversationId),
      });
      // Invalidate conversations list để cập nhật lastMessage
      queryClient.invalidateQueries({
        queryKey: chatKeys.conversations(),
      });
      // Invalidate conversation detail
      queryClient.invalidateQueries({
        queryKey: chatKeys.conversation(conversationId),
      });

      // Trigger scroll to bottom after sending message
      onMessageSent?.();
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description:
          error?.payload?.message || "Có lỗi xảy ra khi gửi tin nhắn",
        variant: "destructive",
      });
    },
  });
}

// Hook để chỉnh sửa tin nhắn
export function useEditMessage(conversationId: number, messageId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: EditMessageBody) =>
      chatApiRequest.editMessage(conversationId, messageId, body),
    onSuccess: () => {
      // Invalidate messages list
      queryClient.invalidateQueries({
        queryKey: chatKeys.messages(conversationId),
      });
      toast({
        title: "Thành công",
        description: "Chỉnh sửa tin nhắn thành công",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description:
          error?.payload?.message || "Có lỗi xảy ra khi chỉnh sửa tin nhắn",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteMessage(conversationId: number, messageId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => chatApiRequest.deleteMessage(conversationId, messageId),
    onSuccess: () => {
      // Invalidate messages list
      queryClient.invalidateQueries({
        queryKey: chatKeys.messages(conversationId),
      });
      toast({
        title: "Thành công",
        description: "Xóa tin nhắn thành công",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description:
          error?.payload?.message || "Có lỗi xảy ra khi xóa tin nhắn",
        variant: "destructive",
      });
    },
  });
}

export function useMarkAsRead(conversationId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: number) =>
      chatApiRequest.markAsRead(conversationId, messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.messages(conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: chatKeys.conversations(),
      });
    },
    onError: () => {},
  });
}

// Hook để archive cuộc hội thoại
export function useArchiveConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chatApiRequest.archiveConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.conversations(),
      });
      toast({
        title: "Thành công",
        description: "Đã lưu trữ cuộc hội thoại",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description:
          error?.payload?.message || "Có lỗi xảy ra khi lưu trữ cuộc hội thoại",
        variant: "destructive",
      });
    },
  });
}

// Hook để unarchive cuộc hội thoại
export function useUnarchiveConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chatApiRequest.unarchiveConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.conversations(),
      });
      toast({
        title: "Thành công",
        description: "Đã khôi phục cuộc hội thoại",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description:
          error?.payload?.message ||
          "Có lỗi xảy ra khi khôi phục cuộc hội thoại",
        variant: "destructive",
      });
    },
  });
}

// Hook để rời khỏi cuộc hội thoại
export function useLeaveConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chatApiRequest.leaveConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.conversations(),
      });
      toast({
        title: "Thành công",
        description: "Đã rời khỏi cuộc hội thoại",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description:
          error?.payload?.message || "Có lỗi xảy ra khi rời cuộc hội thoại",
        variant: "destructive",
      });
    },
  });
}

// Hook để thêm thành viên vào cuộc hội thoại
export function useAddMembers(conversationId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userIds: number[]) =>
      chatApiRequest.addMembers(conversationId, userIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.conversation(conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: chatKeys.conversations(),
      });
      toast({
        title: "Thành công",
        description: "Đã thêm thành viên vào cuộc hội thoại",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description:
          error?.payload?.message || "Có lỗi xảy ra khi thêm thành viên",
        variant: "destructive",
      });
    },
  });
}

// Hook để xóa thành viên khỏi cuộc hội thoại
export function useRemoveMember(conversationId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) =>
      chatApiRequest.removeMember(conversationId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.conversation(conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: chatKeys.conversations(),
      });
      toast({
        title: "Thành công",
        description: "Đã xóa thành viên khỏi cuộc hội thoại",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description:
          error?.payload?.message || "Có lỗi xảy ra khi xóa thành viên",
        variant: "destructive",
      });
    },
  });
}
