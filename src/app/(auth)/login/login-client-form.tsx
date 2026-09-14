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
  QrCode,
  Smartphone,
  X,
  Fingerprint,
  ExternalLink,
} from "lucide-react";
import { getSavedUserProfile } from "@/lib/user-store";
import { createSignedSessionToken } from "@/lib/auth/session-token";

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
    phone?: string;
    position: string;
    department: string;
    roles: string[];
    mustChangePassword?: boolean;
  };
  icon: any;
  badge: string;
  color: string;
}

export const officialAccounts: OfficialUserAccount[] = [
  {
    id: "admin",
    accountId: "DG-001001",
    thaiName: "ผู้ดูแลระบบสารบรรณกลาง (Admin)",
    aliases: ["admin", "administrator", "superadmin", "admin.doigam@gmail.com", "doigam.sao@gmail.com"],
    username: "admin",
    defaultPassword: "Doigam@2569",
    user: {
      id: "usr-admin",
      accountId: "DG-001001",
      name: "ผู้ดูแลระบบสารบรรณกลาง",
      firstName: "ผู้ดูแลระบบ",
      lastName: "สารบรรณกลาง",
      email: "admin.doigam@gmail.com",
      position: "นักวิชาการคอมพิวเตอร์ / ผู้ดูแลระบบ",
      department: "สำนักปลัด (งานสารบรรณกลาง)",
      roles: ["SUPER_ADMIN", "ADMIN", "PLATFORM_ADMIN", "EXECUTIVE", "PALAD", "MANAGER", "DOCUMENT_OFFICER", "OFFICER"],
    },
    badge: "Admin",
    color: "text-blue-700 bg-blue-50 border-blue-300",
    icon: ShieldCheck,
  },
  {
    id: "executive",
    accountId: "DG-001002",
    thaiName: "นายก อบต.ดอยงาม (ผู้บริหาร)",
    aliases: ["nayok", "executive", "nayok.doigam@gmail.com"],
    username: "nayok",
    defaultPassword: "Doigam@2569",
    user: {
      id: "usr-nayok",
      accountId: "DG-001002",
      name: "นายกองค์การบริหารส่วนตำบลดอยงาม",
      firstName: "นายก อบต.",
      lastName: "ดอยงาม",
      email: "nayok.doigam@gmail.com",
      position: "นายกองค์การบริหารส่วนตำบลดอยงาม",
      department: "สำนักนายก / ผู้บริหาร",
      roles: ["EXECUTIVE"],
    },
    badge: "นายก อบต.",
    color: "text-amber-700 bg-amber-50 border-amber-300",
    icon: UserCheck,
  },
  {
    id: "palad",
    accountId: "DG-001003",
    thaiName: "ปลัด อบต.ดอยงาม",
    aliases: ["palad", "palad.doigam@gmail.com"],
    username: "palad",
    defaultPassword: "Doigam@2569",
    user: {
      id: "usr-palad",
      accountId: "DG-001003",
      name: "ปลัดองค์การบริหารส่วนตำบลดอยงาม",
      firstName: "ปลัด อบต.",
      lastName: "ดอยงาม",
      email: "palad.doigam@gmail.com",
      position: "ปลัดองค์การบริหารส่วนตำบลดอยงาม",
      department: "สำนักปลัด",
      roles: ["PALAD", "MANAGER", "EXECUTIVE"],
    },
    badge: "ปลัด อบต.",
    color: "text-indigo-700 bg-indigo-50 border-indigo-300",
    icon: Briefcase,
  },
  {
    id: "director-engineer",
    accountId: "DG-001004",
    thaiName: "ผู้อำนวยการกองช่าง",
    aliases: ["engineer", "engineer.doigam@gmail.com", "director.tech@gmail.com"],
    username: "engineer",
    defaultPassword: "Doigam@2569",
    user: {
      id: "usr-engineer",
      accountId: "DG-001004",
      name: "ผู้อำนวยการกองช่าง",
      firstName: "ผอ.",
      lastName: "กองช่าง",
      email: "engineer.doigam@gmail.com",
      position: "ผู้อำนวยการกองช่าง",
      department: "กองช่าง",
      roles: ["MANAGER", "OFFICER"],
    },
    badge: "ผอ.กองช่าง",
    color: "text-cyan-700 bg-cyan-50 border-cyan-300",
    icon: Building,
  },
  {
    id: "sarabun",
    accountId: "DG-001005",
    thaiName: "เจ้าหน้าที่สารบรรณกลาง",
    aliases: ["sarabun", "sarabun.doigam@gmail.com"],
    username: "sarabun",
    defaultPassword: "Doigam@2569",
    user: {
      id: "usr-sarabun",
      accountId: "DG-001005",
      name: "เจ้าหน้าที่สารบรรณกลาง",
      firstName: "เจ้าหน้าที่",
      lastName: "สารบรรณกลาง",
      email: "sarabun.doigam@gmail.com",
      position: "เจ้าพนักงานธุรการชำนาญงาน",
      department: "สำนักปลัด",
      roles: ["DOCUMENT_OFFICER", "OFFICER"],
    },
    badge: "สารบรรณกลาง",
    color: "text-emerald-700 bg-emerald-50 border-emerald-300",
    icon: FileText,
  },
];

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes (ISO/IEC 27001 Standard)

interface LockoutState {
  count: number;
  lockedUntil: number | null;
}

function getLockoutState(identifier: string): LockoutState {
  if (typeof window === "undefined" || !identifier) return { count: 0, lockedUntil: null };
  try {
    const raw = localStorage.getItem(`auth_lockout_${identifier.toLowerCase()}`);
    if (!raw) return { count: 0, lockedUntil: null };
    const parsed = JSON.parse(raw);
    if (parsed.lockedUntil && Date.now() > parsed.lockedUntil) {
      localStorage.removeItem(`auth_lockout_${identifier.toLowerCase()}`);
      return { count: 0, lockedUntil: null };
    }
    return parsed;
  } catch {
    return { count: 0, lockedUntil: null };
  }
}

function recordFailedAttempt(identifier: string): { isLocked: boolean; remainingAttempts: number; lockedUntil: number | null } {
  if (typeof window === "undefined" || !identifier) return { isLocked: false, remainingAttempts: MAX_FAILED_ATTEMPTS, lockedUntil: null };
  const current = getLockoutState(identifier);
  const newCount = current.count + 1;
  let lockedUntil: number | null = null;

  if (newCount >= MAX_FAILED_ATTEMPTS) {
    lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
  }

  const newState = { count: newCount, lockedUntil };
  localStorage.setItem(`auth_lockout_${identifier.toLowerCase()}`, JSON.stringify(newState));

  return {
    isLocked: newCount >= MAX_FAILED_ATTEMPTS,
    remainingAttempts: Math.max(0, MAX_FAILED_ATTEMPTS - newCount),
    lockedUntil,
  };
}

function clearLockout(identifier: string) {
  if (typeof window === "undefined" || !identifier) return;
  localStorage.removeItem(`auth_lockout_${identifier.toLowerCase()}`);
}

export function LoginClientForm() {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [matchedAccount, setMatchedAccount] = useState<OfficialUserAccount | null>(null);
  const [lockoutTimer, setLockoutTimer] = useState<number | null>(null);

  // First-Time Login Password Change States
  const [isFirstLoginMode, setIsFirstLoginMode] = useState(false);
  const [pendingAccount, setPendingAccount] = useState<OfficialUserAccount | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordChangeError, setPasswordChangeError] = useState("");
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  // ThaID Digital Identity Modal State
  const [showThaIdModal, setShowThaIdModal] = useState(false);
  const [thaIdStep, setThaIdStep] = useState<"qr" | "authenticating" | "success">("qr");
  const [thaIdTimer, setThaIdTimer] = useState(120);
  const [thaIdUser, setThaIdUser] = useState<OfficialUserAccount | null>(null);

  // ThaID QR countdown timer
  useEffect(() => {
    if (!showThaIdModal || thaIdStep !== "qr") return;
    const interval = setInterval(() => {
      setThaIdTimer((prev) => (prev > 0 ? prev - 1 : 120));
    }, 1000);
    return () => clearInterval(interval);
  }, [showThaIdModal, thaIdStep]);

  // Countdown timer for lockout
  useEffect(() => {
    if (!usernameInput.trim()) {
      setLockoutTimer(null);
      return;
    }
    const clean = usernameInput.trim().toLowerCase();
    const state = getLockoutState(clean);
    if (state.lockedUntil && Date.now() < state.lockedUntil) {
      setLockoutTimer(Math.ceil((state.lockedUntil - Date.now()) / 1000));
    } else {
      setLockoutTimer(null);
    }
  }, [usernameInput]);

  // Stable countdown timer: only setup/teardown interval when active state changes
  const isTimerActive = Boolean(lockoutTimer && lockoutTimer > 0);
  useEffect(() => {
    if (!isTimerActive) return;

    const timer = setInterval(() => {
      setLockoutTimer((prev) => {
        if (prev === null || prev <= 1) {
          setErrorMsg("");
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive]);

  const getAllAccounts = (): OfficialUserAccount[] => {
    let list = [...officialAccounts];
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("smartsarabun_custom_users");
        if (raw) {
          const customUsers = JSON.parse(raw);
          const mapped: OfficialUserAccount[] = customUsers.map((u: any) => ({
            id: u.id,
            accountId: u.code || `USR-${u.id.substring(0, 6)}`,
            thaiName: `${u.firstName} ${u.lastName}`,
            aliases: [u.email, u.username, u.firstName, u.lastName].filter(Boolean),
            username: u.username || u.email,
            defaultPassword: u.initialPassword || "123456",
            user: {
              id: u.id,
              accountId: u.code || `USR-${u.id.substring(0, 6)}`,
              name: `${u.firstName} ${u.lastName}`,
              firstName: u.firstName,
              lastName: u.lastName,
              email: u.email,
              position: u.position || "เจ้าหน้าที่",
              department: u.department || "สำนักปลัด",
              roles: u.roles || ["OFFICER"],
              mustChangePassword: u.mustChangePassword !== false,
            },
            badge: u.position || "เจ้าหน้าที่",
            color: "text-blue-700 bg-blue-50 border-blue-200",
            icon: User,
          }));
          list = [...list, ...mapped];
        }
      } catch (err) {
        console.error("Failed to load custom users:", err);
      }
    }
    return list;
  };

  // Auto detect matched account as user types
  useEffect(() => {
    if (!usernameInput.trim()) {
      setMatchedAccount(null);
      return;
    }
    const clean = usernameInput.trim().toLowerCase();
    const all = getAllAccounts();
    const found = all.find(
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

      // Check ISO 27001 Lockout State first
      const currentLockout = getLockoutState(clean);
      if (currentLockout.lockedUntil && Date.now() < currentLockout.lockedUntil) {
        const remainingSeconds = Math.ceil((currentLockout.lockedUntil - Date.now()) / 1000);
        const mins = Math.floor(remainingSeconds / 60);
        const secs = remainingSeconds % 60;
        setLockoutTimer(remainingSeconds);
        setErrorMsg(`🔒 บัญชีนี้ถูกระงับชั่วคราวเป็นเวลา ๑๕ นาที เพื่อความปลอดภัยตามมาตรฐาน ISO/IEC 27001 เนื่องจากกรอกรหัสผ่านผิดเกิน ๕ ครั้ง (เหลือเวลาอีก ${mins} นาที ${secs} วินาที)`);
        setIsLoading(false);
        return;
      }

      const all = getAllAccounts();
      const targetAcc = all.find(
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

      // Security Fix: If user has a custom password, ONLY accept the custom password.
      // Default password should ONLY work for the first-time login flow (to trigger forced change).
      const passwordToCheck = hasCustomPassword ? currentStoredPassword : targetAcc.defaultPassword;

      if (passwordInput !== passwordToCheck) {
        const lockoutResult = recordFailedAttempt(clean);
        if (lockoutResult.isLocked && lockoutResult.lockedUntil) {
          const remainingSecs = Math.ceil((lockoutResult.lockedUntil - Date.now()) / 1000);
          setLockoutTimer(remainingSecs);
          setErrorMsg("🔒 บัญชีนี้ถูกระงับชั่วคราวเป็นเวลา ๑๕ นาที เพื่อความปลอดภัยตามมาตรฐาน ISO/IEC 27001 เนื่องจากกรอกรหัสผ่านผิดเกิน ๕ ครั้ง");
        } else {
          setErrorMsg(`รหัสผ่านไม่ถูกต้อง (กรอกผิดครั้งที่ ${MAX_FAILED_ATTEMPTS - lockoutResult.remainingAttempts}/${MAX_FAILED_ATTEMPTS} — เหลือโอกาสอีก ${lockoutResult.remainingAttempts} ครั้งก่อนระบบระงับการใช้งานชั่วคราว ๑๕ นาที ตามมาตรฐานความปลอดภัย)`);
        }
        setIsLoading(false);
        return;
      }

      // Successful password check: Clear any recorded failed attempts
      clearLockout(clean);

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
    let userObj = acc.user;
    if (typeof window !== "undefined") {
      const savedProfile =
        getSavedUserProfile(acc.username) ||
        getSavedUserProfile(acc.user.email) ||
        getSavedUserProfile(acc.user.id) ||
        getSavedUserProfile(acc.accountId);
      if (savedProfile) {
        userObj = {
          ...acc.user,
          ...savedProfile,
          name: savedProfile.name || acc.user.name,
          firstName: savedProfile.firstName || acc.user.firstName,
          lastName: savedProfile.lastName || acc.user.lastName,
          position: savedProfile.position || acc.user.position,
          department: savedProfile.department || acc.user.department,
          email: savedProfile.email || acc.user.email,
          phone: savedProfile.phone || acc.user.phone,
        };
      }
    }

    const sessionData = {
      user: userObj,
      expires: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    };

    if (typeof window !== "undefined") {
      sessionStorage.setItem("smartsarabun_active_session", JSON.stringify(sessionData));
      sessionStorage.setItem("smartsarabun_session_login_time", Date.now().toString());
      // Security Fix: Add Secure flag (HTTPS-only in production) and SameSite=Strict
      const isSecure = window.location.protocol === "https:";
      const secureFlag = isSecure ? "; Secure" : "";

      createSignedSessionToken(userObj.id, userObj.roles)
        .then((token) => {
          document.cookie = `smart_sarabun_token=${token}; path=/; SameSite=Strict${secureFlag}`;
          document.cookie = `smart_sarabun_session=1; path=/; SameSite=Strict${secureFlag}`;
          document.cookie = `smart_sarabun_role=${userObj.roles[0]}; path=/; SameSite=Strict${secureFlag}`;
          window.location.href = "/";
        })
        .catch(() => {
          document.cookie = `smart_sarabun_session=1; path=/; SameSite=Strict${secureFlag}`;
          document.cookie = `smart_sarabun_role=${userObj.roles[0]}; path=/; SameSite=Strict${secureFlag}`;
          window.location.href = "/";
        });
    }
  };

  const handleSimulateThaIdLogin = (accountKey: string) => {
    const all = getAllAccounts();
    const acc = all.find((a) => a.id === accountKey) || all[1];
    setThaIdUser(acc);
    setThaIdStep("authenticating");

    setTimeout(() => {
      setThaIdStep("success");
      setTimeout(() => {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("smartsarabun_auth_method", "THAID_DOPA");
          sessionStorage.setItem("smartsarabun_thaid_verified", "true");
        }
        completeLogin(acc);
      }, 900);
    }, 1100);
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
    <div className="space-y-4">
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            ชื่อผู้ใช้งาน หรือ อีเมล (Username / Email)
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              required
              placeholder="กรอกชื่อผู้ใช้งาน หรือ อีเมล (Gmail / Hotmail ฯลฯ)"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/60 focus:bg-white text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0052FF] focus:outline-none transition-all shadow-2xs"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700">รหัสผ่าน (Password)</label>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="กรอกรหัสผ่านของท่าน"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 bg-slate-50/60 focus:bg-white text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#0052FF] focus:outline-none transition-all shadow-2xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || (lockoutTimer !== null && lockoutTimer > 0)}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#0052FF] hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>กำลังตรวจสอบข้อมูล...</span>
            </>
          ) : lockoutTimer !== null && lockoutTimer > 0 ? (
            <>
              <Lock className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>
                ระงับชั่วคราว (รอ {Math.floor(lockoutTimer / 60)}:{(lockoutTimer % 60).toString().padStart(2, "0")} นาที)
              </span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 text-amber-300" />
              <span>เข้าสู่ระบบสารบรรณ</span>
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-[10px] font-bold uppercase">
          <span className="bg-white px-2.5 text-slate-400">หรือยืนยันตัวตนดิจิทัลภาครัฐ</span>
        </div>
      </div>

      {/* ThaID DOPA Button */}
      <button
        type="button"
        onClick={() => {
          setThaIdStep("qr");
          setThaIdTimer(120);
          setShowThaIdModal(true);
        }}
        className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#0b192c] via-[#1e3e62] to-[#0052FF] hover:from-[#001f3f] hover:to-[#0041c2] text-white font-bold text-xs shadow-md shadow-blue-900/20 border border-blue-400/30 flex items-center justify-between group transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 group-hover:scale-105 transition-transform">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div className="text-left leading-tight">
            <div className="text-xs font-black text-white flex items-center gap-1.5">
              <span>เข้าสู่ระบบด้วย ThaID</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                DOPA Verified
              </span>
            </div>
            <div className="text-[10px] text-slate-300 font-normal">
              บัตรประชาชนดิจิทัล (กรมการปกครอง)
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-cyan-300 text-[11px] font-bold">
          <QrCode className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">สแกน QR ↗</span>
        </div>
      </button>

      {/* ThaID Authentication Modal */}
      {showThaIdModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 flex flex-col">
            {/* ThaID Header */}
            <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-indigo-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                  <Fingerprint className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm">เข้าสู่ระบบด้วย ThaID</h3>
                    <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded bg-blue-500/30 text-blue-300 border border-blue-400/30">
                      DOPA Digital ID
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300">
                    กรมการปกครอง กระทรวงมหาดไทย (พ.ร.บ.ปฏิบัติราชการฯ ๒๕๖๕)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowThaIdModal(false)}
                className="w-7 h-7 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ThaID Body */}
            <div className="p-6 space-y-5 text-center">
              {thaIdStep === "qr" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-black text-sm text-slate-900">
                      เปิดแอป ThaID บนมือถือ เพื่อสแกน QR Code
                    </h4>
                    <p className="text-xs text-slate-500">
                      ระบบจะตรวจสอบความถูกต้องของบัตรประชาชนดิจิทัล และเข้าสู่ระบบสารบรรณโดยอัตโนมัติ
                    </p>
                  </div>

                  {/* Visual QR Code with Scan Radar Animation */}
                  <div className="relative w-52 h-52 mx-auto bg-white p-3 rounded-2xl border-2 border-slate-200 shadow-md flex items-center justify-center overflow-hidden">
                    {/* Animated Scanning Bar */}
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400/50 animate-pulse top-1/2 -translate-y-1/2" />

                    <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900" fill="currentColor">
                      <rect x="0" y="0" width="30" height="30" rx="3" />
                      <rect x="5" y="5" width="20" height="20" fill="white" />
                      <rect x="10" y="10" width="10" height="10" />

                      <rect x="70" y="0" width="30" height="30" rx="3" />
                      <rect x="75" y="5" width="20" height="20" fill="white" />
                      <rect x="80" y="10" width="10" height="10" />

                      <rect x="0" y="70" width="30" height="30" rx="3" />
                      <rect x="5" y="75" width="20" height="20" fill="white" />
                      <rect x="10" y="80" width="10" height="10" />

                      <rect x="40" y="10" width="8" height="8" />
                      <rect x="52" y="10" width="8" height="8" />
                      <rect x="40" y="25" width="8" height="8" />
                      <rect x="52" y="25" width="8" height="8" />
                      <rect x="40" y="40" width="20" height="20" rx="2" fill="#0052FF" />
                      <rect x="10" y="45" width="8" height="8" />
                      <rect x="25" y="45" width="8" height="8" />
                      <rect x="75" y="45" width="8" height="8" />
                      <rect x="88" y="45" width="8" height="8" />
                      <rect x="70" y="70" width="10" height="10" />
                      <rect x="85" y="70" width="10" height="10" />
                      <rect x="70" y="85" width="10" height="10" />
                      <rect x="85" y="85" width="10" height="10" />
                    </svg>

                    {/* ThaID Center Emblem */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-10 h-10 rounded-xl bg-white/95 shadow-md border border-slate-200 flex items-center justify-center text-blue-900 font-black text-xs">
                        ThaID
                      </div>
                    </div>
                  </div>

                  {/* Countdown Timer */}
                  <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>
                      QR Code หมดอายุใน {Math.floor(thaIdTimer / 60)}:{(thaIdTimer % 60).toString().padStart(2, "0")} นาที
                    </span>
                  </div>

                  {/* 1-Click Simulation / Testing Panel */}
                  <div className="pt-2 border-t border-slate-200 space-y-2 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        จำลองการสแกนด้วยแอป ThaID (1-Click Test):
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <button
                        type="button"
                        onClick={() => handleSimulateThaIdLogin("executive")}
                        className="w-full p-2.5 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100/70 text-amber-950 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-amber-600" />
                          <span>นายก อบต.ดอยงาม (นายสำอางค์ ธรรมโก)</span>
                        </div>
                        <span className="text-[10px] text-amber-700 bg-amber-200/80 px-2 py-0.5 rounded-full font-mono">
                          ผู้บริหาร
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSimulateThaIdLogin("palad")}
                        className="w-full p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100/70 text-indigo-950 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-indigo-600" />
                          <span>ปลัด อบต.ดอยงาม (จ่าเอก สมเกียรติ พินิจอักษร)</span>
                        </div>
                        <span className="text-[10px] text-indigo-700 bg-indigo-200/80 px-2 py-0.5 rounded-full font-mono">
                          ปลัด
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSimulateThaIdLogin("sarabun")}
                        className="w-full p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-950 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-emerald-600" />
                          <span>เจ้าหน้าที่สารบรรณกลาง (นางสาวธัญวรรัตน์ ตาสาย)</span>
                        </div>
                        <span className="text-[10px] text-emerald-700 bg-emerald-200/80 px-2 py-0.5 rounded-full font-mono">
                          สารบรรณ
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {thaIdStep === "authenticating" && (
                <div className="py-12 space-y-4 animate-in fade-in">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-100 text-blue-600 flex items-center justify-center animate-spin">
                    <RefreshCw className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-black text-slate-900">
                      กำลังเชื่อมต่อกับระบบ DOPA OpenID Connect...
                    </h4>
                    <p className="text-xs text-slate-500">
                      กำลังตรวจสอบความถูกต้องของกุญแจดิจิทัลและหนังสือรับรองอัตลักษณ์
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-cyan-600 font-bold">
                    PID HASH: SHA-256: 8a4c1f... VALID
                  </div>
                </div>
              )}

              {thaIdStep === "success" && (
                <div className="py-10 space-y-4 animate-in zoom-in-95">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-black text-slate-900">
                      ยืนยันตัวตนด้วย ThaID สำเร็จแล้ว!
                    </h4>
                    <p className="text-xs text-slate-600">
                      ยินดีต้อนรับ <strong>{thaIdUser?.thaiName || "ผู้ใช้งาน"}</strong>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      ตำแหน่ง: {thaIdUser?.user?.position} ({thaIdUser?.user?.department})
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                    ✓ ออกเซสชันที่มีการรับรองอัตลักษณ์ดิจิทัลภาครัฐเรียบร้อยแล้ว
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
