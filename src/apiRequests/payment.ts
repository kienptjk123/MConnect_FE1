export interface CreatePaymentRequest {
  bookingId: number;
  bookingType: "WORK_EXPERIENCE";
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

import http from "@/lib/http";

const paymentApiRequest = {
  createPayment: (body: CreatePaymentRequest) =>
    http.post<CreatePaymentResponse>("/payment/create", body),
};

export default paymentApiRequest;
