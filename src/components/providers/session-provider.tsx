"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Clock, AlertTriangle, RefreshCw, LogOut, ShieldCheck } from "lucide-react";

export interface SessionUser {
  id: string;
  accountId?: string;
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
  mustChangePassword?: boolean;
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

const DEFAULT_SESSION_HOURS = 8; // 8 Official Government Working Hours

const SessionContext = createContext<SessionContextType>({
  data: null,
  status: "loading",
  remainingSeconds: DEFAULT_SESSION_HOURS * 3600,
  extendSession: () => {},
  updateProfile: () => {},
});

export function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [status, setStatus] = useState<"authenticated" | "unauthenticated" | "loading">("loading");
  const [remainingSeconds, setRemainingSeconds] = useState<number>(DEFAULT_SESSION_HOURS * 3600);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [isExtending, setIsExtending] = useState(false);

  // Extend session handler
  const extendSession = useCallback(() => {
    setIsExtending(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("smartsarabun_session_login_time", Date.now().toString());
    }
    setRemainingSeconds(DEFAULT_SESSION_HOURS * 3600);
    setShowWarningModal(false);
    setTimeout(() => setIsExtending(false), 500);
  }, []);

  // Strict Tab/Browser Lifecycle Check: Reads strictly from sessionStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkSession = () => {
      try {
        const rawSession = sessionStorage.getItem("smartsarabun_active_session");
        if (!rawSession) {
          setCurrentUser(null);
          setStatus("unauthenticated");
          // If accessing dashboard pages without active tab session, redirect to login
          if (pathname && !pathname.startsWith("/login") && !pathname.startsWith("/platform-admin")) {
            router.replace("/login");
          }
          return;
        }

        const parsed = JSON.parse(rawSession);
        const user = parsed.user || parsed;
        setCurrentUser(user);
        setStatus("authenticated");

        // Verify session time
        let loginTime = sessionStorage.getItem("smartsarabun_session_login_time");
        if (!loginTime) {
          loginTime = Date.now().toString();
          sessionStorage.setItem("smartsarabun_session_login_time", loginTime);
        }
      } catch (err) {
        console.error("Session parse error:", err);
        setCurrentUser(null);
        setStatus("unauthenticated");
      }
    };

    checkSession();

    // Timer loop: checks remaining seconds every 1 second
    const interval = setInterval(() => {
      const loginTime = sessionStorage.getItem("smartsarabun_session_login_time");
      if (!loginTime) return;

      const currentLoginTime = Number(loginTime);
      const maxDurationMs = DEFAULT_SESSION_HOURS * 3600 * 1000;
      const elapsedMs = Date.now() - currentLoginTime;
      const leftSec = Math.max(0, Math.floor((maxDurationMs - elapsedMs) / 1000));

      setRemainingSeconds(leftSec);

      if (leftSec > 0 && leftSec <= 180) {
        setShowWarningModal(true);
      } else if (leftSec <= 0) {
        clearInterval(interval);
        signOut({ callbackUrl: "/login?reason=session_expired" });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [pathname, router]);

  const updateProfile = (updated: Partial<SessionUser>) => {
    if (!currentUser) return;
    const next = { ...currentUser, ...updated };
    if (updated.name) {
      next.name = updated.name;
    } else if (updated.firstName || updated.lastName) {
      const title = currentUser.name?.startsWith("นางสาว") ? "นางสาว" : currentUser.name?.startsWith("นาง") ? "นาง" : "นาย";
      next.name = `${title}${updated.firstName || currentUser.firstName || ""} ${updated.lastName || currentUser.lastName || ""}`.trim();
    }
    setCurrentUser(next);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("smartsarabun_active_session", JSON.stringify({ user: next }));
      window.dispatchEvent(new CustomEvent("user_profile_updated", { detail: next }));
    }
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
        data: currentUser ? { user: currentUser } : null,
        status,
        remainingSeconds,
        extendSession,
        updateProfile,
      }}
    >
      {children}

      {/* Session Expiry Warning Modal */}
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
                ตามนโยบายความมั่นคงปลอดภัยภาครัฐ ระบบจะตัดการเชื่อมต่ออัตโนมัติเมื่อครบ <strong>๘ ชั่วโมง</strong>
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
    sessionStorage.clear();
    // Clear cookies with no-age so they expire immediately
    document.cookie = "smart_sarabun_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "smart_sarabun_role=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = options?.callbackUrl || "/login";
  }
}
