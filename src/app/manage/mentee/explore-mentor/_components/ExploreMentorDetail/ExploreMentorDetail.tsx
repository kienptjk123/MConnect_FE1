"use client";

import { Suspense, useState } from "react";
import { useParams } from "next/navigation";
import { useMentorByUsername, useMentorCourses } from "@/queries/useMentor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Award,
  BookOpen,
  Clock,
  TrendingUp,
  Target,
  CheckCircle,
  ExternalLink,
  User,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import BookingModal from "@/app/manage/mentee/explore-mentor/_components/BookingModal/BookingModal";

// Fake data for better UI
const fakeReviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/images/default-avatar.png",
    rating: 5,
    comment:
      "Excellent mentor! Very knowledgeable and patient. Helped me understand complex algorithms.",
    date: "2 weeks ago",
  },
  {
    id: 2,
    name: "Mike Chen",
    avatar: "/images/default-avatar.png",
    rating: 5,
    comment:
      "Great session on system design. The mentor provided clear explanations and practical examples.",
    date: "1 month ago",
  },
  {
    id: 3,
    name: "Emily Davis",
    avatar: "/images/default-avatar.png",
    rating: 4,
    comment:
      "Very helpful with career advice. Got valuable insights about the tech industry.",
    date: "3 weeks ago",
  },
];

const fakeAchievements = [
  {
    id: 1,
    title: "Top Mentor 2024",
    description: "Recognized as one of the top mentors with highest ratings",
    icon: Award,
    date: "2024",
  },
  {
    id: 2,
    title: "1000+ Sessions Completed",
    description: "Successfully completed over 1000 mentoring sessions",
    icon: Users,
    date: "2024",
  },
  {
    id: 3,
    title: "Expert Badge - AI/ML",
    description:
      "Certified expert in Artificial Intelligence and Machine Learning",
    icon: Target,
    date: "2023",
  },
  {
    id: 4,
    title: "Community Contributor",
    description:
      "Active contributor to open source projects and tech community",
    icon: Globe,
    date: "2023",
  },
];

const fakeStats = {
  totalMentoringTime: 450,
  sessionsCompleted: 127,
  successRate: 98,
  responseTime: "< 2 hours",
};

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
    <div className="min-h-screen light:bg-white">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link
              href="/manage/mentee/explore-mentor"
              className="flex items-center light:text-gray-600 hover:text-blue-500"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Mentors
            </Link>
          </Button>
        </div>
      </div>

      <div className="relative light:bg-gradient-to-br from-sky-100 via-white to-blue-200 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden">
                <Image
                  src={mentor.avatar || "/images/default-avatar.png"}
                  alt={mentor.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                <div className="flex flex-col gap-2">
                  <h1 className="text-4xl lg:text-5xl font-bold light:text-gray-900 leading-tight">
                    {mentor.name}
                  </h1>
                  <p className="text-xl text-blue-600 font-medium">
                    {mentor.major}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium light:text-gray-700">
                        4.9 (127 reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 light:text-gray-500" />
                      <span className="text-sm light:text-gray-600">
                        {fakeStats.sessionsCompleted}+ sessions
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap my-auto gap-3">
                  <BookingModal
                    mentorId={mentor.id}
                    mentorName={mentor.name}
                    mentorAvatar={mentor.avatar}
                  >
                    <Button
                      size="lg"
                      className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-6"
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      Book Session
                    </Button>
                  </BookingModal>

                  <FriendRequestButton
                    targetUserId={mentorData.id}
                    targetUserName={mentor?.name}
                    size="lg"
                    variant="outline"
                    className="border-2 border-gray-200 hover:border-gray-300 light:text-gray-700 hover:bg-gray-50 px-6 py-6"
                  />
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                <div className="light:bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto mb-3 shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold light:text-gray-900 mb-1">
                    {fakeStats.totalMentoringTime} mins
                  </div>
                  <div className="text-sm light:text-gray-600">
                    Total mentoring time
                  </div>
                </div>

                <div className="light:bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mx-auto mb-3 shadow-lg">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold light:text-gray-900 mb-1">
                    {fakeStats.sessionsCompleted}
                  </div>
                  <div className="text-sm light:text-gray-600">
                    Sessions completed
                  </div>
                </div>

                <div className="light:bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mx-auto mb-3 shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold light:text-gray-900 mb-1">
                    {fakeStats.successRate}%
                  </div>
                  <div className="text-sm light:text-gray-600">
                    Success rate
                  </div>
                </div>

                <div className="light:bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl mx-auto mb-3 shadow-lg">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold light:text-gray-900 mb-1">
                    {fakeStats.responseTime}
                  </div>
                  <div className="text-sm light:text-gray-600">
                    Response time
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger
                  value="overview"
                  className="flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="flex items-center gap-2"
                >
                  <Star className="w-4 h-4" />
                  Reviews ({fakeReviews.length})
                </TabsTrigger>
                <TabsTrigger
                  value="achievements"
                  className="flex items-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  Achievements ({fakeAchievements.length})
                </TabsTrigger>
                <TabsTrigger
                  value="sessions"
                  className="flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Group sessions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">About Me</h2>
                  <div className="prose max-w-none">
                    <p className="light:text-gray-700 leading-relaxed mb-4">
                      {mentor.bio ||
                        "With over 15 years of robust experience in software engineering, cloud-native architecture, and AI/ML, I have a proven track record of leading complex transformation projects for esteemed organizations such as JPMorgan Chase, American Honda, and various U.S. Medicaid and Healthcare IT initiatives. Currently, I am expanding my expertise through a Postgraduate Program in Generative AI and Machine Learning at the Illinois Institute of Technology, with a keen focus on responsible AI, agentic..."}
                    </p>
                    {mentor.description && (
                      <p className="light:text-gray-700 leading-relaxed">
                        {mentor.description}
                      </p>
                    )}
                  </div>

                  {mentor.website && (
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="font-semibold mb-3">Links</h3>
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={mentor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visit Website
                        </a>
                      </Button>
                    </div>
                  )}
                </Card>

                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-6">Background</h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3 light:text-gray-600 uppercase text-sm tracking-wide">
                        Expertise
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                          Engineering
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3 light:text-gray-600 uppercase text-sm tracking-wide">
                        Disciplines
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">
                          Technical Product Management
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3 light:text-gray-600 uppercase text-sm tracking-wide">
                        Fluent in
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">English</Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                {fakeReviews.map((review) => (
                  <Card key={review.id} className="p-6">
                    <div className="flex items-start gap-4">
                      <Image
                        src={review.avatar}
                        alt={review.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{review.name}</h4>
                          <span className="text-sm light:text-gray-500">
                            {review.date}
                          </span>
                        </div>
                        <div className="flex items-center mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "light:text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="light:text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="achievements" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fakeAchievements.map((achievement) => (
                    <Card key={achievement.id} className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <achievement.icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">
                            {achievement.title}
                          </h4>
                          <p className="light:text-gray-600 text-sm mb-2">
                            {achievement.description}
                          </p>
                          <span className="text-xs light:text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {achievement.date}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="sessions">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Group Sessions</h2>
                  <p className="light:text-gray-600">
                    No group sessions available at the moment.
                  </p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - 1 column */}
          <div className="space-y-6">
            {(mentor.phoneNumber || mentor.website || mentorData.email) && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  {mentorData.email && (
                    <div className="flex items-center gap-3 light:text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{mentorData.email}</span>
                    </div>
                  )}
                  {mentor.phoneNumber && (
                    <div className="flex items-center gap-3 light:text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{mentor.phoneNumber}</span>
                    </div>
                  )}
                  {mentor.website && (
                    <div className="flex items-center gap-3 light:text-gray-600">
                      <Globe className="w-4 h-4" />
                      <a
                        href={mentor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline"
                      >
                        Website
                      </a>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          {courses && courses.length > 0 && (
            <div className="mt-12">
              <div className="mb-8">
                <h2 className="text-2xl font-bold light:text-gray-900 mb-2">
                  Courses by {mentor?.name}
                </h2>
                <p className="light:text-gray-600">
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
    </div>
  );
}
