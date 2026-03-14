"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const u = JSON.parse(localStorage.getItem("currentUser") || "null");
      if (!u || u.role !== "TEACHER") {
        router.push("/auth/login");
        return;
      }
      setUser(u);

      const allCourses = JSON.parse(localStorage.getItem("courses") || "[]");
      const teacherCourses = allCourses.filter((c: any) => c.teacherId === u.id);
      setMyCourses(teacherCourses);
    }
  }, [router]);

  if (!mounted || !user) return <p className="p-10">Loading...</p>;

  const addCourse = () => {
    const title = prompt("Course title?");
    const price = Number(prompt("Course price?") || 0);
    if (!title) return;

    const allCourses = JSON.parse(localStorage.getItem("courses") || "[]");
    const newCourse = {
      id: Date.now(),
      title,
      price,
      description: "",
      teacherId: user.id,
      lessons: [],
    };
    allCourses.push(newCourse);
    localStorage.setItem("courses", JSON.stringify(allCourses));
    setMyCourses([...myCourses, newCourse]);
  };

  const addLesson = (courseId: number) => {
    const title = prompt("Lesson title?");
    const videoUrl = prompt("Video URL?");
    if (!title || !videoUrl) return;

    const allCourses = JSON.parse(localStorage.getItem("courses") || "[]");
    const updatedCourses = allCourses.map((c: any) => {
      if (c.id === courseId) {
        c.lessons = c.lessons || [];
        c.lessons.push({
          id: Date.now(),
          title,
          videoUrl,
        });
      }
      return c;
    });

    localStorage.setItem("courses", JSON.stringify(updatedCourses));
    setMyCourses(updatedCourses.filter((c: any) => c.teacherId === user.id));
  };

  const viewStudents = (courseId: number) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const students = users.filter((u: any) => (u.enrolledCourses || []).includes(courseId));
    alert(`Students enrolled:\n${students.map((s: any) => s.email).join("\n")}`);
  };

  return (
    <section className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Teacher Dashboard</h1>

      <button
        onClick={addCourse}
        className="bg-yellow-600 text-white px-4 py-2 rounded mb-6"
      >
        Add Course
      </button>

      {myCourses.map((course) => (
        <div key={course.id} className="border p-4 rounded bg-white mb-4">
          <h2 className="font-semibold">{course.title}</h2>
          <p>${course.price}</p>
          <button
            onClick={() => addLesson(course.id)}
            className="bg-blue-600 text-white px-3 py-1 rounded mr-2 mt-2"
          >
            Add Lesson
          </button>
          <button
            onClick={() => viewStudents(course.id)}
            className="bg-green-600 text-white px-3 py-1 rounded mt-2"
          >
            View Students
          </button>

          <ul className="mt-2">
            {course.lessons?.map((lesson: any) => (
              <li key={lesson.id} className="text-gray-700">
                {lesson.title} — <a href={lesson.videoUrl} target="_blank" className="text-blue-600 underline">Watch Video</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
