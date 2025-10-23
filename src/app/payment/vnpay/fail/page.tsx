"use client";

import { XCircle, RotateCcw, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PaymentFailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-lg text-center space-y-6 border border-red-100">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-red-100 rounded-full animate-pulse"></div>
          </div>
          <XCircle className="w-24 h-24 text-red-500 mx-auto relative z-10 drop-shadow-lg" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Thanh toán thất bại! ❌
          </h1>
          <p className="text-lg text-red-600 font-semibold">Payment Failed</p>
        </div>

        <div className="bg-red-50 rounded-xl p-4 border border-red-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-gray-700 font-medium mb-1">
                Có lỗi xảy ra trong quá trình thanh toán
              </p>
              <p className="text-sm text-gray-600">
                Oops! Something went wrong with your payment. Vui lòng thử lại
                hoặc liên hệ hỗ trợ nếu vấn đề tiếp tục.
              </p>
            </div>
          </div>
        </div>

        {/* Possible reasons */}
        <div className="bg-gray-50 rounded-xl p-4 text-left">
          <p className="font-semibold text-gray-800 mb-2">
            Nguyên nhân có thể:
          </p>
          <ul className="space-y-1 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-red-500">•</span>
              <span>Hết thời gian thanh toán (15 phút)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500">•</span>
              <span>Số dư tài khoản không đủ</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500">•</span>
              <span>Lỗi kết nối mạng</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500">•</span>
              <span>Thông tin thanh toán không chính xác</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3 pt-4">
          <Link
            href="/manage/mentee/explore-courses"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            Thử lại thanh toán
          </Link>

          <Link
            href="/manage/mentee/dashboard"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-gray-700 font-medium border-2 border-gray-300 hover:bg-gray-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay về Dashboard
          </Link>

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600">
              Cần hỗ trợ? Liên hệ:{" "}
              <a
                href="mailto:support@mconnect.edu.vn"
                className="text-blue-600 hover:underline font-medium"
              >
                support@mconnect.edu.vn
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
