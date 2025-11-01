"use client";

import { CheckCircle, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function PaymentSuccessPage() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-lg text-center space-y-6 border border-green-100">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-green-100 rounded-full animate-ping"></div>
          </div>
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto relative z-10 drop-shadow-lg" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Thanh toán thành công! 🎉
          </h1>
          <p className="text-lg text-green-600 font-semibold">
            Payment Successful
          </p>
        </div>

        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <p className="text-gray-700">
            Cảm ơn bạn đã thanh toán. Giao dịch của bạn đã được xử lý thành công.
            <br />
            <span className="text-sm text-gray-600">
              Thank you for your payment. Your transaction was completed successfully.
            </span>
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <Link
            href="/manage/mentee/my-courses"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <BookOpen className="w-5 h-5" />
            Xem khóa học của tôi
          </Link>

          <Link
            href="/manage/mentee/explore-courses"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-green-600 font-medium border-2 border-green-500 hover:bg-green-50 transition-all"
          >
            Khám phá thêm khóa học
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/manage/mentee/dashboard"
            className="block text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Quay về Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
