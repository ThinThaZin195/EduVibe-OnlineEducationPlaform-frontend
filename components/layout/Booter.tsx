"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Booter() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard) return null;

  return (
    <footer className="sticky bottom-0 z-40 bg-gray-900 w-full border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Brand Section */}
        <Link href="/" className="flex flex-col md:flex-row items-center gap-2 md:gap-3 group cursor-pointer text-center md:text-left">
          <h2 className="text-lg font-black text-yellow-500 transition-transform duration-300 group-hover:scale-105 tracking-tight">EduVibe</h2>
          <span className="hidden md:block text-gray-700">|</span>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
            Online learning platform
          </p>
        </Link>

        {/* Links Section */}
        <ul className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-gray-400">
          <li>
            <Link href="/courses" className="hover:text-yellow-500 cursor-pointer transition-colors pb-0.5 border-b-2 border-transparent hover:border-yellow-500">Courses</Link>
          </li>
          <li>
            <Link href="/quizzes" className="hover:text-yellow-500 cursor-pointer transition-colors pb-0.5 border-b-2 border-transparent hover:border-yellow-500">Quizzes</Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-yellow-500 cursor-pointer transition-colors pb-0.5 border-b-2 border-transparent hover:border-yellow-500">About</Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-yellow-500 cursor-pointer transition-colors pb-0.5 border-b-2 border-transparent hover:border-yellow-500">Contact</Link>
          </li>
        </ul>

        {/* Copyright Section */}
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-600 bg-gray-800/50 px-3 py-1.5 rounded-full shadow-inner border border-gray-800">
          © {new Date().getFullYear()} EduVibe
        </div>
      </div>
    </footer>
  );
}