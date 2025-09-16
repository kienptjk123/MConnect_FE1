"use client";

import { Suspense, useState } from "react";
import { useParams } from "next/navigation";
import { useMentorByUsername, useMentorCourses } from "@/queries/useMentor";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CourseCard from "@/app/manage/mentee/explore-courses/_components/CourseCard/CourseCard";
import { FriendRequestButton } from "@/components/FriendRequestButton/FriendRequestButton";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Globe,
  MessageCircle,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Loading from "@/app/loading";

export default function MentorDetailPage() {
  const params = useParams();
  const username = params.username as string;

  const {
    data: mentorResponse,
    isLoading,
    error,
  } = useMentorByUsername(username);

  const mentorData = mentorResponse?.payload?.result;
  const mentor = mentorData?.mentorProfiles;

  // Fetch courses của mentor
  const { data: coursesResponse, isLoading: coursesLoading } = useMentorCourses(
    mentor?.id || 0
  );
  const courses = coursesResponse?.payload?.result?.courses || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error loading mentor
          </h1>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : "Something went wrong"}
          </p>
          <Button asChild>
            <Link href="/manage/mentee/explore-mentor">Back to Mentors</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">
            Mentor not found
          </h1>
          <Button asChild>
            <Link href="/manage/mentee/explore-mentor">Back to Mentors</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Suspense fallback={<Loading />}>
        <div className="min-h-screen bg-gray-50">
          {/* Header Navigation */}
          <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href="/manage/mentee/explore-mentor"
                  className="flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Mentors
                </Link>
              </Button>
            </div>
          </div>

          {/* Cover Photo */}
          <div className="h-64 bg-gradient-to-r from-blue-600 to-purple-600 relative">
            {mentor.coverPhoto && (
              <Image
                src={mentor.coverPhoto}
                alt="Cover"
                fill
                className="object-cover"
              />
            )}
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Mentor Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Profile Header */}
                <Card className="p-6 bg-white">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    {/* Avatar */}
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-100 overflow-hidden flex-shrink-0">
                      {mentor?.avatar ? (
                        <Image
                          src={mentor.avatar}
                          alt={mentor?.name}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-3xl">
                            {mentor?.name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-gray-900">
                          {mentor?.name}
                        </h1>
                        <Badge
                          variant={
                            mentorData?.role === "MENTOR"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {mentorData?.role}
                        </Badge>
                      </div>

                      <p className="text-lg text-gray-600 mb-4">
                        @{mentor?.username}
                      </p>

                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-500" />
                          <span>4.8 (09 Reviews)</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>254 Students</span>
                        </div>
                      </div>

                      {/* Quick Action Buttons */}
                      <div className="mt-4 flex gap-3">
                        <FriendRequestButton
                          targetUserId={mentorData?.id}
                          targetUserName={mentor?.name}
                          size="sm"
                          variant="outline"
                        />
                        <Button size="sm" variant="ghost">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* About Section */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    About Me
                  </h2>
                  <div className="space-y-4">
                    {mentor.bio && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Bio</h3>
                        <p className="text-gray-600 leading-relaxed">
                          {mentor.bio}
                        </p>
                      </div>
                    )}

                    {mentor.description && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">
                          Description
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {mentor.description}
                        </p>
                      </div>
                    )}

                    {!mentor.bio && !mentor.description && (
                      <p className="text-gray-500 italic">
                        If you need help coping with a mental health condition
                        or things going on in your life, like loneliness or
                        stress due to a new baby or financial issues, just come
                        to us.
                      </p>
                    )}
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="p-6 top-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Contact Information
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-3" />
                        <span className="text-sm">Send Message</span>
                      </div>
                      <span className="text-sm font-medium">
                        {mentorData?.email}
                      </span>
                    </div>

                    {/* Phone */}
                    {mentor.phoneNumber && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-3" />
                          <span className="text-sm">24/7 Support</span>
                        </div>
                        <span className="text-sm font-medium">
                          {mentor?.phoneNumber}
                        </span>
                      </div>
                    )}

                    {/* Location */}
                    {mentor.location && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-3" />
                          <span className="text-sm">Location</span>
                        </div>
                        <span className="text-sm font-medium">
                          {mentor.location}
                        </span>
                      </div>
                    )}

                    {/* Website */}
                    {mentor.website && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <Globe className="h-4 w-4 mr-3" />
                          <span className="text-sm">Website</span>
                        </div>
                        <Link
                          href={mentor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          Visit
                        </Link>
                      </div>
                    )}

                    {mentor.dateOfBirth && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-3" />
                          <span className="text-sm">Date of Birth</span>
                        </div>
                        <span className="text-sm font-medium">
                          {new Date(mentor.dateOfBirth).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Contact Button */}
                  <div className="mt-6 pt-6 border-t space-y-3">
                    <Button className="w-full" size="lg">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Contact Mentor
                    </Button>

                    <FriendRequestButton
                      targetUserId={mentorData.id}
                      targetUserName={mentor?.name}
                      className="w-full"
                      size="lg"
                      variant="outline"
                    />
                  </div>
                </Card>

                {/* Social Links */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Connect
                  </h3>
                  <div className="flex space-x-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      Facebook
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Twitter
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      LinkedIn
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

            {/* Courses Section */}
            {courses && courses.length > 0 && (
              <div className="mt-12">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Courses by {mentor?.name}
                  </h2>
                  <p className="text-gray-600">
                    Explore courses created by this mentor
                  </p>
                </div>

                {coursesLoading ? (
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-80 bg-gray-200 rounded-lg animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course: any) => (
                      <Link
                        key={course.id}
                        href={`/manage/mentee/explore-courses/${course.slug}`}
                      >
                        <CourseCard course={course} />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Suspense>
    </>
  );
}
