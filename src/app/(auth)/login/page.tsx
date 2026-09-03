import { Shield } from "lucide-react";
import { LoginClientForm } from "./login-client-form";
import { DoiNgamLogoEmblem } from "@/components/shared/doigam-logo-emblem";

export default function LoginPage() {
  return (
    <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/80 shadow-[0_25px_70px_rgba(0,0,0,0.45)] p-7 sm:p-9 space-y-6 text-slate-900 animate-in fade-in zoom-in-95 duration-200">
      {/* Official Emblem & Branding Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-white p-2 border border-slate-200 shadow-md ring-4 ring-blue-500/15 flex items-center justify-center">
          <DoiNgamLogoEmblem className="w-12 h-12" size={48} />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight font-sans">
            องค์การบริหารส่วนตำบลดอยงาม
          </h1>
          <p className="text-xs font-bold text-[#0052FF]">
            ระบบสารบรรณอิเล็กทรอนิกส์ (SmartSarabun)
          </p>
          <p className="text-[11px] text-slate-400 font-medium">
            อำเภอพาน จังหวัดเชียงราย • ประจำปี พ.ศ. ๒๕๖๙
          </p>
        </div>
      </div>

      <div className="h-px bg-slate-200/80 w-full" />

      {/* Client Interactive Login Form */}
      <LoginClientForm />

      {/* Security Footer Seal */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
        <span className="flex items-center gap-1 text-emerald-700 font-bold">
          <Shield className="w-3 h-3 text-emerald-600" />
          ระบบความปลอดภัยภาครัฐ SSL/TLS
        </span>
        <span className="font-mono">v2026.1</span>
      </div>
    </div>
  );
}
