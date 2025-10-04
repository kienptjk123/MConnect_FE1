import workExpBookingApiRequest from "@/apiRequests/work-exp-booking";
import { WorkBookingCreate } from "@/schemaValidations/work-exp-booking";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useWorkExpBookingsByMentee = () => {
  return useQuery({
    queryKey: ["workExpBookings", "mentee"],
    queryFn: () => workExpBookingApiRequest.getWorkExpBookingsByMentee(),
  });
};

export const useCreateWorkExpBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WorkBookingCreate) =>
      workExpBookingApiRequest.createWorkExpBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workExpBookings"] });
    },
  });
};
