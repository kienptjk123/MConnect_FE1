"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Calendar, Clock } from "lucide-react";
import Link from "next/link";

export default function PaymentReturn() {
  const searchParams = useSearchParams();
  const [paymentResult, setPaymentResult] = useState<{
    success: boolean;
    message: string;
    bookingDetails?: any;
  } | null>(null);

  useEffect(() => {
    // Parse VNPay return parameters
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
    const vnp_TxnRef = searchParams.get("vnp_TxnRef");
    const vnp_Amount = searchParams.get("vnp_Amount");
    const vnp_OrderInfo = searchParams.get("vnp_OrderInfo");

    if (vnp_ResponseCode === "00") {
      // Payment successful
      setPaymentResult({
        success: true,
        message: "Payment completed successfully!",
        bookingDetails: {
          transactionRef: vnp_TxnRef,
          amount: vnp_Amount ? parseInt(vnp_Amount) / 100 : 0, // VNPay returns amount in cents
          orderInfo: vnp_OrderInfo,
        },
      });
    } else {
      // Payment failed
      setPaymentResult({
        success: false,
        message: "Payment failed. Please try again.",
      });
    }
  }, [searchParams]);

  if (!paymentResult) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {paymentResult.success ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          <CardTitle className="text-xl">
            {paymentResult.success ? "Payment Successful!" : "Payment Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">{paymentResult.message}</p>

          {paymentResult.success && paymentResult.bookingDetails && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-medium">
                  {paymentResult.bookingDetails.transactionRef}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">
                  {paymentResult.bookingDetails.amount.toLocaleString()} VND
                </span>
              </div>
              {paymentResult.bookingDetails.orderInfo && (
                <div className="text-sm">
                  <span className="text-gray-600">Details:</span>
                  <p className="font-medium mt-1">
                    {decodeURIComponent(paymentResult.bookingDetails.orderInfo)}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            {paymentResult.success ? (
              <>
                <Button asChild className="w-full">
                  <Link href="/manage/mentee/my-courses">View My Sessions</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/manage/mentee/explore-mentor">
                    Book Another Session
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild className="w-full">
                  <Link href="/manage/mentee/explore-mentor">Try Again</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/manage/mentee/dashboard">Go to Dashboard</Link>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
