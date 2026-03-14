"use client";

import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react"; 
import { DEFAULT_COURSES } from "@/data/courses";

interface Lesson {
  id: number;
  title: string;
  videoUrl: string;
}

export default function LessonDetailPage() {
  const params = useParams(); 
  
  const cId = params?.courseId ? Number(params.courseId) : null;
  const lId = params?.lessonId ? Number(params.lessonId) : null;

  const lesson = useMemo<Lesson | null>(() => {
    if (cId && lId) {
      const course = DEFAULT_COURSES.find((c) => c.id === cId);
      if (course) {
        return course.lessons.find((l) => l.id === lId) || null;
      }
    }
    return null;
  }, [cId, lId]);

  const [isCompleted, setIsCompleted] = useState(() => {
    if (typeof window !== 'undefined' && lId) {
      const completed = JSON.parse(localStorage.getItem("completedLessons") || "[]");
      return completed.includes(lId);
    }
    return false;
  });

 
  const handleMarkComplete = () => {
    if (!cId || !lId) return;
    
    if (typeof window === 'undefined') return;
    
    const completed = JSON.parse(localStorage.getItem("completedLessons") || "[]");
    
    if (!completed.includes(lId)) {
      const updated = [...completed, lId];
      localStorage.setItem("completedLessons", JSON.stringify(updated));
      setIsCompleted(true);
    }
    
    alert("Progress saved! Once all lessons are done, the Assignment will unlock.");
  };

  if (!params?.lessonId) return <p className="p-10 text-center">Loading Route...</p>;

  if (!lesson) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-2xl font-bold text-red-500">Lesson Not Found</h2>
        <Link href="/courses" className="text-yellow-600 dark:text-yellow-500 underline mt-4 inline-block">Return to Courses</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 pb-20">
      <Link href={`/courses/${cId}`} className="text-yellow-600 dark:text-yellow-500 font-medium mb-6 inline-block hover:underline">
        ← Back to Curriculum
      </Link>
      
     
      <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl mb-8 border-4 border-white dark:border-gray-800">
        {lesson.videoUrl ? (
          <iframe src={lesson.videoUrl} className="w-full h-full" allowFullScreen />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-white bg-gray-900 border border-transparent dark:border-gray-800">
             <span className="text-4xl mb-2">🎥</span>
             <p className="text-gray-400">Video Content Placeholder</p>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{lesson.title}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Course ID: {cId} | Lesson: {lId}</p>
        </div>

        
        <div className="flex flex-col gap-3 w-full md:w-auto">
          <button 
            onClick={handleMarkComplete}
            disabled={isCompleted}
            className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${
              isCompleted 
              ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 cursor-not-allowed border border-green-200 dark:border-green-800/50" 
              : "bg-yellow-600 dark:bg-yellow-500 text-white dark:text-gray-900 hover:bg-yellow-700 dark:hover:bg-yellow-400 shadow-lg shadow-yellow-100 dark:shadow-yellow-900/20"
            }`}
          >
            {isCompleted ? <CheckCircle size={20} /> : null}
            {isCompleted ? "Lesson Completed" : "Mark as Finished"}
          </button>
          
          <p className="text-[10px] text-center text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            Complete all lessons to unlock Assignment
          </p>
        </div>
      </div>
    </div>
  );
}