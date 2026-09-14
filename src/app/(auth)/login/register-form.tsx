"use client";

import { useState, useMemo } from "react";
import {
  User,
  Lock,
  Mail,
  Building2,
  Briefcase,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  Send,
  Phone,
  CreditCard,
  Zap,
  ShieldCheck,
  Check,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSignedSessionToken } from "@/lib/auth/session-token";

const STORAGE_KEY = "smartsarabun_pending_registrations";

export interface PendingRegistration {
  id: string;
  prefix?: string;
  firstName: string;
  lastName: string;
  cid?: string; // เลขประจำตัวประชาชน 13 หลัก
  email: string;
  phone: string;
  position: string;
  department: string;
  roleRequested?: string;
  password: string;
  requestedAt: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  reviewedAt?: string;
}

export function getPendingRegistrations(): PendingRegistration[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePendingRegistration(reg: PendingRegistration) {
  const list = getPendingRegistrations();
  list.push(reg);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function updateRegistrationStatus(
  id: string,
  status: "approved" | "rejected",
  reviewedBy: string
) {
  const list = getPendingRegistrations();
  const updated = list.map((r) =>
    r.id === id ? { ...r, status, reviewedBy, reviewedAt: new Date().toISOString() } : r
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // If approved, add to custom users list so they can login
  if (status === "approved") {
    const reg = updated.find((r) => r.id === id);
    if (reg) {
      const customUsersRaw = localStorage.getItem("smartsarabun_custom_users");
      const customUsers = customUsersRaw ? JSON.parse(customUsersRaw) : [];
      
      const role = reg.roleRequested || "OFFICER";
      const rolesList =
        role === "EXECUTIVE"
          ? ["EXECUTIVE"]
          : role === "MANAGER"
          ? ["MANAGER", "OFFICER"]
          : role === "DOCUMENT_OFFICER"
          ? ["DOCUMENT_OFFICER", "OFFICER"]
          : ["OFFICER"];

      customUsers.push({
        id: reg.id,
        code: `DG-${Math.floor(100000 + Math.random() * 900000)}`,
        name: `${reg.prefix || ""}${reg.firstName} ${reg.lastName}`.trim(),
        firstName: reg.firstName,
        lastName: reg.lastName,
        cid: reg.cid,
        email: reg.email,
        username: reg.email,
        phone: reg.phone,
        position: reg.position,
        department: reg.department,
        initialPassword: reg.password,
        roles: rolesList,
        mustChangePassword: false, // They already set their own password
        createdAt: reg.requestedAt,
        approvedAt: reg.reviewedAt,
      });
      localStorage.setItem("smartsarabun_custom_users", JSON.stringify(customUsers));
      // Store their password
      localStorage.setItem(`user_pwd_${reg.id}`, reg.password);
    }
  }
}

export const OFFICIAL_DEPARTMENTS = [
  "สำนักปลัด",
  "กองคลัง",
  "กองช่าง",
  "กองการศึกษา ศาสนาและวัฒนธรรม",
  "กองสาธารณสุขและสิ่งแวดล้อม",
  "กองสวัสดิการสังคม",
];

export const PREFIX_OPTIONS = ["นาย", "นาง", "นางสาว", "ว่าที่ ร.ต.", "จ่าเอก"];

export function RegisterForm({
  onBack,
  isStandalonePage = false,
}: {
  onBack?: () => void;
  isStandalonePage?: boolean;
}) {
  const router = useRouter();

  // Form states
  const [prefix, setPrefix] = useState(PREFIX_OPTIONS[0]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cid, setCid] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("เจ้าหน้าที่ธุรการ");
  const [department, setDepartment] = useState(OFFICIAL_DEPARTMENTS[0]);
  const [roleRequested, setRoleRequested] = useState("DOCUMENT_OFFICER");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Instant demo activation toggle (default: true for best user testing experience!)
  const [instantActivate, setInstantActivate] = useState(true);

  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdUserAccount, setCreatedUserAccount] = useState<any>(null);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score; // 0 to 5
  }, [password]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg("กรุณาระบุชื่อและนามสกุลให้ครบถ้วน");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("กรุณาระบุอีเมลที่ถูกต้อง (รองรับ Gmail, Hotmail ฯลฯ)");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("รหัสผ่านต้องมีความยาวอย่างน้อย ๖ ตัวอักษร");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง");
      return;
    }

    // Check if email is already registered in pending or active users
    const existing = getPendingRegistrations();
    if (
      existing.some(
        (r) => r.email.toLowerCase() === email.toLowerCase() && r.status !== "rejected"
      )
    ) {
      setErrorMsg("อีเมลนี้ถูกลงทะเบียนไปแล้ว กรุณาใช้อีเมลอื่น หรือเข้าสู่ระบบ");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const regId = `reg-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      const nowIso = new Date().toISOString();

      const newReg: PendingRegistration = {
        id: regId,
        prefix,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        cid: cid.trim() || "1-5799-00000-00-0",
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        position: position.trim(),
        department,
        roleRequested,
        password,
        requestedAt: nowIso,
        status: instantActivate ? "approved" : "pending",
        reviewedBy: instantActivate ? "ระบบอนุมัติอัตโนมัติ (Instant Demo)" : undefined,
        reviewedAt: instantActivate ? nowIso : undefined,
      };

      savePendingRegistration(newReg);

      if (instantActivate) {
        // Activate immediately into custom users
        updateRegistrationStatus(regId, "approved", "ระบบอนุมัติอัตโนมัติ (Instant Demo)");
        setCreatedUserAccount({
          id: regId,
          name: `${prefix}${firstName.trim()} ${lastName.trim()}`,
          email: email.trim().toLowerCase(),
          username: email.trim().toLowerCase(),
          position: position.trim(),
          department,
          roles: [roleRequested, "OFFICER"],
        });
      }

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 500);
  };

  // Direct 1-Click Login with newly created account
  const handleInstantLogin = () => {
    if (!createdUserAccount) {
      if (onBack) onBack();
      else router.push("/login");
      return;
    }

    const sessionData = {
      user: createdUserAccount,
      expires: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    };

    if (typeof window !== "undefined") {
      sessionStorage.setItem("smartsarabun_active_session", JSON.stringify(sessionData));
      sessionStorage.setItem("smartsarabun_session_login_time", Date.now().toString());

      const isSecure = window.location.protocol === "https:";
      const secureFlag = isSecure ? "; Secure" : "";

      createSignedSessionToken(createdUserAccount.id, createdUserAccount.roles)
        .then((token) => {
          document.cookie = `smart_sarabun_token=${token}; path=/; SameSite=Strict${secureFlag}`;
          document.cookie = `smart_sarabun_session=1; path=/; SameSite=Strict${secureFlag}`;
          document.cookie = `smart_sarabun_role=${createdUserAccount.roles[0]}; path=/; SameSite=Strict${secureFlag}`;
          window.location.href = "/";
        })
        .catch(() => {
          document.cookie = `smart_sarabun_session=1; path=/; SameSite=Strict${secureFlag}`;
          document.cookie = `smart_sarabun_role=${createdUserAccount.roles[0]}; path=/; SameSite=Strict${secureFlag}`;
          window.location.href = "/";
        });
    }
  };

  // ---------------------------------------------------------------------------
  // SUCCESS SCREEN
  // ---------------------------------------------------------------------------
  if (isSuccess) {
    return (
      <div className="bg-white/[0.98] backdrop-blur-2xl rounded-3xl border border-white/60 shadow-2xl p-6 sm:p-8 space-y-5 text-center select-none animate-in fade-in zoom-in-95">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/15">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-1.5">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block">
            {instantActivate ? "เปิดใช้งานบัญชีสำเร็จเรียบร้อย" : "ส่งคำขอลงทะเบียนเรียบร้อย"}
          </span>
          <h2 className="text-xl font-black text-slate-900">
            {instantActivate
              ? `ยินดีต้อนรับคุณ ${prefix}${firstName} ${lastName}`
              : "ส่งคำขอไปยังผู้ดูแลระบบเรียบร้อย"}
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {instantActivate
              ? `สังกัด ${department} (${position}) บัญชีของท่านพร้อมใช้งานในระบบสารบรรณ อบต.ดอยงาม ทันที`
              : "ผู้ดูแลระบบสารบรรณกลางจะทำการตรวจสอบและอนุมัติสิทธิ์การเข้าใช้งานภายใน ๒๔ ชั่วโมง"}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">ชื่อผู้ใช้งาน (อีเมล):</span>
            <span className="font-bold text-slate-900 font-mono">{email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">สังกัดกอง/สำนัก:</span>
            <span className="font-bold text-slate-900">{department}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">ตำแหน่งงาน:</span>
            <span className="font-bold text-slate-900">{position}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">สถานะบัญชี:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                instantActivate
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {instantActivate ? "✓ อนุมัติแล้ว (พร้อมใช้งาน)" : "⏳ รอดำเนินการอนุมัติ"}
            </span>
          </div>
        </div>

        <div className="space-y-2.5 pt-2">
          {instantActivate ? (
            <button
              type="button"
              onClick={handleInstantLogin}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#0052FF] hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all accessible-focus"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>เข้าสู่ระบบด้วยบัญชีใหม่ทันที</span>
            </button>
          ) : (
            <Link href="/login" className="block">
              <button
                type="button"
                className="w-full py-3.5 px-4 rounded-2xl bg-[#0052FF] hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all accessible-focus"
              >
                <span>กลับสู่หน้าเข้าสู่ระบบ</span>
              </button>
            </Link>
          )}

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold underline cursor-pointer"
            >
              ย้อนกลับ
            </button>
          )}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // REGISTRATION FORM SCREEN
  // ---------------------------------------------------------------------------
  return (
    <div className="bg-white/[0.98] backdrop-blur-2xl rounded-3xl border border-white/60 shadow-2xl p-6 sm:p-8 space-y-6 select-none animate-in fade-in">
      {/* Top Header & Tab Switcher */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-[#0052FF]">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                ลงทะเบียนบุคลากรใหม่
              </h2>
              <p className="text-[11px] text-slate-500">
                ระบบสารบรรณอิเล็กทรอนิกส์ อบต.ดอยงาม
              </p>
            </div>
          </div>

          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="text-xs font-bold text-slate-500 hover:text-[#0052FF] flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>กลับสู่หน้าเข้าสู่ระบบ</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="text-xs font-bold text-slate-500 hover:text-[#0052FF] flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>เข้าสู่ระบบ</span>
            </Link>
          )}
        </div>

        {/* Segmented Mode Control */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="py-2 text-center text-slate-600 hover:text-slate-900 rounded-xl transition-all cursor-pointer"
            >
              🔐 เข้าสู่ระบบ (Login)
            </button>
          ) : (
            <Link
              href="/login"
              className="py-2 text-center text-slate-600 hover:text-slate-900 rounded-xl transition-all"
            >
              🔐 เข้าสู่ระบบ (Login)
            </Link>
          )}
          <div className="py-2 text-center bg-white text-[#0052FF] shadow-xs rounded-xl font-black">
            📝 สมัครสมาชิกใหม่
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleRegister} className="space-y-4">
        {/* Section 1: Personal Info */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 uppercase tracking-wider">
            <User className="w-3.5 h-3.5 text-blue-600" />
            <span>ส่วนที่ ๑ : ข้อมูลส่วนบุคคล</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            <div className="sm:col-span-3">
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                คำนำหน้า *
              </label>
              <select
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0052FF] focus:outline-none"
              >
                {PREFIX_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-5">
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                ชื่อจริง *
              </label>
              <input
                type="text"
                required
                placeholder="เช่น สมพร"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0052FF] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                นามสกุล *
              </label>
              <input
                type="text"
                required
                placeholder="เช่น ใจดี"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0052FF] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                เลขประจำตัวประชาชน (๑๓ หลัก)
              </label>
              <div className="relative">
                <CreditCard className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  maxLength={17}
                  placeholder="X-XXXX-XXXXX-XX-X (ผูก ThaID)"
                  value={cid}
                  onChange={(e) => setCid(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-mono text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0052FF] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                เบอร์โทรศัพท์มือถือ *
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  required
                  placeholder="08X-XXX-XXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-mono text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0052FF] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              อีเมลติดต่อราชการหรือส่วนตัว (ใช้เป็น Username ในการเข้าสู่ระบบ) *
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="somporn.doigam@gmail.com หรืออีเมลอื่นๆ"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0052FF] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Department & Role */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>ส่วนที่ ๒ : สังกัดและตำแหน่งงานใน อบต.ดอยงาม</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                สังกัดกอง / สำนัก *
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0052FF] focus:outline-none cursor-pointer"
              >
                {OFFICIAL_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                ตำแหน่งงาน *
              </label>
              <input
                type="text"
                required
                placeholder="เช่น เจ้าพนักงานธุรการ, นักวิชาการ..."
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0052FF] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              ระดับสิทธิ์การทำงานที่ต้องการขอรับ
            </label>
            <select
              value={roleRequested}
              onChange={(e) => setRoleRequested(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0052FF] focus:outline-none cursor-pointer"
            >
              <option value="DOCUMENT_OFFICER">
                เจ้าหน้าที่งานสารบรรณ (รับ-ส่งหนังสือ, ออกเลข, ร่างคำสั่ง)
              </option>
              <option value="OFFICER">
                ผู้ปฏิบัติงานทั่วไปประจำกอง (รับทราบงาน, เสนอเกษียนหนังสือ)
              </option>
              <option value="MANAGER">
                หัวหน้าฝ่าย / ผู้อำนวยการกอง (ลงนามเกษียน, มอบหมายงาน)
              </option>
            </select>
          </div>
        </div>

        {/* Section 3: Password Security */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-indigo-600" />
            <span>ส่วนที่ ๓ : กำหนดรหัสผ่านและความปลอดภัย</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                กำหนดรหัสผ่าน (อย่างน้อย ๖ ตัวอักษร) *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="ตั้งรหัสผ่านของท่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 pr-9 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0052FF] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                ยืนยันรหัสผ่านใหม่อีกครั้ง *
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="กรอกรหัสผ่านอีกครั้ง"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0052FF] focus:outline-none"
              />
            </div>
          </div>

          {/* Password Strength Meter */}
          {password && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                <span>ระดับความปลอดภัยของรหัสผ่าน:</span>
                <span
                  className={
                    passwordStrength <= 2
                      ? "text-rose-600"
                      : passwordStrength <= 3
                      ? "text-amber-600"
                      : "text-emerald-600"
                  }
                >
                  {passwordStrength <= 2
                    ? "ระดับเริ่มต้น (ควรเพิ่มตัวเลขหรือตัวพิมพ์ใหญ่)"
                    : passwordStrength <= 3
                    ? "ระดับปานกลาง"
                    : "ความปลอดภัยสูง"}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex">
                <div
                  className={`h-full transition-all duration-300 ${
                    passwordStrength <= 2
                      ? "w-1/3 bg-rose-500"
                      : passwordStrength <= 3
                      ? "w-2/3 bg-amber-500"
                      : "w-full bg-emerald-500"
                  }`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Instant Activation Demo Toggle */}
        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/90 flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-black text-blue-900">
              <Zap className="w-4 h-4 text-amber-500 shrink-0" />
              <span>เปิดใช้งานทันที (Instant Demo Mode)</span>
            </div>
            <p className="text-[11px] text-blue-700 leading-snug">
              เปิดให้บัญชีนี้สามารถเข้าสู่ระบบเพื่อทดลองใช้งานสารบรรณได้ทันที 0 วินาที โดยไม่ต้องรอการอนุมัติจาก Admin
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={instantActivate}
              onChange={(e) => setInstantActivate(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0052FF]" />
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#0052FF] hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer accessible-focus disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>กำลังบันทึกข้อมูลและออกรหัสบัญชี...</span>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>ยืนยันการลงทะเบียนบุคลากร</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
