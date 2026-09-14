import { DOIGAM_OFFICE_BG_BASE64 } from "@/assets/branding-images";
import { DoiNgamLogoEmblem } from "@/components/shared/doigam-logo-emblem";
import {
  ShieldCheck,
  FileCheck2,
  Sparkles,
  Building2,
  Fingerprint,
  Lock,
  CheckCircle2,
} from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-x-hidden bg-[#060e1e] font-sans">
      {/* Background Image with Cinematic Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-[12px] opacity-20 scale-110 pointer-events-none"
        style={{ backgroundImage: `url(${DOIGAM_OFFICE_BG_BASE64})` }}
      />

      {/* Layered Gradient Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#060e1e]/95 via-[#0a1a3a]/85 to-[#0c0f1e]/95 pointer-events-none" />

      {/* Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/15 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/12 blur-[140px] pointer-events-none" />
      <div className="absolute top-0 right-1/3 w-[300px] h-[300px] rounded-full bg-cyan-400/8 blur-[100px] pointer-events-none" />

      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 0h1v40H0zM39 0h1v40h-1z'/%3E%3Cpath d='M0 0h40v1H0zM0 39h40v1H0z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Main Split-Screen Container */}
      <div className="w-full max-w-6xl relative z-10 py-6 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: GovTech Brand & Trust Showcase (Hidden on small mobile, prominent on desktop) */}
          <div className="lg:col-span-5 space-y-6 text-white hidden md:block">
            {/* Logo Emblem & Title */}
            <div className="space-y-4">
              <div className="inline-flex p-3 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-blue-500/15 ring-4 ring-blue-500/10">
                <DoiNgamLogoEmblem className="w-14 h-14" size={56} />
              </div>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>แพลตฟอร์มสารบรรณดิจิทัลมาตรฐานภาครัฐ ๒๕๖๙</span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight">
                  องค์การบริหารส่วนตำบลดอยงาม
                </h1>
                <p className="text-sm font-semibold text-blue-200/90">
                  Smart Sarabun — อำเภอพาน จังหวัดเชียงราย
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-md">
              ระบบบริหารจัดการงานสารบรรณ บันทึกข้อความ เกษียนหนังสือ และทะเบียนคำสั่งอิเล็กทรอนิกส์ มุ่งเน้นความมั่นคงปลอดภัยตามมาตรฐานสากลและความสะดวกในการปฏิบัติราชการ
            </p>

            {/* 4 Feature Value Pillars */}
            <div className="space-y-2.5 pt-2">
              <div className="p-3 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-sm flex items-start gap-3 hover:bg-white/[0.08] transition-colors">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300 shrink-0 mt-0.5">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    พ.ร.บ.การปฏิบัติราชการทางอิเล็กทรอนิกส์ พ.ศ. ๒๕๖๕
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    รองรับหนังสือรับเข้า ส่งออก และเกษียนหนังสือออนไลน์ 100%
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-sm flex items-start gap-3 hover:bg-white/[0.08] transition-colors">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 shrink-0 mt-0.5">
                  <Fingerprint className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    ThaID & ตรารับรองดิจิทัล PAdES Cryptographic Seal
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    เข้าสู่ระบบด้วย ThaID กรมการปกครอง พร้อมตราประทับลายมือชื่อดิจิทัล
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-sm flex items-start gap-3 hover:bg-white/[0.08] transition-colors">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    AI Vision OCR สแกนตราครุฑอัตโนมัติ
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    สกัดเลขที่หนังสือ วันที่ และเนื้อหาได้ใน 1 วินาที
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-sm flex items-start gap-3 hover:bg-white/[0.08] transition-colors">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    SaaS Inter-Agency Network
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    เครือข่ายสารบรรณรับ-ส่งหนังสือตรงข้าม อปท. และเทศบาลทั่วประเทศ
                  </p>
                </div>
              </div>
            </div>

            {/* Compliance & Status Footer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                ISO/IEC 27001 & SSL 256-Bit
              </span>
              <span className="text-slate-400 font-mono text-[10px]">
                v2.15 Production Ready
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Auth Hub (Login / Register Card) */}
          <div className="lg:col-span-7 w-full max-w-lg lg:max-w-none mx-auto">
            {children}
          </div>
        </div>
      </div>

      {/* Bottom Attribution */}
      <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
        <p className="text-[10px] text-white/30 font-medium">
          © ๒๕๖๙ องค์การบริหารส่วนตำบลดอยงาม อำเภอพาน จังหวัดเชียงราย — สงวนลิขสิทธิ์ตามกฎหมาย
        </p>
      </div>
    </div>
  );
}
