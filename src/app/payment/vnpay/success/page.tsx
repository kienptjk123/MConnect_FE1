"use client";

import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center space-y-6">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto animate-bounce" />
        <h1 className="text-2xl font-bold text-gray-900">
          Payment Successful!
        </h1>
        <p className="text-gray-600">
          Thank you for your payment. Your transaction was completed
          successfully.
        </p>
        <Link
          href="/manage/mentee/dashboard"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-500 text-white font-medium shadow hover:bg-green-600 transition"
        >
          Go to Dashboard
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
