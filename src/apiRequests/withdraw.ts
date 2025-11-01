import http from "@/lib/http";

export interface MentorEarningsResponse {
  message: string;
  result: {
    total_earned: number;
    total_withdrawn: number;
    available_balance: number;
    breakdown: {
      courses: {
        total_earned: number;
        transaction_count: number;
      };
      single_sessions: {
        total_earned: number;
        transaction_count: number;
      };
      work_experience_packages: {
        total_earned: number;
        transaction_count: number;
      };
    };
  };
}

export interface CreateWithdrawRequest {
  amount: number;
  account_number: string;
  bank_name: string;
  account_owner_name: string;
}

export interface WithdrawRequestResponse {
  id: number;
  mentor_profile_id: number;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  account_number: string;
  bank_name: string;
  account_owner_name: string;
  transaction_image?: string;
  admin_note?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
  mentor_profile: {
    id: number;
    name?: string;
    username?: string;
    avatar?: string;
    user: {
      id: number;
      email: string;
    };
  };
  reviewed_by?: {
    id: number;
    email: string;
    role: string;
  };
}

export interface GetWithdrawRequestsResponse {
  message: string;
  result: {
    requests: WithdrawRequestResponse[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_count: number;
      per_page: number;
    };
  };
}

export interface ReviewWithdrawRequest {
  status: "APPROVED" | "REJECTED";
  admin_note?: string;
}

const withdrawApiRequest = {
  // Get mentor earnings
  getMentorEarnings: () =>
    http.get<MentorEarningsResponse>("/withdraw-requests/earnings"),

  // Create withdrawal request
  createWithdrawRequest: (body: CreateWithdrawRequest) =>
    http.post<{ message: string; result: WithdrawRequestResponse }>(
      "/withdraw-requests",
      body
    ),

  // Get mentor's withdrawal requests
  getMentorWithdrawRequests: (params?: {
    page?: number;
    limit?: number;
    status?: "PENDING" | "APPROVED" | "REJECTED";
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.status) searchParams.set("status", params.status);

    const query = searchParams.toString();
    return http.get<GetWithdrawRequestsResponse>(
      `/withdraw-requests/my-requests${query ? `?${query}` : ""}`
    );
  },

  // Get withdrawal request by ID
  getWithdrawRequestById: (id: number) =>
    http.get<{ message: string; result: WithdrawRequestResponse }>(
      `/withdraw-requests/${id}`
    ),

  // Admin: Get all withdrawal requests
  getAllWithdrawRequests: (params?: {
    page?: number;
    limit?: number;
    status?: "PENDING" | "APPROVED" | "REJECTED";
    mentor_id?: number;
    sort_by?: "created_at" | "updated_at" | "amount";
    sort_order?: "asc" | "desc";
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.status) searchParams.set("status", params.status);
    if (params?.mentor_id)
      searchParams.set("mentor_id", params.mentor_id.toString());
    if (params?.sort_by) searchParams.set("sort_by", params.sort_by);
    if (params?.sort_order) searchParams.set("sort_order", params.sort_order);

    const query = searchParams.toString();
    return http.get<GetWithdrawRequestsResponse>(
      `/withdraw-requests/admin/all${query ? `?${query}` : ""}`
    );
  },

  // Admin: Review withdrawal request
  reviewWithdrawRequest: (
    id: number,
    body: ReviewWithdrawRequest,
    transactionImage?: File
  ) => {
    const formData = new FormData();
    formData.append("status", body.status);
    if (body.admin_note) {
      formData.append("admin_note", body.admin_note);
    }
    if (transactionImage) {
      formData.append("transaction_image", transactionImage);
    }

    return http.patch<{ message: string; result: WithdrawRequestResponse }>(
      `/withdraw-requests/${id}/review`,
      formData
      // Don't set Content-Type header - let the browser set it automatically with boundary
    );
  },
};

export default withdrawApiRequest;
