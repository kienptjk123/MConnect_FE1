"use client";

import React from "react";
import MentorTable from "@/app/manage/staff/manage-mentor/mentor-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useMentors } from "@/queries/useMentor";
import { GraduationCap } from "lucide-react";

export default function ManageMentorPage() {
  const { data, isLoading, isError } = useMentors();

  return (
    <div className="mx-auto min-w-7xl p-6">
      <Card className="rounded-md shadow-sm border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between bg-blue-500 text-white dark:bg-black p-6 rounded-t-md">
          <div className="flex items-center gap-4">
            <div className="rounded-md bg-white/20 p-2 border border-white/20">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">
                Mentor Management
              </CardTitle>
              <p className="text-sm opacity-90">
                Manage registered mentors in the system
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
                Loading mentors...
              </div>
            </div>
          )}
          {isError && (
            <div className="py-16 text-center">
              <div className="inline-flex flex-col items-center gap-3 text-red-600">
                <div className="rounded-md bg-red-50 p-3">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span>Failed to load mentors. Please try again.</span>
              </div>
            </div>
          )}
          {Array.isArray(data?.payload?.result) && (
            <MentorTable data={data.payload.result} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
