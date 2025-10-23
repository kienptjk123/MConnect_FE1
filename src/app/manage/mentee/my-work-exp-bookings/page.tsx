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
  X,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSocket } from "@/components/SocketProvider";
import { toast } from "@/components/ui/use-toast";

export default function MyWorkExpBookingsPage() {
  const {
    data: bookingsResponse,
    isLoading,
    error,
  } = useWorkExpBookingsByMentee();
  const router = useRouter();
  const { onPaymentSuccess, onPaymentFailed } = useSocket();
  const [loadingPaymentId, setLoadingPaymentId] = useState<number | null>(null);
  const [paymentData, setPaymentData] = useState<{
    qrUrl: string;
    amount: number;
    orderInfo: string;
    bookingId: number;
  } | null>(null);
  const [countdown, setCountdown] = useState(900);

  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Countdown timer
  useEffect(() => {
    if (!paymentData) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPaymentData(null);
          toast({
            title: "Payment Timeout",
            description: "Payment session expired. Please try again.",
            variant: "destructive",
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentData]);

  // Listen for payment events from Socket.IO
  useEffect(() => {
    if (!paymentData) return;

    const handlePaymentSuccess = (data: any) => {
      console.log("💰 Payment Success:", data);
      setPaymentData(null);
      toast({
        title: "Thanh toán thành công! 🎉",
        description: "Bạn đã thanh toán booking thành công.",
      });
      router.push("/payment/vnpay/success");
    };

    const handlePaymentFailed = (data: any) => {
      console.log("❌ Payment Failed:", data);
      setPaymentData(null);
      toast({
        title: "Thanh toán thất bại",
        description: data?.message || "Vui lòng thử lại sau.",
        variant: "destructive",
      });
      router.push("/payment/vnpay/fail");
    };

    // Subscribe to socket events
    const unsubscribeSuccess = onPaymentSuccess(handlePaymentSuccess);
    const unsubscribeFailed = onPaymentFailed(handlePaymentFailed);

    return () => {
      unsubscribeSuccess();
      unsubscribeFailed();
    };
  }, [paymentData, router, onPaymentSuccess, onPaymentFailed]);

  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const formatPrice = (price: string | number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(typeof price === "string" ? parseFloat(price) : price);

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

      if (res.payload?.data?.paymentUrl) {
        setPaymentData({
          qrUrl: res.payload.data.paymentUrl,
          amount: parseFloat(booking.price),
          orderInfo: `Payment for Work Experience Booking #${booking.id}`,
          bookingId: booking.id,
        });
        setCountdown(900); // Reset countdown to 15 minutes
      } else {
        toast({
          title: "Error",
          description: "Failed to get payment URL",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Payment error", err);
      toast({
        title: "Error",
        description: err?.message || "Failed to initiate payment",
        variant: "destructive",
      });
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
    <div className="min-w-7xl p-4 mx-auto py-8">
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

      {/* Payment QR Modal */}
      {paymentData && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setPaymentData(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <div className="grid md:grid-cols-2 gap-0">
              {/* Left Side - QR Code */}
              <div className="bg-white p-8 flex flex-col items-center justify-center border-r">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-blue-600 mb-2">
                    Mconnect
                  </h2>
                  <p className="text-gray-600 font-medium">
                    Quét mã QR để thanh toán
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Sử dụng tính năng quét mã QR trên ứng dụng ngân hàng/ví điện
                    tử để quét mã
                  </p>
                </div>

                {/* QR Code */}
                <div className="relative bg-white p-4 rounded-xl shadow-lg mb-6">
                  <Image
                    src={paymentData.qrUrl}
                    alt="Payment QR Code"
                    width={300}
                    height={300}
                    className="object-contain"
                  />
                </div>

                <p className="text-center text-sm text-gray-600 max-w-sm">
                  <span className="font-medium">LE DUC LOC</span>
                  <br />
                  <span className="text-xs">Số tài khoản: VQRQAEWVR9666</span>
                  <br />
                  <span className="text-xs">
                    Số tiền: {formatPrice(paymentData.amount)}
                  </span>
                </p>

                {/* Warning */}
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md">
                  <p className="text-sm text-yellow-800">
                    <span className="font-semibold">Lưu ý:</span> Mã số thời hạn{" "}
                    <span className="font-bold">
                      {formatCountdown(countdown)}
                    </span>{" "}
                    phút. Vui lòng không tải trễ để tránh đơn khi nhận được tiền
                    giao dịch!
                  </p>
                </div>
              </div>

              {/* Right Side - Payment Info */}
              <div className="bg-gray-50 p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  THÔNG TIN THANH TOÁN
                </h3>

                <div className="space-y-4 mb-8">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Tên đơn vị thu hưởng:
                    </p>
                    <p className="font-semibold text-gray-900">LE DUC LOC</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Số tài khoản:</p>
                    <p className="font-semibold text-gray-900">MB Bank</p>
                    <p className="font-mono text-lg font-bold text-blue-600">
                      VQRQAEWVR9666
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Nội dung thanh toán:
                    </p>
                    <p className="font-semibold text-gray-900">
                      {paymentData.orderInfo}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Số tiền:</p>
                    <p className="text-3xl font-bold text-red-500">
                      {formatPrice(paymentData.amount)}
                    </p>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Hướng dẫn thanh toán
                  </h4>
                  <ol className="space-y-2 text-sm text-gray-600">
                    <li className="flex gap-2">
                      <span className="font-semibold text-blue-600">1.</span>
                      <span>
                        Mở ứng dụng ngân hàng hoặc ví điện tử trên điện thoại
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-blue-600">2.</span>
                      <span>Chọn chức năng quét mã QR</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-blue-600">3.</span>
                      <span>Quét mã QR và xác nhận thanh toán</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-blue-600">4.</span>
                      <span>Chờ xác nhận từ hệ thống (tự động)</span>
                    </li>
                  </ol>
                </div>

                {/* Timer */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">Thời gian còn lại:</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCountdown(countdown)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
