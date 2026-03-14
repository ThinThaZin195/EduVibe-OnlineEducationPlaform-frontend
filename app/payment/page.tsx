"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { 
  CreditCard, Wallet, Lock, Loader2, CheckCircle, 
  X, AlertCircle, ShieldCheck, ArrowLeft 
} from "lucide-react";

const API_URL = "https://eduvibe-onlineeducationplaform-production.up.railway.app/api";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get("courseId");

  const [course, setCourse] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const u = JSON.parse(localStorage.getItem("currentUser") || "null");
      const token = localStorage.getItem("token");

      if (!u || !token) {
        router.push("/auth/login");
        return;
      }
      setUser(u);

      try {
        const res = await fetch(`${API_URL}/courses/${courseId}`);
        const data = await res.json();
        setCourse(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchData();
  }, [courseId, router]);

  const handlePay = async (method: "card" | "wallet") => {
    if (method === "wallet" && user.wallet < course.price) {
      if (user.age < 18) {
        alert("Insufficient funds. Please ask your parent to top up your wallet.");
      } else {
        router.push(`/wallet?refill=${course.price}&courseId=${courseId}`);
      }
      return;
    }

    setProcessing(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/courses/${courseId}/enroll`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ payment_method: method }),
      });

      if (res.ok) {
        setPaymentSuccess(true);
        const userRes = await fetch(`${API_URL}/user`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const updatedUser = await userRes.json();
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));

        setTimeout(() => {
          router.push(`/my-courses`);
          window.dispatchEvent(new Event("userChanged"));
        }, 2000);
      } else {
        const data = await res.json();
        alert(data.error || "Payment declined.");
        setProcessing(false);
      }
    } catch (err) {
      alert("System error.");
      setProcessing(false);
    }
  };

  if (loading) return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Loader2 className="animate-spin text-yellow-600 dark:text-yellow-500" size={40} />
    </div>
  );

  if (paymentSuccess) return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center text-center p-6 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="w-24 h-24 bg-green-50 dark:bg-green-900/40 rounded-full flex items-center justify-center mb-6 shadow-inner border border-green-100 dark:border-green-800 animate-in zoom-in slide-in-from-bottom-4 duration-500">
        <CheckCircle className="text-green-500 dark:text-green-400 animate-bounce" size={48} />
      </div>
      <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100 uppercase tracking-tighter animate-in fade-in duration-700">Payment Verified!</h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium animate-in fade-in duration-700 delay-150">Welcome to {course?.title}. Redirecting to your classroom...</p>
    </div>
  );

  const isRestricted = user?.role === "student" && user?.age < 18;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-gray-950 py-12 px-4 text-black transition-colors duration-300">
      <div className="max-w-md mx-auto relative animate-in fade-in slide-in-from-bottom-8 duration-700">
        <button 
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors mb-6 text-xs font-black uppercase tracking-widest"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-100 dark:border-gray-800 overflow-hidden relative z-10">
          {/* Summary Header */}
          <div className="p-8 bg-gray-900 dark:bg-gray-950 text-white text-center border-b border-gray-800">
            <h1 className="text-xl font-black uppercase tracking-tighter opacity-80 mb-1 text-gray-300">Checkout</h1>
            <p className="text-sm font-bold text-gray-400 truncate px-4">{course?.title}</p>
            <div className="mt-4 text-5xl font-black text-yellow-500 tracking-tighter animate-pulse">${course?.price}</div>
          </div>

          <div className="p-8 space-y-6">
            {/* Balance Warning */}
            {user.wallet < course?.price && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 p-4 rounded-2xl flex items-start gap-3 text-amber-800 dark:text-amber-400 animate-in fade-in duration-500">
                    <AlertCircle size={18} className="shrink-0 mt-0.5 text-amber-500" />
                    <div className="text-xs font-bold leading-relaxed">
                      Your wallet balance <span className="underline decoration-amber-300/50">(${user.wallet})</span> is too low.
                    </div>
                </div>
            )}

            <div className="space-y-4">
              <button
                onClick={() => setShowCardForm(true)}
                disabled={isRestricted}
                className={`w-full group flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 ${
                  isRestricted 
                  ? "bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-300 dark:text-gray-500 cursor-not-allowed" 
                  : "border-gray-100 dark:border-gray-800 hover:border-blue-600 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 text-gray-900 dark:text-gray-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isRestricted ? "bg-gray-100 dark:bg-gray-700/50 text-gray-300 dark:text-gray-500" : "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:scale-110 duration-300"}`}>
                    <CreditCard size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-sm uppercase tracking-tight">Credit / Debit Card</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pay via Secure Gateway</p>
                  </div>
                </div>
                {isRestricted ? <Lock size={16} /> : <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700 group-hover:bg-blue-600 dark:group-hover:bg-blue-500 transition-colors"></div>}
              </button>

              <button
                onClick={() => handlePay("wallet")}
                className="w-full group flex items-center justify-between p-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 hover:border-yellow-500 dark:hover:border-yellow-500 hover:bg-yellow-50/50 dark:hover:bg-yellow-900/20 text-gray-900 dark:text-gray-100 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-500 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
                    <Wallet size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-sm uppercase tracking-tight">EduVibe Wallet</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Balance: ${user?.wallet}</p>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700 group-hover:bg-yellow-500 transition-colors"></div>
              </button>
            </div>
          </div>

          <div className="px-8 py-5 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 flex items-center justify-center gap-2">
            <ShieldCheck size={16} className="text-gray-400 dark:text-gray-500" />
            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Secure SSL Encrypted Checkout</span>
          </div>
        </div>
      </div>

      {/* --- BANK INFO MODAL --- */}
      {showCardForm && (
        <div className="fixed inset-0 bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-gray-800 relative animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300">
            <button onClick={() => setShowCardForm(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 dark:text-gray-500 transition-colors"><X size={20} /></button>

            <div className="flex flex-col items-center mb-8 text-center">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-sm"><CreditCard size={28} /></div>
              <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 uppercase tracking-tighter">Secure Card Payment</h3>
              <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest leading-none">Transactions are encrypted</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handlePay("card"); }} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cardholder Name</label>
                <input required type="text" placeholder="John S. Doe" className="w-full p-4 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 dark:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-500 transition-all font-bold text-sm text-gray-900 dark:text-gray-100" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Card Number</label>
                <input required type="text" maxLength={16} placeholder="0000 0000 0000 0000" className="w-full p-4 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 dark:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-500 transition-all font-bold text-sm text-gray-900 dark:text-gray-100" />
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Expiry</label>
                  <input required type="text" placeholder="MM/YY" className="w-full p-4 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 dark:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-500 transition-all font-bold text-sm text-gray-900 dark:text-gray-100" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">CVV</label>
                  <input required type="password" maxLength={3} placeholder="•••" className="w-full p-4 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 ring-blue-500/20 dark:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-500 transition-all font-bold text-sm text-gray-900 dark:text-gray-100" />
                </div>
              </div>

              <button 
                disabled={processing} 
                className="w-full bg-gray-900 dark:bg-blue-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-gray-200/50 dark:shadow-blue-900/30 flex items-center justify-center gap-2.5 hover:bg-black dark:hover:bg-blue-500 transition-all active:scale-95 mt-2 disabled:bg-gray-300 dark:disabled:bg-gray-800"
              >
                {processing ? <Loader2 className="animate-spin" size={20} /> : <><Lock size={14} /><span>Authorize ${course?.price}</span></>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="animate-spin text-yellow-600 dark:text-yellow-500" size={40} />
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}