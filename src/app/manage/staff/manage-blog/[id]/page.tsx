"use client";

import React from "react";
import { useBlogByIdQuery } from "@/queries/useBlog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  FileText,
  Calendar,
  User,
  Tag,
  Edit,
  ImageIcon,
  Clock,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function BlogDetailPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = parseInt(params.id as string);

  const { data: blogData, isLoading } = useBlogByIdQuery(blogId, !!blogId);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-400 border-t-transparent"></div>
            Loading blog details...
          </div>
        </div>
      </div>
    );
  }

  if (!blogData?.payload?.data) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700">Blog not found</p>
            <p className="text-sm text-gray-500 mb-4">
              The blog you're looking for doesn't exist.
            </p>
            <Button
              onClick={() => router.push("/manage/staff/manage-blog")}
              className="mt-4"
            >
              Back to Blogs
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const blog = blogData.payload.data;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-blue-500 p-2 text-white">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Blog Details</h1>
              <p className="text-sm text-gray-600">
                View blog post information
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={() =>
            router.push(`/manage/staff/manage-blog/${blog.id}/edit`)
          }
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
        >
          <Edit className="h-4 w-4" />
          Edit Blog
        </Button>
      </div>

      <div className="space-y-6">
        {/* Main Blog Card */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="bg-gray-50 border-b">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold text-gray-900 leading-tight">
                  {blog.title}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(blog.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Published</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Featured Image */}
            {blog.image && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <ImageIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Featured Image
                  </span>
                </div>
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}

            {/* Content */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Content
                </span>
              </div>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {blog.content}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metadata Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Author Information */}
          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="bg-gray-50 border-b pb-3">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <User className="h-5 w-5" />
                Author Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  {blog.staff.avatar ? (
                    <img
                      src={blog.staff.avatar}
                      alt={blog.staff.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-medium text-blue-600">
                      {blog.staff.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{blog.staff.name}</p>
                  <p className="text-sm text-gray-600">
                    Staff ID: {blog.staff.id}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="bg-gray-50 border-b pb-3">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Tags ({blog.tags.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {blog.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((blogTag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                    >
                      {blogTag.tag.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No tags assigned</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Technical Details */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="bg-gray-50 border-b pb-3">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Technical Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Blog ID:</span>
                <p className="text-gray-600">#{blog.id}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Staff ID:</span>
                <p className="text-gray-600">#{blog.staffId}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Publish Date:</span>
                <p className="text-gray-600">
                  {new Date(blog.date).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
