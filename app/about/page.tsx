"use client";

import Link from "next/link";
import { BookOpen, Users, Globe, Target } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Active Students", value: "10K+" },
    { label: "Expert Instructors", value: "500+" },
    { label: "High-Quality Courses", value: "1,200+" },
    { label: "Countries Reached", value: "120+" },
  ];

  const values = [
    {
      icon: <Globe className="w-8 h-8 text-yellow-500" />,
      title: "Accessible Learning",
      description: "We break down barriers to education, making high-quality courses available to anyone, anywhere in the world.",
    },
    {
      icon: <Target className="w-8 h-8 text-yellow-500" />,
      title: "Goal-Oriented",
      description: "Our curriculum is designed to help you achieve your personal and professional goals through actionable skills.",
    },
    {
      icon: <Users className="w-8 h-8 text-yellow-500" />,
      title: "Community Driven",
      description: "Learn together. We foster a supportive global community of learners and educators who grow together.",
    },
    {
      icon: <BookOpen className="w-8 h-8 text-yellow-500" />,
      title: "Lifelong Education",
      description: "We believe education doesn't stop at graduation. We are committed to fueling your lifelong learning journey.",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white/100"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-in">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Empowering Minds <br/>
            <span className="text-yellow-600">Transforming Futures</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-10">
            At EduVibe, we believe that education is the ultimate catalyst for change. Our platform connects passionate learners with world-class instructors to unlock human potential on a global scale.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/courses" 
              className="px-8 py-3.5 bg-yellow-600 text-white font-bold rounded-full hover:bg-yellow-700 transition-all transform hover:scale-105 shadow-lg shadow-yellow-600/30"
            >
              Start Learning Now
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-900 py-16 px-6 text-white border-y-4 border-yellow-600">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="animate-in" 
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="text-4xl md:text-5xl font-black text-yellow-500 mb-2 drop-shadow-sm">{stat.value}</div>
              <div className="text-sm md:text-base font-medium text-gray-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-in" style={{ animationDelay: '200ms' }}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
          <div className="w-24 h-1.5 bg-yellow-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {values.map((value, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-yellow-200 transition-all duration-300 animate-in group"
              style={{ animationDelay: `${(index + 3) * 150}ms` }}
            >
              <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:bg-yellow-100">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-yellow-50 to-white text-center border-t border-yellow-100 animate-in" style={{ animationDelay: '600ms' }}>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to join our community?</h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Create an account today and get access to hundreds of courses taught by industry leading instructors.
        </p>
        <Link 
          href="/auth/register" 
          className="inline-flex items-center justify-center px-8 py-3.5 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-all transform hover:-translate-y-1 shadow-xl"
        >
          Join EduVibe Today
        </Link>
      </section>
    </div>
  );
}
