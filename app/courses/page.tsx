"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CourseCard from "@/components/course/CourseCard";

const API_URL = "https://eduvibe-onlineeducationplaform-backend-production.up.railway.app/api";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [freeOnly, setFreeOnly] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_URL}/courses`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const categories = Array.from(
    new Set(courses.map((course) => course.category ?? "General"))
  );
  const categoryOptions = ["All", ...categories];

  const filteredCourses = courses.filter((course) => {
    const searchLower = search.trim().toLowerCase();
    const matchesSearch =
      !searchLower ||
      `${course.title ?? ""} ${course.description ?? ""}`
        .toLowerCase()
        .includes(searchLower);

    const courseCategory = course.category ?? "General";
    const matchesCategory =
      selectedCategory === "All" || courseCategory === selectedCategory;

    const matchesFree = !freeOnly || Number(course.price) === 0;

    return matchesSearch && matchesCategory && matchesFree;
  });

  if (loading) {
    return (
      <section className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-950 pb-20 transition-colors duration-300">
        <div className="max-w-6xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-48 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
                  <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-full bg-gray-50 dark:bg-gray-950 pb-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 text-gray-900 dark:text-gray-100 tracking-tight">
            Explore Our <span className="text-yellow-600 dark:text-yellow-500">Courses</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Discover courses that match your interests and advance your career with expert-led learning.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <button
              onClick={() => setFreeOnly((prev) => !prev)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                freeOnly
                  ? "bg-yellow-600 text-white border-yellow-600 hover:bg-yellow-700"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {freeOnly ? "Showing free" : "Free Courses"}
            </button>
          </div>
        </div>
        
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {filteredCourses.map((course, index) => {
              const finalImage = course.image
                ? (course.image.startsWith("http")
                    ? course.image
                    : `https://eduvibe-onlineeducationplaform-backend-production.up.railway.app/storage/${course.image}`)
                : "/images/placeholder.png";

              return (
                <div
                  key={course.id}
                  className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CourseCard
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    price={course.price}
                    image={finalImage}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {courses.length === 0
                ? "No courses available"
                : "No courses match your filters"}
            </h3>
            {courses.length > 0 && (
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Try clearing the filters or modifying your search.
              </p>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                  setFreeOnly(false);
                }}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-yellow-600 text-white font-bold hover:bg-yellow-700 transition-colors"
              >
                Clear filters
              </button>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Browse all courses
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}