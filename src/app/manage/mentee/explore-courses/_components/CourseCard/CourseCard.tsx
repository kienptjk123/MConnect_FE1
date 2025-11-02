"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useCourseEnrollment } from "@/queries/useCourse";
import { CourseType } from "@/schemaValidations/course.schema";
import {
  BookOpen,
  BookText,
  Clock,
  MoveRight,
  Star,
  Users,
  X,
  Smartphone,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/components/SocketProvider";
import { useLearningCourses } from "@/queries/useMyCourses";

interface CourseCardProps {
  course: CourseType;
}

export default function CourseCard({ course }: CourseCardProps) {
  const enrollMutation = useCourseEnrollment();
  const router = useRouter();
  const { onPaymentSuccess, onPaymentFailed } = useSocket();
  const { data: learningCoursesData } = useLearningCourses();
  const [paymentData, setPaymentData] = useState<{
    qrUrl: string;
    amount: number;
    orderInfo: string;
  } | null>(null);
  const [countdown, setCountdown] = useState(900);

  // Check if user already enrolled in this course
  const isEnrolled = learningCoursesData?.payload?.result?.enrollments?.some(
    (enrollment) => enrollment.courseId === course.id
  );

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

  useEffect(() => {
    if (!paymentData) return;
    const handlePaymentSuccess = (data: any) => {
      setPaymentData(null);
      toast({
        title: "Thanh toán thành công! 🎉",
        description: "Bạn đã đăng ký khóa học thành công.",
      });
      router.push("/payment/vnpay/success");
    };

    const handlePaymentFailed = (data: any) => {
      setPaymentData(null);
      toast({
        title: "Thanh toán thất bại",
        description: data?.message || "Vui lòng thử lại sau.",
        variant: "destructive",
      });
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
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
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
        setCountdown(900);
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
    <>
      <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg dark:hover:shadow-none hover:shadow-blue-100 border-0 bg-white dark:bg-[#080808] dark:border-1 dark:border-white rounded-xl overflow-hidden">
        <div className="relative">
          <div className="relative h-56 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
            {course.thumbnail ? (
              <Link href={`/manage/mentee/explore-courses/${course.slug}`}>
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
            ) : (
              <Link
                href={`/manage/mentee/explore-courses/${course.slug}`}
                className="w-full h-full flex items-center justify-center"
              >
                <BookOpen className="w-52 h-52 text-white/80" />
              </Link>
            )}

            <div className="absolute top-3 right-3">
              <Badge
                variant="secondary"
                className={`${getStatusColor(course.status)} border-0`}
              >
                {course.status}
              </Badge>
            </div>
          </div>

          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium px-2 py-1 text-sm border-1 border-gray-300 hover:bg-blue-500 transition-all duration-300 ease-in hover:text-white rounded-xs">
                {course.categories?.[0]?.courseCategory?.name || "Learning IT"}
              </div>
              <div className="flex gap-1 items-center justify-center">
                <BookText className="w-4 h-4 text-blue-500" />
                <div className="">
                  {course.modules
                    .map((module) => module.lessons.length)
                    .reduce((a, b) => a + b, 0)}{" "}
                  Lessons
                </div>
              </div>
            </div>
            <Link
              href={`/manage/mentee/explore-courses/${course.slug}`}
              className="mt-3 font-bold text-xl text-gray-900 dark:text-white mb-3
             relative w-fit transition-colors duration-400 
             hover:text-blue-500
             after:content-[''] after:absolute after:left-0 after:bottom-0
             after:w-0 after:h-[2px] after:bg-blue-500 after:transition-all 
             after:duration-400 hover:after:w-full line-clamp-1"
            >
              {course.title}
            </Link>

            <div className="flex items-center gap-4 mb-3 text-xs dark:text-white text-gray-500">
              <div className="flex items-center gap-1 text-sm">
                <Users className="w-4 h-4" />
                <span>{course._count.enrollments} students</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{course._count.modules} modules</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>1h 30m</span>
              </div>
            </div>

            <div className="flex mt-3 mb-3 items-center justify-between font-semibold dark:text-white">
              <div className="text-xl font-bold">
                {Number(course.price).toLocaleString("en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}{" "}
                đ
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= course.avgRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <div className="">{course.avgRating.toFixed(1)}</div>
                <div className="">({course.ratingCount})</div>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-gray-200 pt-3">
              <div className="flex items-center gap-2 ">
                <Avatar className="w-9 h-9">
                  <AvatarImage
                    width={9}
                    height={9}
                    src={course.mentorProfile?.avatar || ""}
                  />
                  <AvatarFallback className="text-sm bg-blue-100 text-blue-700 ">
                    {course.mentorProfile.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-gray-700 capitalize truncate dark:text-white">
                    {course?.mentorProfile?.username}
                  </p>
                </div>
              </div>

              {isEnrolled ? (
                <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-semibold">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-base">Enrolled</span>
                </div>
              ) : (
                <div
                  onClick={handleEnrollNow}
                  className="flex items-center justify-center gap-2 text-gray-700 dark:text-white font-semibold hover:text-blue-500 transition-colors duration-300 cursor-pointer"
                >
                  <span className="text-base">Enroll Now</span>
                  <MoveRight className="w-5 h-5 text-gray-700 hover:text-blue-500" />
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </Card>

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
                    src={paymentData?.qrUrl}
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
                      Thanh toán khóa học
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
