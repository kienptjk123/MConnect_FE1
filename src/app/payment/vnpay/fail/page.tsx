"use client";

import { XCircle, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function PaymentFailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center  p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center space-y-6">
        <XCircle className="w-20 h-20 text-red-500 mx-auto animate-pulse" />
        <h1 className="text-2xl font-bold text-gray-900">Payment Failed</h1>
        <p className="text-gray-600">
          Oops! Something went wrong with your payment. Please try again later.
        </p>
        <Link
          href="/manage/mentee/dashboard"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-500 text-white font-medium shadow hover:bg-red-600 transition"
        >
          Try Again
          <RotateCcw className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
