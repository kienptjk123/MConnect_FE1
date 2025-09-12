"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { toast } from "@/components/ui/use-toast";
import {
  formatDateTimeToLocaleString,
  formatDateToLocaleString,
} from "@/lib/utils";
import Link from "next/link";
import blogApiRequest from "@/apiRequests/blog";
import tagApiRequest from "@/apiRequests/tag";
import { BlogResType } from "@/schemaValidations/blog.schema";
import { TagResType } from "@/schemaValidations/tag.schema";
import { Button } from "@/components/ui/button";
import BreadcrumbTitle from "@/components/BreadCrumb/BreadcrumbTitle";

export default function BlogForm() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsData, setBlogsData] = useState<BlogResType | null>(null);
  const [tagsData, setTagsData] = useState<TagResType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const formatDateSidebar = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const POSTS_PER_PAGE = 4;

  // Fetch blogs data
  const fetchBlogs = async () => {
    try {
      const response = await blogApiRequest.getBlogs();
      setBlogsData(response.payload);
    } catch (err: any) {
      console.error("Error fetching blogs:", err);
      const errorMessage = err?.payload?.message || "Unable to load blog list";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Fetch tags data
  const fetchTags = async () => {
    try {
      const response = await tagApiRequest.getTags();
      setTagsData(response.payload);
    } catch (err: any) {
      console.error("Error fetching tags:", err);
      const errorMessage = err?.payload?.message || "Unable to load tag list";
      setError(errorMessage);
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        await Promise.all([fetchBlogs(), fetchTags()]);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter and search blogs
  const filteredBlogs = useMemo(() => {
    if (!blogsData?.data) return [];

    let filtered = blogsData.data;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter((blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected tag
    if (selectedTagId) {
      filtered = filtered.filter((blog) =>
        blog.tags.some((blogTag) => blogTag.tag.id === selectedTagId)
      );
    }

    return filtered;
  }, [blogsData?.data, searchTerm, selectedTagId]);

  // Pagination
  const totalPages = Math.ceil(filteredBlogs.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentBlogs = filteredBlogs.slice(startIndex, endIndex);

  // Reset page when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleTagSelect = (tagId: number | null) => {
    setSelectedTagId(tagId);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    Promise.all([fetchBlogs(), fetchTags()]).finally(() => {
      setLoading(false);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg font-semibold">Error</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
          <button
            onClick={handleRetry}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!blogsData?.data?.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <p className="text-lg font-semibold">Can not find any blog</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center ">
      <div className="container mx-auto px-4 md:px-16 lg:px-48 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Blog Posts */}
            <div className="space-y-8">
              {currentBlogs.length > 0 ? (
                currentBlogs.map((blog) => (
                  <article key={blog.id} className="">
                    {/* Image */}
                    <figure className="relative overflow-hidden rounded-sm ring-1 ring-gray-200">
                      <div className="aspect-[16/9] w-full">
                        <Image
                          src={blog.image || "/placeholder-image.jpg"}
                          alt={blog.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          sizes="(min-width: 1024px) 900px, 100vw"
                          priority={false}
                        />
                      </div>
                    </figure>

                    {/* Body */}
                    <div className="mt-4">
                      <div className="mb-4 flex flex-wrap items-center gap-6 text-sm text-[#333931] font-medium">
                        <span className="inline-flex items-center gap-1">
                          {/* calendar */}
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 11 13"
                            fill="none"
                          >
                            <path
                              d="M0 11.6406V5.26562H10.5V11.6406C10.5 11.9531 10.3906 12.2188 10.1719 12.4375C9.95312 12.6562 9.6875 12.7656 9.375 12.7656H1.125C0.8125 12.7656 0.546875 12.6562 0.328125 12.4375C0.109375 12.2188 0 11.9531 0 11.6406ZM7.5 7.04688V7.98438C7.5 8.17188 7.59375 8.26562 7.78125 8.26562H8.71875C8.90625 8.26562 9 8.17188 9 7.98438V7.04688C9 6.85938 8.90625 6.76562 8.71875 6.76562H7.78125C7.59375 6.76562 7.5 6.85938 7.5 7.04688ZM7.5 10.0469V10.9844C7.5 11.1719 7.59375 11.2656 7.78125 11.2656H8.71875C8.90625 11.2656 9 11.1719 9 10.9844V10.0469C9 9.85938 8.90625 9.76562 8.71875 9.76562H7.78125C7.59375 9.76562 7.5 9.85938 7.5 10.0469ZM4.5 7.04688V7.98438C4.5 8.17188 4.59375 8.26562 4.78125 8.26562H5.71875C5.90625 8.26562 6 8.17188 6 7.98438V7.04688C6 6.85938 5.90625 6.76562 5.71875 6.76562H4.78125C4.59375 6.76562 4.5 6.85938 4.5 7.04688ZM4.5 10.0469V10.9844C4.5 11.1719 4.59375 11.2656 4.78125 11.2656H5.71875C5.90625 11.26562 6 11.1719 6 10.9844V10.0469C6 9.85938 5.90625 9.76562 5.71875 9.76562H4.78125C4.59375 9.76562 4.5 9.85938 4.5 10.0469ZM1.5 7.04688V7.98438C1.5 8.17188 1.59375 8.26562 1.78125 8.26562H2.71875C2.90625 8.26562 3 8.17188 3 7.98438V7.04688C3 6.85938 2.90625 6.76562 2.71875 6.76562H1.78125C1.59375 6.76562 1.5 6.85938 1.5 7.04688ZM1.5 10.0469V10.9844C1.5 11.1719 1.59375 11.2656 1.78125 11.2656H2.71875C2.90625 11.2656 3 11.1719 3 10.9844V10.0469C3 9.85938 2.90625 9.76562 2.71875 9.76562H1.78125C1.59375 9.76562 1.5 9.85938 1.5 10.0469ZM9.375 2.26562C9.6875 2.26562 9.95312 2.375 10.1719 2.59375C10.3906 2.8125 10.5 3.07813 10.5 3.39062V4.51562H0V3.39062C0 3.07813 0.109375 2.8125 0.328125 2.59375C0.546875 2.375 0.8125 2.26562 1.125 2.26562H2.25V1.14062C2.25 1.03125 2.28125 0.945313 2.34375 0.882812C2.42188 0.804688 2.51562 0.765625 2.625 0.765625H3.375C3.48438 0.765625 3.57031 0.804688 3.63281 0.882812C3.71094 0.945313 3.75 1.03125 3.75 1.14062V2.26562H6.75V1.14062C6.75 1.03125 6.78125 0.945313 6.84375 0.882812C6.92188 0.804688 7.01562 0.765625 7.125 0.765625H7.875C7.98438 0.765625 8.07031 0.804688 8.13281 0.882812C8.21094 0.945313 8.25 1.03125 8.25 1.14062V2.26562H9.375Z"
                              fill="#FC6441"
                            />
                          </svg>
                          {formatDateToLocaleString(blog.date)}
                        </span>

                        <span className="inline-flex items-center gap-1">
                          {/* user */}
                          <svg
                            width="12"
                            height="13"
                            viewBox="0 0 12 13"
                            fill="none"
                          >
                            <path
                              d="M8.02441 5.89844C7.44629 6.47656 6.74316 6.76562 5.91504 6.76562C5.08691 6.76562 4.37598 6.47656 3.78223 5.89844C3.2041 5.30469 2.91504 4.59375 2.91504 3.76562C2.91504 2.9375 3.2041 2.23438 3.78223 1.65625C4.37598 1.0625 5.08691 0.765625 5.91504 0.765625C6.74316 0.765625 7.44629 1.0625 8.02441 1.65625C8.61816 2.23438 8.91504 2.9375 8.91504 3.76562C8.91504 4.59375 8.61816 5.30469 8.02441 5.89844ZM8.02441 7.51562C8.88379 7.51562 9.61816 7.82812 10.2275 8.45312C10.8525 9.0625 11.165 9.79688 11.165 10.6562V11.6406C11.165 11.9531 11.0557 12.2188 10.8369 12.4375C10.6182 12.6562 10.3525 12.7656 10.04 12.7656H1.79004C1.47754 12.7656 1.21191 12.6562 0.993164 12.4375C0.774414 12.2188 0.665039 11.9531 0.665039 11.6406V10.6562C0.665039 9.79688 0.969727 9.0625 1.5791 8.45312C2.2041 7.82812 2.94629 7.51562 3.80566 7.51562H4.2041C4.75098 7.76562 5.32129 7.89062 5.91504 7.89062C6.50879 7.89062 7.0791 7.76562 7.62598 7.51562H8.02441Z"
                              fill="#FC6441"
                            />
                          </svg>
                          {blog.staff.name}
                        </span>
                      </div>

                      {/* Tags */}
                      {blog.tags.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-2">
                          {blog.tags.map((blogTag) => (
                            <span
                              key={blogTag.tag.id}
                              className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                            >
                              {blogTag.tag.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Title */}
                      <Link href={`/blog/${blog.id}`}>
                        <h2 className="mb-4 text-2xl font-bold leading-tight text-slate-900 transition-colors hover:text-slate-800 line-clamp-2">
                          {blog.title}
                        </h2>
                      </Link>

                      {/* CTA */}
                      <Link
                        href={`/blog/${blog.id}`}
                        className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3 font-medium text-white shadow-sm hover:shadow-lg transition-shadow"
                      >
                        Read More
                        <span className="grid h-6 w-6 place-content-center rounded-full ">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                          >
                            <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                          </svg>
                        </span>
                      </Link>
                    </div>
                  </article>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg font-semibold">No blogs found</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-20 flex justify-start items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-sm bg-white border border-gray-300 text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow hover:cursor-pointer"
                >
                  Pre
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-sm font-semibold transition-all shadow hover:cursor-pointer ${
                        currentPage === page
                          ? "bg-[#704FE6] text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-purple-50 hover:text-purple-600 "
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className=" px-4 py-2 rounded-sm bg-white border border-gray-300 text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow hover:cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-3">
            {/* Search Box */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full px-4 py-3 pr-12 border bg-white border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="text-black"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Popular Tags */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-slate-800 uppercase tracking-wide">
                SERVICE CATEGORY
              </h3>

              <ul className="space-y-2 max-h-[420px] overflow-auto">
                {[
                  { id: null, name: "All Services" },
                  ...(tagsData?.data?.slice(0, 5) || []),
                ].map((tag) => {
                  const active = selectedTagId === tag.id;
                  return (
                    <li key={tag.id ?? "all"}>
                      <button
                        onClick={() => handleTagSelect(tag.id ?? null)}
                        className={`w-full flex items-center justify-between rounded-sm px-4 py-3 border transition-all hover:cursor-pointer
                ${
                  active
                    ? "bg-[#7768E5] text-white border-transparent shadow-sm"
                    : "bg-white text-slate-700 border-gray-200 hover:border-violet-300 hover:text-slate-900"
                }`}
                      >
                        <span className="truncate">{tag.name}</span>
                        <span className="grid h-4 w-4 place-content-center rounded-full ">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                          >
                            <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                          </svg>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Recent Posts */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-slate-800 uppercase tracking-wide">
                RECENT POST
              </h3>

              <ul className="divide-y divide-gray-200">
                {blogsData?.data?.slice(0, 5).map((blog) => (
                  <li key={blog.id}>
                    <Link
                      href={`/blog/${blog.id}`}
                      className="flex gap-3 items-center py-4 -mx-2 px-2 hover:bg-gray-50 rounded-xl transition"
                    >
                      <div className="relative h-16 w-16 rounded-xs overflow-hidden ring-1 ring-gray-200 flex-shrink-0">
                        <Image
                          src={blog.image || "/placeholder-image.jpg"}
                          alt={blog.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 11 13"
                            fill="none"
                          >
                            <path
                              d="M0 11.6406V5.26562H10.5V11.6406C10.5 11.9531 10.3906 12.2188 10.1719 12.4375C9.95312 12.6562 9.6875 12.7656 9.375 12.7656H1.125C0.8125 12.7656 0.546875 12.6562 0.328125 12.4375C0.109375 12.2188 0 11.9531 0 11.6406ZM7.5 7.04688V7.98438C7.5 8.17188 7.59375 8.26562 7.78125 8.26562H8.71875C8.90625 8.26562 9 8.17188 9 7.98438V7.04688C9 6.85938 8.90625 6.76562 8.71875 6.76562H7.78125C7.59375 6.76562 7.5 6.85938 7.5 7.04688ZM7.5 10.0469V10.9844C7.5 11.1719 7.59375 11.2656 7.78125 11.2656H8.71875C8.90625 11.2656 9 11.1719 9 10.9844V10.0469C9 9.85938 8.90625 9.76562 8.71875 9.76562H7.78125C7.59375 9.76562 7.5 9.85938 7.5 10.0469ZM4.5 7.04688V7.98438C4.5 8.17188 4.59375 8.26562 4.78125 8.26562H5.71875C5.90625 8.26562 6 8.17188 6 7.98438V7.04688C6 6.85938 5.90625 6.76562 5.71875 6.76562H4.78125C4.59375 6.76562 4.5 6.85938 4.5 7.04688ZM4.5 10.0469V10.9844C4.5 11.1719 4.59375 11.2656 4.78125 11.2656H5.71875C5.90625 11.26562 6 11.1719 6 10.9844V10.0469C6 9.85938 5.90625 9.76562 5.71875 9.76562H4.78125C4.59375 9.76562 4.5 9.85938 4.5 10.0469ZM1.5 7.04688V7.98438C1.5 8.17188 1.59375 8.26562 1.78125 8.26562H2.71875C2.90625 8.26562 3 8.17188 3 7.98438V7.04688C3 6.85938 2.90625 6.76562 2.71875 6.76562H1.78125C1.59375 6.76562 1.5 6.85938 1.5 7.04688ZM1.5 10.0469V10.9844C1.5 11.1719 1.59375 11.2656 1.78125 11.2656H2.71875C2.90625 11.2656 3 11.1719 3 10.9844V10.0469C3 9.85938 2.90625 9.76562 2.71875 9.76562H1.78125C1.59375 9.76562 1.5 9.85938 1.5 10.0469ZM9.375 2.26562C9.6875 2.26562 9.95312 2.375 10.1719 2.59375C10.3906 2.8125 10.5 3.07813 10.5 3.39062V4.51562H0V3.39062C0 3.07813 0.109375 2.8125 0.328125 2.59375C0.546875 2.375 0.8125 2.26562 1.125 2.26562H2.25V1.14062C2.25 1.03125 2.28125 0.945313 2.34375 0.882812C2.42188 0.804688 2.51562 0.765625 2.625 0.765625H3.375C3.48438 0.765625 3.57031 0.804688 3.63281 0.882812C3.71094 0.945313 3.75 1.03125 3.75 1.14062V2.26562H6.75V1.14062C6.75 1.03125 6.78125 0.945313 6.84375 0.882812C6.92188 0.804688 7.01562 0.765625 7.125 0.765625H7.875C7.98438 0.765625 8.07031 0.804688 8.13281 0.882812C8.21094 0.945313 8.25 1.03125 8.25 1.14062V2.26562H9.375Z"
                              fill="#FC6441"
                            />
                          </svg>
                          <span>{formatDateSidebar(blog.date)}</span>
                        </div>

                        <h4 className="text-sm font-semibold leading-snug text-slate-900 line-clamp-2 hover:text-violet-600 transition-colors">
                          {blog.title}
                        </h4>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
