"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Inbox,
  Send,
  Clock,
  CheckCircle2,
  PenTool,
  Search,
  Calendar,
  Building2,
  FolderOpen,
  FileText,
  Eye,
  PlusCircle,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  Zap,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  LayoutList,
  StretchHorizontal,
  Keyboard,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "@/components/providers/session-provider";
import {
  DocumentViewerWorkspace,
  DocumentData,
} from "@/components/documents/document-viewer-workspace";
import {
  getDocumentStats,
  getAllDocuments,
  syncCloudDocuments,
  StoredDocument,
} from "@/lib/document-store";
import { formatThaiDate } from "@/lib/formatters/thai-date";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getTenantSaaSConfig } from "@/config/tenant-config";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [allDocs, setAllDocs] = useState<StoredDocument[]>([]);
  const [stats, setStats] = useState({
    totalDocs: 0,
    incomingToday: 0,
    outgoingToday: 0,
    pendingCount: 0,
    completedCount: 0,
    overdueCount: 0,
    slaRate: "100%",
  });
  const [selectedDoc, setSelectedDoc] = useState<DocumentData | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "incoming" | "outgoing" | "pending">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [isSyncing, setIsSyncing] = useState(false);
  const [tenantConfig, setTenantConfig] = useState(getTenantSaaSConfig());
  const [tableDensity, setTableDensity] = useState<"comfortable" | "compact">("comfortable");

  const userName = session?.user?.name || "ผู้ใช้งานสารบรรณ";
  const userPosition = session?.user?.position || "เจ้าหน้าที่สารบรรณ";
  const userDept = session?.user?.department || "สำนักปลัด";
  const todayThai = formatThaiDate(new Date());

  // Fiscal Year calculation (Thai Buddhist Era: Oct 1 starts new fiscal year)
  const currentDate = new Date();
  const currentYearBE = currentDate.getFullYear() + 543;
  const fiscalYearBE = currentDate.getMonth() >= 9 ? currentYearBE + 1 : currentYearBE;

  const refreshData = () => {
    setAllDocs(getAllDocuments());
    setStats(getDocumentStats());
    setTenantConfig(getTenantSaaSConfig());
  };

  // Load saved density preference and listen for D shortcut
  useEffect(() => {
    try {
      const saved = localStorage.getItem("smartsarabun_table_density");
      if (saved === "compact" || saved === "comfortable") {
        setTableDensity(saved);
      }
    } catch {}

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || "").toLowerCase();
      if (activeTag === "input" || activeTag === "textarea" || activeTag === "select") {
        return;
      }
      if (e.key === "d" || e.key === "D") {
        e.preventDefault();
        setTableDensity((prev) => {
          const next = prev === "comfortable" ? "compact" : "comfortable";
          try {
            localStorage.setItem("smartsarabun_table_density", next);
          } catch {}
          return next;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleDensity = (mode: "comfortable" | "compact") => {
    setTableDensity(mode);
    try {
      localStorage.setItem("smartsarabun_table_density", mode);
    } catch {}
  };

  useEffect(() => {
    refreshData();

    // Auto sync latest documents from Supabase Cloud on mount
    setIsSyncing(true);
    syncCloudDocuments()
      .then(() => {
        refreshData();
      })
      .finally(() => {
        setIsSyncing(false);
      });

    const handleUpdate = () => refreshData();
    window.addEventListener("smartsarabun_documents_updated", handleUpdate);
    window.addEventListener("tenant_switched", handleUpdate);
    window.addEventListener("tenant_config_updated", handleUpdate);

    return () => {
      window.removeEventListener("smartsarabun_documents_updated", handleUpdate);
      window.removeEventListener("tenant_switched", handleUpdate);
      window.removeEventListener("tenant_config_updated", handleUpdate);
    };
  }, []);

  // Filter documents by tab, search, and department
  const filteredDocs = useMemo(() => {
    return allDocs.filter((doc) => {
      // 1. Tab filter
      if (activeTab === "incoming" && doc.direction === "outgoing") return false;
      if (activeTab === "outgoing" && doc.direction !== "outgoing") return false;
      if (activeTab === "pending" && (doc.status === "completed" || doc.status === "sent")) return false;

      // 2. Department filter
      if (selectedDept !== "ALL") {
        const matchDept = doc.targetDept === selectedDept || doc.senderDept === selectedDept;
        if (!matchDept) return false;
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = doc.title?.toLowerCase().includes(query);
        const matchDocNo = doc.docNo?.toLowerCase().includes(query);
        const matchRegNo = doc.regNo?.toLowerCase().includes(query);
        const matchFrom = doc.from?.toLowerCase().includes(query);
        if (!matchTitle && !matchDocNo && !matchRegNo && !matchFrom) return false;
      }

      return true;
    });
  }, [allDocs, activeTab, selectedDept, searchQuery]);

  // Urgent pending documents (ด่วนที่สุด, ด่วนมาก, ด่วน) that are pending action
  const urgentDocs = useMemo(() => {
    return allDocs
      .filter(
        (d) =>
          (d.speed === "ด่วนที่สุด" || d.speed === "ด่วนมาก" || d.speed === "ด่วน") &&
          d.status !== "completed" &&
          d.status !== "sent"
      )
      .slice(0, 3);
  }, [allDocs]);

  const incomingCount = allDocs.filter((d) => d.direction !== "outgoing").length;
  const outgoingCount = allDocs.filter((d) => d.direction === "outgoing").length;
  const pendingCount = allDocs.filter((d) => d.status !== "completed" && d.status !== "sent").length;

  return (
    <div className="space-y-6 pb-20 font-sans">
      {/* ========================================================================= */}
      {/* 1. HERO COMMAND BAR (Bento Master Header)                                 */}
      {/* ========================================================================= */}
      <div className="bento-card p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shadow-md relative overflow-hidden border border-slate-800">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left info */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ปีงบประมาณ {fiscalYearBE}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-slate-200 border border-white/15">
                {tenantConfig.name}
              </span>
              {isSupabaseConfigured() && (
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin text-emerald-400" : ""}`} />
                  Cloud Sync พร้อมใช้งาน
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              ศูนย์บัญชาการสารบรรณดิจิทัล
              <span className="text-xs font-normal px-2 py-0.5 rounded bg-blue-600 text-white font-mono">
                v2.15
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300">
              ยินดีต้อนรับ: <strong className="text-white font-bold">{userName}</strong> ({userPosition}) • {userDept} | ประจำวันที่ <strong>{todayThai}</strong>
            </p>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <Link href="/receive">
              <Button
                size="sm"
                className="h-9 px-4 bg-[#0052FF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs gap-1.5 cursor-pointer accessible-focus transition-all"
              >
                <Inbox className="w-4 h-4" />
                <span>ลงรับหนังสือเข้า</span>
              </Button>
            </Link>

            <Link href="/send">
              <Button
                size="sm"
                variant="outline"
                className="h-9 px-4 bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold text-xs rounded-xl gap-1.5 cursor-pointer accessible-focus transition-all"
              >
                <Send className="w-4 h-4 text-emerald-400" />
                <span>ออกเลขหนังสือส่ง</span>
              </Button>
            </Link>

            <Link href="/cabinet">
              <Button
                size="sm"
                variant="outline"
                className="h-9 px-3.5 bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold text-xs rounded-xl gap-1.5 cursor-pointer accessible-focus transition-all hidden sm:inline-flex"
              >
                <FolderOpen className="w-4 h-4 text-amber-400" />
                <span>ตู้เอกสาร</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. 4 CORE METRIC BENTO CARDS                                              */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* หนังสือเข้าวันนี้ */}
        <Link href="/inbox" className="group">
          <div className="bento-card-interactive p-5 h-full flex flex-col justify-between border-t-[3.5px] border-t-[#0052FF]">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-[#0052FF] group-hover:bg-[#0052FF] group-hover:text-white transition-colors">
                  <Inbox className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#0052FF] transition-colors" />
              </div>
              <p className="text-xs font-bold text-slate-600">หนังสือเข้าวันนี้</p>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
                  {stats.incomingToday}
                </span>
                <span className="text-xs font-bold text-slate-500">ฉบับ</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              ลงรับในสมุดทะเบียนรับแล้ว
            </p>
          </div>
        </Link>

        {/* หนังสือส่งวันนี้ */}
        <Link href="/outbox" className="group">
          <div className="bento-card-interactive p-5 h-full flex flex-col justify-between border-t-[3.5px] border-t-emerald-600">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Send className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </div>
              <p className="text-xs font-bold text-slate-600">หนังสือส่งวันนี้</p>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
                  {stats.outgoingToday}
                </span>
                <span className="text-xs font-bold text-slate-500">ฉบับ</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              ออกเลขและส่งหนังสือแล้ว
            </p>
          </div>
        </Link>

        {/* งานรอดำเนินการ / เกษียน */}
        <Link href="/approvals" className="group">
          <div className="bento-card-interactive p-5 h-full flex flex-col justify-between border-t-[3.5px] border-t-amber-500">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  รอลงนาม
                </span>
              </div>
              <p className="text-xs font-bold text-slate-600">รอดำเนินการ / เกษียน</p>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-amber-600 font-sans">
                  {stats.pendingCount}
                </span>
                <span className="text-xs font-bold text-slate-500">ฉบับ</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              รอการพิจารณาหรือเกษียนงาน
            </p>
          </div>
        </Link>

        {/* เอกสารทั้งหมดในระบบ */}
        <Link href="/documents" className="group">
          <div className="bento-card-interactive p-5 h-full flex flex-col justify-between border-t-[3.5px] border-t-indigo-600">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </div>
              <p className="text-xs font-bold text-slate-600">เอกสารทั้งหมดในระบบ</p>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
                  {allDocs.length}
                </span>
                <span className="text-xs font-bold text-slate-500">ฉบับ</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              บันทึกในฐานข้อมูลเรียบร้อย
            </p>
          </div>
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* 3. BENTO ROW 2: URGENT / SLA ALERT TILE + QUICK WORKFLOW LAUNCHER          */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Urgent Action & SLA Tracker (7 cols) */}
        <div className="lg:col-span-7 bento-card p-5 bg-gradient-to-br from-rose-50/40 via-white to-amber-50/20 border-rose-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-rose-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    เอกสารด่วน & ติดตามกำหนดเวลา (SLA Monitor)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    หนังสือราชการเร่งด่วนและงานที่ต้องดำเนินการทันที
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                SLA {stats.slaRate}
              </span>
            </div>

            {/* List of urgent items or reassuring state */}
            {urgentDocs.length > 0 ? (
              <div className="space-y-2">
                {urgentDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-xl bg-white border border-rose-200/80 shadow-2xs hover:border-rose-400 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200">
                          {doc.speed}
                        </span>
                        <span className="font-mono text-xs font-bold text-blue-900">
                          {doc.docNo}
                        </span>
                        <span className="text-[11px] text-slate-400">• {doc.docDate}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {doc.title}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        จาก: {doc.from || "หน่วยงานภายนอก"} ➔ กอง: {doc.targetDept || "สำนักปลัด"}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => setSelectedDoc(doc)}
                      className="h-8 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shrink-0 cursor-pointer shadow-2xs gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>เปิดเกษียนทันที</span>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 px-4 rounded-xl bg-emerald-50/50 border border-emerald-100 text-center">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600 mb-1.5" />
                <p className="text-xs font-extrabold text-emerald-900">
                  ไม่มีเอกสารค้างเกินกำหนด (Zero Overdue)
                </p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  ระบบสารบรรณและคิวงานของ อบต.ดอยงาม ทำงานตรงตามเกณฑ์มาตรฐาน SLA 100%
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>เอกสารรอดำเนินการทั้งหมด: <strong className="text-slate-800 font-bold">{pendingCount} ฉบับ</strong></span>
            <Link
              href="/approvals"
              className="text-[#0052FF] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>ดูงานเกษียนทั้งหมด</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right: Quick Workflow Launcher (5 cols) */}
        <div className="lg:col-span-5 bento-card p-5 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 text-[#0052FF]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    ทางลัดการทำงานสารบรรณ
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    เข้าถึงฟังก์ชันหลักรวดเร็วในคลิกเดียว
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                พร้อมใช้งาน
              </span>
            </div>

            {/* 4 Quick Tiles Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/receive"
                className="p-3 rounded-xl border border-slate-200/90 hover:border-blue-500 hover:bg-blue-50/40 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-blue-50 text-[#0052FF] group-hover:bg-[#0052FF] group-hover:text-white transition-colors">
                    <Inbox className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded">
                    ด่วน
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-[#0052FF] transition-colors">
                    ลงรับหนังสือเข้า
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">ประทับตรา & มอบหมาย</p>
                </div>
              </Link>

              <Link
                href="/send"
                className="p-3 rounded-xl border border-slate-200/90 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Send className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    ออกเลขหนังสือส่ง
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">จองเลข & ส่งหนังสือ</p>
                </div>
              </Link>

              <Link
                href="/receive?ocr=true"
                className="p-3 rounded-xl border border-purple-200 bg-purple-50/20 hover:border-purple-500 hover:bg-purple-50/50 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold text-purple-800 bg-purple-100 px-1.5 py-0.5 rounded">
                    AI OCR
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                    สแกนอัตโนมัติ
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">ดึงข้อมูลด้วย AI Vision</p>
                </div>
              </Link>

              <Link
                href="/templates"
                className="p-3 rounded-xl border border-slate-200/90 hover:border-amber-500 hover:bg-amber-50/40 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <PenTool className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                    แม่แบบเอกสาร
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">บันทึกข้อความ & คำสั่ง</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 text-center">
            <Link
              href="/numbers"
              className="text-xs font-bold text-slate-600 hover:text-[#0052FF] inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>ดูสมุดทะเบียนคุมเลขทั้งหมด</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MAIN WORK QUEUE: ทะเบียนและคิวงานสารบรรณ (ตารางแสดงผล Bento Data Table) */}
      {/* ========================================================================= */}
      <div className="bento-card bg-white shadow-xs overflow-hidden border border-slate-300">
        {/* Controls: Tabs & Search Filter & Density Toggle */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5 bg-slate-50/50">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl text-xs font-bold shrink-0 overflow-x-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer accessible-focus whitespace-nowrap ${
                activeTab === "all"
                  ? "bg-white text-slate-900 shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ทั้งหมด ({allDocs.length})
            </button>
            <button
              onClick={() => setActiveTab("incoming")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer accessible-focus whitespace-nowrap ${
                activeTab === "incoming"
                  ? "bg-white text-[#0052FF] shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              หนังสือเข้า ({incomingCount})
            </button>
            <button
              onClick={() => setActiveTab("outgoing")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer accessible-focus whitespace-nowrap ${
                activeTab === "outgoing"
                  ? "bg-white text-emerald-700 shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              หนังสือส่ง ({outgoingCount})
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer accessible-focus whitespace-nowrap ${
                activeTab === "pending"
                  ? "bg-white text-amber-700 shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              รอดำเนินการ ({pendingCount})
            </button>
          </div>

          {/* Search, Dept Selector, and Density Switcher */}
          <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหาเลขที่, เรื่อง, หน่วยงาน... (Ctrl+K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0052FF] transition-all font-medium"
              />
            </div>

            {/* Department */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="py-1.5 px-3 text-xs rounded-xl border border-slate-300 bg-white font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0052FF] cursor-pointer"
            >
              <option value="ALL">ทุกกอง/สำนัก</option>
              <option value="สำนักปลัด">สำนักปลัด</option>
              <option value="กองคลัง">กองคลัง</option>
              <option value="กองช่าง">กองช่าง</option>
              <option value="กองการศึกษาฯ">กองการศึกษาฯ</option>
              <option value="กองสาธารณสุข">กองสาธารณสุข</option>
            </select>

            {/* View Density Switcher (Comfortable vs Compact) */}
            <div className="inline-flex items-center p-1 rounded-xl bg-slate-200/80 border border-slate-300 text-xs font-bold">
              <button
                type="button"
                onClick={() => toggleDensity("comfortable")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer accessible-focus flex items-center gap-1.5 ${
                  tableDensity === "comfortable"
                    ? "bg-white text-slate-900 shadow-xs font-black"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="มุมมองสบายตา"
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">สบายตา</span>
              </button>
              <button
                type="button"
                onClick={() => toggleDensity("compact")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer accessible-focus flex items-center gap-1.5 ${
                  tableDensity === "compact"
                    ? "bg-white text-[#0052FF] shadow-xs font-black"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="มุมมองกะทัดรัด (กด D)"
              >
                <StretchHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">กะทัดรัด</span>
              </button>
            </div>
          </div>
        </div>

        {/* Real Document Data Table */}
        <div className="overflow-x-auto">
          <table
            className={`w-full text-left border-collapse ${
              tableDensity === "compact"
                ? "table-density-compact text-[11.5px]"
                : "table-density-comfortable text-xs"
            }`}
          >
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-extrabold border-b-2 border-slate-300">
                <th className="py-2.5 px-3.5 whitespace-nowrap">เลขที่หนังสือ / เลขรับ</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">วันที่</th>
                <th className="py-2.5 px-3.5 min-w-[260px]">ชื่อเรื่อง</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">จากหน่วยงาน</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">กองผู้รับผิดชอบ</th>
                <th className="py-2.5 px-3.5 text-center whitespace-nowrap">ความเร่งด่วน</th>
                <th className="py-2.5 px-3.5 text-center whitespace-nowrap">สถานะ</th>
                <th className="py-2.5 px-3.5 text-center whitespace-nowrap">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc, idx) => {
                  const speedBadge =
                    doc.speed === "ด่วนที่สุด" ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300 badge-compact">
                        ด่วนที่สุด
                      </span>
                    ) : doc.speed === "ด่วนมาก" ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-orange-100 text-orange-800 border border-orange-300 badge-compact">
                        ด่วนมาก
                      </span>
                    ) : doc.speed === "ด่วน" ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300 badge-compact">
                        ด่วน
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 badge-compact">
                        ปกติ
                      </span>
                    );

                  const statusBadge =
                    doc.status === "completed" || doc.status === "sent" ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 badge-compact">
                        {doc.direction === "outgoing" ? "ส่งแล้ว" : "เสร็จสิ้น"}
                      </span>
                    ) : doc.status === "forwarded" ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-900 border border-sky-300 badge-compact">
                        ส่งต่อกองแล้ว
                      </span>
                    ) : doc.status === "assigned" ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-300 badge-compact">
                        มอบหมายแล้ว
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 badge-compact">
                        รอดำเนินการ
                      </span>
                    );

                  return (
                    <tr
                      key={doc.id}
                      className={`hover:bg-blue-50/60 transition-colors ${
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                      }`}
                    >
                      <td
                        className={`${
                          tableDensity === "compact" ? "py-2 px-3.5" : "py-3.5 px-3.5"
                        } whitespace-nowrap`}
                      >
                        <div className="font-mono font-bold text-blue-900">{doc.docNo}</div>
                        {doc.regNo && (
                          <div className="text-[10px] text-slate-500 font-mono font-semibold">
                            เลขรับ: {doc.regNo}
                          </div>
                        )}
                      </td>
                      <td
                        className={`${
                          tableDensity === "compact" ? "py-2 px-3.5" : "py-3.5 px-3.5"
                        } whitespace-nowrap text-slate-700 font-medium`}
                      >
                        {doc.docDate || "-"}
                      </td>
                      <td
                        className={`${
                          tableDensity === "compact" ? "py-2 px-3.5" : "py-3.5 px-3.5"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedDoc(doc)}
                          className={`font-bold text-slate-900 hover:text-[#0052FF] text-left leading-snug cursor-pointer transition-colors block ${
                            tableDensity === "compact" ? "line-clamp-1" : "line-clamp-2"
                          }`}
                        >
                          {doc.title}
                        </button>
                        <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">
                          {doc.direction === "outgoing" ? "หนังสือส่งออก" : "หนังสือรับเข้า"}
                        </span>
                      </td>
                      <td
                        className={`${
                          tableDensity === "compact" ? "py-2 px-3.5" : "py-3.5 px-3.5"
                        } whitespace-nowrap text-slate-800 font-medium`}
                      >
                        {doc.from || (doc as any).fromOrg || "ส่วนราชการ"}
                      </td>
                      <td
                        className={`${
                          tableDensity === "compact" ? "py-2 px-3.5" : "py-3.5 px-3.5"
                        } whitespace-nowrap font-semibold text-slate-700`}
                      >
                        {doc.targetDept || doc.senderDept || "สำนักปลัด"}
                      </td>
                      <td
                        className={`${
                          tableDensity === "compact" ? "py-2 px-3.5" : "py-3.5 px-3.5"
                        } text-center whitespace-nowrap`}
                      >
                        {speedBadge}
                      </td>
                      <td
                        className={`${
                          tableDensity === "compact" ? "py-2 px-3.5" : "py-3.5 px-3.5"
                        } text-center whitespace-nowrap`}
                      >
                        {statusBadge}
                      </td>
                      <td
                        className={`${
                          tableDensity === "compact" ? "py-2 px-3.5" : "py-3.5 px-3.5"
                        } text-center whitespace-nowrap`}
                      >
                        <Button
                          size="sm"
                          onClick={() => setSelectedDoc(doc)}
                          className={`${
                            tableDensity === "compact" ? "h-6 px-2.5 text-[10px]" : "h-7 px-3 text-[11px]"
                          } bg-[#0052FF] hover:bg-blue-700 text-white font-bold rounded-lg gap-1 cursor-pointer accessible-focus shadow-2xs`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>เปิดดู / เกษียน</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400">
                    <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-sm text-slate-600">
                      {searchQuery ? "ไม่พบเอกสารที่ค้นหา" : "ยังไม่มีรายการหนังสือในระบบ"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {searchQuery
                        ? "ลองตรวจสอบคำค้นหาหรือตัวกรองกองงานอีกครั้ง"
                        : "สามารถกดปุ่ม 'ลงรับหนังสือเข้า' หรือ 'ออกเลขหนังสือส่ง' ด้านบนเพื่อเริ่มต้น"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. WORKSPACE MODAL (เปิดอ่าน, ประทับตรายาง, และเกษียนหนังสือฉบับจริง)         */}
      {/* ========================================================================= */}
      {selectedDoc && (
        <DocumentViewerWorkspace
          document={selectedDoc}
          onClose={() => setSelectedDoc(null)}
          onSaveDoc={() => {
            refreshData();
          }}
        />
      )}
    </div>
  );
}

