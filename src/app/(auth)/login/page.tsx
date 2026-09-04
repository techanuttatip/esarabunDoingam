"use client";

import { useState } from "react";
import { Shield, Fingerprint } from "lucide-react";
import { LoginClientForm } from "./login-client-form";
import { RegisterForm } from "./register-form";
import { DoiNgamLogoEmblem } from "@/components/shared/doigam-logo-emblem";
import { IsoStandardsBadge } from "@/components/shared/iso-standards-badge";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="space-y-0">
      {/* Card */}
      <div className="bg-white/[0.97] backdrop-blur-3xl rounded-[28px] border border-white/60 shadow-[0_30px_80px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Header Band */}
        <div className="relative px-7 pt-7 pb-5 text-center">
          {/* Emblem */}
          <div className="relative z-10 space-y-3">
            <div className="w-[68px] h-[68px] mx-auto rounded-[22px] bg-gradient-to-br from-white to-slate-50 p-2 border border-slate-200/80 shadow-lg shadow-slate-900/10 ring-[3px] ring-blue-500/10 flex items-center justify-center">
              <DoiNgamLogoEmblem className="w-12 h-12" size={48} />
            </div>
            <div className="space-y-0.5">
              <h1 className="text-lg font-black text-slate-900 tracking-tight">
                องค์การบริหารส่วนตำบลดอยงาม
              </h1>
              <p className="text-[11px] font-extrabold text-[#0052FF] tracking-wide uppercase">
                Smart Sarabun — ระบบสารบรรณอิเล็กทรอนิกส์
              </p>
              <p className="text-[10px] text-slate-400 font-medium">
                อำเภอพาน จังหวัดเชียงราย
              </p>
            </div>
          </div>
        </div>

        {/* Divider with accent line */}
        <div className="relative h-px mx-7">
          <div className="absolute inset-0 bg-slate-200/60" />
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-12 h-[3px] rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
        </div>

        {/* Content */}
        <div className="px-7 py-6">
          {mode === "login" ? (
            <div className="space-y-5">
              {/* Login Form */}
              <LoginClientForm />

              {/* Register Link */}
              <div className="text-center space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-200/80" />
                  <span className="text-[10px] text-slate-400 font-bold">หรือ</span>
                  <div className="flex-1 h-px bg-slate-200/80" />
                </div>
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="w-full py-3 px-4 rounded-2xl border-2 border-slate-200 hover:border-[#0052FF] hover:bg-blue-50/50 text-slate-600 hover:text-[#0052FF] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer group"
                >
                  <Fingerprint className="w-4 h-4 text-slate-400 group-hover:text-[#0052FF] transition-colors" />
                  <span>สมัครสมาชิกใหม่ (ต้องรอ Admin อนุมัติ)</span>
                </button>
              </div>
            </div>
          ) : (
            <RegisterForm onBack={() => setMode("login")} />
          )}
        </div>
      </div>

      {/* Security Footer - Outside card */}
      <div className="pt-4 px-2">
        <IsoStandardsBadge />
        <div className="flex items-center justify-center gap-1.5 mt-3">
          <Shield className="w-3 h-3 text-white/25" />
          <p className="text-[10px] text-white/25 font-medium">
            ข้อมูลถูกเข้ารหัสด้วยมาตรฐาน SSL/TLS
          </p>
        </div>
      </div>
    </div>
  );
}
