"use client";

import React, { useEffect, useState } from "react";
import {
  useProfile,
  useProfileLoading,
  useFetchProfile,
} from "@/stores/profileStore";
import {
  Search,
  Bell,
  Mail,
  MoreVertical,
  Play,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function MenteeDashboard() {
  const [currentDate] = useState(
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search your course here...."
                  className="pl-10 bg-gray-50 border-gray-200"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarImage src="/professional-avatar.png" />
                <AvatarFallback>P</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Section */}
              <Card className="bg-blue-500 border-0 text-white overflow-hidden relative">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <Badge
                      variant="secondary"
                      className="bg-white/20 text-white border-0"
                    >
                      ONLINE COURSE
                    </Badge>
                  </div>
                  <h1 className="text-3xl font-bold mb-4 text-balance">
                    Sharpen Your Skills With Professional Online Courses
                  </h1>
                  <Button className="bg-blue-600 text-white hover:bg-blue-700">
                    <span className="mr-2">Join Now</span>
                  </Button>
                  {/* Decorative star */}
                  <div className="absolute top-8 right-8 text-white/30">
                    <Star className="h-16 w-16 fill-current" />
                  </div>
                </CardContent>
              </Card>

              {/* Course Progress Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { watched: 2, total: 8, progress: 25 },
                  { watched: 2, total: 8, progress: 25 },
                  { watched: 2, total: 8, progress: 25 },
                ].map((course, i) => (
                  <Card key={i} className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                            <Play className="h-4 w-4 text-blue-primary" />
                          </div>
                          <span className="text-sm text-gray-500">
                            {course.watched}/{course.total} Watched
                          </span>
                        </div>
                        <MoreVertical className="h-4 w-4 text-gray-400" />
                      </div>
                      <h3 className="font-semibold text-sm mb-3">
                        Product Design
                      </h3>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-primary h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Continue Watching */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Continue Watching</h2>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      title:
                        "Beginner's Guide To Becoming A Professional Frontend Developer",
                      category: "FRONTEND",
                      instructor: "Prashant Kumar Singh",
                      role: "Software Developer",
                      image:
                        "https://mconnectv1.s3.ap-southeast-1.amazonaws.com/thumbnailImages/Screenshot+2025-09-28+124534.png",
                      progress: 65,
                    },
                    {
                      title:
                        "Beginner's Guide To Becoming A Professional Frontend Developer",
                      category: "FRONTEND",
                      instructor: "Prashant Kumar Singh",
                      role: "Software Developer",
                      image:
                        "https://mconnectv1.s3.ap-southeast-1.amazonaws.com/thumbnailImages/Screenshot+2025-09-28+124534.png",
                      progress: 40,
                    },
                    {
                      title:
                        "Beginner's Guide To Becoming A Professional Frontend Developer",
                      category: "FRONTEND",
                      instructor: "Prashant Kumar Singh",
                      role: "Software Developer",
                      image:
                        "https://mconnectv1.s3.ap-southeast-1.amazonaws.com/thumbnailImages/Screenshot+2025-09-28+124534.png",
                      progress: 80,
                    },
                  ].map((course, i) => (
                    <Card key={i} className="bg-white overflow-hidden">
                      <div className="aspect-video bg-gray-100 relative">
                        <img
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                        <Button
                          size="icon"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-600"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardContent className="p-4 relative">
                        <Badge
                          variant="secondary"
                          className="mb-2 text-xs bg-blue-100 text-blue-primary"
                        >
                          {course.category}
                        </Badge>
                        <h3 className="font-semibold text-sm mb-3 line-clamp-2">
                          {course.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src="/instructor-avatar.png" />
                            <AvatarFallback>PK</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs font-medium">
                              {course.instructor}
                            </p>
                            <p className="text-xs text-gray-500">
                              {course.role}
                            </p>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                          <div
                            className="h-full bg-blue-primary transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Your Mentor */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Your Mentor</h2>
                  <Button variant="link" className="text-blue-primary">
                    See All
                  </Button>
                </div>

                <Card className="bg-white">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">
                              INSTRUCTOR NAME & DATE
                            </th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">
                              COURSE TYPE
                            </th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">
                              COURSE TITLE
                            </th>
                            <th className="text-left p-4 text-sm font-medium text-gray-500">
                              ACTIONS
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            {
                              name: "Prashant Kumar Singh",
                              date: "25/2/2023",
                              type: "FRONTEND",
                              title: "Understanding Concept Of React",
                            },
                            {
                              name: "Ravi Kumar",
                              date: "25/2/2023",
                              type: "FRONTEND",
                              title: "Understanding Concept Of React",
                            },
                          ].map((mentor, i) => (
                            <tr key={i} className="border-t border-gray-100">
                              <td className="p-4">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src="/mentor-avatar.jpg" />
                                    <AvatarFallback>
                                      {mentor.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium text-sm">
                                      {mentor.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {mentor.date}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <Badge
                                  variant="secondary"
                                  className="bg-blue-100 text-blue-primary text-xs"
                                >
                                  {mentor.type}
                                </Badge>
                              </td>
                              <td className="p-4 text-sm">{mentor.title}</td>
                              <td className="p-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-blue-primary border-blue-primary bg-transparent"
                                >
                                  SHOW DETAILS
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Column - Sidebar Content */}
            <div className="space-y-6">
              {/* User Greeting */}
              <Card className="bg-white">
                <CardContent className="p-6 text-center">
                  <Avatar className="h-16 w-16 mx-auto mb-4">
                    <AvatarImage src="/student-avatar-sunglasses.jpg" />
                    <AvatarFallback>P</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold mb-1">Good Morning Prashant</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Continue Your Journey And Achieve Your Target
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Bell className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Today's Schedule */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Today</h3>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ChevronLeft className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <Card className="bg-white overflow-hidden">
                  <div className="aspect-video bg-gray-100 relative">
                    <img
                      src="https://mconnectv1.s3.ap-southeast-1.amazonaws.com/thumbnailImages/Screenshot+2025-09-28+124534.png"
                      alt="UX Design Course"
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 left-2 bg-white text-gray-700">
                      Beginner
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">
                      UX Design : How To Implement Usability Testing
                    </h4>
                    <p className="text-sm text-gray-500 mb-3">
                      Alfredo Rhiel Madsen
                    </p>

                    <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>500 Student</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Play className="h-3 w-3" />
                        <span>5 Modul</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>1h 30m</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">5 Module</h5>
                        <span className="text-sm text-gray-500">0/5 Done</span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div
                          className="bg-blue-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: "0%" }}
                        ></div>
                      </div>

                      {[
                        {
                          number: 1,
                          title: "Introduction",
                          duration: "10:00",
                          completed: false,
                        },
                        {
                          number: 2,
                          title: "What is UX Design",
                          duration: "10:00",
                          completed: false,
                        },
                        {
                          number: 3,
                          title: "Usability Testing",
                          duration: "10:00",
                          completed: false,
                        },
                        {
                          number: 4,
                          title: "Create Usability Test",
                          duration: "30:00",
                          completed: false,
                        },
                      ].map((module) => (
                        <div
                          key={module.number}
                          className="flex items-center justify-between py-2"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${
                                module.completed
                                  ? "bg-blue-primary border-blue-primary text-white"
                                  : "border-gray-300 text-gray-500"
                              }`}
                            >
                              {module.completed ? "✓" : module.number}
                            </div>
                            <span
                              className={`text-sm ${
                                module.completed
                                  ? "text-gray-900"
                                  : "text-gray-600"
                              }`}
                            >
                              {module.title}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {module.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
