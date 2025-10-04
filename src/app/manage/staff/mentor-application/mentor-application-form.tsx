"use client";

import MentorApplicationTable from "@/app/manage/staff/mentor-application/mentor-application-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUpdateRequestQuery } from "@/queries/useUpdateRequest";
import { FileText } from "lucide-react";

export default function MentorApplicationForm() {
  const { data, isLoading, isError } = useUpdateRequestQuery();
  return (
    <div className="mx-auto min-w-7xl p-6">
      <Card className="rounded-md shadow-sm border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between bg-blue-500 text-white dark:bg-black p-6 rounded-t-md">
          <div className="flex items-center gap-4">
            <div className="rounded-md bg-white/20 p-2 border border-white/20">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">
                Mentor Application Management
              </CardTitle>
              <p className="text-sm opacity-90">
                Manage mentor applications efficiently
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
                Loading Mentor Applications...
              </div>
            </div>
          )}
          {isError && (
            <div className="py-16 text-center">
              <div className="inline-flex flex-col items-center gap-3 text-red-600">
                <div className="rounded-md bg-red-50 p-3">
                  <FileText className="h-5 w-5" />
                </div>
                <span>
                  Failed to load Mentor Applications. Please try again.
                </span>
              </div>
            </div>
          )}
          {Array.isArray(data?.payload?.result.requests) && (
            <MentorApplicationTable data={data.payload.result.requests} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
