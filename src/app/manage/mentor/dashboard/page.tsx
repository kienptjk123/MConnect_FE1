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
    <div className="p-6">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {profile?.name}!
        </h1>
        <p className="text-gray-600">Mentee Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Profile Info</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Name:</span> {profile?.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {profile?.email}
            </p>
            <p>
              <span className="font-medium">Role:</span> {profile?.role}
            </p>
            <p>
              <span className="font-medium">Status:</span> {profile.status}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
              Find Mentors
            </button>
            <button className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
              My Courses
            </button>
            <button className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors">
              Messages
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Courses Enrolled:</span>
              <span className="font-bold">0</span>
            </div>
            <div className="flex justify-between">
              <span>Messages:</span>
              <span className="font-bold">0</span>
            </div>
            <div className="flex justify-between">
              <span>Mentors:</span>
              <span className="font-bold">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
