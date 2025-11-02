"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useCourseEnrollment } from "@/queries/useCourse";
import { CourseDetailType } from "@/schemaValidations/course.schema";
import {
  Bookmark,
  BookOpen,
  Clock,
  Globe,
  Heart,
  ShieldCheck,
  ShoppingCart,
  Stars,
  Users,
  X,
  Smartphone,
  CheckCircle,
  PlayCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSocket } from "@/components/SocketProvider";
import { useLearningCourses } from "@/queries/useMyCourses";
import Link from "next/link";

interface CourseInfoPanelProps {
  course: CourseDetailType;
}

export default function CourseInfoPanel({ course }: CourseInfoPanelProps) {
  const enrollMutation = useCourseEnrollment();
  const router = useRouter();
  const { onPaymentSuccess, onPaymentFailed } = useSocket();
  const { data: learningCoursesData } = useLearningCourses();
  const [paymentData, setPaymentData] = useState<{
    qrUrl: string;
    amount: number;
    orderInfo: string;
  } | null>(null);
  const [countdown, setCountdown] = useState(900); // 15 minutes in seconds

  // Check if user already enrolled in this course
  const enrolledCourse =
    learningCoursesData?.payload?.result?.enrollments?.find(
      (enrollment) => enrollment.courseId === course.id
    );
  const isEnrolled = !!enrolledCourse;

  const totalDuration = course.modules.reduce((total, moduleData) => {
    return (
      total +
      moduleData.lessons.reduce(
        (moduleTotal, lesson) => moduleTotal + lesson.durationSec,
        0
      )
    );
  }, 0);

  const totalHours = Math.floor(totalDuration / 3600);
  const totalMinutes = Math.floor((totalDuration % 3600) / 60);

  const totalLessons = course.modules.reduce(
    (total, moduleData) => total + moduleData.lessons.length,
    0
  );

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
        description: "Bạn đã đăng ký khóa học thành công.",
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

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(typeof price === "string" ? parseFloat(price) : price);
  };

  const handleEnrollNow = async () => {
    try {
      const enrollmentData = {
        courseId: course.id,
        amount: parseFloat(course.price),
        orderInfo: `Course enrollment: ${course.title}`,
      };

      const result = await enrollMutation.mutateAsync({
        id: course.id.toString(),
        body: enrollmentData,
      });

      if (result.payload?.data?.paymentUrl) {
        setPaymentData({
          qrUrl: result.payload.data.paymentUrl,
          amount: parseFloat(course.price),
          orderInfo: enrollmentData.orderInfo,
        });
        setCountdown(900); // Reset countdown to 15 minutes
      } else {
        toast({
          title: "Success",
          description: "Course enrollment initiated successfully!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to enroll in course",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 top-6 sticky dark:bg-[#080808]">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-3xl font-bold  light:text-gray-900">
              {Number(course.price).toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              đ
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between border-b pb-3 light:text-gray-600">
          <div className="flex items-center justify-center">
            <Clock className="h-5 w-5 mr-3" />
            <span>Duration</span>
          </div>

          <span>
            {totalHours > 0 && `${totalHours}h `}
            {totalMinutes}m
          </span>
        </div>

        <div className="flex items-center justify-between border-b pb-3 light:text-gray-600">
          <div className="flex items-center justify-center">
            <BookOpen className="h-5 w-5 mr-3" />
            <span>Lesson</span>
          </div>
          <span>{totalLessons} lessons</span>
        </div>

        <div className="flex items-center justify-between border-b pb-3 light:text-gray-600">
          <div className="flex items-center justify-center">
            <BookOpen className="h-5 w-5 mr-3" />
            <span>Category</span>
          </div>
          <span>{course.categories?.[0]?.courseCategory?.name}</span>
        </div>

        <div className="flex items-center justify-between border-b pb-3 light:text-gray-600">
          <div className="flex items-center justify-center">
            <Globe className="h-5 w-5 mr-3" />
            <span>Language</span>
          </div>
          <span>Vietnamese</span>
        </div>

        <div className="flex items-center justify-between border-b pb-3 light:text-gray-600">
          <div className="flex items-center justify-center">
            <Bookmark className="h-5 w-5 mr-3" />
            <span>Access</span>
          </div>
          <span>Full Lifetime</span>
        </div>

        <div className="flex items-center justify-between border-b pb-3 light:text-gray-600">
          <div className="flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 mr-3" />
            <span>Certificate</span>
          </div>
          <span>Yes</span>
        </div>

        <div className="flex items-center justify-between border-b pb-3 light:text-gray-600">
          <div className="flex items-center justify-center">
            <Users className="h-5 w-5 mr-3" />
            <span>Students Enrolled</span>
          </div>
          <span>{course._count.enrollments}</span>
        </div>

        <div className="flex items-center justify-between border-b pb-3 light:text-gray-600">
          <div className="flex items-center justify-center">
            <Stars className="h-5 w-5 mr-3" />
            <span>Average Rating</span>
          </div>
          <span>
            {course.avgRating} ({course.ratingCount} reviews)
          </span>
        </div>
      </div>

      {isEnrolled ? (
        <>
          {/* Enrolled Status */}
          <div className="pt-4 mt-4 bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 mb-3">
              <CheckCircle className="h-6 w-6" />
              <span className="font-semibold text-lg">Already Enrolled</span>
            </div>
            {enrolledCourse && (
              <div className="text-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                <p>Progress: {enrolledCourse.progressPercentage}%</p>
                <p className="text-xs mt-1">
                  {enrolledCourse.completedLessons} of{" "}
                  {enrolledCourse.totalLessons} lessons completed
                </p>
              </div>
            )}
          </div>

          {/* Go to Course Button */}
          <div className="pt-4">
            <Link href={`/manage/mentee/my-courses/${course.slug}`}>
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
                size="lg"
              >
                <PlayCircle className="h-5 w-5 mr-2" />
                Continue Learning
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="pt-4 mt-4">
            <Button
              className="w-full bg-blue-500 hover:bg-blue-400 dark:text-white"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add To Cart
            </Button>
          </div>

          <div className="pt-4">
            <Button
              className="w-full bg-white border text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
              size="lg"
              onClick={handleEnrollNow}
              disabled={enrollMutation.isPending}
            >
              <Heart className="h-5 w-5 mr-2" />
              {enrollMutation.isPending ? "Processing..." : "Buy Now"}
            </Button>
          </div>
        </>
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
    </Card>
  );
}
