"use client";

import { useState } from "react";
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
} from "lucide-react";

const STORAGE_KEY = "smartsarabun_pending_registrations";

export interface PendingRegistration {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
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

export function updateRegistrationStatus(id: string, status: "approved" | "rejected", reviewedBy: string) {
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
      customUsers.push({
        id: reg.id,
        firstName: reg.firstName,
        lastName: reg.lastName,
        email: reg.email,
        username: reg.email,
        phone: reg.phone,
        position: reg.position,
        department: reg.department,
        initialPassword: reg.password,
        roles: ["OFFICER"],
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

const DEPARTMENTS = [
  "สำนักปลัด",
  "กองคลัง",
  "กองช่าง",
  "กองการศึกษา ศาสนาและวัฒนธรรม",
  "กองสาธารณสุข",
  "กองสวัสดิการสังคม",
];

export function RegisterForm({ onBack }: { onBack: () => void }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password.length < 6) {
      setErrorMsg("รหัสผ่านต้องมีอย่างน้อย ๖ ตัวอักษร");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("รหัสผ่านไม่ตรงกัน กรุณากรอกใหม่");
      return;
    }

    // Check if email is already registered
    const existing = getPendingRegistrations();
    if (existing.some((r) => r.email.toLowerCase() === email.toLowerCase() && r.status !== "rejected")) {
      setErrorMsg("อีเมลนี้ถูกลงทะเบียนไปแล้ว กรุณาใช้อีเมลอื่น หรือรอการอนุมัติจากผู้ดูแลระบบ");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const reg: PendingRegistration = {
        id: `reg-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        firstName,
        lastName,
        email,
        phone,
        position,
        department,
        password,
        requestedAt: new Date().toISOString(),
        status: "pending",
      };

      savePendingRegistration(reg);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 600);
  };

  if (isSuccess) {
    return (
      <div className="space-y-5 text-center py-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7 text-emerald-600" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-black text-slate-900">ส่งคำขอสมัครเรียบร้อยแล้ว!</h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            คำขอของคุณถูกส่งไปยังผู้ดูแลระบบ (Admin) แล้ว
            เมื่อได้รับการอนุมัติ คุณจะสามารถเข้าสู่ระบบด้วยอีเมลและรหัสผ่านที่ตั้งไว้ได้ทันที
          </p>
        </div>
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 font-medium">
          ⏳ สถานะ: <strong>รอการอนุมัติจากผู้ดูแลระบบ</strong>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="w-full py-3 px-4 rounded-2xl border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-sm transition-all cursor-pointer"
        >
          กลับไปหน้าเข้าสู่ระบบ
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0052FF] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>กลับไปหน้าเข้าสู่ระบบ</span>
      </button>

      {errorMsg && (
        <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-3.5">
        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">ชื่อจริง *</label>
            <input
              type="text"
              required
              placeholder="เช่น สมชาย"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0052FF] focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">นามสกุล *</label>
            <input
              type="text"
              required
              placeholder="เช่น ดอยงาม"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0052FF] focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-[11px] font-bold text-slate-600 block mb-1">อีเมล *</label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              required
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0052FF] focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="text-[11px] font-bold text-slate-600 block mb-1">เบอร์โทรศัพท์</label>
          <input
            type="tel"
            placeholder="08x-xxx-xxxx"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0052FF] focus:outline-none transition-all"
          />
        </div>

        {/* Position & Department */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">ตำแหน่ง *</label>
            <div className="relative">
              <Briefcase className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                placeholder="เช่น เจ้าพนักงานธุรการ"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0052FF] focus:outline-none transition-all"
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">กอง / ฝ่าย *</label>
            <div className="relative">
              <Building2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0052FF] focus:outline-none transition-all appearance-none cursor-pointer"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-[11px] font-bold text-slate-600 block mb-1">ตั้งรหัสผ่าน * (อย่างน้อย ๖ ตัว)</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="ตั้งรหัสผ่านส่วนตัว"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#0052FF] focus:outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-[11px] font-bold text-slate-600 block mb-1">ยืนยันรหัสผ่าน *</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="กรอกรหัสผ่านอีกครั้ง"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#0052FF] focus:outline-none transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>กำลังส่งคำขอ...</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>ส่งคำขอสมัครสมาชิก</span>
            </>
          )}
        </button>

        <p className="text-[10px] text-slate-400 text-center leading-relaxed">
          เมื่อส่งคำขอแล้ว ผู้ดูแลระบบ (Admin) จะตรวจสอบและอนุมัติให้ภายใน ๑ วันทำการ
        </p>
      </form>
    </div>
  );
}
