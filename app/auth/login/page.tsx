"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(""); 
    setIsLoading(true);

    try {
      const response = await fetch("https://eduvibe-onlineeducationplaform-production.up.railway.app/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        window.dispatchEvent(new Event("userChanged"));

        if (data.user.role === 'ADMIN') router.push("/dashboard/admin");
        else if (data.user.role === 'TEACHER') router.push("/dashboard/teacher");
        else router.push("/");
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch {
      setError("Server connection failed. Is the API running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
<div className="flex items-center justify-center w-full px-4">
      <div className="w-full max-w-xs animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out z-10">
        
        {/* Card */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 dark:shadow-black/50 border border-white/20 dark:border-gray-700/50 overflow-hidden">
          
          <div className="pt-3 pb-4 px-4 sm:pt-4 sm:pb-6 sm:px-6">
            <div className="text-center mb-4">
              <Link href="/" className="inline-block mb-3 group">
                <span className="text-2xl font-black bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent tracking-tight group-hover:scale-105 transition-transform">
                  EduVibe
                </span>
              </Link>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Welcome Back</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Sign in to continue your learning journey</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-800/50 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-500 focus:border-transparent outline-none transition-all text-base"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
                  <a href="#" className="text-sm font-medium text-yellow-600 dark:text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-500 focus:border-transparent outline-none transition-all text-base"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-yellow-600 dark:to-yellow-500 hover:from-gray-800 hover:to-gray-700 dark:hover:from-yellow-500 dark:hover:to-yellow-400 text-white dark:text-gray-950 font-bold py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl shadow-gray-900/20 dark:shadow-yellow-900/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 group text-base"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
          
          {/* Footer of the card */}
          <div className="bg-gray-50/80 dark:bg-gray-950/50 backdrop-blur-sm p-4 text-center border-t border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-yellow-600 dark:text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 font-semibold hover:underline transition-colors">
                Sign up instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}