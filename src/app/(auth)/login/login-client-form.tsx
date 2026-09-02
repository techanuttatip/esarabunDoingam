"use client";

import { useState, useEffect } from "react";
import {
  User,
  Lock,
  LogIn,
  ShieldCheck,
  FileText,
  UserCheck,
  Briefcase,
  RefreshCw,
  Sparkles,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Building,
  Check,
  ShieldAlert,
  Info,
} from "lucide-react";

export interface OfficialUserAccount {
  id: string;
  accountId: string;
  thaiName: string;
  aliases: string[];
  username: string;
  defaultPassword: string;
  user: {
    id: string;
    accountId: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    position: string;
    department: string;
    roles: string[];
  };
  icon: any;
  badge: string;
  color: string;
}

export const officialAccounts: OfficialUserAccount[] = [
  {
    id: "techanut",
    accountId: "DG-008301",
    thaiName: "ผู้ดูแลระบบสูงสุด (Super Admin)",
    aliases: ["techanut0@gmail.com", "techanut", "superadmin", "admin", "00830125"],
    username: "techanut0@gmail.com",
    defaultPassword: "00830125",
    user: {
      id: "usr-superadmin",
      accountId: "DG-008301",
      name: "ผู้ดูแลระบบสูงสุด (Super Admin)",
      firstName: "ผู้ดูแลระบบ",
      lastName: "สูงสุด",
      email: "techanut0@gmail.com",
      position: "ผู้ดูแลระบบสารบรรณอิเล็กทรอนิกส์ & แพลตฟอร์ม SaaS",
      department: "ผู้ดูแลระบบส่วนกลาง (SaaS Owner)",
      roles: ["SUPER_ADMIN", "ADMIN", "PLATFORM_ADMIN", "EXECUTIVE", "PALAD", "MANAGER", "DOCUMENT_OFFICER", "OFFICER"],
    },
    badge: "Super Admin",
    color: "text-amber-700 bg-amber-50 border-amber-300",
    icon: ShieldAlert,
  },
];

export function LoginClientForm() {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [matchedAccount, setMatchedAccount] = useState<OfficialUserAccount | null>(null);

  // First-Time Login Password Change States
  const [isFirstLoginMode, setIsFirstLoginMode] = useState(false);
  const [pendingAccount, setPendingAccount] = useState<OfficialUserAccount | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordChangeError, setPasswordChangeError] = useState("");
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  // Auto detect matched account as user types
  useEffect(() => {
    if (!usernameInput.trim()) {
      setMatchedAccount(null);
      return;
    }
    const clean = usernameInput.trim().toLowerCase();
    const found = officialAccounts.find(
      (acc) =>
        acc.thaiName.toLowerCase().includes(clean) ||
        acc.username.toLowerCase() === clean ||
        acc.aliases.some((alias) => alias.toLowerCase().includes(clean))
    );
    setMatchedAccount(found || null);
  }, [usernameInput]);

  const handleSelectOfficialUser = (acc: OfficialUserAccount) => {
    setUsernameInput(acc.thaiName);
    setPasswordInput(acc.defaultPassword);
    setMatchedAccount(acc);
    setErrorMsg("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    setTimeout(() => {
      const clean = usernameInput.trim().toLowerCase();
      const targetAcc = officialAccounts.find(
        (acc) =>
          acc.thaiName.toLowerCase().includes(clean) ||
          acc.username.toLowerCase() === clean ||
          acc.aliases.some((alias) => alias.toLowerCase().includes(clean))
      );

      if (!targetAcc) {
        setErrorMsg("ไม่พบชื่อผู้ใช้งานนี้ในระบบ กรุณาตรวจสอบกับผู้ดูแลระบบ (Admin)");
        setIsLoading(false);
        return;
      }

      // Check if password matches (either updated password in localStorage or default)
      let currentStoredPassword = targetAcc.defaultPassword;
      let hasCustomPassword = false;

      if (typeof window !== "undefined") {
        const custom = localStorage.getItem(`user_pwd_${targetAcc.user.id}`);
        if (custom) {
          currentStoredPassword = custom;
          hasCustomPassword = true;
        }
      }

      if (passwordInput !== currentStoredPassword && passwordInput !== targetAcc.defaultPassword) {
        setErrorMsg("รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
        setIsLoading(false);
        return;
      }

      // Check if this is the FIRST TIME logging in with the default password
      if (!hasCustomPassword && passwordInput === targetAcc.defaultPassword) {
        // Trigger First-Time Login Password Change Flow
        setPendingAccount(targetAcc);
        setIsFirstLoginMode(true);
        setIsLoading(false);
        return;
      }

      // Successful login for returning user who already set a custom password
      completeLogin(targetAcc);
    }, 450);
  };

  const handleForcePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError("");

    if (!pendingAccount) return;

    if (newPassword.length < 6) {
      setPasswordChangeError("รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย ๖ ตัวอักษร");
      return;
    }

    if (newPassword === pendingAccount.defaultPassword) {
      setPasswordChangeError("รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสผ่านเริ่มต้นของระบบ");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordChangeError("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    // Save custom password in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(`user_pwd_${pendingAccount.user.id}`, newPassword);
      localStorage.setItem(`pwd_changed_at_${pendingAccount.user.id}`, new Date().toISOString());
    }

    setPasswordChangeSuccess(true);
    setTimeout(() => {
      completeLogin(pendingAccount);
    }, 1200);
  };

  const completeLogin = (acc: OfficialUserAccount) => {
    const sessionData = {
      user: acc.user,
      expires: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("smartsarabun_custom_session", JSON.stringify(sessionData));
      localStorage.setItem("smartsarabun_user_profile", JSON.stringify(acc.user));
      localStorage.setItem("smartsarabun_session_login_time", Date.now().toString());
      document.cookie = "smart_sarabun_session=1; path=/; max-age=28800; SameSite=Lax";
      document.cookie = `smart_sarabun_role=${acc.user.roles[0]}; path=/; max-age=28800; SameSite=Lax`;
      window.location.href = "/";
    }
  };

  // ---------------------------------------------------------------------------
  // SCREEN 2: Force Password Change for First-Time Users
  // ---------------------------------------------------------------------------
  if (isFirstLoginMode && pendingAccount) {
    return (
      <div className="space-y-5 animate-in fade-in zoom-in-95">
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
          <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <span>เข้าสู่ระบบครั้งแรก — กรุณาตั้งรหัสผ่านใหม่</span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            ผู้ดูแลระบบได้สร้างบัญชีผู้ใช้งานให้ท่านเรียบร้อยแล้ว เพื่อความปลอดภัยของข้อมูลราชการ กรุณากำหนดรหัสผ่านใหม่ส่วนตัวของท่านก่อนเริ่มใช้งาน
          </p>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
          <div><strong>ชื่อผู้ใช้งาน :</strong> <span className="text-slate-900 font-bold">{pendingAccount.thaiName}</span></div>
          <div><strong>ตำแหน่ง :</strong> <span className="text-slate-700">{pendingAccount.user.position}</span></div>
          <div><strong>สังกัด :</strong> <span className="text-slate-700">{pendingAccount.user.department}</span></div>
        </div>

        {passwordChangeError && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{passwordChangeError}</span>
          </div>
        )}

        {passwordChangeSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>เปลี่ยนรหัสผ่านสำเร็จแล้ว! กำลังนำท่านเข้าสู่ระบบ...</span>
          </div>
        )}

        <form onSubmit={handleForcePasswordChange} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              รหัสผ่านเริ่มต้นปัจจุบัน :
            </label>
            <input
              type="text"
              disabled
              value={pendingAccount.defaultPassword}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-mono text-xs font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              กำหนดรหัสผ่านใหม่ (อย่างน้อย ๖ ตัวอักษร) * :
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="ตั้งรหัสผ่านใหม่ส่วนตัวของท่าน"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              ยืนยันรหัสผ่านใหม่อีกครั้ง * :
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="กรอกรหัสผ่านใหม่อีกครั้งเพื่อยืนยัน"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              disabled={passwordChangeSuccess}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>บันทึกรหัสผ่านใหม่ & เข้าสู่ระบบ</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsFirstLoginMode(false);
                setPendingAccount(null);
              }}
              className="py-3 px-3 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-bold"
            >
              ยกเลิก
            </button>
          </div>
        </form>

        <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-[11px] text-blue-900 leading-snug flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <span>
            หมายเหตุ: ข้อมูลส่วนตัวอื่นๆ และลายมือชื่ออิเล็กทรอนิกส์ (E-Signature) ท่านสามารถเข้าไปจัดการแก้ไขเองได้ในเมนู <strong>&ldquo;โปรไฟล์ & ลายเซ็น&rdquo;</strong> หลังจากเข้าสู่ระบบเสร็จสิ้นแล้ว
          </span>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // SCREEN 1: Standard Official Login Screen
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-5">
      {/* Official Admin Note */}
      <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-[11px] text-blue-900 leading-snug flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <span>
          <strong>ประกาศระบบ :</strong> ผู้ดูแลระบบ (Admin) เป็นผู้เพิ่มรายชื่อและกำหนดรหัสผ่านเริ่มต้นให้ หากเข้าสู่ระบบครั้งแรก ระบบจะบังคับให้ท่านเปลี่ยนรหัสผ่านใหม่ทันที
        </span>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            ชื่อผู้ใช้งาน หรือ อีเมล (Username / Email) :
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              required
              placeholder="กรอกชื่อผู้ใช้งาน หรือ อีเมล (เช่น techanut0@gmail.com)"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700">รหัสผ่าน (Password) :</label>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="กรอกรหัสผ่านของท่าน"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0052FF] via-[#0284c7] to-[#2563eb] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>กำลังตรวจสอบข้อมูล...</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 text-amber-300" />
              <span>เข้าสู่ระบบสารบรรณ</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
