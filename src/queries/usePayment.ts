import paymentApiRequest from "@/apiRequests/payment";
import { useQuery } from "@tanstack/react-query";
import { PaymentFilters } from "@/types/payment";

export const usePaymentsQuery = (filters?: PaymentFilters) => {
  return useQuery({
    queryKey: ["payments", filters],
    queryFn: () => paymentApiRequest.getAllPayments(filters),
  });
};

export const usePaymentByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["payment", id],
    queryFn: () => paymentApiRequest.getPaymentById(id),
    enabled: !!id,
  });
};
