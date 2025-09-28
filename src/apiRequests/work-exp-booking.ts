import http from "@/lib/http";
import {
  WorkBookingCreate,
  WorkBookingsRes,
} from "@/schemaValidations/work-exp-booking";

const workExpBookingApiRequest = {
  getWorkExpBookingsByMentee: () =>
    http.get<WorkBookingsRes>("/work-experience-booking/mentee/bookings"),
  createWorkExpBooking: (data: WorkBookingCreate) =>
    http.post("/work-experience-booking/bookings", data),
};

export default workExpBookingApiRequest;
