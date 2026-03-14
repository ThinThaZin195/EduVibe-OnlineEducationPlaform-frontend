"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookMarked } from "lucide-react";

export default function QuizzesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if the user is logged in
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) {
      // If not logged in, redirect them immediately to the login page!
      router.push("/auth/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-yellow-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 animate-in" style={{ animationDelay: '100ms' }}>
          My Quizzes
        </h1>
        
        <div 
          className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center flex flex-col items-center animate-in" 
          style={{ animationDelay: '200ms' }}
        >
          <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mb-6">
            <BookMarked className="w-10 h-10 text-yellow-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">You're all caught up!</h2>
          <p className="text-gray-500 max-w-sm mx-auto">
            You don't have any pending quizzes at the moment. As you progress through your courses, your active quizzes will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
