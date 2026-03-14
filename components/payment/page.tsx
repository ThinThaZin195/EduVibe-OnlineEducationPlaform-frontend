"use client";

import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();

  const pay = () => {
    const enrolled =
      JSON.parse(localStorage.getItem("enrolledCourses") || "[]");

    enrolled.push({
      courseId: 1,
      title: "Next.js Full Course",
      quizScore: null,
    });

    localStorage.setItem(
      "enrolledCourses",
      JSON.stringify(enrolled)
    );

    alert("Payment successful");
    router.push("/my-courses");
  };

  return (
    <section className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Choose Payment Method
      </h1>

      <button
        onClick={pay}
        className="w-full bg-blue-600 text-white py-2 rounded mb-3"
      >
        Pay with Bank / Card
      </button>

      <button
        onClick={() => router.push("/wallet")}
        className="w-full bg-gray-600 text-white py-2 rounded"
      >
        Pay with Wallet
      </button>
    </section>
  );
}
