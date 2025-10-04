"use client";

import WorkExpPackageCard from "@/app/manage/mentee/explore-work-exp-pkg/_components/WorkExpPackageCard/WorkExpPackageCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkExpPackages } from "@/queries/useWorkExpPackage";
import { WorkExperiencePackage } from "@/schemaValidations/work-exp-package.schema";
import { Search, Filter, Calendar, Package } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ExploreWorkExp() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [packageTypeFilter, setPackageTypeFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("title");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { data, isLoading, error } = useWorkExpPackages();

  const handleStatusChange = (value: string) => {
    setStatusFilter(value === "all" ? "" : value);
    setCurrentPage(1);
  };

  const handlePackageTypeChange = (value: string) => {
    setPackageTypeFilter(value === "all" ? "" : value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const searchPackages = (packages: WorkExperiencePackage[], query: string) => {
    if (!query.trim()) return packages;
    return packages.filter(
      (pkg) =>
        pkg.title?.toLowerCase().includes(query.toLowerCase().trim()) ||
        pkg.description?.toLowerCase().includes(query.toLowerCase().trim()) ||
        pkg.skills?.some((skill) =>
          skill.toLowerCase().includes(query.toLowerCase().trim())
        ) ||
        pkg.mentorProfile?.name
          ?.toLowerCase()
          .includes(query.toLowerCase().trim())
    );
  };

  const filterPackages = (
    packages: WorkExperiencePackage[],
    status: string,
    packageType: string
  ) => {
    let filtered = packages;

    if (status) {
      filtered = filtered.filter((pkg) => pkg.status === status);
    }

    if (packageType) {
      filtered = filtered.filter((pkg) => pkg.packageType === packageType);
    }

    return filtered;
  };

  const sortPackages = (
    packages: WorkExperiencePackage[],
    sortType: string
  ) => {
    const sortedPackages = [...packages];

    switch (sortType) {
      case "title":
        return sortedPackages.sort((a, b) => a.title.localeCompare(b.title));
      case "price":
        return sortedPackages.sort((a, b) => a.price - b.price);
      case "duration":
        return sortedPackages.sort((a, b) => a.duration - b.duration);
      case "recent":
        return sortedPackages.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return sortedPackages;
    }
  };

  const allPackages = data?.payload?.data?.packages || [];

  const searchedPackages = searchPackages(allPackages, searchQuery);
  const filteredPackages = filterPackages(
    searchedPackages,
    statusFilter,
    packageTypeFilter
  );
  const sortedPackages = sortPackages(filteredPackages, sortBy);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPackages = sortedPackages.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedPackages.length / itemsPerPage);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600">
            Failed to load work experience packages. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black max-w-7xl mx-auto p-6">
      <div className="z-10">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold light:text-gray-900 mb-2">
                Explore Work Experience Packages
              </h1>
              <p className="light:text-gray-600 text-sm sm:text-base">
                Discover hands-on work experience opportunities from expert
                mentors
              </p>
            </div>

            <Link href="/manage/mentee/my-work-exp-bookings">
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                <Calendar className="h-4 w-4" />
                My Bookings
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
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
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 dark:text-gray-600" />
              <span className="text-sm font-medium dark:text-gray-600">
                Type:
              </span>
              <Select
                value={packageTypeFilter}
                onValueChange={handlePackageTypeChange}
              >
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="SANDBOX_ONLY">Sandbox Only</SelectItem>
                  <SelectItem value="COURSE_PLUS_SANDBOX">
                    Course + Sandbox
                  </SelectItem>
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
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                  <SelectItem value="recent">Recent</SelectItem>
                </SelectContent>
              </Select>
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
                className="h-96 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        )}

        {!isLoading && paginatedPackages.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold dark:text-gray-900 mb-2">
              No work experience packages found
            </h3>
            <p className="dark:text-gray-600">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}

        {!isLoading && paginatedPackages.length > 0 && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {paginatedPackages.map((workPackage) => (
              <WorkExpPackageCard
                key={workPackage.id}
                workPackage={workPackage}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
