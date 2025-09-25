"use client";

import React, { useEffect } from "react";
import {
  useProfile,
  useProfileLoading,
  useFetchProfile,
} from "@/stores/profileStore";

export default function MenteeDashboard() {
  const profile = useProfile();
  const isLoading = useProfileLoading();
  const fetchProfile = useFetchProfile();
  const isLoggedIn = !!profile;

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

  return <div className="p-6">page</div>;
}
