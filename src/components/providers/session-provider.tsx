"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Clock, AlertTriangle, RefreshCw, LogOut, ShieldCheck } from "lucide-react";

export interface SessionUser {
  id?: string;
  name?: string | null;
  firstName?: string;
  lastName?: string;
  email?: string | null;
  phone?: string;
  image?: string | null;
  roles?: string[];
  department?: string | null;
  departmentId?: string | null;
  position?: string | null;
}

export interface SessionData {
  user?: SessionUser;
  expires?: string;
}

interface SessionContextType {
  data: SessionData | null;
  status: "authenticated" | "unauthenticated" | "loading";
  remainingSeconds: number;
  extendSession: () => void;
  updateProfile: (updated: Partial<SessionUser>) => void;
}

const defaultAdminUser: SessionUser = {
  id: "e4a2d8a0-4a8a-4c22-9f33-111111111111",
  name: "นายสมศักดิ์ สุขใจ",
  firstName: "สมศักดิ์",
  lastName: "สุขใจ",
  email: "somsak.s@doigam.go.th",
  phone: "081-999-8877",
  position: "ปลัด อบต.ดอยงาม (Super Admin)",
  department: "สำนักปลัด อบต.ดอยงาม",
  roles: ["SUPER_ADMIN", "ADMIN", "PALAD"],
};

const DEFAULT_SESSION_HOURS = 8; // 8 Official Government Working Hours (08:30 - 16:30)

const SessionContext = createContext<SessionContextType>({
  data: { user: defaultAdminUser },
  status: "authenticated",
  remainingSeconds: DEFAULT_SESSION_HOURS * 3600,
  extendSession: () => {},
  updateProfile: () => {},
});

export function SessionProvider({
  children,
  session = null,
}: {
  children: React.ReactNode;
  session?: SessionData | null;
}) {
  const [currentUser, setCurrentUser] = useState<SessionUser>(() => {
    if (session?.user) return session.user;
    return defaultAdminUser;
  });

  const [remainingSeconds, setRemainingSeconds] = useState<number>(DEFAULT_SESSION_HOURS * 3600);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [isExtending, setIsExtending] = useState(false);

  // Extend session handler (เพิ่มเวลา Session อีก 8 ชั่วโมง)
  const extendSession = useCallback(() => {
    setIsExtending(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("smartsarabun_session_login_time", Date.now().toString());
      sessionStorage.setItem("smartsarabun_session_active", "true");
    }
    setRemainingSeconds(DEFAULT_SESSION_HOURS * 3600);
    setShowWarningModal(false);
    setTimeout(() => setIsExtending(false), 500);
  }, []);

  // Hydrate from localStorage on client and initialize Session Tracking
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if user profile is saved
    const saved = localStorage.getItem("smartsarabun_user_profile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCurrentUser((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        // ignore
      }
    }

    // Initialize or verify session timestamp
    let loginTime = localStorage.getItem("smartsarabun_session_login_time");
    if (!loginTime) {
      loginTime = Date.now().toString();
      localStorage.setItem("smartsarabun_session_login_time", loginTime);
      sessionStorage.setItem("smartsarabun_session_active", "true");
    }

    // Timer loop: checks remaining seconds every 1 second
    const interval = setInterval(() => {
      const currentLoginTime = Number(localStorage.getItem("smartsarabun_session_login_time") || Date.now());
      const maxDurationMs = DEFAULT_SESSION_HOURS * 3600 * 1000;
      const elapsedMs = Date.now() - currentLoginTime;
      const leftSec = Math.max(0, Math.floor((maxDurationMs - elapsedMs) / 1000));

      setRemainingSeconds(leftSec);

      // Warning when less than 180 seconds (3 minutes) left
      if (leftSec > 0 && leftSec <= 180) {
        setShowWarningModal(true);
      } else if (leftSec <= 0) {
        // Auto logout when 8-hour government session expires
        clearInterval(interval);
        signOut({ callbackUrl: "/login?reason=session_expired" });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const updateProfile = (updated: Partial<SessionUser>) => {
    setCurrentUser((prev) => {
      const next = { ...prev, ...updated };
      if (updated.firstName || updated.lastName) {
        const title = prev.name?.startsWith("นางสาว") ? "นางสาว" : prev.name?.startsWith("นาง") ? "นาง" : "นาย";
        next.name = `${title}${updated.firstName || prev.firstName || ""} ${updated.lastName || prev.lastName || ""}`.trim();
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("smartsarabun_user_profile", JSON.stringify(next));
      }
      return next;
    });
  };

  const formatHoursMinutes = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${hours} ชม. ${minutes} นาที`;
    }
    return `${minutes} นาที ${seconds} วิ`;
  };

  return (
    <SessionContext.Provider
      value={{
        data: { user: currentUser },
        status: "authenticated",
        remainingSeconds,
        extendSession,
        updateProfile,
      }}
    >
      {children}

      {/* Session Expiry Warning Modal (นับถอยหลัง 3 นาทีก่อนหมดเวลาราชการ 8 ชม.) */}
      {showWarningModal && (
        <div className="fixed inset-0 z-[999999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border-2 border-amber-400 space-y-4 animate-in zoom-in-95 text-slate-900">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-black text-slate-900">
                Session กำลังจะหมดอายุการใช้งาน
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                ตามนโยบายความมั่นคงปลอดภัยภาครัฐ ระบบจะตัดการเชื่อมต่ออัตโนมัติเมื่อครบ <strong>๘ ชั่วโมง (หมดเวลาราชการ)</strong>
              </p>
            </div>

            {/* Countdown Badge */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                เวลาที่เหลือก่อนตัดระบบอัตโนมัติ:
              </span>
              <div className="text-2xl font-black font-mono text-amber-900">
                {formatHoursMinutes(remainingSeconds)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>ออกจากระบบ</span>
              </button>

              <button
                type="button"
                onClick={extendSession}
                disabled={isExtending}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#0052FF] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs font-black shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isExtending ? "animate-spin" : ""}`} />
                <span>ต่อเวลาอีก ๘ ชม.</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}

export async function signOut(options?: { callbackUrl?: string }) {
  if (typeof window !== "undefined") {
    localStorage.removeItem("smartsarabun_user_profile");
    localStorage.removeItem("smartsarabun_session_login_time");
    sessionStorage.clear();
    // Redirect to login page
    window.location.href = options?.callbackUrl || "/login";
  }
}
