"use client";

import MentorCard from "@/app/manage/mentee/explore-mentor/_components/MentorCard/MentorCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMentors } from "@/queries/useMentor";
import { MentorType } from "@/schemaValidations/mentor.schema";
import { Search, Filter } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ExploreMentors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { data, isLoading, error } = useMentors();

  const handleStatusChange = (value: string) => {
    setStatusFilter(value === "all" ? "" : value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const searchMentors = (mentors: MentorType[], query: string) => {
    if (!query.trim()) return mentors;
    return mentors.filter(
      (mentor) =>
        mentor?.name?.toLowerCase().includes(query.toLowerCase().trim()) ||
        mentor?.username?.toLowerCase().includes(query.toLowerCase().trim()) ||
        mentor?.location?.toLowerCase().includes(query.toLowerCase().trim())
    );
  };

  const filterMentors = (mentors: MentorType[], status: string) => {
    if (!status) return mentors;
    return mentors.filter((mentor) => mentor.status === status);
  };

  const sortMentors = (mentors: MentorType[], sortType: string) => {
    const sortedMentors = [...mentors];

    switch (sortType) {
      case "name":
        return sortedMentors.sort(
          (a, b) => a?.name?.localeCompare(b?.name || "") || 0
        );
      case "username":
        return sortedMentors.sort(
          (a, b) => a?.username?.localeCompare(b?.username || "") || 0
        );
      case "recent":
        return sortedMentors.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      default:
        return sortedMentors;
    }
  };

  const allMentors = data?.payload.result || [];
  const searchedMentors = searchMentors(allMentors, searchQuery);
  const filteredMentors = filterMentors(searchedMentors, statusFilter);
  const sortedMentors = sortMentors(filteredMentors, sortBy);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMentors = sortedMentors.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedMentors.length / itemsPerPage);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600">
            Failed to load mentors. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black max-w-7xl mx-auto p-6">
      <div className="z-10">
        <div className="">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold light:text-gray-900 mb-2">
              Explore Mentors
            </h1>
            <p className="light:text-gray-600 text-sm sm:text-base">
              Discover amazing courses from experienced mentors
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search mentors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 dark:text-gray-600" />
                <span className="text-sm font-medium dark:text-gray-600">
                  Status:
                </span>
                <Select value={statusFilter} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="VERIFIED">Verified</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium dark:text-gray-600">
                  Sort by:
                </span>
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="username">Username</SelectItem>
                    <SelectItem value="recent">Recent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        {isLoading && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-80 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        )}

        {!isLoading && paginatedMentors.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold dark:text-gray-900 mb-2">
              No mentors found
            </h3>
            <p className="dark:text-gray-600">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}

        {!isLoading && paginatedMentors.length > 0 && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {paginatedMentors.map((mentor) => (
              <Link
                key={mentor.id}
                href={`/manage/mentee/explore-mentor/${
                  mentor?.username || mentor?.id
                }`}
              >
                <MentorCard mentor={mentor} />
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-md border disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-md border ${
                  currentPage === page
                    ? "bg-blue-600 text-white border-blue-600"
                    : "hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-md border disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
