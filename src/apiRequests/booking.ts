import http from "@/lib/http";
import {
  SingleSessionTopicResType,
  MentorWorkScheduleResType,
  CreateBookingBodyType,
  CreateBookingResType,
  PaymentResType,
} from "@/schemaValidations/booking.schema";

export const bookingApiRequest = {
  // Get single session topics by mentor profile id
  getSingleSessionTopics: (mentorProfileId: number) =>
    http.get<SingleSessionTopicResType>(
      `/single-session-topics/mentee/${mentorProfileId}`
    ),

  getMentorWorkSchedules: (mentorProfileId: number) =>
    http.get<MentorWorkScheduleResType>(
      `/mentor-work-schedules/${mentorProfileId}/available`
    ),

  createBooking: (body: CreateBookingBodyType) =>
    http.post<CreateBookingResType>("/single-session-booking", body),

  createPayment: (bookingId: number) =>
    http.post<PaymentResType>(
      `/single-session-booking/${bookingId}/payment`,
      {}
    ),

  createBookingWithPayment: async (body: CreateBookingBodyType) => {
    const bookingResponse = await bookingApiRequest.createBooking(body);
    const bookingId = bookingResponse.payload.data.id;

    const paymentResponse = await bookingApiRequest.createPayment(bookingId);

    return {
      booking: bookingResponse.payload.data,
      payment: paymentResponse.payload.data,
    };
  },
};
