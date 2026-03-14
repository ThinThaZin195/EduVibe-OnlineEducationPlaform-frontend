"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardLink, setDashboardLink] = useState("/my-courses");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateNavigation = () => {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("currentUser");
        
        setIsLoggedIn(!!token);

        if (userStr) {
          const user = JSON.parse(userStr);
          if (user.role === "ADMIN") {
            setDashboardLink("/dashboard/admin");
          } else {
            setDashboardLink("/my-courses");
          }
        }
      };

      updateNavigation();

      window.addEventListener("userChanged", updateNavigation);
      return () => window.removeEventListener("userChanged", updateNavigation);
    }
  }, []);

  return (
    <main className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden flex flex-col">
      
      {/* Background with overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/edu.png" 
          alt="EduVibe Background"
          fill
          priority
          className="object-cover brightness-[0.2] md:brightness-50 scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-yellow-900/30"></div>
      </div>

      {/* Hero Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center z-10 max-w-5xl mx-auto">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-yellow-500/20 text-yellow-300 text-sm font-bold uppercase tracking-widest rounded-full border border-yellow-400/30 mb-4">
              Welcome to the Future of Learning
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 text-white drop-shadow-2xl tracking-tight leading-none">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">EduVibe</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 md:mb-12 text-gray-200 font-medium opacity-90 max-w-3xl mx-auto leading-relaxed">
            Learn anything, anywhere, anytime with our expert-led courses and interactive platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-lg mx-auto">
            <Link 
              href="/courses" 
              className="w-full sm:flex-1 px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold rounded-2xl hover:from-yellow-600 hover:to-yellow-700 transition-all transform hover:-translate-y-1 hover:shadow-2xl shadow-yellow-500/25 text-center text-lg"
            >
              Browse Courses
            </Link>

            {!isLoggedIn ? (
              <Link 
                href="/auth/login" 
                className="w-full sm:flex-1 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-2xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all transform hover:-translate-y-1 hover:shadow-2xl shadow-white/10 text-center text-lg"
              >
                Sign In
              </Link>
            ) : (
              <Link 
                href={dashboardLink} 
                className="w-full sm:flex-1 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:-translate-y-1 hover:shadow-2xl shadow-blue-500/25 text-center text-lg"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white/5 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white mb-2">10K+</div>
              <div className="text-sm text-gray-300 font-medium">Active Students</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white mb-2">500+</div>
              <div className="text-sm text-gray-300 font-medium">Expert Instructors</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white mb-2">1,200+</div>
              <div className="text-sm text-gray-300 font-medium">Quality Courses</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white mb-2">120+</div>
              <div className="text-sm text-gray-300 font-medium">Countries</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}