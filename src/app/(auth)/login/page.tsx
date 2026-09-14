"use client";

import { useState } from "react";
import { Shield, Lock } from "lucide-react";
import { LoginClientForm } from "./login-client-form";
import { RegisterForm } from "./register-form";
import { DoiNgamLogoEmblem } from "@/components/shared/doigam-logo-emblem";
import { IsoStandardsBadge } from "@/components/shared/iso-standards-badge";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  if (mode === "register") {
    return <RegisterForm onBack={() => setMode("login")} />;
  }

  return (
    <div className="space-y-4">
      {/* Login Card */}
      <div className="bg-white/[0.98] backdrop-blur-2xl rounded-3xl border border-white/60 shadow-[0_25px_70px_rgba(0,0,0,0.45)] overflow-hidden animate-in fade-in select-none">
        {/* Mobile Header (Hidden on md+ because left column in layout displays full branding) */}
        <div className="md:hidden pt-6 px-6 pb-2 text-center space-y-2 border-b border-slate-100 bg-slate-50/50">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white p-2 border border-slate-200/80 shadow-md flex items-center justify-center">
            <DoiNgamLogoEmblem className="w-10 h-10" size={40} />
          </div>
          <div>
            <h1 className="text-base font-black text-slate-900 tracking-tight">
              องค์การบริหารส่วนตำบลดอยงาม
            </h1>
            <p className="text-[11px] font-extrabold text-[#0052FF]">
              Smart Sarabun — ระบบสารบรรณอิเล็กทรอนิกส์
            </p>
          </div>
        </div>

        {/* Desktop Header Banner */}
        <div className="hidden md:block pt-6 px-7 pb-2 space-y-1">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#0052FF] text-[11px] font-black">
              <Lock className="w-3 h-3" />
              <span>เข้าสู่ระบบเพื่อปฏิบัติราชการ</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              GovTech Portal 2026
            </span>
          </div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight pt-1">
            ระบบสารบรรณอิเล็กทรอนิกส์ อบต.ดอยงาม
          </h2>
          <p className="text-xs text-slate-500">
            เลือกบัญชีทดสอบด่วนตามบทบาท (1-Click Demo) หรือระบุชื่อผู้ใช้งานและรหัสผ่าน
          </p>
        </div>

        {/* Segmented Mode Tabs: [ Login | Register ] */}
        <div className="px-6 md:px-7 pt-4 pb-2">
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
            <div className="py-2 text-center bg-white text-[#0052FF] shadow-xs rounded-xl font-black">
              🔐 เข้าสู่ระบบ (Login)
            </div>
            <button
              type="button"
              onClick={() => setMode("register")}
              className="py-2 text-center text-slate-600 hover:text-slate-900 rounded-xl transition-all cursor-pointer"
            >
              📝 สมัครสมาชิกใหม่
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="px-6 md:px-7 py-4">
          <LoginClientForm onSwitchToRegister={() => setMode("register")} />
        </div>

        {/* Card Footer: ISO Standards Badge */}
        <div className="px-6 md:px-7 pb-5 bg-slate-50/50 border-t border-slate-100/80">
          <IsoStandardsBadge />
        </div>
      </div>

      {/* Security attribution */}
      <div className="flex items-center justify-center gap-1.5 text-center px-4">
        <Shield className="w-3 h-3 text-white/30" />
        <p className="text-[10px] text-white/35 font-medium">
          ระบบรักษาความมั่นคงปลอดภัยตามมาตรฐาน ISO/IEC 27001 และ SSL/TLS 256-Bit
        </p>
      </div>
    </div>
  );
}
