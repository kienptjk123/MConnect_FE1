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
}

export interface WithdrawRequestResponse {
  id: number;
  mentor_profile_id: number;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
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
  }) =>
    http.get<GetWithdrawRequestsResponse>("/withdraw-requests/my-requests", {
      params,
    }),

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
  }) =>
    http.get<GetWithdrawRequestsResponse>("/withdraw-requests/admin/all", {
      params,
    }),

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
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
};

export default withdrawApiRequest;

