import { bookingApiRequest } from "@/apiRequests/booking";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSingleSessionTopics = (
  mentorProfileId: number,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["singleSessionTopics", mentorProfileId],
    queryFn: () => bookingApiRequest.getSingleSessionTopics(mentorProfileId),
    enabled: !!mentorProfileId && options?.enabled !== false,
  });
};

export const useMentorWorkSchedules = (
  mentorProfileId: number,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["mentorWorkSchedules", mentorProfileId],
    queryFn: () => bookingApiRequest.getMentorWorkSchedules(mentorProfileId),
    enabled: !!mentorProfileId && options?.enabled !== false,
  });
};

export const useCreateBooking = () => {
  return useMutation({
    mutationFn: bookingApiRequest.createBooking,
    onSuccess: (data) => {
      toast.success("Booking created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create booking");
    },
  });
};

// Create payment mutation
export const useCreatePayment = () => {
  return useMutation({
    mutationFn: bookingApiRequest.createPayment,
    onSuccess: (data) => {
      // Redirect to payment URL
      if (data.payload.data.paymentUrl) {
        window.location.href = data.payload.data.paymentUrl;
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create payment");
    },
  });
};

export const useCreateBookingWithPayment = () => {
  return useMutation({
    mutationFn: bookingApiRequest.createBookingWithPayment,
    onSuccess: (data) => {
      toast.success("Booking created! Redirecting to payment...");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create booking and payment");
    },
  });
};
