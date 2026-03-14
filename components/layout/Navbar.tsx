"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, BookOpen, Wallet, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadUser = () => {
        const u = JSON.parse(localStorage.getItem("currentUser") || "null");
        setUser(u);
      };
      loadUser();
      window.addEventListener("userChanged", loadUser);
      return () => window.removeEventListener("userChanged", loadUser);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("currentUser");
    window.dispatchEvent(new Event("userChanged"));
    router.push("/");
  };

  const isSpecialRole = user?.role?.toUpperCase() === "TEACHER" || user?.role?.toUpperCase() === "ADMIN";
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard) {
    return null; 
  }

  return (
    <nav className="flex justify-between items-center px-4 md:px-8 py-2 md:py-3 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/80 sticky top-0 z-100 transition-all duration-300 shadow-sm">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="p-1.5 rounded-lg text-yellow-600 font-black text-xl md:text-2xl tracking-tight transition-transform duration-300 group-hover:scale-105">
          EduVibe
        </div>
      </Link>

      <div className="flex gap-3 md:gap-6 items-center">
        <ThemeToggle />
        
        <Link href="/courses" className="hidden sm:block text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors">
          Browse Courses
        </Link>
        
        {/* Mobile-only icon for Browse Courses */}
        <Link href="/courses" className="sm:hidden text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors">
          <BookOpen size={20} />
        </Link>

        {!mounted ? (
          <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        ) : !user ? (
          <Link
            href="/auth/login"
            className="bg-gray-900 dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-500 text-white dark:text-gray-950 px-5 md:px-7 py-2 md:py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-lg shadow-gray-900/20 hover:shadow-yellow-600/30 transform hover:-translate-y-0.5"
          >
            Sign In
          </Link>
        ) : (
          /* --- USER PROFILE DROPDOWN ON HOVER --- */
          <div className="relative group">
            <Link href="/wallet" className="flex items-center gap-3 cursor-pointer py-1.5 px-2 pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors border border-transparent dark:border-gray-800">
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-yellow-100 to-yellow-50 dark:from-yellow-900/40 dark:to-yellow-800/20 flex items-center justify-center text-yellow-700 dark:text-yellow-500 font-bold border border-yellow-200 dark:border-yellow-700/30 shadow-sm">
                {(user.email?.[0] || 'U').toUpperCase()}
              </div>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                {user.email ? user.email.split('@')[0] : 'User'}
              </span>
              <ChevronDown size={14} className="text-gray-400 dark:text-gray-500 group-hover:rotate-180 transition-transform duration-300" />
            </Link>

            {/* Dropdown Card */}
            <div className="absolute right-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-110">
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl dark:shadow-black/60 overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
                
                {/* Header info */}
                <div className="p-5 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 block">
                  <p className="text-[10px] font-black text-yellow-600 dark:text-yellow-500 uppercase tracking-widest mb-1.5">Student Account</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{user.email || 'No email'}</p>
                </div>
                
                {/* Links */}
                <div className="p-2.5 space-y-1">
                  <Link 
                    href="/my-courses" 
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-gray-800 hover:text-yellow-700 dark:hover:text-yellow-500 rounded-xl transition-all"
                  >
                    <BookOpen size={18} className="text-yellow-600/70 dark:text-yellow-500/70" /> 
                    My Courses
                  </Link>
                  
                  <Link 
                    href="/wallet" 
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-gray-800 hover:text-yellow-700 dark:hover:text-yellow-500 rounded-xl transition-all"
                  >
                    <Wallet size={18} className="text-yellow-600/70 dark:text-yellow-500/70" /> 
                    Wallet
                    <span className="ml-auto font-bold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 px-2 py-0.5 rounded-md shadow-sm border border-gray-100 dark:border-gray-700">
                      ${user.wallet ?? 0}
                    </span>
                  </Link>
                </div>

                {/* Footer Action */}
                <div className="p-2.5 border-t border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                  <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400 rounded-xl transition-all font-bold"
                  >
                    <LogOut size={16} /> 
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}