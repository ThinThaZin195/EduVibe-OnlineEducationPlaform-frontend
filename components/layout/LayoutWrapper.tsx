"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Booter from "@/components/layout/Booter";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith("/auth");

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Navbar />}

      <main
        className={`flex-1 ${isAuthPage ? "overflow-hidden flex items-center justify-center" : "overflow-y-auto pb-20"}`}
      >
        {children}
      </main>


      {!isAuthPage && <Booter />}
    </div>
  );
}