"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import {
  useUpdateRequestByIdQuery,
  useEditUpdateRequestMutation,
} from "@/queries/useUpdateRequest";
import {
  EditUpdateRequestSchema,
  type EditUpdateRequest,
} from "@/schemaValidations/upgradeRequest";
import {
  FileText,
  User,
  Mail,
  Phone,
  Globe,
  GraduationCap,
  Calendar,
  ArrowLeft,
  Save,
  Eye,
  Download,
  Check,
  X,
  Clock,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function EditMentorApplicationForm() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as any);
  const { data, isLoading, isError, refetch } = useUpdateRequestByIdQuery(
    id,
    !!id
  );
  const editMutation = useEditUpdateRequestMutation();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<EditUpdateRequest>({
    resolver: zodResolver(EditUpdateRequestSchema),
    defaultValues: {
      status: data?.payload?.result?.status || "PENDING",
      review_comment: data?.payload?.result?.review_comment || "",
    },
  });

  React.useEffect(() => {
    if (data?.payload?.result) {
      form.reset({
        status: data.payload.result.status,
        review_comment: data.payload.result.review_comment || "",
      });
    }
  }, [data, form]);

  const onSubmit = async (values: EditUpdateRequest) => {
    try {
      await editMutation.mutateAsync({ id, body: values });
      toast({
        title: "Application updated",
        description: "The mentor application has been updated successfully.",
      });
      setIsEditing(false);
      refetch();
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error?.message || "Failed to update the application.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-400 border-t-transparent"></div>
            Loading application details...
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data?.payload?.result) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700">
              Mentor application not found
            </p>
            <p className="text-sm text-gray-500 mb-4">
              The mentor application you're looking for doesn't exist.
            </p>
            <Button
              onClick={() => router.push("/manage/staff/mentor-application")}
              className="mt-4"
            >
              Back to Mentor Applications
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const application = data.payload.result;

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

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant="default"
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white hover:cursor-pointer"
          >
            {isEditing ? (
              <>
                <X className="h-4 w-4" />
                Cancel
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Edit
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applicant Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Applicant Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  {application.mentee_profile.avatar ? (
                    <img
                      src={application.mentee_profile.avatar}
                      alt={application.mentee_profile.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-blue-600">
                      {application.mentee_profile.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{application.name}</h3>
                  <p className="text-gray-600">
                    @{application.mentee_profile.username}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    Applied on{" "}
                    {new Date(application.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Major
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <GraduationCap className="h-4 w-4 text-gray-400" />
                    <span>{application.major}</span>
                  </div>
                </div>

                {application.phone_number && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Phone
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{application.phone_number}</span>
                    </div>
                  </div>
                )}

                {application.website && (
                  <div className="md:col-span-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Website
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <a
                        href={application.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {application.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bio & Description */}
          <Card>
            <CardHeader>
              <CardTitle>Bio & Motivation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Bio</Label>
                <p className="mt-2 text-gray-800 leading-relaxed">
                  {application.bio}
                </p>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Why do you want to become a mentor?
                </Label>
                <p className="mt-2 text-gray-800 leading-relaxed">
                  {application.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CV Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Curriculum Vitae
              </CardTitle>
            </CardHeader>
            <CardContent>
              {application.cv_url ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => window.open(application.cv_url, "_blank")}
                      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white hover:cursor-pointer"
                    >
                      <Download className="h-4 w-4" />
                      Download CV
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open(application.cv_url, "_blank")}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View CV
                    </Button>
                  </div>

                  {/* PDF Viewer */}
                  <div className="border rounded-lg overflow-hidden">
                    <iframe
                      src={`${application.cv_url}#toolbar=0`}
                      className="w-full h-full min-h-[800px]"
                      title="CV Preview"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">No CV uploaded</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Review Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Review & Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="status" className="text-sm font-medium">
                      Status *
                    </Label>
                    <Select
                      value={form.watch("status")}
                      onValueChange={(value) =>
                        form.setValue("status", value as any)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Pending
                          </div>
                        </SelectItem>
                        <SelectItem value="APPROVED">
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4" />
                            Approved
                          </div>
                        </SelectItem>
                        <SelectItem value="REJECTED">
                          <div className="flex items-center gap-2">
                            <X className="h-4 w-4" />
                            Rejected
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.status && (
                      <p className="text-xs text-red-500 mt-1">
                        {form.formState.errors.status.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="review_comment"
                      className="text-sm font-medium"
                    >
                      Review Comment
                    </Label>
                    <Textarea
                      id="review_comment"
                      placeholder="Add your review comments here..."
                      {...form.register("review_comment")}
                      className="mt-1 min-h-[120px]"
                    />
                    {form.formState.errors.review_comment && (
                      <p className="text-xs text-red-500 mt-1">
                        {form.formState.errors.review_comment.message}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={editMutation.isPending}
                      className="flex items-center gap-2 flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      {editMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Review
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Current Status
                    </Label>
                    <Badge
                      className={`${getStatusColor(
                        application.status
                      )} flex items-center gap-1 mt-2 w-fit p-2`}
                    >
                      {getStatusIcon(application.status)}
                      {application.status}
                    </Badge>
                  </div>

                  {application.review_comment && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Review Comment
                      </Label>
                      <div className="mt-2 p-3 bg-gray-50 rounded-md">
                        <p className="text-gray-800 text-sm leading-relaxed">
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
                      <div className="mt-2 flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{application.reviewed_by.email}</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Last Updated
                    </Label>
                    <p className="mt-1 text-sm text-gray-600">
                      {new Date(application.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Application Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Application Submitted</p>
                    <p className="text-xs text-gray-500">
                      {new Date(application.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {application.updated_at !== application.created_at && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-xs text-gray-500">
                        {new Date(application.updated_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
