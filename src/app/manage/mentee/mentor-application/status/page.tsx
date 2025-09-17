"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useMyUpdateRequestsQuery } from "@/queries/useUpdateRequest";
import {
  FileText,
  Clock,
  Check,
  X,
  Calendar,
  User,
  Mail,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MentorApplicationStatus() {
  const router = useRouter();
  const { data, isLoading, isError } = useMyUpdateRequestsQuery();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Check className="h-4 w-4" />;
      case "REJECTED":
        return <X className="h-4 w-4" />;
      case "PENDING":
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-400 border-t-transparent"></div>
            Loading applications...
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700">
              Failed to load applications
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Please try again later.
            </p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const application = data?.payload?.result || null;

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

        <Link href="/manage/mentee/mentor-application">
          <Button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white">
            <Plus className="h-4 w-4" />
            New Application
          </Button>
        </Link>
      </div>

      {!application ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No Applications Found
            </h3>
            <p className="text-gray-500 mb-6">
              You haven't submitted any mentor applications yet.
            </p>
            <Link href="/manage/mentee/mentor-application">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                Apply to Become a Mentor
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card
            key={application.id}
            className="rounded-md shadow-sm border border-gray-200"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  Application Status
                </CardTitle>
                <Badge
                  className={`${getStatusColor(
                    application.status
                  )} flex items-center gap-1`}
                >
                  {getStatusIcon(application.status)}
                  {application.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Name
                  </Label>
                  <p className="mt-1 text-gray-900">{application.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Major
                  </Label>
                  <p className="mt-1 text-gray-900">{application.major}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Submitted
                  </Label>
                  <p className="mt-1 text-gray-900 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(application.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium text-gray-700">Bio</Label>
                <p className="mt-1 text-gray-800 text-sm">
                  {application.bio.length > 150
                    ? `${application.bio.substring(0, 150)}...`
                    : application.bio}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Motivation
                </Label>
                <p className="mt-1 text-gray-800 text-sm">
                  {application.description.length > 150
                    ? `${application.description.substring(0, 150)}...`
                    : application.description}
                </p>
              </div>

              {application.review_comment && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Review Comment
                  </Label>
                  <div className="mt-1 p-3 bg-gray-100 rounded-md">
                    <p className="text-gray-800 text-sm">
                      {application.review_comment}
                    </p>
                  </div>
                </div>
              )}

              {application.reviewed_by && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Reviewed By
                  </Label>
                  <p className="mt-1 text-gray-600 text-sm flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {application.reviewed_by.email}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-500">
                  Last updated:{" "}
                  {new Date(application.updated_at).toLocaleString()}
                </div>

                {application.cv_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(application.cv_url, "_blank")}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    View CV
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
