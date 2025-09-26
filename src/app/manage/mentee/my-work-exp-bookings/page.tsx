"use client";

import paymentApiRequest from "@/apiRequests/payment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkExpBookingsByMentee } from "@/queries/useWorkExpBooking";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Hourglass,
  Package,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function MyWorkExpBookingsPage() {
  const {
    data: bookingsResponse,
    isLoading,
    error,
  } = useWorkExpBookingsByMentee();
  const [loadingPaymentId, setLoadingPaymentId] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 5;

  const formatPrice = (price: string) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(parseFloat(price));

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "CONFIRMED":
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case "PAID":
        return <CreditCard className="h-4 w-4 text-green-600" />;
      case "IN_PROGRESS":
        return <Hourglass className="h-4 w-4 text-blue-600" />;
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "ON_HOLD":
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "PAID":
        return "bg-green-100 text-green-800";
      case "IN_PROGRESS":
        return "bg-indigo-100 text-indigo-800";
      case "COMPLETED":
        return "bg-green-200 text-green-900";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "ON_HOLD":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handlePayment = async (booking: any) => {
    try {
      setLoadingPaymentId(booking.id);
      const res = await paymentApiRequest.createPayment({
        bookingId: booking.id,
        bookingType: "WORK_EXPERIENCE",
        paymentType: "BOOKING",
        amount: parseFloat(booking.price),
        orderInfo: `Payment for Work Experience Booking #${booking.id}`,
      });

      window.location.href = res.payload.data.paymentUrl;
    } catch (err) {
      console.error("Payment error", err);
    } finally {
      setLoadingPaymentId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-red-800">
            Failed to load your bookings. Please try again later.
          </span>
        </div>
      </div>
    );
  }

  const bookings = bookingsResponse?.payload?.data || [];
  const totalPages = Math.ceil(bookings.length / pageSize);
  const pagedBookings = bookings.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="min-w-7xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          My Work Experience Bookings
        </h1>
        <p className="text-gray-600 mt-2">
          Track your work experience package bookings and payments
        </p>
      </div>

      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/manage/mentee/explore-work-exp-pkg">
            Back to Explore Packages
          </Link>
        </Button>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Bookings Yet
            </h3>
            <p className="text-gray-600 mb-4">
              You haven't booked any work experience packages yet.
            </p>
            <Link href="/manage/mentee/explore-work-exp-pkg">
              <Button>Explore Packages</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {pagedBookings.map((booking) => (
            <Card
              key={booking.id}
              className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-xl"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg font-semibold">
                        {booking.workExperiencePackage?.title ||
                          "Package Title"}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <User className="h-4 w-4" />
                      <span>
                        Mentor:{" "}
                        {booking.workExperiencePackage?.mentorProfile?.name ||
                          "Unknown Mentor"}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Start: {formatDate(booking.startDate)}</span>
                      </div>
                      {booking.expectedEndDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            End: {formatDate(booking.expectedEndDate)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getStatusBadgeColor(booking.status)}>
                      {getStatusIcon(booking.status)}
                      <span className="ml-1">
                        {booking.status.split("_").join(" ")}
                      </span>
                    </Badge>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        {formatPrice(booking.price)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Booking #{booking.id}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {booking.workExperiencePackage?.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {booking.workExperiencePackage.duration} hours
                        </span>
                      </div>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {booking.workExperiencePackage?.packageType ===
                      "COURSE_PLUS_SANDBOX"
                        ? "Course + Sandbox"
                        : "Sandbox Only"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {booking.paymentStatus !== "PAID" ? (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handlePayment(booking)}
                        disabled={loadingPaymentId === booking.id}
                      >
                        {loadingPaymentId === booking.id ? (
                          "Processing..."
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4 mr-1" />
                            Pay Now
                          </>
                        )}
                      </Button>
                    ) : (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Paid
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 ">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
