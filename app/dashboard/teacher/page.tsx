"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Video,
  HelpCircle,
  Trash2,
  Edit3,
  X,
  Loader2,
  GraduationCap,
  Image as ImageIcon,
  ExternalLink,
  BookOpen,
} from "lucide-react";

const API_URL = "https://eduvibe-onlineeducationplaform-production.up.railway.app/api";
const STORAGE_URL = "https://eduvibe-onlineeducationplaform-production.up.railway.app/storage";

export default function TeacherStudio() {
  const [activeTab, setActiveTab] = useState("courses");
  const [courses, setCourses] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal & Edit Controls
  const [modalMode, setModalMode] = useState<
    "COURSE" | "LESSON" | "QUIZ" | null
  >(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [targetId, setTargetId] = useState<number | null>(null);

  // Form States
  const [courseForm, setCourseForm] = useState({
    title: "",
    price: "",
    description: "",
    assignment_instructions: "",
  });
  const [courseImage, setCourseImage] = useState<File | null>(null);
  const [lessonForm, setLessonForm] = useState({
    title: "",
    video_url: "",
    order_index: 0,
  });
  const [quizForm, setQuizForm] = useState({
    question: "",
    options: ["", "", "", ""],
    correct_answer: 0,
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const getHeaders = (isFormData = false) => {
    const headers: any = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    };
    if (!isFormData) headers["Content-Type"] = "application/json";
    return headers;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/teacher/${
          activeTab === "grading" ? "submissions" : "courses"
        }`,
        {
          headers: getHeaders(),
        }
      );
      const data = await res.json();
      activeTab === "grading" ? setSubmissions(data) : setCourses(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  // --- MODAL HELPERS ---
  const openEdit = (type: "COURSE" | "LESSON" | "QUIZ", data: any) => {
    setIsEdit(true);
    setEditId(data.id);
    setModalMode(type);
    if (type === "COURSE")
      setCourseForm({
        title: data.title,
        price: data.price,
        description: data.description || "",
        assignment_instructions: data.assignment_instructions || "",
      });
    if (type === "LESSON")
      setLessonForm({
        title: data.title,
        video_url: data.video_url,
        order_index: data.order_index || 0,
      });
    if (type === "QUIZ")
      setQuizForm({
        question: data.question,
        options: data.options,
        correct_answer: data.correct_answer || 0,
      });
  };

  const closeModal = () => {
    setModalMode(null);
    setIsEdit(false);
    setEditId(null);
    setTargetId(null);
    setCourseForm({
      title: "",
      price: "",
      description: "",
      assignment_instructions: "",
    });
    setCourseImage(null);
    setLessonForm({ title: "", video_url: "", order_index: 0 });
    setQuizForm({ question: "", options: ["", "", "", ""], correct_answer: 0 });
  };

  // --- SUBMIT ACTIONS ---
  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", courseForm.title);
    formData.append("price", courseForm.price);
    formData.append("description", courseForm.description);
    formData.append(
      "assignment_instructions",
      courseForm.assignment_instructions
    );
    if (courseImage) formData.append("image", courseImage);
    if (isEdit) formData.append("_method", "PUT");

    const url = isEdit
      ? `${API_URL}/teacher/courses/${editId}`
      : `${API_URL}/teacher/courses`;
    const res = await fetch(url, {
      method: "POST",
      headers: getHeaders(true),
      body: formData,
    });
    if (res.ok) {
      closeModal();
      fetchData();
    }
  };

  const handleLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEdit
      ? `${API_URL}/teacher/lessons/${editId}`
      : `${API_URL}/teacher/courses/${targetId}/lessons`;
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: getHeaders(),
      body: JSON.stringify(lessonForm),
    });
    if (res.ok) {
      closeModal();
      fetchData();
    }
  };

  const handleQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEdit
      ? `${API_URL}/teacher/quizzes/${editId}`
      : `${API_URL}/teacher/courses/${targetId}/quizzes`;
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: getHeaders(),
      body: JSON.stringify(quizForm),
    });
    if (res.ok) {
      closeModal();
      fetchData();
    }
  };

  const handleDelete = async (type: string, id: number) => {
    if (!confirm(`Delete this ${type.slice(0, -1)}?`)) return;
    const res = await fetch(`${API_URL}/teacher/${type}/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (res.ok) fetchData();
  };

  if (loading && courses.length === 0)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-yellow-500" />
      </div>
    );

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-gray-950 flex flex-col font-sans transition-colors duration-300">
      <header className="h-[80px] bg-white dark:bg-gray-900 border-b border-gray-200/50 dark:border-gray-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-20 shadow-sm backdrop-blur-xl bg-opacity-80 dark:bg-opacity-80">
        <h1 className="font-extrabold text-gray-900 dark:text-gray-100 mt-1 flex items-center gap-2">
          <span className="text-yellow-600 dark:text-yellow-500 text-xl sm:text-2xl font-black tracking-tight">EduVibe</span>{" "}
          <span className="text-sm sm:text-lg opacity-80 border-l border-gray-300 dark:border-gray-700 pl-2 hidden sm:inline">Instructor</span>
        </h1>
        <nav className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl sm:rounded-2xl gap-1 border border-gray-200/50 dark:border-gray-700/50 shadow-inner">
          <button
            onClick={() => setActiveTab("courses")}
            className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs font-black tracking-widest transition-all duration-300 ${
              activeTab === "courses"
                ? "bg-white dark:bg-gray-900 shadow-md text-gray-900 dark:text-gray-100 scale-[1.02]"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <span className="hidden sm:inline">CURRICULUM</span>
            <span className="sm:hidden">Courses</span>
          </button>
          <button
            onClick={() => setActiveTab("grading")}
            className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs font-black tracking-widest transition-all duration-300 ${
              activeTab === "grading"
                ? "bg-white dark:bg-gray-900 shadow-md text-gray-900 dark:text-gray-100 scale-[1.02]"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <span className="hidden sm:inline">GRADING</span>
            <span className="sm:hidden">Grade</span>
          </button>
        </nav>
      </header>

      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex-1">
        {activeTab === "courses" ? (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-3">
                 <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-500 rounded-lg sm:rounded-xl">
                   <GraduationCap size={24} className="sm:w-7 sm:h-7" />
                 </div>
                 <span className="hidden sm:inline">Studio Curriculum Manager</span>
                 <span className="sm:hidden">My Courses</span>
              </h2>
              <button
                onClick={() => {
                  setModalMode("COURSE");
                  setIsEdit(false);
                }}
                className="w-full sm:w-auto bg-gray-900 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500 text-white dark:text-gray-900 px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-gray-900/20 dark:shadow-yellow-900/20 transform hover:-translate-y-0.5"
              >
                <Plus size={18} strokeWidth={3} /> Create Course
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-200/60 dark:border-gray-800 shadow-xl shadow-gray-200/30 dark:shadow-black/20 hover:shadow-2xl transition-all flex flex-col group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/5 dark:from-yellow-400/10 to-transparent rounded-bl-full pointer-events-none"></div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-6">
                    <div className="flex items-center gap-5">
                      {course.image ? (
                        <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white dark:border-gray-800 shadow-lg shrink-0">
                          <img
                            src={`${STORAGE_URL}/${course.image}`}
                            className="w-full h-full object-cover"
                            alt="Thumb"
                            onError={(e) =>
                              (e.currentTarget.src =
                                "https://images.unsplash.com/photo-1501504905953-f84476b0dfbb?q=80&w=200&auto=format&fit=crop")
                            }
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-300 dark:text-gray-600 border border-gray-100 dark:border-gray-700 shadow-sm shrink-0">
                          <ImageIcon size={32} />
                        </div>
                      )}
                      <div>
                        <h3 className="font-black text-2xl text-gray-900 dark:text-gray-100 tracking-tight leading-tight line-clamp-2">
                          {course.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-2">
                           <span className="text-sm font-black text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                             ${course.price}
                           </span>
                           <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Id: {course.id}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 w-full sm:w-auto self-start sm:self-center shrink-0 bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <button
                        onClick={() => openEdit("COURSE", course)}
                        className="p-2.5 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700"
                        title="Edit Course"
                      >
                        <Edit3 size={18} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => handleDelete("courses", course.id)}
                        className="p-2.5 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700"
                        title="Delete Course"
                      >
                        <Trash2 size={18} strokeWidth={2.5}/>
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3 border-t border-gray-100 dark:border-gray-800 pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Curriculum Contents</h4>
                      <div className="flex gap-2">
                         <button
                           onClick={() => { setTargetId(course.id); setModalMode("LESSON"); setIsEdit(false); }}
                           className="text-[10px] font-black uppercase bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50 px-3 py-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition tracking-widest shadow-sm flex items-center gap-1"
                         >
                           <Plus size={12}/> Lesson
                         </button>
                         <button
                           onClick={() => { setTargetId(course.id); setModalMode("QUIZ"); setIsEdit(false); }}
                           className="text-[10px] font-black uppercase bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800/50 px-3 py-1.5 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition tracking-widest shadow-sm flex items-center gap-1"
                         >
                           <Plus size={12}/> Quiz
                         </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {course.lessons?.map((l: any, i: number) => (
                        <div key={l.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-3.5 rounded-xl border border-gray-200/50 dark:border-gray-700/50 group hover:border-blue-200 dark:hover:border-blue-800/50 transition-colors">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <span className="w-6 h-6 rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-[10px] font-black text-gray-400 dark:text-gray-500">{i+1}</span>
                            <Video size={16} className="text-blue-500/70 flex-shrink-0" />
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300 truncate">{l.title}</span>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                            <button onClick={() => openEdit("LESSON", l)} className="p-1.5 bg-white dark:bg-gray-700 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600"><Edit3 size={14} /></button>
                            <button onClick={() => handleDelete("lessons", l.id)} className="p-1.5 bg-white dark:bg-gray-700 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600"><X size={14} /></button>
                          </div>
                        </div>
                      ))}
                      {course.quizzes?.map((q: any) => (
                        <div key={q.id} className="flex items-center justify-between bg-purple-50/50 dark:bg-purple-900/10 p-3.5 rounded-xl border border-purple-100 dark:border-purple-800/30 group hover:border-purple-200 dark:hover:border-purple-800/60 transition-colors">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <span className="w-6 h-6 rounded-md bg-white dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800 flex items-center justify-center text-[10px] font-black text-purple-400">Q</span>
                            <HelpCircle size={16} className="text-purple-400 flex-shrink-0" />
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300 truncate">{q.question}</span>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                            <button onClick={() => openEdit("QUIZ", q)} className="p-1.5 bg-white dark:bg-gray-700 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg shadow-sm border border-purple-50 dark:border-purple-900/50"><Edit3 size={14} /></button>
                            <button onClick={() => handleDelete("quizzes", q.id)} className="p-1.5 bg-white dark:bg-gray-700 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg shadow-sm border border-purple-50 dark:border-purple-900/50"><X size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-200 dark:border-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-none overflow-hidden animate-in fade-in duration-500">
            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
              <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-3">
                 <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 rounded-xl">
                   <HelpCircle size={24} />
                 </div>
                 Student Assignment Submissions
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              {submissions.length === 0 ? (
                 <div className="py-24 text-center">
                   <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 mb-4">
                      <GraduationCap size={32}/>
                   </div>
                   <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">No Submissions Yet</h3>
                   <p className="text-sm text-gray-500 mt-1">When students complete their final assignments, they will appear here for grading.</p>
                 </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-800/50 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest border-b border-gray-200 dark:border-gray-800">
                    <tr>
                      <th className="p-6 pl-8">Student Name</th>
                      <th className="p-6">Enrolled Course</th>
                      <th className="p-6">Final Project Link</th>
                      <th className="p-6 pr-8 text-right">Grading Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {submissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-yellow-50/30 dark:hover:bg-yellow-900/5 transition-colors group">
                        <td className="p-6 pl-8">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                              {sub.user?.name?.[0].toUpperCase()}
                            </div>
                            <span className="font-bold text-sm text-gray-900 dark:text-gray-100">{sub.user?.name}</span>
                          </div>
                        </td>
                        <td className="p-6">
                           <span className="text-xs font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                             {sub.course?.title}
                           </span>
                        </td>
                        <td className="p-6">
                          <a
                            href={sub.submission_link}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-xs bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                          >
                            Explore Source <ExternalLink size={12} />
                          </a>
                        </td>
                        <td className="p-6 pr-8 text-right">
                          {sub.status === "GRADED" ? (
                            <span className="inline-flex items-center gap-1.5 text-green-700 dark:text-green-400 font-black text-xs bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-xl border border-green-200 dark:border-green-800/50 shadow-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> PASS: {sub.grade}
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                const grade = prompt(`Assign grade for ${sub.user?.name} (e.g. A, B, 100):`);
                                if (grade && grade.trim() !== '') {
                                   fetch(`${API_URL}/teacher/submissions/${sub.id}/grade`, {
                                      method: "POST",
                                      headers: getHeaders(),
                                      body: JSON.stringify({ grade })
                                   }).then(res => {
                                      if(res.ok) fetchData();
                                   });
                                }
                              }}
                              className="bg-gray-900 dark:bg-yellow-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-yellow-600 dark:hover:bg-yellow-500 transition-colors shadow-md text-xs tracking-widest uppercase"
                            >
                              Issue Grade
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </main>

      {/* --- MODALS --- */}
      {modalMode && (
        <div className="fixed inset-0 bg-gray-900/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] w-full max-w-xl p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 dark:border-gray-800 relative animate-in zoom-in-95 duration-200 custom-scrollbar">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-5">
              <h3 className="font-extrabold text-2xl tracking-tighter text-gray-900 dark:text-gray-100 flex items-center gap-3">
                 <span className="p-2 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-500 rounded-lg">
                    {modalMode === "COURSE" ? <BookOpen size={20}/> : modalMode === "LESSON" ? <Video size={20}/> : <HelpCircle size={20}/>}
                 </span>
                 {isEdit ? "Update" : "New"} {modalMode === 'COURSE' ? 'curriculum' : modalMode.toLowerCase()}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            {modalMode === "COURSE" && (
              <form onSubmit={handleCourseSubmit} className="space-y-5 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 dark:bg-yellow-400/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
                {/* Title Input */}
                <input
                  required
                  value={courseForm.title}
                  placeholder="Official Course Title"
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl outline-none border border-gray-200/60 dark:border-gray-700/50 focus:border-yellow-600 dark:focus:border-yellow-500 focus:ring-2 focus:ring-yellow-600/20 dark:focus:ring-yellow-500/20 font-bold text-gray-900 dark:text-white placeholder-gray-400 transition-all shadow-sm"
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, title: e.target.value })
                  }
                />

                {/* Price Input */}
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-400">$</span>
                  <input
                    required
                    value={courseForm.price}
                    type="number"
                    step="0.01"
                    placeholder="Enrollment Price"
                    className="w-full p-4 pl-10 bg-gray-50 dark:bg-gray-800/50 rounded-2xl outline-none border border-gray-200/60 dark:border-gray-700/50 focus:border-yellow-600 dark:focus:border-yellow-500 focus:ring-2 focus:ring-yellow-600/20 dark:focus:ring-yellow-500/20 font-bold text-gray-900 dark:text-white placeholder-gray-400 transition-all shadow-sm"
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, price: e.target.value })
                    }
                  />
                </div>

                {/* Description Textarea */}
                <textarea
                  value={courseForm.description}
                  placeholder="Detailed Curriculum Description..."
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl outline-none border border-gray-200/60 dark:border-gray-700/50 focus:border-yellow-600 dark:focus:border-yellow-500 focus:ring-2 focus:ring-yellow-600/20 dark:focus:ring-yellow-500/20 font-medium text-gray-900 dark:text-gray-200 placeholder-gray-400 transition-all shadow-sm h-32 resize-none custom-scrollbar"
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      description: e.target.value,
                    })
                  }
                />

                {/* Assignment Instructions Textarea */}
                <textarea
                  value={courseForm.assignment_instructions}
                  placeholder="Instructions for Final Project/Assignment"
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl outline-none border border-gray-200/60 dark:border-gray-700/50 focus:border-yellow-600 dark:focus:border-yellow-500 focus:ring-2 focus:ring-yellow-600/20 dark:focus:ring-yellow-500/20 font-medium text-gray-900 dark:text-gray-200 placeholder-gray-400 transition-all shadow-sm h-32 resize-none custom-scrollbar"
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      assignment_instructions: e.target.value,
                    })
                  }
                />

                {/* Image Upload Box */}
                <div className="p-6 border-2 border-dashed rounded-2xl border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 flex flex-col items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors group cursor-pointer">
                  <div className="p-3 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
                    <ImageIcon className="text-gray-400 group-hover:text-yellow-500 transition-colors" size={32} />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="text-xs text-gray-500 dark:text-gray-400 file:cursor-pointer file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-black file:tracking-widest file:uppercase file:bg-yellow-50 file:text-yellow-700 dark:file:bg-yellow-900/20 dark:file:text-yellow-500 hover:file:bg-yellow-100 dark:hover:file:bg-yellow-900/40 file:transition-colors file:shadow-sm"
                    onChange={(e) =>
                      setCourseImage(e.target.files ? e.target.files[0] : null)
                    }
                  />
                </div>

                {/* Golden Gradient Button */}
                <button className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500 text-white dark:text-gray-900 py-5 rounded-2xl font-black text-lg shadow-xl shadow-gray-900/20 dark:shadow-yellow-900/20 transition-all transform active:scale-[0.98]">
                  {isEdit ? <Edit3 size={20}/> : <Plus strokeWidth={3} size={20}/>}
                  {isEdit ? "Commit Changes" : "Launch Course"}
                </button>
              </form>
            )}

            {modalMode === "LESSON" && (
              <form onSubmit={handleLessonSubmit} className="space-y-5">
                {/* Lesson Title */}
                <input
                  required
                  value={lessonForm.title}
                  placeholder="Lesson Title"
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl outline-none border border-gray-200/60 dark:border-gray-700/50 focus:border-yellow-600 dark:focus:border-yellow-500 focus:ring-2 focus:ring-yellow-600/20 dark:focus:ring-yellow-500/20 font-bold text-gray-900 dark:text-white placeholder-gray-400 transition-all shadow-sm"
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, title: e.target.value })
                  }
                />

                {/* Video URL */}
                <input
                  required
                  value={lessonForm.video_url}
                  placeholder="Video Embded URL (YouTube/Vimeo)"
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl outline-none border border-gray-200/60 dark:border-gray-700/50 focus:border-yellow-600 dark:focus:border-yellow-500 focus:ring-2 focus:ring-yellow-600/20 dark:focus:ring-yellow-500/20 font-bold text-gray-900 dark:text-white placeholder-gray-400 transition-all shadow-sm text-sm"
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, video_url: e.target.value })
                  }
                />

                {/* Sort Order */}
                <input
                  value={lessonForm.order_index ?? 0}
                  type="number"
                  placeholder="Lesson Index / Sort Order"
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl outline-none border border-gray-200/60 dark:border-gray-700/50 focus:border-yellow-600 dark:focus:border-yellow-500 focus:ring-2 focus:ring-yellow-600/20 dark:focus:ring-yellow-500/20 font-bold text-gray-900 dark:text-white placeholder-gray-400 transition-all shadow-sm"
                  onChange={(e) =>
                    setLessonForm({
                      ...lessonForm,
                      order_index: parseInt(e.target.value) || 0,
                    })
                  }
                />

                <button className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500 text-white dark:text-gray-900 py-5 rounded-2xl font-black text-lg shadow-xl shadow-gray-900/20 dark:shadow-yellow-900/20 transition-all transform active:scale-[0.98]">
                  {isEdit ? "Update Content" : "Mount Lesson"}
                </button>
              </form>
            )}

            {modalMode === "QUIZ" && (
              <form onSubmit={handleQuizSubmit} className="space-y-5">
                {/* Question Input */}
                <input
                  required
                  value={quizForm.question}
                  placeholder="Specific Quiz Prompt..."
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl outline-none border border-gray-200/60 dark:border-gray-700/50 focus:border-yellow-600 dark:focus:border-yellow-500 focus:ring-2 focus:ring-yellow-600/20 dark:focus:ring-yellow-500/20 font-bold text-gray-900 dark:text-white placeholder-gray-400 transition-all shadow-sm"
                  onChange={(e) =>
                    setQuizForm({ ...quizForm, question: e.target.value })
                  }
                />

                {/* Options Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {quizForm.options.map((opt, i) => (
                    <div key={i} className="relative group">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-black text-gray-500 dark:text-gray-300">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <input
                        required
                        value={opt}
                        placeholder={`Provide answer...`}
                        className="w-full pl-10 pr-3 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/50 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:border-yellow-600 dark:focus:border-yellow-500 focus:ring-2 focus:ring-yellow-600/20 transition-all shadow-sm placeholder-gray-400"
                        onChange={(e) => {
                          const newOpts = [...quizForm.options];
                          newOpts[i] = e.target.value;
                          setQuizForm({ ...quizForm, options: newOpts });
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Correct Answer Selector */}
                <select
                  value={quizForm.correct_answer ?? 0}
                  className="w-full p-4 bg-green-50 dark:bg-green-900/10 rounded-2xl outline-none border border-green-200 dark:border-green-800/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 font-bold text-green-800 dark:text-green-500 appearance-none shadow-sm cursor-pointer"
                  onChange={(e) =>
                    setQuizForm({
                      ...quizForm,
                      correct_answer: parseInt(e.target.value) || 0,
                    })
                  }
                >
                  {[0, 1, 2, 3].map((i) => (
                    <option key={i} value={i} className="font-bold text-black">
                      Correct Answer Must Be: Option {String.fromCharCode(65 + i)}
                    </option>
                  ))}
                </select>

                <button className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500 text-white dark:text-gray-900 py-5 rounded-2xl font-black text-lg shadow-xl shadow-gray-900/20 dark:shadow-yellow-900/20 transition-all transform active:scale-[0.98]">
                  {isEdit ? "Update Quiz Params" : "Inject Quiz to Vault"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
