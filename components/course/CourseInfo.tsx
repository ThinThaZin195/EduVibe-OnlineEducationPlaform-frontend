"use client";

import { useRouter } from "next/navigation";

type Course = {
  id: number;
  title: string;
  description: string;
  price: number;
};

export default function CourseInfo({
  course,
}: {
  course: Course;
}) {
  const router = useRouter();

  const handleEnroll = () => {
    if (typeof window === 'undefined') return;

    const user = JSON.parse(
      localStorage.getItem("currentUser") || "null"
    );

    if (!user) {
      router.push("/auth/login");
      return;
    }
    if (user.role === "UNDER_18") {
      router.push("/wallet");
    } else {
      router.push("/payments");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h1 className="text-3xl font-bold">
        {course.title}
      </h1>

      <p className="mt-3 text-gray-600">
        {course.description}
      </p>

      <div className="mt-4 text-yellow-600 font-bold text-xl">
        ${course.price}
      </div>

      <button
        onClick={handleEnroll}
        className="mt-6 bg-yellow-600 text-white px-6 py-2 rounded-lg"
      >
        Enroll Now
      </button>
    </div>
  );
}
