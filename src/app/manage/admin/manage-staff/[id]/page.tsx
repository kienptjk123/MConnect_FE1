"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTimeToLocaleString } from "@/lib/utils";
import { useStaffByIdQuery } from "@/queries/useStaff";
import {
  ArrowLeft,
  Edit,
  Users,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  FileUser,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

export default function StaffDetailPage() {
  const router = useRouter();
  const params = useParams();
  const staffId = parseInt(params.id as string);

  const { data: staffData, isLoading } = useStaffByIdQuery(staffId);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-400 border-t-transparent"></div>
            Loading staff details...
          </div>
        </div>
      </div>
    );
  }

  if (!staffData) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700">Staff not found</p>
            <p className="text-sm text-gray-500 mb-4">
              The staff member you're looking for doesn't exist.
            </p>
            <Button
              onClick={() => router.push("/manage/admin/manage-staff")}
              className="mt-4"
            >
              Back to Staff
            </Button>
          </div>
        </div>
      </div>
    );
  }

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

        <Button
          onClick={() =>
            router.push(`/manage/admin/manage-staff/${staffData.id}/edit`)
          }
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
        >
          <Edit className="h-4 w-4" />
          Edit Staff
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              {staffData.avatar ? (
                <div className="relative w-32 h-32 mx-auto">
                  <Image
                    src={staffData.avatar}
                    alt={staffData.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              {staffData.name}
            </CardTitle>
            <p className="text-gray-600">@{staffData.username}</p>
            <div className="flex justify-center gap-2 mt-2">
              <Badge
                variant="secondary"
                className={`text-xs ${
                  staffData.role === "ADMIN"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {staffData.role}
              </Badge>
              <Badge
                variant="secondary"
                className={`text-xs ${
                  staffData.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : staffData.status === "INACTIVE"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {staffData.status}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Details Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileUser className="h-5 w-5" />
              Staff Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{staffData.email}</p>
                  </div>
                </div>

                {staffData.phone_number && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{staffData.phone_number}</p>
                    </div>
                  </div>
                )}

                {staffData.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{staffData.location}</p>
                    </div>
                  </div>
                )}

                {staffData.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <a
                        href={staffData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-800"
                      >
                        {staffData.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {staffData.date_of_birth && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium">
                        {formatDateTimeToLocaleString(staffData.date_of_birth)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Joined</p>
                    <p className="font-medium">
                      {formatDateTimeToLocaleString(staffData.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio/Description */}
            {(staffData.bio || staffData.description) && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  About
                </h3>
                <div className="space-y-3">
                  {staffData.bio && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Bio</p>
                      <p className="text-gray-700">{staffData.bio}</p>
                    </div>
                  )}
                  {staffData.description && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Description</p>
                      <p className="text-gray-700">{staffData.description}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cover Photo */}
      {staffData.coverPhoto && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Cover Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-64 w-full rounded-lg overflow-hidden">
              <Image
                src={staffData.coverPhoto}
                alt={`${staffData.name} cover photo`}
                fill
                className="object-cover"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
