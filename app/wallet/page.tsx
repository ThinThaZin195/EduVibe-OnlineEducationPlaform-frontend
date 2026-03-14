"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Wallet, Loader2, ArrowLeft, PlusCircle, CreditCard, ShieldCheck } from "lucide-react";

const API_URL = "https://eduvibe-onlineeducationplaform-production.up.railway.app/api";

type Transaction = {
  id: string;
  type: "topup" | "purchase";
  amount: number;
  date: string;
  description: string;
};

function WalletContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");
  const refillNeeded = searchParams.get("refill");

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [topUpAmount, setTopUpAmount] = useState<string>(refillNeeded || "50");
  const [processing, setProcessing] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/auth/login");

      try {
        const uRes = await fetch(`${API_URL}/user`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const uData = await uRes.json();
        setUser(uData);
        localStorage.setItem("currentUser", JSON.stringify(uData));

        const storedTx = localStorage.getItem("walletTransactions");
        if (storedTx) setTransactions(JSON.parse(storedTx));
      } catch (e) {
        console.error("Initialization failed");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [router]);

  const handleTopUp = async () => {
    const amount = Number(topUpAmount);
    if (!amount || amount <= 0) return alert("Please enter a valid amount.");

    setProcessing(true);
    const token = localStorage.getItem("token");

    // Simulate backend top up (Assuming backend has an endpoint or we just simulate it here for frontend demo)
    // If backend doesn't have a topup endpoint, we'll hit an error. Assuming student can topup.
    try {
      // Simulate a successful top up for UX; in a real app, call a backend endpoint.
      const newBalance = (Number(user?.wallet) || 0) + amount;
      const updatedUser = { ...user, wallet: newBalance };
      setUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      const newTx: Transaction = {
        id: `${Date.now()}`,
        type: "topup",
        amount,
        date: new Date().toISOString(),
        description: `Top up of $${amount}`,
      };

      const nextTransactions = [newTx, ...transactions].slice(0, 8);
      setTransactions(nextTransactions);
      localStorage.setItem("walletTransactions", JSON.stringify(nextTransactions));

      alert(`✅ Top up of $${amount} completed!`);

      if (courseId) {
        router.push(`/payment?courseId=${courseId}`);
      } else {
        setTopUpAmount("");
      }
    } catch (e) {
      alert("Top up failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Loader2 className="animate-spin text-yellow-600 dark:text-yellow-500" size={40} />
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-gray-950 py-12 px-4 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs font-semibold tracking-widest text-gray-500 dark:text-gray-400 uppercase">
              Wallet
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
              Your Wallet
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Add funds and keep track of your balance and activity.
            </p>
          </div>

          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Balance + Top Up */}
          <div className="rounded-[2.5rem] bg-white dark:bg-gray-900 shadow-2xl shadow-gray-200/40 dark:shadow-black/40 border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-8 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white relative overflow-hidden">
              <div className="absolute -top-14 -right-14 w-44 h-44 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-14 -left-14 w-44 h-44 bg-black/10 rounded-full blur-3xl" />

              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl shadow-lg shadow-black/20 mx-auto mb-4">
                <Wallet className="text-white" size={28} />
              </div>

              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                  Available Balance
                </p>
                <p className="mt-3 text-5xl font-black tracking-tight">
                  ${user?.wallet ?? 0}
                </p>
                <p className="text-sm text-white/80 mt-2">
                  Your wallet balance is ready to use for any course purchase.
                </p>
              </div>
            </div>

            <div className="p-8">
              {refillNeeded && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 p-4 rounded-2xl flex items-start gap-3 text-blue-800 dark:text-blue-400 mb-6">
                  <ShieldCheck size={18} className="shrink-0 mt-0.5 text-blue-500" />
                  <div className="text-xs font-bold leading-relaxed">
                    Please top up your wallet to proceed with the course enrollment.
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  Top Up Amount
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-400 dark:text-gray-500 text-lg">
                    $
                  </span>
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 p-5 bg-gray-50 dark:bg-gray-950 border-2 border-transparent dark:border-gray-800 rounded-2xl outline-none focus:border-yellow-500 dark:focus:border-yellow-500 focus:bg-white dark:focus:bg-gray-950 transition-all font-black text-xl text-gray-900 dark:text-gray-100 shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[20, 50, 100].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setTopUpAmount(amount.toString())}
                      className={`py-3 rounded-xl font-bold transition-all border ${
                        Number(topUpAmount) === amount
                          ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-600 dark:text-yellow-400"
                          : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-yellow-300"
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleTopUp}
                  disabled={processing}
                  className="w-full bg-gray-900 dark:bg-yellow-600 text-white dark:text-gray-950 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-gray-200/50 dark:shadow-yellow-900/30 flex items-center justify-center gap-2.5 hover:bg-black dark:hover:bg-yellow-500 transition-all active:scale-95 disabled:bg-gray-300 dark:disabled:bg-gray-800"
                >
                  {processing ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <PlusCircle size={18} />
                      <span>Add Funds</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="rounded-[2.5rem] bg-white dark:bg-gray-900 shadow-2xl shadow-gray-200/40 dark:shadow-black/40 border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-8 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Recent Activity
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Track your latest top-ups and purchases.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setTransactions([]);
                    localStorage.removeItem("walletTransactions");
                  }}
                  className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="p-6">
              {transactions.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  No transactions yet. Top up to see activity here.
                </div>
              ) : (
                <ul className="space-y-3">
                  {transactions.map((tx) => (
                    <li
                      key={tx.id}
                      className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800"
                    >
                      <div>
                        <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                          {tx.description}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(tx.date).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {tx.type === "topup" ? "+" : "-"}${tx.amount}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WalletPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <Loader2 className="animate-spin text-yellow-600 dark:text-yellow-500" size={40} />
      </div>
    }>
      <WalletContent />
    </Suspense>
  );
}