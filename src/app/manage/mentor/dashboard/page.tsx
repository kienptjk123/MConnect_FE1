"use client";

import React, { useEffect } from "react";
import {
  useProfile,
  useProfileLoading,
  useFetchProfile,
} from "@/stores/profileStore";
import { DashboardLayout } from "@/app/manage/mentor/dashboard/components/dashboard-layout";
import { DashboardHeader } from "@/app/manage/mentor/dashboard/components/dashboard-header";
import { StatsGrid } from "@/app/manage/mentor/dashboard/components/stats-grid";
import { ProfileSection } from "@/app/manage/mentor/dashboard/components/profile-section";
import { RecentActivity } from "@/app/manage/mentor/dashboard/components/recent-activity";
import { RevenueChart } from "@/app/manage/mentor/dashboard/components/revenue-chart";
import { ProfileViewChart } from "@/app/manage/mentor/dashboard/components/profile-view-chart";
import { CourseRating } from "@/app/manage/mentor/dashboard/components/course-rating";
import { CourseOverview } from "@/app/manage/mentor/dashboard/components/course-overview";

export default function MenteeDashboard() {
  const profile = useProfile();
  const isLoading = useProfileLoading();
  const fetchProfile = useFetchProfile();
  const isLoggedIn = !!profile;

  // Fetch profile when component mounts
  useEffect(() => {
    if (!profile && !isLoading) {
      fetchProfile();
    }
  }, [profile, isLoading, fetchProfile]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Profile not found</p>
          <p className="text-gray-600">Please login again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <DashboardHeader />
      <StatsGrid />
      <ProfileSection />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
        <div className="lg:col-span-1">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <ProfileViewChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CourseRating />
        <CourseOverview />
      </div>
    </div>
  );
}
