"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, CheckCircle, ArrowLeft, Trophy } from "lucide-react";
import CertificateModal from "@/components/CertificateModal";

const API_URL = "https://eduvibe-onlineeducationplaform-production.up.railway.app/api";

export default function AssignmentPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId;

  const [course, setCourse] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [submissionLink, setSubmissionLink] = useState("");
  const [status, setStatus] = useState<"NOT_SUBMITTED" | "PENDING" | "GRADED">("NOT_SUBMITTED");
  const [loading, setLoading] = useState(true);
  const [showCert, setShowCert] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("token");
      try {
       
        const cRes = await fetch(`${API_URL}/courses/${courseId}`);
        setCourse(await cRes.json());

     
        const uRes = await fetch(`${API_URL}/user`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const userData = await uRes.json();
        setUser(userData);

       
        const existing = userData.submissions?.find(
          (s: any) => String(s.course_id) === String(courseId)
        );

        if (existing) {
          
          setStatus(existing.status === "PENDING" ? "GRADED" : existing.status);
          setSubmissionLink(existing.submission_link);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [courseId]);

  const handleSubmit = async () => {
    if (!submissionLink.includes("http")) return alert("Please enter a valid URL");

    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/student/courses/${courseId}/assignment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ submission_link: submissionLink })
      });

      if (res.ok) {
       
        setStatus("GRADED");
        localStorage.removeItem(`assignment_${courseId}`);
      }
    } catch {
      alert("Error submitting assignment");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Loader2 className="animate-spin text-yellow-600 dark:text-yellow-500" size={40} />
      <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Processing your request...</p>
    </div>
  );

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-gray-950 transition-colors duration-300 p-6 py-12">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="group flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-500 mb-8 transition-colors font-bold tracking-tight animate-in fade-in slide-in-from-left-4 duration-500"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Course
        </button>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-4xl p-6 sm:p-10 shadow-2xl shadow-gray-200/50 dark:shadow-black/50 overflow-hidden relative animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <div className="flex flex-col items-start mb-8 relative z-10">
              <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 shadow-sm border border-yellow-200/50 dark:border-yellow-700/30">
                  Final Step
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-gray-100 mb-2 tracking-tight">Final Project Submission</h1>
              <p className="text-gray-500 dark:text-gray-400 text-base font-medium">Course: <span className="text-gray-900 dark:text-gray-200 font-bold">{course?.title || "Loading..."}</span></p>
          </div>

          {status === "NOT_SUBMITTED" ? (
            <div className="space-y-6 relative z-10 animate-in fade-in duration-500 delay-150 fill-mode-both">
              <div className="bg-slate-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-slate-100 dark:border-gray-800/80 shadow-inner">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2.5 flex items-center gap-2 text-base">
                  <Trophy size={18} className="text-yellow-600 dark:text-yellow-500" /> 
                  Instructions:
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  To complete this course and earn your certificate, please provide a link to your final project. 
                  This can be a GitHub repository, a Google Drive folder, or a live website URL. Make sure it is publicly accessible!
                </p>
              </div>
              
              <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1 pl-1 border-l-2 border-yellow-500">Project URL</label>
                  <input 
                      type="text"
                      placeholder="https://github.com/your-username/project"
                      className="w-full p-4 bg-gray-50 dark:bg-gray-950 border-2 border-transparent dark:border-gray-800 rounded-xl outline-none focus:border-yellow-500 dark:focus:border-yellow-500 focus:bg-white dark:focus:bg-gray-950 transition-all text-sm text-gray-900 dark:text-gray-100 shadow-sm"
                      value={submissionLink}
                      onChange={(e) => setSubmissionLink(e.target.value)}
                  />
              </div>

              <button 
                  onClick={handleSubmit} 
                  className="w-full bg-gray-900 dark:bg-yellow-600 text-white dark:text-gray-950 py-4 rounded-xl font-bold text-base hover:bg-yellow-600 dark:hover:bg-yellow-500 hover:scale-[1.01] active:scale-95 transition-all duration-300 shadow-lg shadow-gray-900/20 dark:shadow-yellow-600/20"
              >
                Complete Course & Get Certificate
              </button>
            </div>
          ) : (
            <div className="text-center py-8 flex flex-col items-center relative z-10 animate-in zoom-in-95 duration-700 fill-mode-both">
              <div className="relative mb-6">
                  <div className="absolute inset-0 bg-green-400 dark:bg-green-500 blur-3xl opacity-30 dark:opacity-20 rounded-full scale-125 animate-pulse"></div>
                  <div className="relative inline-flex items-center justify-center w-24 h-24 bg-linear-to-br from-green-100 to-green-50 dark:from-green-900/80 dark:to-green-800/50 text-green-600 dark:text-green-400 rounded-full border-4 border-white dark:border-gray-900 shadow-xl">
                      <CheckCircle size={48} className="drop-shadow-sm" />
                  </div>
              </div>

              <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-3 tracking-tight">Congratulations!</h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-8 text-base font-medium leading-relaxed">
                You&apos;ve successfully completed the course. Your certificate is now ready for viewing.
              </p>
              
              <button 
                  onClick={() => setShowCert(true)}
                  className="group relative bg-gray-900 dark:bg-gray-50 text-white dark:text-gray-900 px-8 py-4 rounded-xl font-bold text-base transition-all hover:-translate-y-1 shadow-xl shadow-gray-900/30 dark:shadow-white/10 hover:shadow-yellow-500/20 border border-transparent dark:border-gray-200"
              >
                <span className="flex items-center gap-2">
                  🎓 Claim Your Certificate
                </span>
                <div className="absolute inset-0 rounded-xl ring-2 ring-transparent group-hover:ring-yellow-500/50 transition-all duration-300"></div>
              </button>
            </div>
          )}
        </div>
      </div>

      {showCert && (
        <CertificateModal 
            userName={user?.name || "Student"} 
            courseTitle={course?.title || "Professional Course"} 
            onClose={() => setShowCert(false)} 
        />
      )}
    </main>
  );
}