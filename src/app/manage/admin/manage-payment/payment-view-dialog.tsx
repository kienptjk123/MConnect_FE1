"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, User, Clock, DollarSign } from "lucide-react";
import { PaymentType } from "@/types/payment";

interface PaymentViewDialogProps {
  payment: PaymentType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PaymentViewDialog({
  payment,
  open,
  onOpenChange,
}: PaymentViewDialogProps) {
  if (!payment) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: {
        variant: "secondary" as const,
        color: "bg-yellow-100 text-yellow-800",
      },
      PAID: {
        variant: "default" as const,
        color: "bg-green-100 text-green-800",
      },
      FAILED: {
        variant: "destructive" as const,
        color: "bg-red-100 text-red-800",
      },
      CANCELLED: {
        variant: "outline" as const,
        color: "bg-gray-100 text-gray-800",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

    return (
      <Badge variant={config.variant} className={config.color}>
        {status}
      </Badge>
    );
  };

  const getPaymentTypeBadge = (type: string) => {
    const typeConfig = {
      BOOKING: { color: "bg-blue-100 text-blue-800" },
      COURSE: { color: "bg-purple-100 text-purple-800" },
    };

    const config =
      typeConfig[type as keyof typeof typeConfig] || typeConfig.BOOKING;

    return (
      <Badge variant="outline" className={config.color}>
        {type}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get customer info
  let customer = null;
  let profile = null;
  if (payment.singleSessionBooking?.menteeProfile) {
    profile = payment.singleSessionBooking.menteeProfile;
    customer = profile.user;
  } else if (payment.workExperienceBooking?.menteeProfile) {
    profile = payment.workExperienceBooking.menteeProfile;
    customer = profile.user;
  } else if (payment.menteeProfile) {
    profile = payment.menteeProfile;
    customer = profile.user;
  }

  // Get service info
  let serviceInfo = null;
  let orderInfo = "N/A";

  if (payment.singleSessionBooking) {
    serviceInfo = {
      type: "Single Session Booking",
      details: "Single session booking service",
    };
    orderInfo = `Single Session Booking #${payment.singleSessionBooking.id}`;
  } else if (payment.workExperienceBooking) {
    const packageTitle =
      payment.workExperienceBooking.workExperiencePackage?.title ||
      "Work Experience Package";
    serviceInfo = {
      type: "Work Experience Booking",
      details: packageTitle,
    };
    orderInfo = `${packageTitle} - Booking #${payment.workExperienceBooking.id}`;
  } else if (payment.course) {
    serviceInfo = {
      type: "Course Enrollment",
      details: payment.course.title,
    };
    orderInfo = `Course: ${payment.course.title}`;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Details - #{payment.id}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Provider Reference
                  </label>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {payment.providerRef?.substring(0, 20) || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Payment ID
                  </label>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                    #{payment.id}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Amount
                  </label>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(payment.amount)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Status
                  </label>
                  <div className="mt-1">{getStatusBadge(payment.status)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Payment Type
                  </label>
                  <div className="mt-1">
                    {getPaymentTypeBadge(payment.paymentType)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Gateway
                  </label>
                  <p className="text-sm mt-1">Sepay</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Order Information
                </label>
                <p className="text-sm bg-gray-100 p-2 rounded mt-1">
                  {orderInfo}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {customer && profile ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Id
                    </label>
                    <p className="text-sm mt-1">{profile.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Full Name
                    </label>
                    <p className="text-sm mt-1">{profile.name || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <p className="text-sm mt-1">{customer.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 italic">
                  Customer information not available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Service Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="h-5 w-5" />
                Service Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {serviceInfo ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Service Type
                    </label>
                    <p className="text-sm mt-1">{serviceInfo.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Service Details
                    </label>
                    <p className="text-sm mt-1">{serviceInfo.details}</p>
                  </div>
                  {payment.course && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Course Price
                        </label>
                        <p className="text-sm mt-1">
                          {formatCurrency(payment.course.price)}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-gray-400 italic">
                  Service information not available
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Created At
                </label>
                <p className="text-sm mt-1">{formatDate(payment.createdAt)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Updated At
                </label>
                <p className="text-sm mt-1">{formatDate(payment.updatedAt)}</p>
              </div>
              {payment.paidAt && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Paid At
                  </label>
                  <p className="text-sm mt-1">{formatDate(payment.paidAt)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
