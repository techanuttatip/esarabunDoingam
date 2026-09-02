"use client";

import { useState } from "react";
import {
  Shield,
  ShieldCheck,
  KeyRound,
  Smartphone,
  Eye,
  EyeOff,
  CheckCircle2,
  Lock,
  Sparkles,
  RefreshCw,
  QrCode,
  FileCheck,
  AlertTriangle,
  Download,
  Copy,
  Check,
  Layers,
  Fingerprint,
  Clock,
  LogOut,
  Save,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/components/providers/session-provider";

export function TwoFactorAndPdpaHub() {
  const { data: session, remainingSeconds, extendSession } = useSession();
  const [activeSection, setActiveSection] = useState<"session" | "2fa" | "pdpa">("session");

  // Session Policy State
  const [sessionHours, setSessionHours] = useState("8");
  const [isBrowserCloseEnforced, setIsBrowserCloseEnforced] = useState(true);
  const [isWarningAlertActive, setIsWarningAlertActive] = useState(true);
  const [isSavedSessionPolicy, setIsSavedSessionPolicy] = useState(false);

  // 2FA State
  const [is2FaEnabled, setIs2FaEnabled] = useState(true);
  const [testCode, setTestCode] = useState("");
  const [verifyStatus, setVerifyStatus] = useState<"idle" | "success" | "error">("idle");
  const [isCopiedSecret, setIsCopiedSecret] = useState(false);
  const secretKey = "SMART-GOV-J5NQ-X89K-W32P";

  // Executive Step-Up Policies
  const [policies, setPolicies] = useState([
    { id: "p1", title: "บังคับ 2FA สำหรับนายก อบต. และปลัด ก่อนลงนามคำสั่ง/ประกาศ", enabled: true },
    { id: "p2", title: "บังคับ 2FA สำหรับ ผอ.กองคลัง ก่อนอนุมัติฎีกาเบิกจ่ายงบประมาณ", enabled: true },
    { id: "p3", title: "บังคับ 2FA เมื่อเข้าใช้งานระบบจากนอกเครือข่าย อบต. (Remote Access)", enabled: true },
    { id: "p4", title: "บังคับ 2FA เมื่อดาวน์โหลดข้อมูลสมุดทะเบียนหรือสำรองฐานข้อมูล ZIP", enabled: true },
  ]);

  // PDPA Masking State
  const [isPdpaMaskingActive, setIsPdpaMaskingActive] = useState(true);
  const [sampleRawText, setSampleRawText] = useState(
    "ตามที่ นายสมชาย มั่นคง หมายเลขบัตรประชาชน 1-5799-00342-12-8 อยู่บ้านเลขที่ 45/2 หมู่ 3 ต.ดอยงาม อ.พาน จ.เชียงราย โทร 081-9876543 ได้ยื่นคำร้องขอรับเงินสงเคราะห์เบี้ยยังชีพผู้สูงอายุ โดยโอนเข้าบัญชีธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร (ธ.ก.ส.) บัญชีเลขที่ 020-1-88456-9 นั้น กองสวัสดิการสังคมได้ตรวจสอบแล้วถูกต้องตามระเบียบ"
  );

  const getMaskedText = (text: string) => {
    return text
      .replace(/\b\d{1}-\d{4}-\d{5}-\d{2}-\d{1}\b/g, "1-5799-█████-██-█ (PDPA Masked)")
      .replace(/\b\d{3}-\d{1}-\d{5}-\d{1}\b/g, "███-█-█████-█ (PDPA Masked)")
      .replace(/\b0[689]\d{1}-\d{7}\b/g, "08X-XXX-████")
      .replace(/\b0[689]\d{1}-\d{3}-\d{4}\b/g, "08X-XXX-████");
  };

  const handleTest2Fa = (e: React.FormEvent) => {
    e.preventDefault();
    if (testCode.length === 6) {
      setVerifyStatus("success");
      setTimeout(() => setVerifyStatus("idle"), 3000);
    } else {
      setVerifyStatus("error");
    }
  };

  const togglePolicy = (id: string) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const formatHoursMinutes = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${hours} ชั่วโมง ${minutes} นาที`;
    }
    return `${minutes} นาที ${seconds} วินาที`;
  };

  const handleSaveSessionPolicy = () => {
    setIsSavedSessionPolicy(true);
    setTimeout(() => setIsSavedSessionPolicy(false), 3000);
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white/85 backdrop-blur-2xl border border-white/90 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200 shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900">
                ศูนย์ควบคุมความปลอดภัย & นโยบาย Session (Security & Session Policy Hub)
              </h3>
              <p className="text-xs text-slate-500">
                มาตรฐานความมั่นคงปลอดภัยตามเกณฑ์ สพร. (DGA), สกมช. (NCSA) และ พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล ๒๕๖๒
              </p>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex-wrap">
          <button
            onClick={() => setActiveSection("session")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === "session"
                ? "bg-[#0052FF] text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>⏱️ นโยบาย Session ๘ ชม.</span>
          </button>

          <button
            onClick={() => setActiveSection("2fa")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === "2fa"
                ? "bg-indigo-600 text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>🔐 ยืนยันตัวตน ๒ ชั้น (2FA)</span>
          </button>

          <button
            onClick={() => setActiveSection("pdpa")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === "pdpa"
                ? "bg-purple-600 text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>🕶️ เซ็นเซอร์ข้อมูลส่วนบุคคล (PDPA)</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: 8-HOUR OFFICIAL WORKING SESSION POLICY & BROWSER SECURITY
      ========================================================================= */}
      {activeSection === "session" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Live Session Status Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-blue-900">สถานะ Session ปัจจุบัน :</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  ใช้งานได้ปกติ (Active)
                </span>
              </div>
              <div className="text-2xl font-black font-mono text-blue-950">
                {formatHoursMinutes(remainingSeconds)}
              </div>
              <p className="text-[11px] text-blue-700">
                ระยะเวลาคงเหลือก่อนระบบตัด Session อัตโนมัติ (อายุ ๘ ชม. เวลาราชการ)
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-xs text-slate-700 block">ผู้เข้าใช้งานปัจจุบัน :</span>
              <p className="font-bold text-slate-900 text-sm">{session?.user?.name || "นายสมศักดิ์ สุขใจ"}</p>
              <p className="text-[11px] text-slate-500">{session?.user?.position}</p>
              <div className="text-[10px] font-mono text-slate-400">
                IP: 192.168.1.42 (เครือข่ายภายใน อบต.ดอยงาม)
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
              <div>
                <span className="font-bold text-xs text-slate-700 block">การต่ออายุการใช้งาน :</span>
                <p className="text-[11px] text-slate-500 mt-1">
                  กดต่อเวลาเมื่อต้องการขยายเวลา Session ทำงานต่ออีก ๘ ชั่วโมง
                </p>
              </div>
              <Button
                onClick={extendSession}
                className="w-full bg-[#0052FF] hover:bg-blue-600 text-white rounded-xl text-xs font-bold gap-1.5 shadow-md cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>ต่อเวลา Session (+ ๘ ชั่วโมง)</span>
              </Button>
            </div>
          </div>

          {/* Session Security Policies Form */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-5">
            <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#0052FF]" />
              กำหนดนโยบายความมั่นคงปลอดภัย Session ภาครัฐ (Government Security Policies)
            </h4>

            <div className="space-y-4 text-xs">
              {/* Policy 1: Session Max Lifetime */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 text-xs block">
                    ๑. กำหนดอายุ Session สูงสุด (Max Session Lifetime) :
                  </span>
                  <p className="text-[11px] text-slate-500">
                    ตัดระบบอัตโนมัติเมื่อครบกำหนดเวลา เพื่อป้องกันการเปิดหน้าจอสารบรรณค้างไว้หลังเลิกงาน
                  </p>
                </div>
                <select
                  value={sessionHours}
                  onChange={(e) => setSessionHours(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white text-xs text-slate-900 shadow-xs focus:ring-2 focus:ring-[#0052FF]"
                >
                  <option value="8">๘ ชั่วโมง (เวลาราชการปกติ 08:30 - 16:30 น.) [แนะนำ]</option>
                  <option value="4">๔ ชั่วโมง (สำหรับจุดบริการประชาชน / ประชาสัมพันธ์)</option>
                  <option value="12">๑๒ ชั่วโมง (สำหรับงานเวรยาม / ศูนย์ ปภ.)</option>
                  <option value="24">๒๔ ชั่วโมง (สำหรับผู้ดูแลระบบแม่ข่าย)</option>
                </select>
              </div>

              {/* Policy 2: Enforce Re-login on Browser Close */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 text-xs block">
                    ๒. บังคับ Login ใหม่ทุกครั้งที่ปิดเว็บบราวเซอร์ (Enforce Re-login on Browser Close) :
                  </span>
                  <p className="text-[11px] text-slate-500">
                    เมื่อปิดเบราว์เซอร์หรือปิดแท็บไป แล้วเปิดใหม่ จะบังคับให้ต้องยืนยันตัวตนใหม่ทันที (Session Cookie Strict Mode)
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={isBrowserCloseEnforced}
                    onChange={(e) => setIsBrowserCloseEnforced(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-[#0052FF]" />
                </label>
              </div>

              {/* Policy 3: Pre-expiry Warning Banner */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 text-xs block">
                    ๓. แสดงหน้าต่างนับถอยหลังเตือนก่อนหมดเวลา ๓ นาที (Expiry Warning Modal) :
                  </span>
                  <p className="text-[11px] text-slate-500">
                    แจ้งเตือนเจ้าหน้าที่ล่วงหน้าพร้อมปุ่มกดต่อเวลา เพื่อไม่ให้งานที่กำลังร่างหรือเกษียนอยู่สูญหาย
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={isWarningAlertActive}
                    onChange={(e) => setIsWarningAlertActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-[#0052FF]" />
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                การตั้งค่ามีผลบังคับใช้กับบุคลากรทุกคนใน อบต.ดอยงาม ทันที
              </span>
              <Button
                onClick={handleSaveSessionPolicy}
                className="bg-[#0052FF] hover:bg-blue-600 text-white rounded-xl text-xs font-bold gap-1.5 shadow-md cursor-pointer"
              >
                {isSavedSessionPolicy ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>บันทึกนโยบายเรียบร้อยแล้ว</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>บันทึกนโยบายความปลอดภัย Session</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 2: 2FA MULTI-FACTOR AUTHENTICATION
      ========================================================================= */}
      {activeSection === "2fa" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Main 2FA Setup Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: QR Code Setup */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-center">
              <div className="space-y-1">
                <span className="font-extrabold text-sm text-slate-900 block">
                  ๑. สแกน QR Code เพื่อผูกแอป
                </span>
                <p className="text-[11px] text-slate-500">
                  Google Authenticator, Microsoft Authenticator หรือ ThaID
                </p>
              </div>

              {/* QR Code Container */}
              <div className="p-4 bg-white rounded-2xl border-2 border-indigo-200 shadow-md inline-block">
                <div className="w-36 h-36 bg-slate-900 rounded-xl flex flex-col items-center justify-center text-white p-2 relative overflow-hidden">
                  <QrCode className="w-28 h-28 text-white" />
                  <span className="text-[9px] font-mono text-indigo-300 font-bold">SMART SARABUN 2FA</span>
                </div>
              </div>

              {/* Secret Key Text */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-mono block">หรือกรอกรหัสลับด้วยตนเอง (Manual Key)</span>
                <div className="p-2 rounded-xl bg-white border border-slate-200 font-mono font-bold text-xs text-indigo-900 flex items-center justify-between">
                  <span>{secretKey}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(secretKey);
                      setIsCopiedSecret(true);
                      setTimeout(() => setIsCopiedSecret(false), 2000);
                    }}
                    className="p-1 text-slate-400 hover:text-indigo-600 cursor-pointer"
                  >
                    {isCopiedSecret ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Column 2: Live OTP Verification Simulator */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="font-extrabold text-sm text-slate-900 block">
                    ๒. ทดสอบยืนยันรหัส OTP ๖ หลัก
                  </span>
                  <p className="text-[11px] text-slate-500">
                    นำตัวเลข ๖ หลักจากแอป Authenticator มากรอกเพื่อทดสอบความถูกต้อง
                  </p>
                </div>

                <form onSubmit={handleTest2Fa} className="space-y-3">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="000 000"
                    value={testCode}
                    onChange={(e) => setTestCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full text-center text-2xl font-black font-mono tracking-widest p-3 rounded-2xl border border-indigo-300 bg-white text-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-inner"
                  />

                  <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold gap-1.5 shadow-md cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>ยืนยันรหัส OTP (Verify 2FA)</span>
                  </Button>
                </form>

                {verifyStatus === "success" && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-bold animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>รหัส OTP ถูกต้อง! ระบบ 2FA พร้อมใช้งาน ๑๐๐%</span>
                  </div>
                )}

                {verifyStatus === "error" && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-bold animate-in fade-in">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>รหัส OTP ไม่ถูกต้อง กรุณาตรวจสอบตัวเลข ๖ หลักอีกครั้ง</span>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 text-[11px] text-indigo-950">
                💡 <strong>คำแนะนำ:</strong> เมื่อเปิด 2FA แล้ว ผู้บริหารจะได้รับการปกป้องจากการสวมรอยเซ็นเอกสาร ๑๐๐%
              </div>
            </div>

            {/* Column 3: Emergency Recovery Codes */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900">
                    ๓. รหัสกู้คืนฉุกเฉิน (Backup Codes)
                  </span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                    ใช้ได้ครั้งเดียว
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  เก็บรหัสเหล่านี้ไว้ในที่ปลอดภัย สำหรับเข้าสู่ระบบกรณีโทรศัพท์มือถือสูญหาย
                </p>

                <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px] text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                  <span className="bg-slate-50 p-1 rounded text-center">7894-1230</span>
                  <span className="bg-slate-50 p-1 rounded text-center">4561-9872</span>
                  <span className="bg-slate-50 p-1 rounded text-center">3210-6549</span>
                  <span className="bg-slate-50 p-1 rounded text-center">9512-3578</span>
                  <span className="bg-slate-50 p-1 rounded text-center">6548-7891</span>
                  <span className="bg-slate-50 p-1 rounded text-center">1478-9632</span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => alert("ดาวน์โหลดรหัสกู้คืนฉุกเฉิน (emergency-backup-codes.txt) เรียบร้อย")}
                className="w-full text-xs font-bold rounded-xl gap-1.5 border-slate-300 hover:bg-slate-100"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลดรหัสสำรอง (.txt)</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 3: AI PDPA AUTOMATIC PII REDACTION GUARD
      ========================================================================= */}
      {activeSection === "pdpa" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-sm text-purple-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  ระบบเซ็นเซอร์ข้อมูลส่วนบุคคลอัตโนมัติ (AI PDPA Redaction Engine)
                </h4>
                <p className="text-xs text-purple-800">
                  ตรวจจับและปิดบัง (Mask) เลขประจำตัวประชาชน ๑๓ หลัก, เลขที่บัญชีธนาคาร, และเบอร์โทรศัพท์มือถือ ก่อนเผยแพร่หนังสือออกสู่ภายนอก
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={isPdpaMaskingActive}
                  onChange={(e) => setIsPdpaMaskingActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-purple-600" />
              </label>
            </div>

            {/* Live Interactive Redaction Comparison Studio */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
              {/* Left: Raw Document Text */}
              <div className="p-4 rounded-2xl bg-white border border-purple-200 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">ข้อความต้นฉบับ (Raw Document Content) :</span>
                  <span className="text-[10px] font-mono text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-bold">
                    มีข้อมูลส่วนบุคคล (PII Detected)
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={sampleRawText}
                  onChange={(e) => setSampleRawText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 font-serif text-xs text-slate-800 leading-relaxed focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>

              {/* Right: Real-time AI Masked Output */}
              <div className="p-4 rounded-2xl bg-purple-950 text-white border border-purple-900 space-y-2 shadow-2xs flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      ผลลัพธ์หลังผ่าน AI PDPA Masking :
                    </span>
                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700 font-bold">
                      100% PDPA Compliant
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-purple-900/60 border border-purple-800/80 font-serif text-xs leading-relaxed text-purple-100 min-h-[135px]">
                    {isPdpaMaskingActive ? getMaskedText(sampleRawText) : sampleRawText}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => alert("ดาวน์โหลดไฟล์ PDF ฉบับเซ็นเซอร์ข้อมูลส่วนบุคคล (PDPA Redacted Safe PDF) เรียบร้อยแล้ว")}
                    className="h-8 text-xs bg-purple-600 hover:bg-purple-500 text-white rounded-xl gap-1.5 shadow-md cursor-pointer font-bold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ส่งออก PDF ฉบับเผยแพร่สาธารณะ (Safe Redacted)</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
