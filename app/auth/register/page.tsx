"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Errors = {
  username?: string;
  email?: string;
  age?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");

  const validateForm = () => {
    const newErrors: Errors = {};

    if (!username.trim())
      newErrors.username = "Username is required";
    else if (username.length < 3)
      newErrors.username = "Username must be at least 3 characters";

    if (!email.trim())
      newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email format";

    if (!age)
      newErrors.age = "Age is required";
    else if (Number(age) < 5 || Number(age) > 100)
      newErrors.age = "Age must be between 5 and 100";

    if (!password)
      newErrors.password = "Password is required";
    else if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (!confirmPassword)
      newErrors.confirmPassword = "Confirm password is required";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!role)
      newErrors.role = "Please select a role";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    setServerError("");
    setErrors({});

   
    if (
      !username &&
      !email &&
      !age &&
      !password &&
      !confirmPassword &&
      !role
    ) {
      alert("Please fill in the form");
      return;
    }

    if (!validateForm()) return;

    try {
      const response = await fetch("https://eduvibe-onlineeducationplaform-production.up.railway.app/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: username,
          email,
          password,
          age: parseInt(age),
          role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful");
        router.push("/auth/login");
        return;
      }

      if (
        data.message &&
        data.message.toLowerCase().includes("email")
      ) {
        setErrors({
          email: "Email had already taken",
        });
        return;
      }

      setServerError(data.message || "Registration failed");
    } catch {
      setServerError("Cannot connect to server. Check if Laravel is running.");
    }
  };

 
  return (
    <div className="flex items-center justify-center w-full px-4">
      <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out z-10">
        
        {/* Card */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 dark:shadow-black/50 border border-white/20 dark:border-gray-700/50 overflow-hidden">
          
          <div className="pt-3 pb-4 px-4 sm:pt-4 sm:pb-6 sm:px-6">
            <div className="text-center mb-3">
              <Link href="/" className="inline-block mb-2 group">
                <span className="text-2xl font-black bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent tracking-tight group-hover:scale-105 transition-transform">
                  EduVibe
                </span>
              </Link>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Create an Account</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Join us and start your learning journey today</p>
            </div>

            {serverError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-800/50 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                {serverError}
              </div>
            )}

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Username</label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-950 border ${errors.username ? 'border-red-300 dark:border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-yellow-500 dark:focus:ring-yellow-500'} rounded-xl text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:border-transparent outline-none transition-all text-base`}
                    placeholder="johndoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  {errors.username && <p className="text-red-500 text-xs ml-1">{errors.username}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Age</label>
                  <input
                    type="number"
                    className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-950 border ${errors.age ? 'border-red-300 dark:border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-yellow-500 dark:focus:ring-yellow-500'} rounded-xl text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:border-transparent outline-none transition-all text-base`}
                    placeholder="18"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                  {errors.age && <p className="text-red-500 text-xs ml-1">{errors.age}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
                <input
                  type="email"
                  className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-950 border ${errors.email ? 'border-red-300 dark:border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-yellow-500 dark:focus:ring-yellow-500'} rounded-xl text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:border-transparent outline-none transition-all text-base`}
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-red-500 text-xs ml-1">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
                  <input
                    type="password"
                    className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-950 border ${errors.password ? 'border-red-300 dark:border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-yellow-500 dark:focus:ring-yellow-500'} rounded-xl text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:border-transparent outline-none transition-all text-base`}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && <p className="text-red-500 text-xs ml-1">{errors.password}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Confirm Password</label>
                  <input
                    type="password"
                    className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-950 border ${errors.confirmPassword ? 'border-red-300 dark:border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-yellow-500 dark:focus:ring-yellow-500'} rounded-xl text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:border-transparent outline-none transition-all text-base`}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs ml-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">I am a...</label>
                <select
                  className={`w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-950 border ${errors.role ? 'border-red-300 dark:border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-yellow-500 dark:focus:ring-yellow-500'} rounded-xl text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:border-transparent outline-none transition-all text-base appearance-none`}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="" disabled>Select your role</option>
                  <option value="STUDENT">Student</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="PARENT">Parent</option>
                  <option value="ADMIN">Admin</option>
                </select>
                {errors.role && <p className="text-red-500 text-xs ml-1">{errors.role}</p>}
              </div>

              <button
                onClick={handleRegister}
                className="w-full mt-4 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-yellow-600 dark:to-yellow-500 hover:from-gray-800 hover:to-gray-700 dark:hover:from-yellow-500 dark:hover:to-yellow-400 text-white dark:text-gray-950 font-bold py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl shadow-gray-900/20 dark:shadow-yellow-900/20 flex items-center justify-center gap-3 group text-base"
              >
                Create Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50/80 dark:bg-gray-950/50 backdrop-blur-sm p-4 text-center border-t border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-yellow-600 dark:text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-400 font-semibold hover:underline transition-colors">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
