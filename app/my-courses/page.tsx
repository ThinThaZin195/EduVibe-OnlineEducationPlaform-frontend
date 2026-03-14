"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      const token = localStorage.getItem("token");
      const API_URL = "https://eduvibe-onlineeducationplaform-backend-production.up.railway.app/api";

      try {

        const res = await fetch(`${API_URL}/student/enrolled`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();

          setCourses(data);
        }
      } catch (error) {
        console.error("Error fetching backend courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600 dark:border-yellow-500"></div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <span className="text-6xl mb-6 block drop-shadow-md">📚</span>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 tracking-tight">No enrolled courses yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">Start your learning journey today by exploring our catalog of premium courses!</p>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:text-gray-950 text-white font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-yellow-600/20"
          >
            Browse All Courses
          </Link>
        </div>
      </div>
    );
  }

  const getImageUrl = (imgSource: string) => {
    if (!imgSource) return "https://images.unsplash.com/photo-1501504905953-f84476b0dfbb?q=80&w=1000&auto=format&fit=crop";
    if (imgSource.startsWith("http")) return imgSource;
    const cleanPath = imgSource.startsWith("/") ? imgSource.substring(1) : imgSource;
    return `https://eduvibe-onlineeducationplaform-backend-production.up.railway.app/storage/${cleanPath}`;
  };

  return (
    <section className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-white via-gray-100 to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300 pb-20">
      <div className="max-w-6xl mx-auto p-6 lg:p-10">
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">My Learning Dashboard</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Continue where you left off and track your progress.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-200 font-semibold text-sm">
                <span className="text-base">🎓</span>
                <span>{courses.length} enrolled course{courses.length === 1 ? "" : "s"}</span>
              </div>

              <Link
                href="/courses"
                className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-100 bg-white/60 dark:bg-gray-900/60 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-800 hover:bg-white dark:hover:bg-gray-900 transition-colors"
              >
                Browse more
                <span className="text-yellow-600 dark:text-yellow-500">→</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {courses.map((course, index) => {
            const score = typeof course.pivot?.score === "number" ? course.pivot.score : null;
            const progress = score !== null ? Math.min(100, Math.max(0, score)) : 0;
            const progressColor = progress >= 80 ? "bg-emerald-500" : progress >= 50 ? "bg-yellow-500" : "bg-amber-500";

            return (
              <div
                key={course.id}
                className="group flex flex-col sm:flex-row border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-sm hover:shadow-2xl hover:border-yellow-200 dark:hover:border-yellow-500/50 transition-all duration-500 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative w-full sm:w-56 h-56 sm:h-auto bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                  <Image
                    src={getImageUrl(course.image)}
                    alt={course.title}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, 256px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e: any) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1501504905953-f84476b0dfbb?q=80&w=1000&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between relative">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors line-clamp-2">
                      {course.title}
                    </h2>

                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {score !== null ? (
                          <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full text-sm font-bold border border-green-200 dark:border-green-800/50">
                            <span>🎯</span>
                            Quiz Score: {score}%
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 px-3 py-1.5 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-700/50">
                            <span>📝</span>
                            No quiz taken yet
                          </div>
                        )}

                        {score !== null && (
                          <div className="flex-1 min-w-[160px]">
                            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800">
                              <div
                                className={`h-full rounded-full ${progressColor} transition-all duration-500`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Progress: {progress}%</div>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                        {course.description ?? "No description provided."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between pt-5 border-t border-gray-100 dark:border-gray-800 transition-colors">
                    <Link
                      href={`/courses/${course.id}`}
                      className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100 bg-yellow-50 dark:bg-gray-800 px-4 py-2 rounded-full group-hover:bg-yellow-100 dark:group-hover:bg-gray-700 transition-colors"
                    >
                      Continue <span className="text-yellow-600 dark:text-yellow-500 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>

                    {score !== null && score >= 80 && (
                      <span className="text-xs font-black uppercase text-yellow-600 dark:text-yellow-500 tracking-wider flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/10 px-3 py-1.5 rounded-full">
                        🌟 Top Student
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}