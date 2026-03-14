"use client";

import Link from "next/link";
import { PlayCircle } from "lucide-react"; 

type Lesson = {
  id: number;
  title: string;
  videoUrl: string;
  thumbnail?: string;
};

export default function LessonList({
  lessons = [],
  courseId,
}: {
  lessons?: Lesson[];
  courseId: number;
}) {
  if (!lessons.length) {
    return (
      <div className="p-8 border-2 border-dashed rounded-xl text-center">
        <p className="text-gray-500">No lessons available for this course yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-yellow-600 rounded-full"></span>
        Course Curriculum
      </h2>

      {/* Grid Layout like the Course Page */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson, index) => (
          <Link
            key={lesson.id}
            href={`/courses/${courseId}/lessons/${lesson.id}`}
            className="group block border rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300"
          >
            {/* Square Video Thumbnail Area */}
            <div className="relative aspect-video bg-gray-900 flex items-center justify-center overflow-hidden">
               {/* Lesson Number Badge */}
               <span className="absolute top-3 left-3 z-10 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded">
                Lesson {index + 1}
              </span>
              
              {/* Play Icon Overlay */}
              <div className="z-10 transform transition-transform duration-300 group-hover:scale-125 text-white/80 group-hover:text-yellow-500">
                <PlayCircle size={48} fill="currentColor" fillOpacity="0.2" />
              </div>

              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Content Section */}
            <div className="p-4">
              <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-yellow-600 transition-colors">
                {lesson.title}
              </h3>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Video Lesson
                </span>
                <span className="text-sm font-bold text-yellow-600">
                  Start →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}