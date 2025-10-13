"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Package,
  Calendar,
  User,
  Edit,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  BookOpen,
  Target,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { formatDateTimeToLocaleString } from "@/lib/utils";
import { useWorkExpPackageById } from "@/queries/useWorkExpPackage";

export default function WorkExperiencePackageDetailPage() {
  const router = useRouter();
  const params = useParams();
  const packageId = parseInt(params.id as string);

  const {
    data: packageData,
    isLoading,
    isError,
  } = useWorkExpPackageById(packageId, !!packageId);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-400 border-t-transparent"></div>
            Loading package details...
          </div>
        </div>
      </div>
    );
  }

  if (isError || !packageData?.payload?.data) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700">
              Package not found
            </p>
            <p className="text-sm text-gray-500 mb-4">
              The work experience package you're looking for doesn't exist or
              couldn't be loaded.
            </p>
            <Button
              onClick={() =>
                router.push("/manage/mentor/work-experience-package")
              }
              className="mt-4"
            >
              Back to Packages
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const workPackage = packageData.payload.data;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Main Info Card */}
        <Card className="bg-white rounded-lg shadow-sm">
          <CardHeader className="bg-blue-500 text-white p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-md bg-white/20 p-2 border border-white/20">
                <Package className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold mb-2">
                  {workPackage.title}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm opacity-90">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {workPackage.mentorProfile?.name}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDateTimeToLocaleString(workPackage.createdAt)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <Badge
                  variant={
                    workPackage.status === "ACTIVE"
                      ? "default"
                      : workPackage.status === "INACTIVE"
                      ? "secondary"
                      : "destructive"
                  }
                  className="mb-2"
                >
                  {workPackage.status.toLowerCase()}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Package Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="rounded-full bg-blue-100 p-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold">{workPackage.duration} hours</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="rounded-full bg-green-100 p-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="font-semibold">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(workPackage.price)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="rounded-full bg-purple-100 p-2">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Max Participants</p>
                  <p className="font-semibold">
                    {workPackage.maxParticipants || "Unlimited"}
                  </p>
                </div>
              </div>
            </div>

            {/* Package Type */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Package Type
              </h3>
              <Badge
                variant={
                  workPackage.packageType === "SANDBOX_ONLY"
                    ? "secondary"
                    : "default"
                }
                className="text-sm px-3 py-1"
              >
                {workPackage.packageType === "SANDBOX_ONLY"
                  ? "Sandbox Only"
                  : "Course + Sandbox"}
              </Badge>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {workPackage.description}
              </p>
            </div>

            {/* Skills */}
            {workPackage.skills && workPackage.skills.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Skills Covered</h3>
                <div className="flex flex-wrap gap-2">
                  {workPackage.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {workPackage.requirements &&
              workPackage.requirements.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Requirements
                  </h3>
                  <div className="space-y-4">
                    {workPackage.requirements
                      .sort((a: any, b: any) => a.order - b.order)
                      .map((requirement: any, index: number) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-800">
                              {index + 1}. {requirement.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              {requirement.isOptional && (
                                <Badge variant="outline" className="text-xs">
                                  Optional
                                </Badge>
                              )}
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm">
                            {requirement.description}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}

            {/* Statistics */}
            <div className="pt-6 border-t">
              <h3 className="text-lg font-semibold mb-3">Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Total Bookings</span>
                  <span className="font-semibold">
                    {workPackage._count?.bookings || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-semibold">
                    {formatDateTimeToLocaleString(workPackage.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
