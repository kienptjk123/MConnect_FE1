"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Globe,
  Mail,
  MessageCircle,
  Phone,
  Star,
  Target,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { useMentorByUsername } from "@/queries/useMentor";
import BookingModal from "@/app/manage/mentee/explore-mentor/_components/BookingModal/BookingModal";
import { FriendRequestButton } from "@/components/FriendRequestButton/FriendRequestButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// =================== Fake Data ===================
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

// =================== Component ===================
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

  // ✅ Không return sớm — tránh thay đổi thứ tự hook
  return (
    <div className="min-h-screen">
      {/* ===== Loading ===== */}
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        // ===== Error =====
        <div className="flex items-center justify-center h-screen">
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
      ) : !mentor ? (
        // ===== No Mentor Found =====
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-600 mb-4">
              Mentor not found
            </h1>
            <Button asChild>
              <Link href="/manage/mentee/explore-mentor">Back to Mentors</Link>
            </Button>
          </div>
        </div>
      ) : (
        // ===== Main Content =====
        <div className="light:bg-white">
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
                {/* Avatar */}
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

                {/* Info */}
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

                    {/* Actions */}
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

                  {/* Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                    {[
                      {
                        label: "Total mentoring time",
                        value: `${fakeStats.totalMentoringTime} mins`,
                        icon: Clock,
                        color: "from-blue-500 to-blue-600",
                      },
                      {
                        label: "Sessions completed",
                        value: fakeStats.sessionsCompleted,
                        icon: Star,
                        color: "from-green-500 to-green-600",
                      },
                      {
                        label: "Success rate",
                        value: `${fakeStats.successRate}%`,
                        icon: TrendingUp,
                        color: "from-purple-500 to-purple-600",
                      },
                      {
                        label: "Response time",
                        value: fakeStats.responseTime,
                        icon: MessageCircle,
                        color: "from-orange-500 to-orange-600",
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="light:bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200"
                      >
                        <div
                          className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl mx-auto mb-3 shadow-lg`}
                        >
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold light:text-gray-900 mb-1">
                          {stat.value}
                        </div>
                        <div className="text-sm light:text-gray-600">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="overview">
                  <User className="w-4 h-4 mr-2" /> Overview
                </TabsTrigger>
                <TabsTrigger value="reviews">
                  <Star className="w-4 h-4 mr-2" /> Reviews (
                  {fakeReviews.length})
                </TabsTrigger>
                <TabsTrigger value="achievements">
                  <Award className="w-4 h-4 mr-2" /> Achievements (
                  {fakeAchievements.length})
                </TabsTrigger>
                <TabsTrigger value="sessions">
                  <Calendar className="w-4 h-4 mr-2" /> Sessions
                </TabsTrigger>
              </TabsList>

              {/* Overview */}
              <TabsContent value="overview">
                <Card className="p-6 space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">About Me</h2>
                    <p className="light:text-gray-700 leading-relaxed mb-4">
                      {mentor.bio ||
                        "With over 15 years of experience in software engineering and AI/ML, I have a proven track record of leading projects for top organizations."}
                    </p>
                    {mentor.description && (
                      <p className="light:text-gray-700 leading-relaxed">
                        {mentor.description}
                      </p>
                    )}
                  </div>

                  {mentor.website && (
                    <div className="pt-6 border-t">
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
              </TabsContent>

              {/* Reviews */}
              <TabsContent value="reviews" className="space-y-4">
                {fakeReviews.map((r) => (
                  <Card key={r.id} className="p-6">
                    <div className="flex items-start gap-4">
                      <Image
                        src={r.avatar}
                        alt={r.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-semibold">{r.name}</h4>
                          <span className="text-sm light:text-gray-500">
                            {r.date}
                          </span>
                        </div>
                        <div className="flex items-center mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < r.rating
                                  ? "text-yellow-400 fill-current"
                                  : "light:text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="light:text-gray-700">{r.comment}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              {/* Achievements */}
              <TabsContent value="achievements" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fakeAchievements.map((a) => (
                    <Card key={a.id} className="p-6 flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <a.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{a.title}</h4>
                        <p className="light:text-gray-600 text-sm mb-2">
                          {a.description}
                        </p>
                        <span className="text-xs light:text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {a.date}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Sessions */}
              <TabsContent value="sessions">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Group Sessions</h2>
                  <p className="light:text-gray-600">
                    No group sessions available at the moment.
                  </p>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Sidebar */}
            <div className="mt-10">
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
          </div>
        </div>
      )}
    </div>
  );
}
