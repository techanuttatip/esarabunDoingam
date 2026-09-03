"use client";

import { useState, useEffect } from "react";
import {
  Inbox,
  Send,
  Clock,
  CheckCircle2,
  PenTool,
  Search,
  Bell,
  ChevronDown,
  Calendar,
  Building2,
  Sparkles,
  ShieldCheck,
  Eye,
  Download,
  Check,
  ArrowRight,
  ExternalLink,
  SlidersHorizontal,
  LayoutDashboard,
  Users,
  FileText,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "@/components/providers/session-provider";
import { DocumentViewerWorkspace, DocumentData } from "@/components/documents/document-viewer-workspace";
import { getDocumentStats, getAllDocuments, StoredDocument } from "@/lib/document-store";
import { ThaiGaruda } from "@/components/shared/thai-garuda";
import { DocVerificationSeal } from "@/components/shared/doc-verification-seal";

// Circular Glowing Progress Ring Component (2026 Spatial Style)
function GlowingRing({
  value,
  color = "#0052FF",
  size = 76,
  stroke = 7,
}: {
  value: number;
  color?: string;
  size?: number;
  stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(value, 100) / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(226, 232, 240, 0.7)"
          strokeWidth={stroke}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          fill="transparent"
        />
      </svg>
      {/* Subtle Specular Glow behind circle */}
      <div
        className="absolute inset-1.5 rounded-full opacity-35 blur-md pointer-events-none"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

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
  const [selectedStudioDoc, setSelectedStudioDoc] = useState<DocumentData | null>(null);
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<StoredDocument | null>(null);
  const [activeDockTab, setActiveDockTab] = useState<"dashboard" | "receive" | "approvals" | "tracking" | "reports" | "settings">("dashboard");

  const userName = session?.user?.name || "สมชาย สมภักดี";
  const userPosition = session?.user?.position || "ผู้ดูแลระบบ (Admin)";
  const userDept = session?.user?.department || "สำนักปลัด • อบต.ดอยงาม";

  useEffect(() => {
    const updateData = () => {
      const currentDocs = getAllDocuments();
      setAllDocs(currentDocs);
      setStats(getDocumentStats());
      if (currentDocs.length > 0 && !selectedPreviewDoc) {
        setSelectedPreviewDoc(currentDocs[0]);
      }
    };
    updateData();

    window.addEventListener("smartsarabun_documents_updated", updateData);
    return () => {
      window.removeEventListener("smartsarabun_documents_updated", updateData);
    };
  }, [selectedPreviewDoc]);

  // Fallback demo row for preview when empty
  const activePreview = selectedPreviewDoc || (allDocs.length > 0 ? allDocs[0] : null);

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* ========================================================================= */}
      {/* 1. FLOATING GLASS COMMAND DOCK (2026 Spatial Island Navigation)            */}
      {/* ========================================================================= */}
      <div className="flex justify-center pt-1 pb-2">
        <nav className="glass-dock px-3 py-1.5 rounded-full border border-white/80 shadow-[0_12px_30px_rgba(0,0,0,0.06)] flex items-center gap-1.5 sm:gap-2 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveDockTab("dashboard")}
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
              activeDockTab === "dashboard"
                ? "bg-[#0b132b] text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-blue-400" />
            <span>Dashboard</span>
          </button>

          <Link
            href="/receive"
            className="px-3.5 py-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Inbox className="w-3.5 h-3.5 text-blue-600" />
            <span>รับ-ส่ง</span>
          </Link>

          <Link
            href="/approvals"
            className="px-3.5 py-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>อนุมัติ</span>
          </Link>

          <Link
            href="/tracking"
            className="px-3.5 py-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>ติดตาม</span>
          </Link>

          <Link
            href="/reports"
            className="px-3.5 py-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>รายงาน</span>
          </Link>

          <Link
            href="/settings"
            className="px-3.5 py-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <span>ตั้งค่า</span>
          </Link>
        </nav>
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP HEADER: Organization & User Profile Bar                             */}
      {/* ========================================================================= */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Organization Brand */}
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0052FF] to-cyan-400 text-white flex items-center justify-center font-black text-base shadow-md ring-4 ring-blue-50 shrink-0">
            สบ
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
                อบต.ดอยงาม
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-100 text-[#0052FF] border border-blue-200">
                DOIGAM-SAO
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              ระบบสารบรรณอิเล็กทรอนิกส์ อบต.ดอยงาม • อำเภอพาน จังหวัดเชียงราย
            </p>
          </div>
        </div>

        {/* Center Subtitle: Sarabun Standard */}
        <div className="hidden lg:block text-center space-y-0.5 px-4 py-1.5 rounded-2xl bg-slate-100/60 border border-slate-200/60">
          <span className="text-sm font-black text-slate-800 tracking-wide block">SmartSarabun 2026</span>
          <span className="text-[11px] text-slate-400 font-mono font-medium">TH Sarabun New, Modern GovTech</span>
        </div>

        {/* User Identity & Action Pill */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-900">{userName}</p>
            <p className="text-[11px] font-bold text-slate-400">{userPosition}</p>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-sm ring-2 ring-slate-200">
            {userName.charAt(0)}
          </div>

          <Link href="/search">
            <button className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer border border-slate-200" title="ค้นหาด่วน (Ctrl+K)">
              <Search className="w-4 h-4" />
            </button>
          </Link>

          <button className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer border border-slate-200 relative" title="การแจ้งเตือน">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BENTO GRID 2.0 KPI CARDS (With Glowing Specular Progress Rings)         */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1: เอกสารรับวันนี้ */}
        <div className="glass-card rounded-3xl p-6 bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 block">เอกสารรับวันนี้</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 font-sans tracking-tight">
                {stats.incomingToday > 0 ? stats.incomingToday : (allDocs.length > 0 ? stats.incomingToday : "48")}
              </span>
              <span className="text-xs font-bold text-slate-600">เอกสาร</span>
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                +5%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">TH Sarabun New • รับกลาง</p>
          </div>
          <GlowingRing value={75} color="#10b981" />
        </div>

        {/* Card 2: เอกสารรอลงนาม */}
        <div className="glass-card rounded-3xl p-6 bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 block">เอกสารรอลงนาม</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 font-sans tracking-tight">
                {stats.pendingCount > 0 ? stats.pendingCount : (allDocs.length > 0 ? stats.pendingCount : "15")}
              </span>
              <span className="text-xs font-bold text-slate-600">ฉบับ</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">TH Sarabun New • รอพิจารณา</p>
          </div>
          <GlowingRing value={50} color="#f59e0b" />
        </div>

        {/* Card 3: เรื่องเสร็จสมบูรณ์ */}
        <div className="glass-card rounded-3xl p-6 bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 block">เรื่องเสร็จสมบูรณ์</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 font-sans tracking-tight">
                {stats.completedCount > 0 ? stats.completedCount : (allDocs.length > 0 ? stats.completedCount : "1,245")}
              </span>
              <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200">
                +12%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">TH Sarabun New • จัดเก็บเข้าแฟ้ม</p>
          </div>
          <GlowingRing value={88} color="#0052FF" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. SPLIT GRID: (Left 7 Cols: Live Feed Table | Right 5 Cols: Paper Preview)*/}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT 7 COLS: รายการเอกสารล่าสุด (Live Document Feed) */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-5 sm:p-6 bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              รายการเอกสารล่าสุด
            </h2>

            <div className="flex items-center gap-2">
              <Link href="/receive">
                <Button size="sm" variant="outline" className="h-8 text-xs font-bold rounded-xl border-slate-300">
                  + ลงรับใหม่
                </Button>
              </Link>
            </div>
          </div>

          {/* Clean Modern Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="text-slate-400 font-bold border-b border-slate-200 pb-2">
                  <th className="py-2.5 px-2 w-8">
                    <input type="checkbox" className="rounded border-slate-300 text-[#0052FF]" />
                  </th>
                  <th className="py-2.5 px-2 font-medium">เอกสาร ID</th>
                  <th className="py-2.5 px-3 font-medium">บทความ / เรื่อง</th>
                  <th className="py-2.5 px-2 font-medium whitespace-nowrap">วันที่ ↑</th>
                  <th className="py-2.5 px-2 font-medium whitespace-nowrap">สำนัก/กอง</th>
                  <th className="py-2.5 px-2 font-medium text-center">Status</th>
                  <th className="py-2.5 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allDocs.length > 0 ? (
                  allDocs.map((doc, idx) => {
                    const isSelected = activePreview?.id === doc.id;
                    const statusPill =
                      doc.status === "completed" || doc.status === "sent" ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          ลงนามแล้ว
                        </span>
                      ) : doc.status === "forwarded" || doc.status === "assigned" ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                          กำลังดำเนินการ
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          รออนุมัติ
                        </span>
                      );

                    return (
                      <tr
                        key={doc.id}
                        onClick={() => setSelectedPreviewDoc(doc)}
                        className={`transition-colors cursor-pointer group ${
                          isSelected ? "bg-blue-50/70" : "hover:bg-slate-50/80"
                        }`}
                      >
                        <td className="py-3 px-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => setSelectedPreviewDoc(doc)}
                            className="rounded border-slate-300 text-[#0052FF]"
                          />
                        </td>
                        <td className="py-3 px-2 font-mono font-bold text-slate-800 whitespace-nowrap">
                          {doc.docNo}
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-bold text-slate-900 group-hover:text-[#0052FF] transition-colors truncate max-w-[200px] sm:max-w-xs">
                            {doc.title}
                          </p>
                          <span className="text-[10px] text-slate-400 block truncate">
                            จาก: {doc.from || (doc as any).fromOrg || "ส่วนราชการ"}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-slate-500 whitespace-nowrap font-medium">
                          {doc.docDate || "15 มี.ค."}
                        </td>
                        <td className="py-3 px-2 whitespace-nowrap text-slate-600 font-semibold">
                          {doc.targetDept || doc.senderDept || "สำนักปลัด"}
                        </td>
                        <td className="py-3 px-2 text-center whitespace-nowrap">
                          {statusPill}
                        </td>
                        <td className="py-3 px-2 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStudioDoc(doc);
                            }}
                            className="text-xs font-bold text-slate-600 hover:text-[#0052FF] flex items-center gap-0.5 ml-auto cursor-pointer"
                          >
                            <span>Action</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  // Default High-Fidelity Demo Rows matching 2026 Mockup
                  [
                    { id: "สบ003/2569", title: "รายงานการประชุมประจำเดือน", date: "15 มี.ค.", dept: "สำนักปลัด", status: "ลงนามแล้ว", color: "emerald" },
                    { id: "ศร56/012", title: "ขออนุมัติโครงการปรับปรุง", date: "15 มี.ค.", dept: "งานการเงิน", status: "รออนุมัติ", color: "amber" },
                    { id: "ชร0023/45", title: "รายงานผลสำรวจพื้นที่อุทกภัย", date: "14 มี.ค.", dept: "กองช่าง", status: "กำลังดำเนินการ", color: "sky" },
                    { id: "สบ004/2569", title: "คำสั่งแต่งตั้งคณะกรรมการตรวจรับ", date: "12 มี.ค.", dept: "สำนักปลัด", status: "ลงนามแล้ว", color: "emerald" },
                    { id: "กค98/2569", title: "รายงานงบทดลองประจำสัปดาห์", date: "11 มี.ค.", dept: "กองคลัง", status: "รออนุมัติ", color: "amber" },
                  ].map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-2">
                        <input type="checkbox" className="rounded border-slate-300 text-[#0052FF]" />
                      </td>
                      <td className="py-3 px-2 font-mono font-bold text-slate-800 whitespace-nowrap">
                        {row.id}
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-slate-900 group-hover:text-[#0052FF] transition-colors">
                          {row.title}
                        </p>
                      </td>
                      <td className="py-3 px-2 text-slate-500 whitespace-nowrap font-medium">
                        {row.date}
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap text-slate-600 font-semibold">
                        {row.dept}
                      </td>
                      <td className="py-3 px-2 text-center whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            row.color === "emerald"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : row.color === "amber"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-sky-100 text-sky-800 border border-sky-200"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right whitespace-nowrap">
                        <span className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-0.5 ml-auto">
                          Action <ChevronDown className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT 5 COLS: พรีวิวแผ่นกระดาษหนังสือราชการจริง (Live Paper Preview Card) */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 bg-white/95 backdrop-blur-2xl border border-white/90 shadow-[0_12px_36px_rgba(0,0,0,0.04)] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              พรีวิวเอกสารฉบับทางการ (Live Paper Sheet)
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              A4 Gov Standard
            </span>
          </div>

          {/* Pure White A4 Simulated Paper */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4 relative overflow-hidden font-sans">
            {/* Red Rubber Stamp at top right */}
            <div className="absolute top-4 right-4 rotate-[-6deg] border-2 border-rose-600 text-rose-700 font-bold px-2 py-1 rounded text-[9px] leading-tight select-none bg-rose-50/60 shadow-2xs">
              <div>อบต.ดอยงาม</div>
              <div>รับที่ {activePreview?.regNo || "๒๗๘๕/๒๕๖๙"}</div>
              <div>๑๕ มี.ค. ๒๕๖๙</div>
            </div>

            {/* Official Thai Garuda Emblem */}
            <div className="flex flex-col items-center justify-center space-y-1 pt-1">
              <ThaiGaruda className="w-14 h-14 drop-shadow-xs" />
              <p className="text-[11px] font-bold text-slate-700">อบต.ดอยงาม</p>
              <h3 className="text-sm font-black text-slate-900 text-center leading-snug">
                {activePreview?.title || "รายงานการประชุมประจำเดือน อบต.ดอยงาม"}
              </h3>
              <p className="text-[10px] text-slate-500 font-mono">
                {activePreview?.docDate || "วันที่ ๑๕ มี.ค. ๒๕๖๙"}
              </p>
            </div>

            {/* Simulated Thai Sarabun Paragraphs */}
            <div className="space-y-2 text-[10.5px] leading-relaxed text-slate-600 text-justify pt-2 border-t border-slate-100">
              <p className="indent-6">
                ตามที่องค์การบริหารส่วนตำบลดอยงาม ได้กำหนดให้มีการจัดทำระบบสารบรรณอิเล็กทรอนิกส์และบริการประชาชนตามมาตรฐานของกรมส่งเสริมการปกครองท้องถิ่น ประจำปีงบประมาณ พ.ศ. ๒๕๖๙ นั้น
              </p>
              <p className="indent-6">
                การดำเนินงานดังกล่าวได้บรรลุวัตถุประสงค์ทุกประการ จึงเรียนมาเพื่อโปรดทราบและพิจารณาลงนามสั่งการต่อไป
              </p>
            </div>

            {/* Official Signature & Blue Seal Block */}
            <div className="pt-4 flex flex-col items-end text-right border-t border-slate-100 space-y-1">
              <div className="font-serif italic font-black text-base text-[#003399] tracking-wider select-none pr-3">
                สมชาย สมภักดี
              </div>
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-[10px] font-bold text-slate-800">
                  ลงนาม: นายสมชาย สมภักดี
                </span>
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[8px] font-bold shadow-xs">
                  ✓
                </span>
              </div>
              <span className="text-[9px] text-slate-400 font-mono">
                วันที่ ๑๕ มี.ค. ๒๕๖๙ • ปลัด อบต.ดอยงาม
              </span>
            </div>
          </div>

          {/* Full Studio Workspace Button */}
          <Button
            size="lg"
            variant="signature"
            onClick={() => {
              if (activePreview) {
                setSelectedStudioDoc(activePreview);
              } else {
                setSelectedStudioDoc({
                  id: "demo-doc-01",
                  docNo: "สบ ๐๐๓/๒๕๖๙",
                  regNo: "๒๗๘๕/๒๕๖๙",
                  regDate: "15 มี.ค. 2569",
                  regTime: "14:30 น.",
                  docDate: "15 มี.ค. 2569",
                  from: "สำนักปลัด องค์การบริหารส่วนตำบลดอยงาม",
                  to: "นายกองค์การบริหารส่วนตำบลดอยงาม",
                  title: "รายงานการประชุมประจำเดือน และผลการดำเนินงานสารบรรณ",
                  docType: "หนังสือภายใน",
                  speed: "ปกติ",
                  secret: "ปกติ",
                  targetDept: "สำนักปลัด",
                  contentParagraphs: [
                    "ตามที่องค์การบริหารส่วนตำบลดอยงาม ได้กำหนดให้มีการจัดทำระบบสารบรรณอิเล็กทรอนิกส์และบริการประชาชนตามมาตรฐานของกรมส่งเสริมการปกครองท้องถิ่น ประจำปีงบประมาณ พ.ศ. ๒๕๖๙ นั้น",
                    "การดำเนินงานดังกล่าวได้บรรลุวัตถุประสงค์ทุกประการ จึงเรียนมาเพื่อโปรดทราบและพิจารณาลงนามสั่งการต่อไป",
                  ],
                  endorsements: [],
                });
              }
            }}
            className="w-full h-11 rounded-2xl gap-2 font-bold text-xs shadow-md shadow-blue-500/25 cursor-pointer"
          >
            <PenTool className="w-4 h-4 text-amber-300" />
            <span>เปิดตรวจเกษียน & ประทับตรายางฉบับเต็ม (Full Studio)</span>
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. FULL-SCREEN IMMERSION ENDORSEMENT STUDIO WORKSPACE MODAL               */}
      {/* ========================================================================= */}
      {selectedStudioDoc && (
        <DocumentViewerWorkspace
          document={selectedStudioDoc}
          onClose={() => setSelectedStudioDoc(null)}
          onSaveDoc={() => {
            setStats(getDocumentStats());
            setAllDocs(getAllDocuments());
          }}
        />
      )}
    </div>
  );
}
