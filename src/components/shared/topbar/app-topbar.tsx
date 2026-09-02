"use client";

import { useState } from "react";
import {
  Search,
  Bell,
  Plus,
  Inbox,
  Send,
  Hash,
  HelpCircle,
  Sparkles,
  ChevronDown,
  User,
  LogOut,
  Shield,
  Clock,
  CheckCircle2,
  FileText,
  PenTool,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "@/components/providers/session-provider";
import { CommandPalette } from "@/components/shared/command-palette";
import { TrialCountdownBadge } from "@/components/shared/saas/trial-countdown-badge";

export function AppTopbar() {
  const { data: session } = useSession();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const notifications = [
    {
      id: "n1",
      title: "หนังสือรับใหม่: มท 0808.2/ว 4553",
      desc: "วิธีปฏิบัติในการจัดทำงบประมาณรายจ่ายประจำปี 2570 (กองคลัง)",
      time: "5 นาทีที่แล้ว",
      unread: true,
      href: "/receive",
    },
    {
      id: "n2",
      title: "มีเอกสารรอลงนามเกษียน",
      desc: "โครงการตรวจสอบและรับมืออุทกภัย (กองช่าง)",
      time: "25 นาทีที่แล้ว",
      unread: true,
      href: "/approvals",
    },
    {
      id: "n3",
      title: "ออกเลขรับสำเร็จ 2785/2569",
      desc: "ประทับตรายางรับกลางและส่งมอบหมายกองเรียบร้อย",
      time: "1 ชั่วโมงที่แล้ว",
      unread: false,
      href: "/receive",
    },
  ];

  return (
    <>
      <header className="h-16 px-4 sm:px-6 bg-white/70 backdrop-blur-2xl border-b border-white/80 flex items-center justify-between gap-4 z-20 shrink-0 shadow-xs">
        {/* Left: Global Spotlight Search Trigger (Ctrl + K) */}
        <div className="flex-1 max-w-md">
          <button
            onClick={() => setIsCommandOpen(true)}
            className="w-full h-10 px-3.5 rounded-2xl bg-white/80 hover:bg-white border border-slate-200/80 hover:border-blue-300 text-slate-400 hover:text-slate-700 flex items-center justify-between text-xs transition-all shadow-2xs cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-[#0052FF] transition-colors" />
              <span className="font-bold text-slate-500 group-hover:text-slate-800">
                ค้นหาด่วน (เอกสาร, เลขรับ, คำสั่ง)...
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1 font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded-md text-slate-500 font-bold border border-slate-200">
              <span>Ctrl</span>
              <span>K</span>
            </div>
          </button>
        </div>

        {/* Right: Quick Actions & Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* SaaS 30-Day Trial Countdown Badge */}
          <TrialCountdownBadge />

          {/* Quick Create Dropdown */}
          <div className="relative">
            <Button
              size="sm"
              variant="signature"
              onClick={() => setIsQuickCreateOpen(!isQuickCreateOpen)}
              className="h-9 px-3 text-xs rounded-xl gap-1.5 shadow-accent hover:shadow-accent-lg cursor-pointer font-bold"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">สร้างงานด่วน</span>
              <ChevronDown className="w-3 h-3 ml-0.5 opacity-80" />
            </Button>

            {isQuickCreateOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 p-1.5 space-y-1 z-50 animate-in fade-in zoom-in-95 select-none">
                <a
                  href="/receive"
                  onClick={() => setIsQuickCreateOpen(false)}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  <Inbox className="w-4 h-4 text-[#0052FF]" />
                  <span>+ ลงรับหนังสือภายนอก</span>
                </a>
                <a
                  href="/send"
                  onClick={() => setIsQuickCreateOpen(false)}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  <Send className="w-4 h-4 text-emerald-600" />
                  <span>+ ร่างหนังสือส่งออก</span>
                </a>
                <a
                  href="/numbers"
                  onClick={() => setIsQuickCreateOpen(false)}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  <Hash className="w-4 h-4 text-amber-600" />
                  <span>+ จองเลขหนังสือด่วน</span>
                </a>
              </div>
            )}
          </div>

          {/* Notification Bell with Badge & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative w-9 h-9 rounded-xl bg-white/80 hover:bg-white border border-slate-200/80 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
              title="การแจ้งเตือน"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 select-none">
                <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-indigo-600" />
                    <span className="font-extrabold text-xs text-slate-900">การแจ้งเตือนงาน</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    2 รายการใหม่
                  </span>
                </div>

                <div className="p-2 divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <a
                      key={n.id}
                      href={n.href}
                      onClick={() => setIsNotificationOpen(false)}
                      className={`p-3 rounded-2xl block hover:bg-slate-50 transition-colors ${
                        n.unread ? "bg-blue-50/40" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-xs text-slate-900 leading-snug">{n.title}</p>
                        {n.unread && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1" />}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{n.desc}</p>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">{n.time}</span>
                    </a>
                  ))}
                </div>

                <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
                  <a href="/tasks" className="text-xs font-bold text-blue-700 hover:underline">
                    ดูงานทั้งหมดในคิว
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200 hover:opacity-85 transition-opacity cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0052FF] to-[#0284c7] text-white flex items-center justify-center font-bold text-xs shadow-accent">
                {session?.user?.name ? session.user.name.charAt(0) : "น"}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {session?.user?.name || "น.ส.สมร กองเงิน"}
                </p>
                <p className="text-[10px] text-slate-500 font-medium leading-tight">
                  {session?.user?.department || "กองคลัง"}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block ml-0.5" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 select-none">
                <div className="p-3.5 bg-slate-50 border-b border-slate-200">
                  <p className="font-extrabold text-xs text-slate-900 truncate">
                    {session?.user?.name || "น.ส.สมร กองเงิน"}
                  </p>
                  <p className="text-[11px] text-blue-700 font-semibold truncate">
                    {session?.user?.position}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {session?.user?.department}
                  </p>
                </div>

                <div className="p-1.5 space-y-1">
                  <a
                    href="/profile"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-[#0052FF] transition-colors"
                  >
                    <User className="w-4 h-4 text-[#0052FF]" />
                    <span>ข้อมูลส่วนตัว (Profile)</span>
                  </a>

                  <a
                    href="/profile"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-[#0052FF] transition-colors"
                  >
                    <PenTool className="w-4 h-4 text-emerald-600" />
                    <span>จัดการลายมือชื่อดิจิทัล (e-Sign)</span>
                  </a>

                  <a
                    href="/settings"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-500" />
                    <span>ตั้งค่าระบบ (Settings)</span>
                  </a>
                </div>

                <div className="p-1.5 bg-slate-50 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>ออกจากระบบ (Logout)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Spotlight Command Palette (Ctrl + K) */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </>
  );
}
