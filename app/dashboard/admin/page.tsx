"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { 
  ShieldCheck, Users, BookOpen, Trash2, Edit,
  Settings, Search, TrendingUp, UserCheck, 
  Bell, Mail, FileText, Send, Inbox, Plus, ChevronRight, X, Image as ImageIcon,
  Clock, MoreVertical, Printer, Megaphone, Globe, Download, LogOut, Calendar
} from "lucide-react";

const API_URL = "https://eduvibe-onlineeducationplaform-backend-production.up.railway.app/api";

export default function AdminDashboardTailwind() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("users");
  const [msgView, setMsgView] = useState("inbox");
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [stats, setStats] = useState({ total_registered: 0, active_teachers: 0, total_courses: 0 });
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  // --- NOTIFICATION & REPORT STATES ---
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notiForm, setNotiForm] = useState({ title: "", content: "", target_audience: "ALL" });
  const [reportType, setReportType] = useState("students");
  const [reportData, setReportData] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [courseForm, setCourseForm] = useState({ 
    title: "", description: "", price: "", teacher_id: "", assignment_instructions: "", image: null as File | null 
  });

  
  const [messageForm, setMessageForm] = useState({ receiver_id: "", subject: "", content: "" });

  useEffect(() => {
    fetchData();
    if (activeTab === "notifications") fetchNotifications();
    if (activeTab === "reports") fetchReportData();
  }, [activeTab, reportType]);

 
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    
    window.dispatchEvent(new Event("userChanged"));
    router.push("/"); 
  };

  const fetchData = async () => {
    const token = localStorage.getItem("token"); 
    const headers = { "Authorization": `Bearer ${token}`, "Accept": "application/json" };
    
    try {
      const statsRes = await fetch(`${API_URL}/admin/system-data`, { headers });
      const statsData = await statsRes.json();
      setStats({
          total_registered: statsData.total_users || 0,
          active_teachers: statsData.active_teachers || 0,
          total_courses: statsData.total_courses || 0
      });

      if (activeTab === "users") {
        const res = await fetch(`${API_URL}/admin/users`, { headers });
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      }

      if (activeTab === "courses") {
        const res = await fetch(`${API_URL}/courses`, { headers });
        const data = await res.json();
        setCourses(Array.isArray(data) ? data : []);
      }

      if (activeTab === "messages") {
        const res = await fetch(`${API_URL}/admin/messages/inbox`, { headers });
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      }
    } catch (error) { console.error("Fetch Error:", error); }
  };

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/notifications`, { headers: { "Authorization": `Bearer ${token}` } });
    const data = await res.json();
    setNotifications(Array.isArray(data) ? data : []);
  };

  const handleBroadcastNoti = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/admin/notifications`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(notiForm)
    });
    if (res.ok) { alert("Announcement Broadcasted!"); setNotiForm({ title: "", content: "", target_audience: "ALL" }); fetchNotifications(); }
  };

  const fetchReportData = async () => {
    setIsGenerating(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/admin/reports/${reportType}`, { headers: { "Authorization": `Bearer ${token}` } });
      const data = await res.json();
      setReportData(Array.isArray(data) ? data : []);
    } finally { setIsGenerating(false); }
  };

  const handlePrint = () => { window.print(); };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", courseForm.title);
    formData.append("description", courseForm.description);
    formData.append("price", courseForm.price);
    formData.append("teacher_id", courseForm.teacher_id);
    formData.append("assignment_instructions", courseForm.assignment_instructions);
    if (courseForm.image) formData.append("image", courseForm.image);

    const url = editingCourse ? `${API_URL}/admin/courses/${editingCourse.id}?_method=PUT` : `${API_URL}/admin/courses`;
    const res = await fetch(url, {
      method: "POST", 
      headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
      body: formData,
    });
    if (res.ok) { setShowCourseModal(false); setCourseForm({ title: "", description: "", price: "", teacher_id: "", assignment_instructions: "", image: null }); fetchData(); }
  };

  const handleDeleteCourse = async (id: number) => {
    if (!confirm("Delete this course?")) return;
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/admin/courses/${id}`, { method: 'DELETE', headers: { "Authorization": `Bearer ${token}` } });
    setCourses(courses.filter(c => c.id !== id));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/admin/messages/send`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(messageForm)
    });
    if (res.ok) { alert("Message Sent!"); setMsgView("inbox"); fetchData(); }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Remove user?")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/admin/users/${id}`, { method: 'DELETE', headers: { "Authorization": `Bearer ${token}` } });
    if(res.ok) setUsers(users.filter((u: any) => u.id !== id));
  };

  return (
    <div className="h-[calc(100vh-80px)] md:h-screen w-full bg-slate-50 flex text-slate-900 font-sans overflow-hidden">
      <style jsx global>{`
        @media print {
          aside, header, .no-print, button { display: none !important; }
          .printable-content { display: block !important; width: 100% !important; margin: 0 !important; padding: 0 !important; }
          .bg-slate-50 { background-color: white !important; }
        }
      `}</style>

      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shadow-sm no-print shrink-0 relative">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="bg-slate-900 p-2 rounded-lg text-white"><ShieldCheck size={20} /></div>
          <h1 className="font-bold text-lg tracking-tight text-yellow-600">EduVibe</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <NavItem icon={<Users size={18} />} label="Users" active={activeTab === "users"} onClick={() => setActiveTab("users")} />
          <NavItem icon={<BookOpen size={18} />} label="Courses" active={activeTab === "courses"} onClick={() => setActiveTab("courses")} />
          <NavItem icon={<Mail size={18} />} label="Messaging" active={activeTab === "messages"} onClick={() => setActiveTab("messages")} />
          <NavItem icon={<Bell size={18} />} label="Notifications" active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} />
          <NavItem icon={<FileText size={18} />} label="Reports" active={activeTab === "reports"} onClick={() => setActiveTab("reports")} />
        </nav>
        
        {/* LOGOUT BUTTON */}
        <div className="p-4 border-t border-slate-100">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
           >
             <LogOut size={18} /> Logout
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shrink-0 no-print">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Administrator Portal</h2>
          {activeTab === "reports" && (
            <button onClick={handlePrint} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
              <Printer size={14}/> PRINT REPORT
            </button>
          )}
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">A</div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full printable-content">
          {/* STATS */}
          <div className="grid grid-cols-3 gap-6 mb-8 no-print">
            <StatCard label="Total Users" value={stats.total_registered} />
            <StatCard label="Live Courses" value={stats.total_courses} />
            <StatCard label="Revenue" value={`$${stats.total_registered * 10}`} />
          </div>

          {/* TAB: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 h-fit">
                <h3 className="font-bold mb-4 flex items-center gap-2"><Megaphone size={18} className="text-blue-600"/> Broadcast</h3>
                <form onSubmit={handleBroadcastNoti} className="space-y-4">
                  <select className="w-full p-2 bg-slate-50 border rounded-lg text-sm" value={notiForm.target_audience} onChange={e => setNotiForm({...notiForm, target_audience: e.target.value})}>
                    <option value="ALL">Everyone</option>
                    <option value="TEACHERS">Teachers</option>
                    <option value="STUDENTS">Students</option>
                  </select>
                  <input required placeholder="Headline" className="w-full p-2 border rounded-lg text-sm" value={notiForm.title} onChange={e => setNotiForm({...notiForm, title: e.target.value})}/>
                  <textarea required rows={4} placeholder="Content Detail..." className="w-full p-2 border rounded-lg text-sm" value={notiForm.content} onChange={e => setNotiForm({...notiForm, content: e.target.value})}/>
                  <button type="submit" className="w-full bg-blue-600 text-black py-2 rounded-lg font-bold text-sm">SEND NOTIFICATION</button>
                </form>
              </div>
              <div className="md:col-span-2 space-y-4">
                {notifications.map(n => (
                  <div key={n.id} className="bg-white p-4 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-blue-500 uppercase">{n.target_audience}</span>
                    <h4 className="font-bold text-slate-800">{n.title}</h4>
                    <p className="text-xs text-slate-500">{n.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: REPORTS */}
          {activeTab === "reports" && (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Navigation Buttons */}
          <div className="flex gap-4 no-print items-center">
            <div className="flex bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm">
              {['students', 'courses', 'assessments'].map(t => (
                <button 
                  key={t} 
                  onClick={() => setReportType(t)} 
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 uppercase tracking-widest ${
                    reportType === t 
                      ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-600/30 transform scale-[1.02]' 
                      : 'bg-transparent text-gray-500 hover:text-yellow-600 hover:bg-yellow-50/50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            
            <div className="ml-auto flex gap-3">
              <button onClick={handlePrint} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 right-0 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm font-bold text-xs uppercase tracking-widest">
                <Printer size={16} /> Print
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 border border-gray-900 text-white rounded-xl hover:bg-black transition-all shadow-sm shadow-gray-900/20 font-bold text-xs uppercase tracking-widest">
                <Download size={16} /> Export
              </button>
            </div>
          </div>

          {/* Report Card */}
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-2xl shadow-gray-200/50">
            {/* Report Header */}
            <div className="p-8 border-b border-gray-100 bg-gradient-to-br from-yellow-50/50 via-white to-white flex items-center justify-between no-print">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 bg-yellow-100 text-yellow-700 rounded-xl">
                    <FileText size={24} strokeWidth={2.5} />
                  </div>
                  <h3 className="font-extrabold text-gray-900 capitalize text-2xl tracking-tight">
                    {reportType} Official Report
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-gray-400 font-bold text-[11px] uppercase tracking-widest ml-14">
                  <Calendar size={14} className="text-yellow-600/70" />
                  <span>Generated by EduVibe System — {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="flex items-center gap-1.5 text-[10px] font-black text-red-600 bg-red-50 border border-red-100 px-4 py-1.5 rounded-full tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                  INTERNAL USE ONLY
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              {isGenerating ? (
                <div className="py-32 flex flex-col items-center justify-center text-yellow-600">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mb-4"></div>
                  <p className="font-bold text-sm animate-pulse tracking-widest uppercase">Compiling Data...</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-500 tracking-widest border-b border-gray-200">
                    <tr>
                      <th className="px-8 py-5 w-1/2">Title / Full Name</th>
                      <th className="px-8 py-5 w-1/4">Metric / Performance</th>
                      <th className="px-8 py-5 w-1/4 text-right">Registered Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {reportData.length > 0 ? reportData.map((r, i) => (
                      <tr key={i} className="hover:bg-yellow-50/20 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                              {(r.name || r.title || "?")[0].toUpperCase()}
                            </div>
                            <span className="text-sm font-bold text-gray-900 group-hover:text-yellow-700 transition-colors">
                              {r.name || r.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-gray-50 text-gray-700 border border-gray-200 shadow-sm">
                            {r.email || (r.price ? `$${r.price}` : "Active Status")}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className="text-xs font-bold text-gray-400 tabular-nums">
                            {new Date(r.created_at).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={3} className="px-8 py-20 text-center text-gray-400 font-medium">
                          No {reportType} data found to report at this time.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
            
            {/* Footer summary */}
            <div className="p-6 bg-gray-50/50 text-center border-t border-gray-100 flex justify-between items-center">
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                 End of {reportType} report
               </p>
               <p className="text-xs text-gray-900 font-black tracking-wider bg-white border border-gray-200 px-4 py-1.5 rounded-full shadow-sm">
                 TOTAL ENTRIES: {reportData.length}
               </p>
            </div>
          </div>
        </div>
      )}

          {/* TAB 1: USERS */}
          {activeTab === "users" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden no-print">
               <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase border-b">
                    <tr><th className="px-6 py-3">Name</th><th className="px-6 py-3">Role</th><th className="px-6 py-3">Balance</th><th className="px-6 py-3 text-right">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {users.map((u: any) => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4"><p className="text-sm font-bold">{u.name}</p><p className="text-xs text-slate-400">{u.email}</p></td>
                        <td className="px-6 py-4 font-bold text-[10px] uppercase text-slate-500">{u.role}</td>
                        <td className="px-6 py-4 text-sm font-bold">${u.wallet}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleDeleteUser(u.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          )}

          {/* TAB 2: COURSES */}
          {activeTab === "courses" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden no-print">
               <div className="px-6 py-4 border-b bg-slate-50/50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-700 text-sm">Course Catalog</h3>
                  <button onClick={() => { setEditingCourse(null); setShowCourseModal(true); }} className="text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-lg flex items-center gap-2"><Plus size={14} /> NEW COURSE</button>
               </div>
               <div className="p-6 space-y-4">
                  {courses.map((course: any) => (
                    <div key={course.id} className="flex items-center justify-between p-4 border rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border">
                           {course.image ? <img src={`https://eduvibe-onlineeducationplaform-backend-production.up.railway.app/storage/${course.image}`} className="w-full h-full object-cover" alt="" /> : <BookOpen size={20} className="text-slate-400" />}
                        </div>
                        <div><p className="text-sm font-bold">{course.title}</p><p className="text-xs text-slate-400">Teacher ID: {course.teacher_id}</p></div>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => { setEditingCourse(course); setShowCourseModal(true); }} className="p-2 text-slate-400 hover:text-blue-600"><Edit size={18} /></button>
                         <button onClick={() => handleDeleteCourse(course.id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* TAB 3: MESSAGING */}
          {activeTab === "messages" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex h-full max-h-[calc(100vh-140px)] no-print">
               <div className="w-80 border-r border-slate-100 flex flex-col">
                  <div className="p-4 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Inbox</h3>
                    <button onClick={() => setMsgView("compose")} className="p-2 bg-blue-600  text-black rounded-lg"><Plus size={16}/></button>
                  </div>
                  <div className="overflow-y-auto flex-1">
                    {messages.map((m: any) => (
                      <div key={m.id} onClick={() => {setSelectedMessage(m); setMsgView("inbox");}} className={`p-4 border-b cursor-pointer transition-colors ${selectedMessage?.id === m.id ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}>
                         <p className="text-xs font-bold text-blue-600">User ID: {m.sender_id}</p>
                         <p className="text-sm font-bold text-slate-700 truncate">{m.subject}</p>
                      </div>
                    ))}
                  </div>
               </div>
               <div className="flex-1 bg-white flex flex-col overflow-hidden">
                  {msgView === "compose" ? (
                    <div className="p-8 h-full overflow-y-auto">
                       <div className="flex justify-between items-center mb-6">
                          <h2 className="text-lg font-bold">New Message</h2>
                          <button onClick={() => setMsgView("inbox")}><X size={20} className="text-slate-400"/></button>
                       </div>
                       <form onSubmit={handleSendMessage} className="space-y-4 max-w-xl">
                          <input required placeholder="Recipient ID" className="w-full p-3 bg-slate-50 border rounded-xl text-sm" onChange={(e)=>setMessageForm({...messageForm, receiver_id: e.target.value})} />
                          <input required placeholder="Subject" className="w-full p-3 bg-slate-50 border rounded-xl text-sm" onChange={(e)=>setMessageForm({...messageForm, subject: e.target.value})} />
                          <textarea required placeholder="Message content..." rows={8} className="w-full p-3 bg-slate-50 border rounded-xl text-sm resize-none" onChange={(e)=>setMessageForm({...messageForm, content: e.target.value})} />
                          <button type="submit" className="bg-blue-600 text-black px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 flex items-center gap-2">
                             <Send size={16}/> SEND
                          </button>
                       </form>
                    </div>
                  ) : selectedMessage ? (
                    <div className="h-full flex flex-col">
                       <div className="p-6 border-b flex justify-between bg-slate-50/20 items-center">
                          <div>
                            <h4 className="font-bold text-slate-800">{selectedMessage.subject}</h4>
                            <p className="text-xs text-slate-500">From User ID: {selectedMessage.sender_id}</p>
                          </div>
                          <button className="text-slate-400 hover:text-red-500"><Trash2 size={18}/></button>
                       </div>
                       <div className="p-8 overflow-y-auto text-sm text-slate-600 leading-relaxed">
                          <div className="flex items-center gap-2 text-slate-400 mb-6 text-xs italic"><Clock size={12}/> Received: {new Date(selectedMessage.created_at).toLocaleDateString()}</div>
                          {selectedMessage.content}
                       </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                       <Mail size={48} className="mb-4 opacity-20"/>
                       <p className="text-sm font-medium">Select a message to read</p>
                    </div>
                  )}
               </div>
            </div>
          )}
        </div>

        {/* MODALS */}
        {showCourseModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 no-print">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
              <div className="flex justify-between items-center"><h3 className="font-bold">Course Details</h3><button onClick={()=>setShowCourseModal(false)}><X size={20}/></button></div>
              <form onSubmit={handleSaveCourse} className="space-y-4">
                <input type="file" onChange={(e)=>setCourseForm({...courseForm, image: e.target.files ? e.target.files[0] : null})} className="text-xs" />
                <input required placeholder="Title" value={courseForm.title} onChange={(e)=>setCourseForm({...courseForm, title: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                <textarea placeholder="Instructions" value={courseForm.assignment_instructions} onChange={(e)=>setCourseForm({...courseForm, assignment_instructions: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                <div className="grid grid-cols-2 gap-4">
                  <input required type="number" placeholder="Price" value={courseForm.price} onChange={(e)=>setCourseForm({...courseForm, price: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                  <input required placeholder="Teacher ID" value={courseForm.teacher_id} onChange={(e)=>setCourseForm({...courseForm, teacher_id: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold">SAVE</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Sub-components
function NavItem({ icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${active ? "bg-slate-900 text-white shadow-lg shadow-slate-200" : "text-slate-500 hover:bg-slate-100"}`}>
      {icon} {label}
    </button>
  );
}

function StatCard({ label, value }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm no-print">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
    </div>
  );
}