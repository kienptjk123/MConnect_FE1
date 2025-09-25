"use client";

import BlogTable from "@/app/manage/staff/manage-blog/blog-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useBlogsQuery } from "@/queries/useBlog";
import { FileText, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BlogForm() {
  const router = useRouter();
  const { data, isLoading, isError } = useBlogsQuery();
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
                Blog Management
              </CardTitle>
              <p className="text-sm opacity-90">
                Manage your blog posts efficiently
              </p>
            </div>
          </div>

          <Button
            onClick={() => router.push("/manage/staff/manage-blog/create")}
            className="gap-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white border border-white/20"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            <span className="font-medium">New Blog</span>
          </Button>
        </CardHeader>

        <Separator />
        <CardContent className="p-6">
          {isLoading && (
            <div className="py-16 text-center">
              <div className="inline-flex items-center gap-3 text-gray-600">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent"></div>
                Loading blogs...
              </div>
            </div>
          )}
          {isError && (
            <div className="py-16 text-center">
              <div className="inline-flex flex-col items-center gap-3 text-red-600">
                <div className="rounded-md bg-red-50 p-3">
                  <FileText className="h-5 w-5" />
                </div>
                <span>Failed to load blogs. Please try again.</span>
              </div>
            </div>
          )}
          {Array.isArray(data?.payload?.data) && (
            <BlogTable data={data.payload.data} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
