"use client";

import { Button } from "@/components/ui/button";
import { useUpdateRequestByIdQuery } from "@/queries/useUpdateRequest";
import { FileText } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

export default function EditMentorApplicationForm() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as any);
  const { data, isLoading, isError } = useUpdateRequestByIdQuery(id, !!id);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-400 border-t-transparent"></div>
            Loading request details...
          </div>
        </div>
      </div>
    );
  }

  if (!data?.payload?.result) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
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

  if (isError) {
    return (
      <div>
        {data?.payload?.message ||
          "An error occurred while fetching the mentor application."}
      </div>
    );
  }
  return (
    <div>
      <div>{data.payload.result.name}</div>
    </div>
  );
}
