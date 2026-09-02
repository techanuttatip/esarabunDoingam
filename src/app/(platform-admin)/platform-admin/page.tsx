"use client";

import { useState, useEffect, useRef } from "react";
import {
  Server,
  Building2,
  Users,
  HardDrive,
  Cpu,
  Activity,
  ShieldCheck,
  Zap,
  SlidersHorizontal,
  Plus,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Lock,
  Layers,
  ArrowRight,
  CheckCircle2,
  Globe,
  Database,
  Radio,
  Terminal,
  Play,
  Pause,
  Trash2,
  Copy,
  Check,
  X,
  Search,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Wifi,
  Gauge,
  Sliders,
  Maximize2,
  CloudLightning,
  FileSignature,
  Image as ImageIcon,
  Calendar,
  FileText,
  Clock,
  ExternalLink,
  Award,
  Upload,
  HelpCircle,
  Briefcase,
  KeyRound,
  Inbox,
  Send,
  PenTool,
  Hash,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type OrgStatus = "ACTIVE" | "TRIAL" | "SUSPENDED" | "EXPIRED";

export interface EnterpriseContract {
  contractNo: string;
  poNumber: string;
  termYears: number;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  contractValueThb: string;
  slaTier: "PLATINUM" | "GOLD" | "SILVER";
  coordinatorName: string;
  coordinatorPhone: string;
  customDomain: string;
}

export interface PlatformTenantItem {
  id: string;
  name: string;
  code: string;
  region: string;
  cluster: string;
  planName: string;
  status: OrgStatus;
  currentUsers: number;
  maxUsers: number;
  storageUsedGb: number;
  maxStorageGb: number;
  docsThisMonth: number;
  qps: number;
  renewalDate: string;
  contract: EnterpriseContract;
  branding: {
    logoUrl: string;
    stampCount: number;
    hasWatermark: boolean;
    digitalCertValid: boolean;
  };
}

const initialTenants: PlatformTenantItem[] = [
  {
    id: "org-01",
    name: "องค์การบริหารส่วนตำบลดอยงาม",
    code: "DOIGAM-SAO",
    region: "อำเภอพาน จังหวัดเชียงราย",
    cluster: "CNX-01 (Northern Edge)",
    planName: "Gov Enterprise (ราชการส่วนท้องถิ่น)",
    status: "ACTIVE",
    currentUsers: 14,
    maxUsers: 50,
    storageUsedGb: 12.8,
    maxStorageGb: 100,
    docsThisMonth: 801,
    qps: 18.4,
    renewalDate: "30 ก.ย. 2570",
    contract: {
      contractNo: "DG-SaaS-2569/001",
      poNumber: "PO-2569-0001",
      termYears: 1,
      startDate: "1 ต.ค. 2568",
      endDate: "30 ก.ย. 2569",
      daysRemaining: 30,
      contractValueThb: "ทดลองใช้งาน ๓๐ วัน",
      slaTier: "PLATINUM",
      coordinatorName: "นายสมศักดิ์ สุขใจ (หัวหน้าสำนักปลัด)",
      coordinatorPhone: "053-958-100",
      customDomain: "sarabun.doigam.go.th",
    },
    branding: {
      logoUrl: "/images/doigam-logo.png",
      stampCount: 1,
      hasWatermark: true,
      digitalCertValid: true,
    },
  },
];

const mockLogs = [
  { time: "13:08:12", tag: "AUTH", color: "text-emerald-600 bg-emerald-50 border-emerald-200", msg: "Keycloak OIDC JWT token verified for [DOIGAM-SAO:u-som-sak] (ThaID DOPA OK)" },
  { time: "13:08:14", tag: "POSTGRES", color: "text-blue-600 bg-blue-50 border-blue-200", msg: "RLS multi-tenant query executed: SELECT FROM documents WHERE org_id = 'DOIGAM-SAO' (1.8ms)" },
  { time: "13:08:16", tag: "CONTRACT", color: "text-amber-600 bg-amber-50 border-amber-200", msg: "Contract validity check: CN-69/042-DOIGAM active (395 days remaining, SLA: PLATINUM)" },
  { time: "13:08:18", tag: "S3-STORAGE", color: "text-indigo-600 bg-indigo-50 border-indigo-200", msg: "Immutable PDF uploaded: /s3/DOIGAM-SAO/2569/doc-4589.pdf (SHA-256 Verified, Encrypted)" },
  { time: "13:08:20", tag: "AI-OCR", color: "text-cyan-600 bg-cyan-50 border-cyan-200", msg: "Gemini 2.5 Flash Thai OCR extracted 9 fields with 98.4% confidence (0.9s)" },
  { time: "13:08:22", tag: "E-SEAL", color: "text-rose-600 bg-rose-50 border-rose-200", msg: "Official Gov Crest e-Seal stamped with digital timestamp (ETSI PAdES compliant)" },
];

import {
  getTenantSaaSConfig,
  saveTenantSaaSConfig,
  TenantSaaSConfig,
  calculateDaysRemaining,
} from "@/config/tenant-config";

export default function PlatformAdminDashboardPage() {
  const [tenants, setTenants] = useState<PlatformTenantItem[]>(initialTenants);
  const [activeTab, setActiveTab] = useState<"saas_config" | "overview" | "tenants" | "contracts" | "branding" | "terminal">("saas_config");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTenantForInspector, setSelectedTenantForInspector] = useState<PlatformTenantItem | null>(null);

  // Live Tenant SaaS Configuration State for Dev Control
  const [saasConfig, setSaasConfig] = useState<TenantSaaSConfig>(getTenantSaaSConfig());
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setSaasConfig(getTenantSaaSConfig());
  }, []);

  const handleSaveSaaSConfig = (updated: TenantSaaSConfig) => {
    setSaasConfig(updated);
    saveTenantSaaSConfig(updated);
    setSaveSuccessMsg("บันทึกการตั้งค่าและบังคับใช้กับระบบของ อบต.ดอยงาม สำเร็จเรียบร้อย!");
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const handleAddTrialDays = (days: number) => {
    const currentEnd = new Date(saasConfig.trialExpiresAt).getTime();
    const newEnd = new Date(Math.max(Date.now(), currentEnd) + days * 24 * 60 * 60 * 1000);
    const updated: TenantSaaSConfig = {
      ...saasConfig,
      licenseStatus: "TRIAL",
      trialExpiresAt: newEnd.toISOString(),
    };
    handleSaveSaaSConfig(updated);
  };

  const handleReset30Days = () => {
    const now = new Date();
    const newEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const updated: TenantSaaSConfig = {
      ...saasConfig,
      licenseStatus: "TRIAL",
      trialStartDate: now.toISOString(),
      trialExpiresAt: newEnd.toISOString(),
    };
    handleSaveSaaSConfig(updated);
  };

  const handleActivateFullLicense = () => {
    const updated: TenantSaaSConfig = {
      ...saasConfig,
      licenseStatus: "ACTIVE",
      licenseTier: "PROFESSIONAL",
    };
    handleSaveSaaSConfig(updated);
  };

  const handleEmergencyLock = () => {
    const updated: TenantSaaSConfig = {
      ...saasConfig,
      licenseStatus: "SUSPENDED",
    };
    handleSaveSaaSConfig(updated);
  };

  // Telemetry Realtime Tickers
  const [dbLatency, setDbLatency] = useState(1.8);
  const [qpsTicker, setQpsTicker] = useState(842);
  const [cpuUsage, setCpuUsage] = useState(14.2);

  useEffect(() => {
    const interval = setInterval(() => {
      setDbLatency(Number((1.6 + Math.random() * 0.5).toFixed(1)));
      setQpsTicker(Math.floor(820 + Math.random() * 50));
      setCpuUsage(Number((13.5 + Math.random() * 2.5).toFixed(1)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const totalTenants = tenants.length;
  const activeTenants = tenants.filter((t) => t.status === "ACTIVE").length;
  const totalUsers = tenants.reduce((acc, t) => acc + t.currentUsers, 0);
  const totalDocs = tenants.reduce((acc, t) => acc + t.docsThisMonth, 0);
  const totalStorage = tenants.reduce((acc, t) => acc + t.storageUsedGb, 0).toFixed(1);

  const filteredTenants = tenants.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.contract.contractNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [isDevAuthenticated, setIsDevAuthenticated] = useState(false);
  const [masterKeyInput, setMasterKeyInput] = useState("");
  const [authError, setAuthError] = useState("");

  const handleDevUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (masterKeyInput === "00830125" || masterKeyInput === "techanut0@gmail.com") {
      setIsDevAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("รหัส Master Key ไม่ถูกต้อง — หน้านี้สงวนเฉพาะทีมวิศวกรผู้พัฒนาระบบเท่านั้น กรุณาติดต่อเจ้าหน้าที่");
    }
  };

  if (!isDevAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-slate-100 selection:bg-rose-600 selection:text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-rose-950/30 via-slate-950 to-slate-950" />
        <Card className="w-full max-w-md bg-slate-900/90 border-slate-800 backdrop-blur-2xl p-8 rounded-3xl text-center space-y-6 shadow-2xl relative z-10 border">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-950/50">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              <Lock className="w-3 h-3" />
              <span>DEV ACCESS ONLY • LEVEL 0</span>
            </div>
            <h2 className="text-xl font-black text-white">พื้นที่สงวนเฉพาะทีมผู้พัฒนาระบบคลาวด์</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              หน้านี้สำหรับทีมวิศวกรผู้ดูแลระบบแพลตฟอร์ม SaaS เท่านั้น ผู้ใช้งานทั่วไปกรุณาติดต่อเจ้าหน้าที่เพื่อรับบริการ
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold animate-in fade-in">
              {authError}
            </div>
          )}

          <form onSubmit={handleDevUnlock} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="กรอก Developer Master Key..."
                value={masterKeyInput}
                onChange={(e) => setMasterKeyInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 font-mono text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl h-11 shadow-lg shadow-blue-600/30 cursor-pointer text-xs"
            >
              ปลดล็อกศูนย์ควบคุม SaaS (Dev Unlock)
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-800">
            <a
              href="/login"
              className="text-xs text-slate-400 hover:text-white transition-colors block font-medium"
            >
              ← กลับสู่หน้าระบบสารบรรณ (ผู้ใช้งานทั่วไป)
            </a>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4f9] text-slate-900 font-sans relative overflow-x-hidden selection:bg-[#0052FF] selection:text-white">
      {/* Background Pastel Ambient Glow Orbs for Crystal Light Glassmorphism */}
      <div className="glow-orb-light-blue -top-20 -left-20 w-[600px] h-[600px] opacity-70" />
      <div className="glow-orb-light-cyan top-[30%] -right-20 w-[700px] h-[700px] opacity-65" />
      <div className="glow-orb-light-purple -bottom-20 left-1/3 w-[650px] h-[650px] opacity-60" />

      {/* 1. TOP COMMAND BAR (Crystal Light Frosted Glass Dock) */}
      <header className="sticky top-0 z-50 bg-white/75 backdrop-blur-2xl border-b border-slate-200/80 px-4 sm:px-8 py-3.5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0052FF] to-[#0284c7] text-white flex items-center justify-center shadow-md shadow-blue-500/25 border border-white/60">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-tight text-slate-900">
                SaaS Super Admin Command Center
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
                CONFIDENTIAL • LEVEL 0
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              ศูนย์ควบคุมคลาวด์สารบรรณภาครัฐ & บริหารสัญญา อปท. ทั่วประเทศ (Multi-Tenant Platform)
            </p>
          </div>
        </div>

        {/* Live Telemetry Pill Bar */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-100/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-200 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-500">Postgres RLS:</span>
            <span className="font-bold text-slate-900">{dbLatency}ms</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#0052FF]" />
            <span className="text-slate-500">Throughput:</span>
            <span className="font-bold text-[#0052FF]">{qpsTicker} QPS</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-slate-500">MinIO S3:</span>
            <span className="font-bold text-indigo-600">{totalStorage} GB / 10 TB</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-600" />
            <span className="text-slate-500">CPU Load:</span>
            <span className="font-bold text-cyan-600">{cpuUsage}%</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 relative z-10">
        {/* 2. NAVIGATION TABS */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 bg-slate-200/60 p-1.5 rounded-2xl border border-slate-300/60 backdrop-blur-md">
            <button
              onClick={() => setActiveTab("saas_config")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "saas_config"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>🎛️ ตั้งค่าหน่วยงาน & ควบคุม License (Doi Ngam)</span>
            </button>

            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "overview"
                  ? "bg-white text-slate-900 shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Gauge className="w-4 h-4 text-[#0052FF]" />
              <span>ภาพรวมระบบ (Overview)</span>
            </button>

            <button
              onClick={() => setActiveTab("tenants")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "tenants"
                  ? "bg-white text-slate-900 shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building2 className="w-4 h-4 text-cyan-600" />
              <span>องค์กร & ผู้ใช้งาน ({totalTenants})</span>
            </button>

            <button
              onClick={() => setActiveTab("contracts")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "contracts"
                  ? "bg-white text-slate-900 shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileSignature className="w-4 h-4 text-amber-600" />
              <span>สัญญา & จัดซื้อภาครัฐ (Contracts & SLA)</span>
            </button>

            <button
              onClick={() => setActiveTab("branding")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "branding"
                  ? "bg-white text-slate-900 shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ImageIcon className="w-4 h-4 text-purple-600" />
              <span>คลังรูปภาพ & ตราประทับดิจิทัล (Asset Hub)</span>
            </button>

            <button
              onClick={() => setActiveTab("terminal")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "terminal"
                  ? "bg-white text-slate-900 shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Terminal className="w-4 h-4 text-emerald-600" />
              <span>Live Console Stream</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหา อปท., รหัส, เลขที่สัญญา..."
                className="pl-10 pr-4 py-2 bg-white/80 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF] w-64 shadow-2xs backdrop-blur-md"
              />
            </div>
          </div>
        </div>

        {/* SUCCESS NOTIFICATION TOAST */}
        {saveSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500 text-white flex items-center justify-between shadow-xl shadow-emerald-600/25 border border-emerald-400 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <div>
                <p className="font-bold text-sm">{saveSuccessMsg}</p>
                <p className="text-xs text-emerald-100">การตั้งค่าถูกส่งต่อไปยังหน้าเว็บของ อบต.ดอยงาม เรียบร้อยแล้วแบบ Real-time</p>
              </div>
            </div>
            <button onClick={() => setSaveSuccessMsg(null)} className="p-1.5 hover:bg-white/20 rounded-lg text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* TAB 0: SAAS TENANT CONFIGURATOR (DEV CONTROL CENTER) */}
        {activeTab === "saas_config" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* 1. Live License Status & 30-Day Controls Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1 rounded-3xl p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl border-slate-700 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl" />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-slate-400">TENANT LICENSE STATUS</span>
                    {saasConfig.licenseStatus === "ACTIVE" ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        🟢 ACTIVE (สัญญาทางการ)
                      </span>
                    ) : saasConfig.licenseStatus === "SUSPENDED" || saasConfig.licenseStatus === "EXPIRED" ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                        🔴 LOCKED (ล็อกระบบ)
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        ⏳ TRIAL 30 DAYS (ทดลองใช้)
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-black text-white">{saasConfig.name}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{saasConfig.code} • {saasConfig.contractNo || "DG-SaaS-2569/001"}</p>

                  <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">วันคงเหลือ (Trial Remaining):</span>
                      <span className="text-2xl font-black text-amber-400 font-mono">
                        {calculateDaysRemaining(saasConfig.trialExpiresAt)} วัน
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10 pt-2">
                      <span>สิ้นสุดวันที่:</span>
                      <span className="text-slate-200 font-mono">
                        {new Date(saasConfig.trialExpiresAt).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span>ผู้ดูแลระบบ:</span>
                  <span className="font-mono text-blue-400">techanut0@gmail.com</span>
                </div>
              </Card>

              {/* License Quick Action Controller */}
              <Card className="lg:col-span-2 rounded-3xl p-6 bg-white/80 backdrop-blur-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <KeyRound className="w-5 h-5 text-[#0052FF]" />
                    <h3 className="text-base font-bold text-slate-900">แผงควบคุมใบอนุญาต & ล็อกระบบเชิงพาณิชย์ (License Controller)</h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-6">
                    ควบคุมการขยายวันทดลองใช้งาน, เปิดใช้งานเต็มรูปแบบตามสัญญาจ้าง หรือสั่งล็อกระบบฉุกเฉินเมื่อหมดสัญญา
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleAddTrialDays(15)}
                      className="rounded-2xl h-14 flex flex-col items-center justify-center border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 cursor-pointer"
                    >
                      <span className="font-bold text-xs sm:text-sm text-blue-700">+ ๑๕ วัน</span>
                      <span className="text-[10px] text-slate-500">ขยายเวลาทดลอง</span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => handleAddTrialDays(30)}
                      className="rounded-2xl h-14 flex flex-col items-center justify-center border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 cursor-pointer"
                    >
                      <span className="font-bold text-xs sm:text-sm text-blue-700">+ ๓๐ วัน</span>
                      <span className="text-[10px] text-slate-500">ขยายเวลาทดลอง</span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={handleReset30Days}
                      className="rounded-2xl h-14 flex flex-col items-center justify-center border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-700 cursor-pointer"
                    >
                      <span className="font-bold text-xs sm:text-sm text-amber-700">รีเซ็ต ๓๐ วัน</span>
                      <span className="text-[10px] text-slate-500">เริ่มนับหนึ่งใหม่วันนี้</span>
                    </Button>

                    <Button
                      onClick={handleActivateFullLicense}
                      className="col-span-1 sm:col-span-2 rounded-2xl h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-md shadow-emerald-500/20 gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <div className="text-left">
                        <div className="text-xs sm:text-sm font-black">เปิดใช้งานทางการตามสัญญา (Full License)</div>
                        <div className="text-[10px] text-emerald-100 font-normal">ปลดล็อก 30 วันเป็นสัญญาจ้างประจำปี</div>
                      </div>
                    </Button>

                    <Button
                      onClick={handleEmergencyLock}
                      className="rounded-2xl h-14 bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-500/20 gap-2 cursor-pointer"
                    >
                      <Lock className="w-5 h-5" />
                      <div className="text-left">
                        <div className="text-xs sm:text-sm font-black">ระงับทันที (Lock)</div>
                        <div className="text-[10px] text-rose-100 font-normal">ล็อกหน้าจอเมื่อหมดสัญญา</div>
                      </div>
                    </Button>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                  <span>สถานะปัจจุบัน: <strong>{saasConfig.licenseStatus}</strong> ({saasConfig.licenseTier})</span>
                  <span>ความจุโควต้า: <strong>{saasConfig.maxUsers} Users</strong> • <strong>{(saasConfig.maxStorageMb / 1024).toFixed(0)} GB Storage</strong></span>
                </div>
              </Card>
            </div>

            {/* 2. Main Config Form: Organization Branding & Feature Toggles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Organization Branding & Details */}
              <Card className="rounded-3xl p-6 bg-white/85 backdrop-blur-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <Building2 className="w-5 h-5 text-blue-700" />
                  <h4 className="font-bold text-slate-900 text-base">๑. ข้อมูลองค์กรและอัตลักษณ์หน่วยงาน (Branding & Identity)</h4>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">ชื่อองค์กรปกครองส่วนท้องถิ่น (อปท.):</label>
                    <input
                      type="text"
                      value={saasConfig.name}
                      onChange={(e) => setSaasConfig({ ...saasConfig, name: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 focus:ring-2 focus:ring-[#0052FF]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">รหัสองค์กร (Tenant Code):</label>
                      <input
                        type="text"
                        value={saasConfig.code}
                        onChange={(e) => setSaasConfig({ ...saasConfig, code: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-slate-900 focus:ring-2 focus:ring-[#0052FF]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">รหัสหมวดหนังสือราชการ (Prefix):</label>
                      <input
                        type="text"
                        value={saasConfig.docPrefix}
                        onChange={(e) => setSaasConfig({ ...saasConfig, docPrefix: e.target.value })}
                        placeholder="เช่น ชร ๕๒๐๐๑/ว"
                        className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-blue-700 focus:ring-2 focus:ring-[#0052FF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">คำขวัญ / สโลแกนหน่วยงาน:</label>
                    <input
                      type="text"
                      value={saasConfig.slogan}
                      onChange={(e) => setSaasConfig({ ...saasConfig, slogan: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-[#0052FF]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">ที่อยู่ทำการสำนักงาน:</label>
                    <input
                      type="text"
                      value={saasConfig.address}
                      onChange={(e) => setSaasConfig({ ...saasConfig, address: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-[#0052FF]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">อีเมลทางการ (Contact Email):</label>
                      <input
                        type="email"
                        value={saasConfig.contactEmail}
                        onChange={(e) => setSaasConfig({ ...saasConfig, contactEmail: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-[#0052FF]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">เบอร์โทรศัพท์ (Contact Phone):</label>
                      <input
                        type="text"
                        value={saasConfig.contactPhone}
                        onChange={(e) => setSaasConfig({ ...saasConfig, contactPhone: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-[#0052FF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">โควต้าผู้ใช้งานสูงสุด (Max Users):</label>
                      <input
                        type="number"
                        value={saasConfig.maxUsers}
                        onChange={(e) => setSaasConfig({ ...saasConfig, maxUsers: Number(e.target.value) })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-slate-900 focus:ring-2 focus:ring-[#0052FF]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">โควต้าพื้นที่เก็บไฟล์ (MB):</label>
                      <input
                        type="number"
                        value={saasConfig.maxStorageMb}
                        onChange={(e) => setSaasConfig({ ...saasConfig, maxStorageMb: Number(e.target.value) })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-slate-900 focus:ring-2 focus:ring-[#0052FF]"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Right Column: Modular Feature Matrix Toggles */}
              <Card className="rounded-3xl p-6 bg-white/85 backdrop-blur-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-indigo-700" />
                    <h4 className="font-bold text-slate-900 text-base">๒. สวิตช์ เปิด/ปิด โมดูลระบบ (Feature Matrix)</h4>
                  </div>
                  <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full font-bold">
                    MODULAR ENGINE
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  เลือกเปิดหรือปิดฟังก์ชันการทำงานตามแพ็กเกจที่ทำสัญญา ระบบจะซ่อนเมนูและปุ่มในหน้าเว็บ อบต.ดอยงาม อัตโนมัติทันที
                </p>

                <div className="space-y-2.5">
                  {[
                    { key: "incoming", label: "ระบบลงรับหนังสือ (Incoming Registration)", desc: "ลงรับหนังสือภายนอกและออกเลขรับอัตโนมัติ", icon: Inbox },
                    { key: "outgoing", label: "ระบบหนังสือส่ง (Outgoing Documents)", desc: "ร่างหนังสือส่งออก พิมพ์หนังสือภายนอก/ภายใน", icon: Send },
                    { key: "endorsement", label: "ระบบเกษียน & ลงนามดิจิทัล (Digital Endorsement)", desc: "เกษียนหนังสือตามลำดับชั้น ๖ ระดับ พร้อมลายเซ็น", icon: PenTool },
                    { key: "aiAssistant", label: "ระบบปัญญาประดิษฐ์ AI Smart Assistant", desc: "OCR สกัดข้อความภาษาไทยและสรุปใจความสำคัญอัตโนมัติ", icon: Sparkles },
                    { key: "autoNumbering", label: "ระบบสมุดทะเบียน & ออกเลขคุม (Auto Numbering)", desc: "สมุดทะเบียนรับกลาง, ส่งกลาง, ทะเบียนคำสั่ง อบต.", icon: Hash },
                    { key: "watermark", label: "ระบบลายน้ำรักษาความลับ (Anti-Leak Watermark)", desc: "พิมพ์ลายน้ำชื่อผู้เปิดอ่านเพื่อป้องกันข้อมูลลับรั่วไหล", icon: ShieldCheck },
                    { key: "cabinet", label: "ระบบตู้เอกสารอิเล็กทรอนิกส์ (Cabinet Hub)", desc: "จัดหมวดหมู่เอกสารย้อนหลังตามระเบียบสารบรรณ", icon: HardDrive },
                    { key: "templates", label: "ระบบแม่แบบหนังสือราชการ (Standard Templates)", desc: "แม่แบบหนังสือครุฑ, บันทึกข้อความ, คำสั่ง อบต.", icon: FileText },
                  ].map((mod) => {
                    const isEnabled = saasConfig.enabledModules[mod.key as keyof typeof saasConfig.enabledModules];
                    const Icon = mod.icon;

                    return (
                      <div
                        key={mod.key}
                        onClick={() => {
                          const updated = {
                            ...saasConfig,
                            enabledModules: {
                              ...saasConfig.enabledModules,
                              [mod.key]: !isEnabled,
                            },
                          };
                          setSaasConfig(updated);
                        }}
                        className={`p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer select-none ${
                          isEnabled
                            ? "bg-blue-50/70 border-blue-200/90 shadow-2xs"
                            : "bg-slate-50 border-slate-200 opacity-60"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isEnabled ? "bg-[#0052FF] text-white" : "bg-slate-200 text-slate-500"}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{mod.label}</div>
                            <div className="text-[10px] text-slate-500">{mod.desc}</div>
                          </div>
                        </div>

                        <div className={`w-10 h-6 rounded-full transition-colors flex items-center p-0.5 ${isEnabled ? "bg-[#0052FF]" : "bg-slate-300"}`}>
                          <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${isEnabled ? "translate-x-4" : "translate-x-0"}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* 3. Master Save Action Banner */}
            <div className="bg-white/90 backdrop-blur-2xl border border-slate-200/80 rounded-3xl p-6 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-black text-slate-900">พร้อมบังคับใช้การตั้งค่ากับระบบของ อบต.ดอยงาม</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  เมื่อกดบันทึก การเปลี่ยนแปลงทั้งหมดจะมีผลต่อหน้าเว็บผู้ใช้งานทันทีโดยไม่ต้องรีสตาร์ทเซิร์ฟเวอร์
                </p>
              </div>

              <Button
                size="lg"
                onClick={() => handleSaveSaaSConfig(saasConfig)}
                className="w-full sm:w-auto bg-gradient-to-r from-[#0052FF] via-indigo-600 to-[#0284c7] hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-2xl h-12 px-8 shadow-xl shadow-blue-500/25 gap-2 cursor-pointer text-sm"
              >
                <Check className="w-5 h-5" />
                <span>💾 บันทึกและบังคับใช้การตั้งค่าทันที (Save & Apply Live)</span>
              </Button>
            </div>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* 4 Crystal Light Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-card glass-card-hover rounded-3xl p-5 bg-white/75 backdrop-blur-xl border border-white/90 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>อปท. ที่ใช้งาน (Active Tenants)</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052FF] flex items-center justify-center border border-blue-200 shadow-2xs">
                    <Building2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                    {activeTenants} <span className="text-sm text-slate-400 font-normal">/ {totalTenants} แห่ง</span>
                  </h3>
                  <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1 font-mono">
                    <TrendingUp className="w-3.5 h-3.5" /> 100% On-time SLA
                  </p>
                </div>
              </div>

              <div className="glass-card glass-card-hover rounded-3xl p-5 bg-white/75 backdrop-blur-xl border border-white/90 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>ผู้ใช้งานภาครัฐทั้งหมด (Gov Users)</span>
                  <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-200 shadow-2xs">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                    {totalUsers} <span className="text-sm text-slate-400 font-normal">บัญชี</span>
                  </h3>
                  <p className="text-xs text-blue-600 font-bold mt-1 font-mono">
                    รองรับได้สูงสุด 500 บัญชี
                  </p>
                </div>
              </div>

              <div className="glass-card glass-card-hover rounded-3xl p-5 bg-white/75 backdrop-blur-xl border border-white/90 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>เอกสารออกเลข/รับส่งเดือนนี้</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 shadow-2xs">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                    {totalDocs.toLocaleString()} <span className="text-sm text-slate-400 font-normal">ฉบับ</span>
                  </h3>
                  <p className="text-xs text-amber-700 font-bold mt-1 font-mono">
                    บันทึกถาวรลง S3 Private Bucket
                  </p>
                </div>
              </div>

              <div className="glass-card glass-card-hover rounded-3xl p-5 bg-white/75 backdrop-blur-xl border border-white/90 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>มูลค่าสัญญารวม (Contract ARR)</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-2xs">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                    720,000 <span className="text-sm text-slate-400 font-normal">บาท/ปี</span>
                  </h3>
                  <p className="text-xs text-emerald-600 font-bold mt-1 font-mono">
                    สัญญาระยะยาว 1-3 ปี (Gov Procurement)
                  </p>
                </div>
              </div>
            </div>

            {/* Enterprise Readiness Check for Big Gov Sales */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/90 shadow-sm bg-white/80 backdrop-blur-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#0052FF] uppercase tracking-wider mb-1">
                    <ShieldCheck className="w-4 h-4 text-[#0052FF]" />
                    <span>ENTERPRISE & LARGE-SCALE GOVERNMENT CAPABILITY</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    ความพร้อมสำหรับขายหน่วยงานขนาดใหญ่ (อบจ., เทศบาลนคร, กระทรวง, กรม)
                  </h3>
                </div>
                <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-bold">
                  ✓ Enterprise Certified
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                    <FileSignature className="w-4 h-4" />
                    <span>๑. การจัดการสัญญา & ใบสั่งจ้าง (PO/TOR)</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    รองรับสัญญา 1 ปี / 3 ปี / 5 ปี, มีระบบนับถอยหลังแจ้งเตือนต่อสัญญา 30/60/90 วันล่วงหน้า, ระบุข้อมูลคณะกรรมการตรวจรับพัสดุ
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-cyan-600 font-bold text-sm">
                    <ImageIcon className="w-4 h-4" />
                    <span>๒. คลังรูปภาพ โลโก้ & ตราประทับแยก อปท.</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    ระบบแยก S3 Multi-tenant Bucket, ลายน้ำราชการอัตโนมัติ, ตราครุฑมาตรฐาน, ตราประจำตำแหน่ง และ Digital Certificate (e-Seal)
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-purple-600 font-bold text-sm">
                    <Globe className="w-4 h-4" />
                    <span>๓. Custom Subdomain & Dedicated URL</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    ผูกโดเมนเฉพาะของหน่วยงาน เช่น <code>sarabun.doigam.go.th</code>, <code>e-sarabun.chiangmai.go.th</code> พร้อม SSL/TLS 1.3 ฟรี
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                    <Lock className="w-4 h-4" />
                    <span>๔. ThaID & Enterprise SSO Integration</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    เชื่อมต่อบัตรประชาชนดิจิทัล (ThaID กรมการปกครอง), Keycloak OIDC, และ Microsoft Entra ID / Active Directory ของภาครัฐ
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                    <Award className="w-4 h-4" />
                    <span>๕. SLA 99.95% & Disaster Recovery (DR)</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    สำรองข้อมูลข้าม Regional Data Center (BKK-01 และ CNX-01 Edge) รับประกัน RPO &lt; 15 นาที และมีสายด่วน Support 24/7
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                    <Radio className="w-4 h-4" />
                    <span>๖. ส่งหนังสือข้าม อปท. (Cross-Tenant Routing)</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    ส่งต่อหนังสือราชการข้าม อบต./เทศบาล/อบจ. ได้ทันทีโดยไม่ต้องพิมพ์กระดาษ มีระบบแจ้งเตือนเข้าสมุดทะเบียนรับปลายทางอัตโนมัติ
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TENANTS & ORGANIZATIONS (CARD VIEW) */}
        {activeTab === "tenants" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900">ทะเบียน อปท. & หน่วยงานผู้ใช้งาน (Tenant Directory)</h3>
                <p className="text-xs text-slate-500 mt-0.5">รายชื่อองค์กรปกครองส่วนท้องถิ่นที่ใช้บริการระบบ SmartSarabun Cloud</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTenants.map((t) => (
                <div
                  key={t.id}
                  className="glass-card rounded-3xl p-6 bg-white/90 backdrop-blur-xl border border-slate-200 shadow-md hover:shadow-xl hover:border-blue-400 transition-all space-y-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 p-2 flex items-center justify-center shrink-0 shadow-sm">
                        <Building2 className="w-8 h-8 text-[#0052FF]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-base sm:text-lg text-slate-900">{saasConfig.name || t.name}</h4>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-mono font-bold bg-blue-50 text-[#0052FF] px-2.5 py-0.5 rounded-md border border-blue-200">
                            {saasConfig.code || t.code}
                          </span>
                          <span className="text-xs text-slate-500">• {saasConfig.docPrefix || "ชร ๕๒๐๐๑/ว"}</span>
                        </div>
                      </div>
                    </div>

                    {saasConfig.licenseStatus === "ACTIVE" ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                        🟢 ACTIVE
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
                        ⏳ TRIAL 30 DAYS
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                      <span className="text-[10px] text-slate-400 block font-medium">โควต้าผู้ใช้งาน</span>
                      <span className="font-bold text-slate-900 font-mono">1 / {saasConfig.maxUsers} Users</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                      <span className="text-[10px] text-slate-400 block font-medium">พื้นที่จัดเก็บ MinIO</span>
                      <span className="font-bold text-slate-900 font-mono">0 / {(saasConfig.maxStorageMb / 1024).toFixed(0)} GB</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                      <span className="text-[10px] text-slate-400 block font-medium">วันทดลองคงเหลือ</span>
                      <span className="font-bold text-amber-600 font-mono">{calculateDaysRemaining(saasConfig.trialExpiresAt)} วัน</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                      <span className="text-[10px] text-slate-400 block font-medium">เลขที่สัญญา</span>
                      <span className="font-bold text-slate-800 font-mono text-[11px] truncate block">
                        {saasConfig.contractNo || "DG-SaaS-2569/001"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="text-xs text-slate-500">
                      <span>ผู้ดูแลระบบ: </span>
                      <strong className="text-blue-700 font-mono">techanut0@gmail.com</strong>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setActiveTab("saas_config")}
                      className="bg-gradient-to-r from-[#0052FF] to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-xs rounded-xl h-9 px-4 gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>⚙️ เข้าไปจัดการข้อมูล (Manage Tenant)</span>
                    </Button>
                  </div>
                </div>
              ))}

              {/* Add New Tenant Card */}
              <div
                onClick={() => {
                  alert("ฟังก์ชันสร้าง Tenant ใหม่อัตโนมัติ: กรุณาติดต่อทีม Dev เพื่อลงทะเบียน Database Sub-tenant");
                }}
                className="rounded-3xl p-8 border-2 border-dashed border-slate-300 bg-white/50 hover:bg-white hover:border-blue-400 transition-all flex flex-col items-center justify-center text-center cursor-pointer shadow-2xs group"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-[#0052FF] flex items-center justify-center transition-colors mb-3">
                  <Plus className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-base text-slate-900 group-hover:text-[#0052FF]">
                  + เพิ่ม อปท. / เทศบาลใหม่ (Add New Tenant)
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  สร้าง Sub-domain, ฐานข้อมูล และโควต้า 30-Day Trial ให้กับ อบต. หรือเทศบาลแห่งใหม่
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONTRACTS & PROCUREMENT (สัญญา & จัดซื้อภาครัฐ) */}
        {activeTab === "contracts" && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white/80 backdrop-blur-2xl border border-white/90 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  ระบบบริหารสัญญา & การจัดซื้อจัดจ้างภาครัฐ (Government Contract & License Manager)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  ติดตามรอบสัญญา, เลขที่ใบสั่งจ้าง (PO), ระยะเวลา SLA, และวันหมดอายุของแต่ละ อปท. เพื่อให้การต่อสัญญาราชการไม่สะดุด
                </p>
              </div>
              <Button size="sm" variant="signature" className="gap-1.5">
                <Plus className="w-4 h-4" />
                <span>เพิ่มสัญญาจัดซื้อภาครัฐ</span>
              </Button>
            </div>

            <div className="divide-y divide-slate-200">
              {filteredTenants.map((t) => (
                <div key={t.id} className="py-4.5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{t.name}</span>
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                        {t.contract.contractNo}
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        SLA: {t.contract.slaTier}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span>ใบสั่งจ้าง (PO): <strong>{t.contract.poNumber}</strong></span>
                      <span>ระยะเวลา: <strong>{t.contract.termYears} ปี ({t.contract.startDate} - {t.contract.endDate})</strong></span>
                      <span>มูลค่า: <strong className="text-slate-800">{t.contract.contractValueThb}</strong></span>
                    </div>
                    <p className="text-xs text-slate-500">
                      ผู้ประสานงาน: <strong>{t.contract.coordinatorName}</strong> (โทร {t.contract.coordinatorPhone})
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block font-medium">สถานะสัญญา</span>
                      <span className="font-bold text-sm text-emerald-600 font-mono">
                        คงเหลือ {t.contract.daysRemaining} วัน
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedTenantForInspector(t)}
                      className="rounded-xl text-xs font-bold"
                    >
                      แก้ไขสัญญา
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ASSET HUB (คลังรูปภาพ & ตราประทับ) */}
        {activeTab === "branding" && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white/80 backdrop-blur-2xl border border-white/90 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  คลังรูปภาพ โลโก้ & ตราประทับดิจิทัลประจำหน่วยงาน (Tenant Asset Management)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  จัดการตราครุฑประจำ อปท., ตราสัญลักษณ์, ตราประทับรับหนังสือ, ลายน้ำราชการ, และใบรับรองดิจิทัล (Digital Certificate)
                </p>
              </div>
              <Button size="sm" variant="outline" className="gap-1.5">
                <Upload className="w-4 h-4 text-blue-600" />
                <span>อัปโหลดชุดตราประทับใหม่</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTenants.map((t) => (
                <div key={t.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 p-2 shrink-0 flex items-center justify-center">
                      <img src={t.branding.logoUrl} alt={t.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{t.name}</h4>
                      <p className="text-xs text-slate-400">{t.code} • S3 Storage Bucket: <code>sarabun-{t.code.toLowerCase()}</code></p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-center">
                      <span className="text-[10px] text-slate-400 block font-medium">ตราประทับในระบบ</span>
                      <span className="font-bold text-slate-900 font-mono text-sm">{t.branding.stampCount} ตรา</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-center">
                      <span className="text-[10px] text-slate-400 block font-medium">ลายน้ำราชการ</span>
                      <span className={`font-bold font-mono text-xs ${t.branding.hasWatermark ? "text-emerald-600" : "text-slate-400"}`}>
                        {t.branding.hasWatermark ? "✓ เปิดใช้งาน" : "✕ ปิด"}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-center">
                      <span className="text-[10px] text-slate-400 block font-medium">ใบรับรองดิจิทัล</span>
                      <span className={`font-bold font-mono text-xs ${t.branding.digitalCertValid ? "text-emerald-600" : "text-amber-600"}`}>
                        {t.branding.digitalCertValid ? "✓ ถูกต้อง (ETSI)" : "รอยืนยัน"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-500">
                      ขนาดโลโก้: <strong>512x512 PNG (Transparent)</strong>
                    </span>
                    <Button size="sm" variant="ghost" className="text-xs text-[#0052FF] font-bold">
                      แก้ไขรูปภาพ / ตราประทับ
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: LIVE TERMINAL STREAM */}
        {activeTab === "terminal" && (
          <div className="glass-card rounded-3xl p-6 bg-slate-950 text-slate-200 font-mono text-xs shadow-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white">LIVE CLOUD PLATFORM TELEMETRY LOGS</span>
              </div>
              <span className="text-[11px] text-slate-400">WebSocket Connected: wss://telemetry.smartsarabun.cloud/v1</span>
            </div>

            <div className="space-y-2 py-2 max-h-96 overflow-y-auto">
              {mockLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-3 py-1 hover:bg-slate-900/60 rounded-lg px-2 transition-colors">
                  <span className="text-slate-500 shrink-0">{log.time}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 border ${log.color}`}>
                    {log.tag}
                  </span>
                  <span className="text-slate-300">{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 3. MODAL: TENANT CONTRACT & QUOTA INSPECTOR */}
      {selectedTenantForInspector && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white max-w-2xl w-full border border-slate-200 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  จัดการสัญญา & โควต้า — {selectedTenantForInspector.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  รหัสหน่วยงาน: {selectedTenantForInspector.code} • เลขที่สัญญา: {selectedTenantForInspector.contract.contractNo}
                </p>
              </div>
              <button
                onClick={() => setSelectedTenantForInspector(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">เลขที่สัญญา (Contract No.)</label>
                  <input
                    type="text"
                    defaultValue={selectedTenantForInspector.contract.contractNo}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">เลขที่ใบสั่งซื้อ/สั่งจ้าง (PO Number)</label>
                  <input
                    type="text"
                    defaultValue={selectedTenantForInspector.contract.poNumber}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ระยะเวลาสัญญา (ปี)</label>
                  <input
                    type="number"
                    defaultValue={selectedTenantForInspector.contract.termYears}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">โควต้าผู้ใช้งาน (Max Users)</label>
                  <input
                    type="number"
                    defaultValue={selectedTenantForInspector.maxUsers}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">โควต้าพื้นที่ S3 (GB)</label>
                  <input
                    type="number"
                    defaultValue={selectedTenantForInspector.maxStorageGb}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">โดเมนเฉพาะ (Custom Domain)</label>
                <input
                  type="text"
                  defaultValue={selectedTenantForInspector.contract.customDomain}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-blue-700 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">ผู้ประสานงานหน่วยงาน & คณะกรรมการตรวจรับ</label>
                <input
                  type="text"
                  defaultValue={`${selectedTenantForInspector.contract.coordinatorName} (โทร ${selectedTenantForInspector.contract.coordinatorPhone})`}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
              <Button variant="outline" onClick={() => setSelectedTenantForInspector(null)} className="rounded-xl">
                ยกเลิก
              </Button>
              <Button
                variant="signature"
                onClick={() => {
                  alert("บันทึกข้อมูลสัญญาและปรับโควต้า อปท. สำเร็จเรียบร้อย!");
                  setSelectedTenantForInspector(null);
                }}
                className="rounded-xl"
              >
                บันทึกการเปลี่ยนแปลง
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
