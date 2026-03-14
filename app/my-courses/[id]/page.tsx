"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DEFAULT_COURSES } from "@/data/courses";

export default function MyCourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [activeLesson, setActiveLesson] = useState<any>(null);

  // 🔐 Check enrollment
  useEffect(() => {
    const enrolled =
      JSON.parse(localStorage.getItem("enrolledCourses") || "[]");

    const isEnrolled = enrolled.some(
      (c: any) => c.courseId === Number(id)
    );

    if (!isEnrolled) {
      router.push("/courses/" + id);
    }
  }, [id, router]);

  const course = DEFAULT_COURSES.find(
    (c) => c.id === Number(id)
  );

  if (!course) return null;

  return (
    <section className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        {course.title}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* VIDEO */}
        <div className="md:col-span-2">
          {activeLesson ? (
            <video
              controls
              src={activeLesson.videoUrl}
              className="w-full rounded"
            />
          ) : (
            <p>Select a lesson to start</p>
          )}
        </div>

        {/* LESSON LIST */}
        <div className="border rounded p-4">
          <h3 className="font-bold mb-3">Lessons</h3>

          {course.lessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => setActiveLesson(lesson)}
              className="block w-full text-left px-3 py-2 mb-2 rounded hover:bg-gray-100"
            >
              {lesson.title}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
