"use client";

import { useParams } from "next/navigation";

export default function QuizQuestionPage() {
  const params = useParams();
  const { courseId, quizId } = params;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Quiz Question
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Course ID: {courseId}, Quiz ID: {quizId}
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            This page is under development.
          </p>
        </div>
      </div>
    </div>
  );
}
