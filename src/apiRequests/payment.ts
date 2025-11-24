export interface CreatePaymentRequest {
  bookingId: number;
  bookingType: "WORKEXPERIENCE";
  paymentType: "BOOKING";
  amount: number;
  orderInfo: string;
}

export interface CreatePaymentResponse {
  message: string;
  data: {
    paymentUrl: string;
  };
}

export interface PaymentData {
  id: number;
  txnRef: string;
  paymentType: "BOOKING" | "COURSE";
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
  orderInfo: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  singleSessionBooking?: {
    id: number;
    menteeProfile: {
      id: number;
      name?: string;
      avatar?: string;
      phoneNumber?: string;
      user: {
        id: number;
        email: string;
      };
    };
    mentorProfile: {
      id: number;
      name?: string;
      user: {
        id: number;
        email: string;
      };
    };
  };
  workExperienceBooking?: {
    id: number;
    menteeProfile: {
      id: number;
      name?: string;
      avatar?: string;
      phoneNumber?: string;
      user: {
        id: number;
        email: string;
      };
    };
    workExperiencePackage: {
      id: number;
      title: string;
      mentorProfile: {
        id: number;
        name?: string;
        user: {
          id: number;
          email: string;
        };
      };
    };
  };
  course?: {
    id: number;
    title: string;
    price: number;
  };
  menteeProfile?: {
    id: number;
    name?: string;
    avatar?: string;
    phoneNumber?: string;
    user: {
      id: number;
      email: string;
    };
  };
}

export interface GetAllPaymentsResponse {
  message: string;
  data: {
    payments: PaymentData[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface GetPaymentByIdResponse {
  message: string;
  data: PaymentData;
}

import http from "@/lib/http";

const paymentApiRequest = {
  createPayment: (body: CreatePaymentRequest) =>
    http.post<CreatePaymentResponse>("/payment/create", body),

  // Admin APIs
  getAllPayments: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    paymentType?: string;
    fromDate?: string;
    toDate?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value.toString());
      });
    }
    return http.get<GetAllPaymentsResponse>(
      `/payment/admin/all?${searchParams.toString()}`
    );
  },

  getPaymentById: (id: number) =>
    http.get<GetPaymentByIdResponse>(`/payment/admin/${id}`),
};

export default paymentApiRequest;
