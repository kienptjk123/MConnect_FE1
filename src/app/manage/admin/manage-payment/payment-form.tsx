"use client";
import PaymentTable from "@/app/manage/admin/manage-payment/payment-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { usePaymentsQuery } from "@/queries/usePayment";
import { CreditCard } from "lucide-react";

export default function PaymentManagementPage() {
  const { data, isLoading, isError } = usePaymentsQuery();
  return (
    <div className="mx-auto min-w-7xl p-6">
      <Card className="rounded-md shadow-sm border border-gray-200 ">
        <CardHeader className="flex flex-row items-center justify-between bg-blue-500 text-white dark:bg-black p-6 rounded-t-md">
          <div className="flex items-center gap-4">
            <div className="rounded-md bg-white/20 p-2 border border-white/20">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">
                Payment Management
              </CardTitle>
              <p className="text-sm opacity-90">
                Monitor and manage all payments
              </p>
            </div>
          </div>
        </CardHeader>

        <Separator />
        <CardContent className="p-6">
          {isLoading && (
            <div className="py-16 text-center">
              <div className="inline-flex items-center gap-3 text-gray-600">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent"></div>
                <span>Loading payments...</span>
              </div>
            </div>
          )}
          {isError && (
            <div className="py-16 text-center">
              <div className="inline-flex flex-col items-center gap-3 text-red-600">
                <div className="rounded-md bg-red-50 p-3">
                  <CreditCard className="h-5 w-5" />
                </div>
                <span>Failed to load payments. Please try again.</span>
              </div>
            </div>
          )}
          {!isLoading && !isError && (
            <>
              {data?.payload?.data?.payments ? (
                <PaymentTable
                  data={data.payload.data.payments.map((payment) => ({
                    ...payment,
                    status:
                      payment.status === "COMPLETED" ? "PAID" : payment.status,
                  }))}
                />
              ) : (
                <div className="py-16 text-center">
                  <p>No payments found or data structure issue</p>
                  <p className="text-sm text-gray-500">
                    Check console for debug info
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
