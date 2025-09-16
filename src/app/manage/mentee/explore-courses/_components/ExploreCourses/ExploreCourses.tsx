"use client";

import CourseCard from "@/app/manage/mentee/explore-courses/_components/CourseCard/CourseCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCourses } from "@/queries/useCourse";
import { CourseType } from "@/schemaValidations/course.schema";
import { Filter, Search } from "lucide-react";
import { useState } from "react";

export default function ExploreCourses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { data, isLoading, error } = useCourses();

  const handleCategoryChange = (value: string) => {
    setCategory(value === "all" ? "" : value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const searchCourses = (courses: CourseType[], query: string) => {
    if (!query.trim()) return courses;
    return courses.filter((course) =>
      course.title.toLowerCase().includes(query.toLowerCase().trim())
    );
  };

  const filterCourses = (courses: CourseType[], selectedCategory: string) => {
    if (!selectedCategory) return courses;
    return courses.filter((course) =>
      course.description.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  };

  const sortCourses = (courses: CourseType[], sortType: string) => {
    const sortedCourses = [...courses];

    switch (sortType) {
      case "popular":
        return sortedCourses.sort(
          (a, b) => b._count.enrollments - a._count.enrollments
        );
      case "newest":
        return sortedCourses.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "price":
        return sortedCourses.sort(
          (a, b) => parseFloat(a.price) - parseFloat(b.price)
        );
      case "rating":
        return sortedCourses.sort((a, b) => b.avgRating - a.avgRating);
      default:
        return sortedCourses;
    }
  };

  const allCourses = data?.payload.result.courses || [];
  const searchedCourses = searchCourses(allCourses, searchQuery);
  const filteredCourses = filterCourses(searchedCourses, category);
  const sortedCourses = sortCourses(filteredCourses, sortBy);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCourses = sortedCourses.slice(startIndex, endIndex);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600">
            Failed to load courses. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-[#080808]">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Explore Courses
          </h1>
          <p className="text-gray-600 dark:text-white text-sm sm:text-base">
            Discover amazing courses from experienced mentors
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 w-[450px]">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search Course Title..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500 dark:text-white" />
                  <span className="text-sm font-medium text-gray-700 dark:text-white">
                    Category
                  </span>
                  <Select
                    value={category || "all"}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="programming">Programming</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-white">
                    Sort by:
                  </span>
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Popular</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!isLoading && paginatedCourses.length > 0 && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {paginatedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
