"use client";

import { useSocket } from "@/components/SocketProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useCreateBookingWithPayment,
  useMentorWorkSchedules,
  useSingleSessionTopics,
} from "@/queries/useBooking";
import {
  MentorWorkScheduleType,
  SingleSessionTopicType,
} from "@/schemaValidations/booking.schema";
import { format } from "date-fns";
import { Calendar, CalendarDays, Clock, User, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface BookingModalProps {
  mentorId: number;
  mentorName: string;
  mentorAvatar?: string | null;
  children: React.ReactNode;
}

export default function BookingModal({
  mentorId,
  mentorName,
  mentorAvatar,
  children,
}: BookingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] =
    useState<SingleSessionTopicType | null>(null);
  const [selectedSchedule, setSelectedSchedule] =
    useState<MentorWorkScheduleType | null>(null);
  const [step, setStep] = useState<"topic" | "schedule" | "confirm">("topic");
  const [paymentData, setPaymentData] = useState<{
    qrUrl: string;
    amount: number;
    orderInfo: string;
  } | null>(null);
  const [countdown, setCountdown] = useState(900);

  const router = useRouter();
  const { onPaymentSuccess, onPaymentFailed } = useSocket();

  const { data: topicsResponse, isLoading: topicsLoading } =
    useSingleSessionTopics(mentorId, { enabled: isOpen && step === "topic" });

  const { data: schedulesResponse, isLoading: schedulesLoading } =
    useMentorWorkSchedules(mentorId, {
      enabled: isOpen && step === "schedule",
    });

  const createBookingMutation = useCreateBookingWithPayment();

  const topics = (topicsResponse?.payload || []) as SingleSessionTopicType[];
  const schedules = (schedulesResponse?.payload?.data ||
    []) as MentorWorkScheduleType[];

  // Countdown timer for payment
  useEffect(() => {
    if (!paymentData) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPaymentData(null);
          toast.error("Payment timeout. Please try again.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentData]);

  // Socket.IO payment event handlers
  useEffect(() => {
    if (!paymentData) return;

    const handlePaymentSuccess = (data: any) => {
      setPaymentData(null);
      toast.success("Thanh toán thành công! 🎉");
      router.push("/payment/vnpay/success");
    };

    const handlePaymentFailed = (data: any) => {
      setPaymentData(null);
      toast.error(data?.message || "Thanh toán thất bại. Vui lòng thử lại.");
      router.push("/payment/vnpay/fail");
    };

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

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(typeof price === "string" ? parseFloat(price) : price);
  };

  const handleTopicSelect = (topic: SingleSessionTopicType) => {
    setSelectedTopic(topic);
    setStep("schedule");
  };

  const handleScheduleSelect = (schedule: MentorWorkScheduleType) => {
    setSelectedSchedule(schedule);
    setStep("confirm");
  };

  const handleConfirmBooking = async () => {
    if (!selectedTopic || !selectedSchedule) {
      toast.error("Please select both topic and schedule");
      return;
    }

    try {
      const result = await createBookingMutation.mutateAsync({
        mentorProfileId: mentorId,
        mentorWorkScheduleId: selectedSchedule.id,
        singleSessionTopicId: selectedTopic.id,
      });

      // If payment URL is returned, show payment QR modal
      if (result.payment?.paymentUrl) {
        setPaymentData({
          qrUrl: result.payment.paymentUrl,
          amount: parseFloat(selectedTopic.price),
          orderInfo: `Booking with ${mentorName}: ${selectedTopic.title}`,
        });
        setCountdown(900); // 15 minutes
        setIsOpen(false); // Close booking modal
      } else {
        // If no payment needed or direct success
        toast.success("Booking created successfully!");
        setIsOpen(false);
        setSelectedTopic(null);
        setSelectedSchedule(null);
        setStep("topic");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to create booking. Please try again.");
    }
  };

  const handleBack = () => {
    if (step === "schedule") {
      setStep("topic");
      setSelectedSchedule(null);
    } else if (step === "confirm") {
      setStep("schedule");
    }
  };

  const resetModal = () => {
    setSelectedTopic(null);
    setSelectedSchedule(null);
    setStep("topic");
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) resetModal();
        }}
      >
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Book Mentorship Session
            </DialogTitle>
            <div className="flex items-center gap-2 text-sm light:text-gray-600">
              <User className="w-4 h-4" />
              with {mentorName}
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-center space-x-4">
              <div
                className={`flex items-center space-x-2 ${
                  step === "topic" ? "text-blue-600" : "light:text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === "topic"
                      ? "bg-blue-600 text-white"
                      : "rounded-full dark:bg-gray-700 bg-gray-300 light:bg-gray-200"
                  }`}
                >
                  1
                </div>
                <span className="text-sm">Select Topic</span>
              </div>
              <div className="w-8 h-0.5 rounded-full bg-gray-700 light:bg-gray-200"></div>
              <div
                className={`flex items-center space-x-2 ${
                  step === "schedule" ? "text-blue-600" : "light:text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === "schedule"
                      ? "bg-blue-600 text-white"
                      : "rounded-full dark:bg-gray-700 bg-gray-300 light:bg-gray-200"
                  }`}
                >
                  2
                </div>
                <span className="text-sm">Select Time</span>
              </div>
              <div className="w-8 h-0.5 rounded-full bg-gray-700 light:bg-gray-200"></div>
              <div
                className={`flex items-center space-x-2 ${
                  step === "confirm" ? "text-blue-600" : "light:text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === "confirm"
                      ? "bg-blue-600 text-white"
                      : "rounded-full dark:bg-gray-700 bg-gray-300 light:bg-gray-200"
                  }`}
                >
                  3
                </div>
                <span className="text-sm">Confirm</span>
              </div>
            </div>

            {step === "topic" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Select a Session Topic
                </h3>
                {topicsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : !topicsResponse ? (
                  <div className="text-center py-8 light:text-gray-500">
                    Open modal to load topics
                  </div>
                ) : topicsResponse && topics.length === 0 ? (
                  <div className="text-center py-8 light:text-gray-500">
                    No session topics available for this mentor
                  </div>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {topics?.map((topic) => (
                      <Card
                        key={topic.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedTopic?.id === topic.id
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                        onClick={() => handleTopicSelect(topic)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold light:text-gray-900">
                              {topic.title}
                            </h4>
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {Number(topic.price).toLocaleString("en-US", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              })}{" "}
                              đ
                            </Badge>
                          </div>
                          <p className="text-sm light:text-gray-600 mb-2">
                            {topic.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs light:text-gray-500">
                            <span>Topic: {topic.topic}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === "schedule" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Select Available Time
                  </h3>
                  <Button variant="ghost" size="sm" onClick={handleBack}>
                    Back
                  </Button>
                </div>

                {selectedTopic && (
                  <Card className="p-3 light:bg-blue-50 border-blue-200">
                    <div className="text-sm">
                      <span className="font-medium">Selected Topic: </span>
                      {selectedTopic.title} -{" "}
                      {parseInt(selectedTopic.price).toLocaleString()} VND
                    </div>
                  </Card>
                )}

                {schedulesLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : !schedulesResponse ? (
                  <div className="text-center py-8 light:text-gray-500">
                    Move to step 2 to load schedules
                  </div>
                ) : schedulesResponse && schedules.length === 0 ? (
                  <div className="text-center py-8 light:text-gray-500">
                    No available schedules for this mentor
                  </div>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {schedules.map((schedule: MentorWorkScheduleType) => (
                      <Card
                        key={schedule.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedSchedule?.id === schedule.id
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                        onClick={() => handleScheduleSelect(schedule)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold light:text-gray-900">
                              {schedule.title}
                            </h4>
                            <Badge
                              className="bg-blue-500"
                              variant={
                                schedule.status === "AVAILABLE"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {schedule.status}
                            </Badge>
                          </div>
                          <p className="text-sm light:text-gray-600 mb-2">
                            {schedule.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm light:text-gray-500">
                            <div className="flex items-center gap-1">
                              <CalendarDays className="w-4 h-4" />
                              {format(new Date(schedule.date), "MMM dd, yyyy")}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {schedule.startTime} - {schedule.endTime}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === "confirm" && selectedTopic && selectedSchedule && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Confirm Your Booking
                  </h3>
                  <Button variant="ghost" size="sm" onClick={handleBack}>
                    Back
                  </Button>
                </div>

                <Card className="p-4 light:bg-gray-50">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold light:text-gray-900 mb-2">
                        Session Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="light:text-gray-600">Topic:</span>
                          <span className="font-medium">
                            {selectedTopic.title}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="light:text-gray-600">Date:</span>
                          <span className="font-medium">
                            {format(
                              new Date(selectedSchedule.date),
                              "MMM dd, yyyy"
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="light:text-gray-600">Time:</span>
                          <span className="font-medium">
                            {selectedSchedule.startTime} -{" "}
                            {selectedSchedule.endTime}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="light:text-gray-600">Duration:</span>
                          <span className="font-medium">
                            {selectedSchedule.title}
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="light:text-gray-900 font-semibold">
                            Total Price:
                          </span>
                          <span className="font-bold text-lg text-blue-600">
                            {Number(selectedTopic.price).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              }
                            )}{" "}
                            đ
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> After confirming, you will be
                    redirected to VNPay to complete the payment. Your session
                    will be confirmed once payment is successful.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={createBookingMutation.isPending}
              >
                Cancel
              </Button>
              {step === "confirm" && (
                <Button
                  onClick={handleConfirmBooking}
                  disabled={createBookingMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createBookingMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    "Confirm & Pay"
                  )}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
    </>
  );
}
