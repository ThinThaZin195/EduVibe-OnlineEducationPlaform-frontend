"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  AlertCircle,
  Trophy,
  Home,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

const API_URL = "https://eduvibe-onlineeducationplaform-production.up.railway.app/api";

type Quiz = {
  id: number;
  question: string;
  options: string[];
  correct_answer: number;
};

export default function CourseQuiz() {
  const params = useParams();
  const router = useRouter();

  const courseId = params.courseId || params.id;

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!courseId) return;

      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`${API_URL}/courses/${courseId}/quiz`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await res.json();
        setQuizzes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Quiz fetch error:", error);
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [courseId]);

  // ---------------- Loading ----------------
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="animate-spin text-indigo-400" size={40} />
      </div>
    );
  }

  // ---------------- No quiz ----------------
  if (!quizzes.length) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center px-6 bg-slate-900 text-white">
        <AlertCircle size={48} className="text-slate-500 mb-4" />
        <h2 className="text-xl font-bold uppercase">No Quiz Found</h2>
        <p className="text-slate-400 text-xs mt-2">
          Course ID: {courseId}
        </p>
        <button
          onClick={() => router.back()}
          className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl text-xs uppercase"
        >
          Go Back
        </button>
      </div>
    );
  }

  const currentQuiz = quizzes[currentIdx];

  const handleSelect = (optionIdx: number) => {
    setAnswers({ ...answers, [currentQuiz.id]: optionIdx });
  };

  const handleSubmit = () => {
    let total = 0;

    quizzes.forEach((q) => {
      if (answers[q.id] === q.correct_answer) {
        total++;
      }
    });

    setScore(total);
    setIsSubmitted(true);
  };

  // ---------------- Result ----------------
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full text-center shadow-xl text-white">
          <Trophy className="mx-auto text-emerald-400 mb-4" size={48} />
          <h2 className="text-2xl font-bold mb-2">Quiz Completed</h2>
          <p className="text-slate-300 mb-6">
            You scored <strong>{score}</strong> out of{" "}
            <strong>{quizzes.length}</strong>
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/my-courses")}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-sm flex items-center justify-center gap-2"
            >
              <Home size={16} /> Dashboard
            </button>

            <button
              onClick={() => {
                setIsSubmitted(false);
                setCurrentIdx(0);
                setAnswers({});
                setScore(0);
              }}
              className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-xl text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

 
  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 text-white">
      <div className="max-w-3xl mx-auto bg-slate-800 rounded-2xl shadow-lg p-8">

        <h2 className="text-sm uppercase tracking-widest text-slate-400 mb-2">
          Question {currentIdx + 1} of {quizzes.length}
        </h2>

        <h1 className="text-xl font-bold mb-6">
          {currentQuiz.question}
        </h1>

        <div className="space-y-3 mb-8">
          {currentQuiz.options.map((option, idx) => {
            const selected = answers[currentQuiz.id] === idx;

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition ${
                  selected
                    ? "bg-indigo-600 border-indigo-400 text-white"
                    : "bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2
                    size={18}
                    className={
                      selected ? "text-white" : "text-slate-400"
                    }
                  />
                  {option}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-between">
          <button
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(currentIdx - 1)}
            className="px-4 py-2 text-sm rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-40 flex items-center gap-2"
          >
            <ChevronLeft size={16} /> Previous
          </button>

          {currentIdx === quizzes.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 text-sm rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={() => setCurrentIdx(currentIdx + 1)}
              className="px-4 py-2 text-sm rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
            >
              Next <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
