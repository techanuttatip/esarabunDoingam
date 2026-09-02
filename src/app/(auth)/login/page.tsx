import { Shield, Sparkles } from "lucide-react";
import { LoginClientForm } from "./login-client-form";
import { DoiNgamLogoEmblem } from "@/components/shared/doigam-logo-emblem";
import { DOIGAM_OFFICE_BG_BASE64 } from "@/assets/branding-images";

export default function LoginPage() {
  return (
    <>
      {/* =================================================================== */}
      {/* LEFT COLUMN: Frosted Glass Login Panel (Glassmorphism UI) */}
      {/* =================================================================== */}
      <div className="w-full md:w-[48%] p-6 sm:p-10 flex flex-col justify-between bg-white/95 backdrop-blur-3xl border-r border-slate-200/80 text-slate-900 overflow-y-auto relative z-10 shadow-lg">
        <div>
          {/* Header Brand */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-1 rounded-2xl bg-white border border-slate-200 shadow-xs ring-2 ring-blue-500/20 shrink-0">
              <DoiNgamLogoEmblem className="w-12 h-12" size={48} />
            </div>
            <div>
              <div className="text-base font-black text-slate-900 tracking-tight leading-tight flex items-center gap-1.5">
                <span>Smart Sarabun</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-100 text-[#0052FF] font-black">
                  SaaS
                </span>
              </div>
              <div className="text-xs font-bold text-[#0052FF]">
                อบต.ดอยงาม อ.พาน จ.เชียงราย
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-3 py-1 text-[11px] font-mono font-bold text-[#0052FF] shadow-2xs backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#0052FF] animate-ping" />
              <span>OFFICIAL GOV PORTAL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              เข้าสู่ระบบ<span className="bg-gradient-to-r from-[#0052FF] via-[#0284c7] to-[#2563eb] bg-clip-text text-transparent">สารบรรณ</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              ระบบยืนยันตัวตนดิจิทัลมาตรฐานความปลอดภัยภาครัฐ พ.ศ. ๒๕๖๙
            </p>
          </div>

          {/* Client Interactive Login Form */}
          <LoginClientForm />
        </div>

        {/* Footer info with Security Badges */}
        <div className="flex items-center justify-between pt-5 mt-6 border-t border-slate-200/80 text-[10px] text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold font-mono">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>TLS 1.3 / 256-BIT ENCRYPTION</span>
          </div>
          <span className="font-mono text-slate-400">SMARTSARABUN v2026</span>
        </div>
      </div>

      {/* =================================================================== */}
      {/* RIGHT COLUMN: Luxury Glass Hero Banner with Real Office Photo */}
      {/* =================================================================== */}
      <div className="w-full md:w-[52%] relative min-h-[360px] md:min-h-full flex flex-col justify-between p-8 sm:p-12 text-white overflow-hidden select-none">
        {/* Background Image of Real Office (Embedded Base64) */}
        <div
          className="absolute inset-0 bg-cover bg-center filter brightness-[0.4] contrast-[1.1] scale-105 transition-transform duration-700 hover:scale-100"
          style={{ backgroundImage: `url(${DOIGAM_OFFICE_BG_BASE64})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-[#0a1936]/60 to-[#041226]/80 backdrop-blur-[1px]" />

        {/* Top Header Badge on Visual */}
        <div className="relative z-10 flex items-center justify-between text-xs text-blue-100 font-medium">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-2xl border border-white/20 shadow-lg">
            <DoiNgamLogoEmblem className="w-6 h-6" size={24} />
            <span className="font-bold text-white text-xs">ระบบสารบรรณอิเล็กทรอนิกส์</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-cyan-200 bg-black/40 px-3 py-1.5 rounded-xl border border-white/15 backdrop-blur-md">
            <span>DOIGAM-SAO</span>
            <span>•</span>
            <span>CHIANG RAI</span>
          </div>
        </div>

        {/* Center Glass Graphic: Welcome Card */}
        <div className="relative z-10 my-auto py-6">
          <div className="p-6 rounded-3xl bg-slate-950/60 backdrop-blur-2xl border border-white/20 shadow-2xl space-y-4 max-w-md">
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-emerald-300">ระบบคลาวด์สารบรรณออนไลน์</span>
              </div>
              <span className="text-[10px] font-mono text-slate-300">พ.ศ. ๒๕๖๙</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                ยินดีต้อนรับสู่ <br />
                <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                  อบต. ดอยงาม
                </span>
              </h2>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                &ldquo;บริการด้วยใจ โปร่งใส เป็นธรรม&rdquo; — ยกระดับการบริหารงานเอกสารราชการด้วยระบบสารบรรณดิจิทัล ออกเลข ลงรับ และเกษียนหนังสือออนไลน์ได้ทุกที่ ทุกเวลา
              </p>
            </div>

            {/* Quick Feature Pills */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-white">
              <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-1.5">
                <span className="text-amber-300">⚡</span>
                <span className="font-semibold truncate">รหัส ชร 52001-52006</span>
              </div>
              <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-1.5">
                <span className="text-emerald-300">✍️</span>
                <span className="font-semibold truncate">เกษียนด่วน e-Sign</span>
              </div>
              <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-1.5">
                <span className="text-blue-300">🔒</span>
                <span className="font-semibold truncate">แยกสิทธิ์ ๖ กองงาน</span>
              </div>
              <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-1.5">
                <span className="text-purple-300">📑</span>
                <span className="font-semibold truncate">๘ แม่แบบราชการ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Status Info */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-300 pt-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>ระเบียบสำนักนายกฯ ฉบับที่ ๔</span>
          </div>
          <span className="text-[10px] text-cyan-300 font-mono">อำเภอพาน จังหวัดเชียงราย</span>
        </div>
      </div>
    </>
  );
}
