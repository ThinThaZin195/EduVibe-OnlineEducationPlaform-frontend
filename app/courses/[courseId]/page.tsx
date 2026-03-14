"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  PlayCircle,
  Lock,
  CheckCircle,
  FileText,
  CreditCard,
  Loader2,
} from "lucide-react";

const API_URL = "https://eduvibe-onlineeducationplaform-production.up.railway.app/api";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId;

  const [user, setUser] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      const token = localStorage.getItem("token");
      const localUser = JSON.parse(
        localStorage.getItem("currentUser") || "null",
      );

      if (localUser) setUser(localUser);

      try {
        const res = await fetch(`${API_URL}/courses/${courseId}`, {
          headers: {
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!res.ok) throw new Error("Course not found");
        const courseData = await res.json();
        setCourse(courseData);

        if (token) {
          const userRes = await fetch(`${API_URL}/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });

          if (userRes.ok) {
            const userData = await userRes.json();
            setUser(userData);
            localStorage.setItem("currentUser", JSON.stringify(userData));

            const enrolled = userData.enrolled_courses?.some(
              (c: any) => c.id === Number(courseId),
            );
            setIsEnrolled(enrolled || false);

            const finished = courseData.lessons?.every((lesson: any) =>
              userData.completed_lessons?.some(
                (cl: any) => cl.id === lesson.id,
              ),
            );
          }
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchCourseData();
  }, [courseId]);

  const handleEnrollClick = () => {
    const activeUser =
      user || JSON.parse(localStorage.getItem("currentUser") || "null");

    if (!activeUser) {
      router.push("/auth/login");
      return;
    }
    router.push(`/payment?courseId=${courseId}`);
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center space-x-2">
        <Loader2 className="animate-spin text-yellow-600" />
        <span className="text-gray-500 font-medium">Loading Course...</span>
      </div>
    );

  if (!course) return <p className="p-10 text-center">Course not found...</p>;

  const imageSrc = course.image
    ? course.image.startsWith("http")
      ? course.image
      : `https://eduvibe-onlineeducationplaform-production.up.railway.app/storage/${course.image}`
    : "/images/placeholder.png";

  return (
    <section className="max-w-6xl mx-auto p-6 pb-20">
      {/* Hero Section */}
      <div className="relative h-80 w-full rounded-3xl overflow-hidden shadow-2xl mb-10 ring-1 ring-black/5 dark:ring-white/5">
        <Image
          src={imageSrc}
          alt={course.title}
          fill
          className="object-cover brightness-[0.4]"
          priority
        />
        <div className="absolute inset-0 flex flex-col justify-center px-10 text-white">
          <h1 className="text-5xl font-extrabold drop-shadow-lg">
            {course.title}
          </h1>
          <p className="mt-4 text-xl text-gray-200 max-w-2xl line-clamp-2">
            {course.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Course Curriculum
            </h2>
            <span className="text-gray-500 dark:text-gray-400 font-medium">
              {course.lessons?.length || 0} Lessons
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {course.lessons?.map((lesson: any, index: number) => (
              <div
                key={lesson.id}
                className={`group relative border dark:border-gray-800 rounded-2xl p-4 bg-white dark:bg-gray-900 transition-all shadow-sm ${
                  isEnrolled ? "hover:shadow-xl dark:hover:shadow-black/50 cursor-pointer hover:border-yellow-200 dark:hover:border-yellow-500/50" : "opacity-75"
                }`}
                onClick={() =>
                  isEnrolled &&
                  router.push(`/courses/${course.id}/lessons/${lesson.id}`)
                }
              >
                <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl mb-4 overflow-hidden flex items-center justify-center">
                  {!isEnrolled ? (
                    <Lock className="text-gray-400 dark:text-gray-500" size={32} />
                  ) : (
                    <PlayCircle
                      className="text-yellow-600 dark:text-yellow-500 transition-transform group-hover:scale-110"
                      size={40}
                    />
                  )}
                  <span className="absolute top-2 left-2 bg-black/60 dark:bg-black/80 text-white text-[10px] px-2 py-1 rounded font-bold">
                    LESSON {index + 1}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 dark:text-gray-200 line-clamp-1 group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors">
                  {lesson.title}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl dark:shadow-black/50 space-y-6">
            <div className="text-center">
              <span className="text-4xl font-black text-gray-900 dark:text-white">
                ${course.price}
              </span>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                One-time payment for lifetime access
              </p>
            </div>

            {!isEnrolled ? (
              <button
                onClick={handleEnrollClick}
                className="w-full flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-400 text-white dark:text-gray-900 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-yellow-200 dark:shadow-yellow-900/20 transition-all active:scale-95"
              >
                <CreditCard size={20} />
                Enroll in Course
              </button>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-xl flex items-center justify-center gap-2 font-bold border border-green-100 dark:border-green-800/50">
                  <CheckCircle size={20} /> You are Enrolled
                </div>
                
                <button
                  onClick={() =>
                    router.push(`/courses/${course.id}/assignment`)
                  }
                  className="w-full flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-400 text-white dark:text-gray-900 py-4 rounded-2xl font-bold transition-all shadow-md"
                >
                  <FileText size={20} /> Start Final Assignment
                </button>
                
                {course.quizzes?.length > 0 && (
                  <button
                    onClick={() => router.push(`/courses/${course.id}/quiz`)}
                    className="w-full bg-gray-900 dark:bg-gray-800 text-white py-4 rounded-2xl font-bold hover:bg-black dark:hover:bg-gray-700 border border-transparent dark:border-gray-700 transition-all"
                  >
                    Start Final Quiz
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
