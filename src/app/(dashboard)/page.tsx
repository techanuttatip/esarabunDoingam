"use client";

import { useState, useEffect } from "react";
import {
  Inbox,
  Send,
  Clock,
  AlertTriangle,
  Hash,
  Sparkles,
  CheckCircle2,
  PenTool,
  ClipboardList,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "@/components/providers/session-provider";
import { DocumentViewerWorkspace, DocumentData } from "@/components/documents/document-viewer-workspace";
import { getDocumentStats, getAllDocuments, StoredDocument } from "@/lib/document-store";

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
  const [myWorkFilter, setMyWorkFilter] = useState<"all" | "today" | "near_due" | "overdue" | "completed">("all");
  const [selectedStudioDoc, setSelectedStudioDoc] = useState<DocumentData | null>(null);

  const userName = session?.user?.name || "ผู้ดูแลระบบสูงสุด (Super Admin)";
  const userDept = session?.user?.department || "สำนักปลัด (ผู้ดูแลระบบส่วนกลาง)";

  useEffect(() => {
    const updateStats = () => {
      setStats(getDocumentStats());
      setAllDocs(getAllDocuments());
    };
    updateStats();

    window.addEventListener("smartsarabun_documents_updated", updateStats);
    return () => {
      window.removeEventListener("smartsarabun_documents_updated", updateStats);
    };
  }, []);

  // 4 Core High-Impact Glass KPI Metrics (Calculated Live from Real Data)
  const kpis = [
    {
      title: "หนังสือรับวันนี้",
      value: stats.incomingToday.toString(),
      trend: stats.incomingToday > 0 ? `ลงรับแล้ว ${stats.incomingToday} ฉบับ` : "รอลงรับหนังสือใหม่",
      icon: Inbox,
      gradient: "from-blue-600 to-indigo-600",
      accent: "text-blue-700",
      bgGlass: "bg-white/85",
      borderGlass: "border-white/90",
      glowRing: "ring-1 ring-blue-500/20",
    },
    {
      title: "หนังสือส่งวันนี้",
      value: stats.outgoingToday.toString(),
      trend: stats.outgoingToday > 0 ? `ออกเลขส่ง ${stats.outgoingToday} ฉบับ` : "รอออกเลขส่งใหม่",
      icon: Send,
      gradient: "from-emerald-600 to-teal-600",
      accent: "text-emerald-700",
      bgGlass: "bg-white/85",
      borderGlass: "border-white/90",
      glowRing: "ring-1 ring-emerald-500/20",
    },
    {
      title: "งานรอดำเนินการ",
      value: stats.pendingCount.toString(),
      trend: stats.pendingCount > 0 ? `รอสั่งการ/เกษียน ${stats.pendingCount} เรื่อง` : "ไม่มีค้างดำเนินการ",
      icon: Clock,
      gradient: "from-amber-500 to-orange-600",
      accent: "text-amber-700",
      bgGlass: "bg-white/85",
      borderGlass: "border-white/90",
      glowRing: "ring-1 ring-amber-500/20",
    },
    {
      title: "เกินกำหนด SLA",
      value: stats.overdueCount.toString(),
      trend: "ตรงเวลา 100%",
      icon: AlertTriangle,
      gradient: "from-rose-500 to-red-600",
      accent: "text-rose-700",
      bgGlass: "bg-white/85",
      borderGlass: "border-white/90",
      glowRing: "ring-1 ring-rose-500/20",
    },
  ];

  // Actionable Task Queue (My Work) - Real active documents
  const myWorkTasks = allDocs.map((doc) => ({
    ...doc,
    regNo: doc.regNo || (doc.direction === "outgoing" ? "หนังสือส่ง" : "ลงรับแล้ว"),
    from: doc.from || (doc as any).fromOrg || "ส่วนราชการ",
    dept: doc.targetDept || doc.senderDept || "สำนักปลัด",
    speed: doc.speed || "ปกติ",
    priority: doc.speed === "ด่วนที่สุด" ? "CRITICAL" : doc.speed === "ด่วนมาก" ? "HIGH" : "NORMAL",
    category: doc.status === "completed" || doc.status === "sent" ? "completed" : "today",
    taskStatus: doc.direction === "outgoing" ? "หนังสือส่ง" : "รอดำเนินการ",
    date: doc.docDate || doc.createdAt || "",
  }));

  const filteredTasks = myWorkTasks.filter((task) => {
    if (myWorkFilter === "all") return true;
    return task.category === myWorkFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header: Executive Welcome & Quick Action Dock */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-white/70 backdrop-blur-2xl border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#0052FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-200/80 shadow-2xs">
              {userDept} • อบต.ดอยงาม
            </span>
            <span className="text-xs text-slate-300">|</span>
            <span className="text-xs font-semibold text-slate-500 font-mono">
              {new Date().toLocaleDateString("th-TH", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            สวัสดี, {userName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            ระบบสารบรรณอิเล็กทรอนิกส์ & แพลตฟอร์มบริหารงานเอกสารราชการดิจิทัล อบต.ดอยงาม
          </p>
        </div>

        {/* Quick Action Dock */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Link href="/receive">
            <Button
              size="sm"
              variant="signature"
              className="h-10 px-4 rounded-2xl gap-2 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 cursor-pointer font-bold text-xs"
            >
              <Inbox className="w-4 h-4" />
              <span>+ ลงรับหนังสือ</span>
            </Button>
          </Link>

          <Link href="/send">
            <Button
              size="sm"
              variant="outline"
              className="h-10 px-4 rounded-2xl gap-2 bg-white/90 hover:bg-white border-slate-200 text-slate-800 cursor-pointer font-bold text-xs shadow-2xs hover:border-emerald-300"
            >
              <Send className="w-4 h-4 text-emerald-600" />
              <span>+ หนังสือส่ง</span>
            </Button>
          </Link>

          <Link href="/numbers">
            <Button
              size="sm"
              variant="outline"
              className="h-10 px-4 rounded-2xl gap-2 bg-white/90 hover:bg-white border-slate-200 text-slate-800 cursor-pointer font-bold text-xs shadow-2xs hover:border-amber-300"
            >
              <Hash className="w-4 h-4 text-amber-600" />
              <span>+ จองเลขด่วน</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Four Premium Glass KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className={`rounded-3xl p-5 ${kpi.bgGlass} backdrop-blur-2xl border ${kpi.borderGlass} ${kpi.glowRing} shadow-[0_8px_25px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">{kpi.title}</span>
                <div
                  className={`w-9 h-9 rounded-2xl bg-gradient-to-tr ${kpi.gradient} text-white flex items-center justify-center shadow-md`}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>
              </div>

              <div className="mt-3">
                <span className="text-3xl font-black text-slate-900 tracking-tight font-mono">
                  {kpi.value}
                </span>
                <p className={`text-[11px] font-bold mt-1 ${kpi.accent}`}>
                  {kpi.trend}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Main Workspace: "งานของฉัน (My Work)" Queue & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Work Task Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl p-6 bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/70 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052FF] flex items-center justify-center shadow-2xs">
                  <ClipboardList className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    งานของฉัน (My Work Priority Queue)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    รายการหนังสือที่ต้องตรวจสอบ เกษียนความเห็น หรือลงนามตามลำดับความเร่งด่วน
                  </p>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 overflow-x-auto text-[11px] font-bold">
                {[
                  { id: "all", label: "ทั้งหมด" },
                  { id: "today", label: "วันนี้" },
                  { id: "near_due", label: "ใกล้ครบ" },
                  { id: "overdue", label: "เกินกำหนด" },
                  { id: "completed", label: "เสร็จแล้ว" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setMyWorkFilter(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      myWorkFilter === tab.id
                        ? "bg-white text-[#0052FF] shadow-2xs font-extrabold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Task List / Empty State */}
            <div className="space-y-3 pt-1">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 rounded-2xl bg-white/90 border border-slate-200/90 hover:border-blue-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {task.docNo}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">
                          เลขรับ: {task.regNo}
                        </span>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            task.priority === "CRITICAL"
                              ? "bg-red-100 text-red-800 border border-red-300"
                              : task.priority === "HIGH"
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {task.speed}
                        </span>
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          {task.dept}
                        </span>
                      </div>

                      <p className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {task.title}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500">
                        <span>จาก: {task.from.split(" ")[0]}</span>
                        <span>•</span>
                        <span className="font-medium text-slate-700 font-mono">{task.status}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <Button
                        size="sm"
                        variant="signature"
                        onClick={() => {
                          setSelectedStudioDoc({
                            id: task.id,
                            docNo: task.docNo,
                            regNo: task.regNo,
                            regDate: task.date,
                            regTime: "09:30 น.",
                            docDate: task.date,
                            from: task.from,
                            to: task.to,
                            title: task.title,
                            docType: "หนังสือภายนอก",
                            speed: task.speed as any,
                            secret: "ปกติ",
                            targetDept: task.dept,
                            contentParagraphs: [],
                            endorsements: [],
                          });
                        }}
                        className="h-8 px-3 rounded-xl text-xs font-bold gap-1 shadow-xs cursor-pointer"
                      >
                        <PenTool className="w-3.5 h-3.5" />
                        <span>เปิดตรวจเกษียน</span>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-slate-400 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200/70 shadow-2xs">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-extrabold text-sm text-slate-800">ไม่มีงานค้างในหมวดหมู่นี้</p>
                    <p className="text-xs text-slate-400 mt-0.5">งานทั้งหมดได้รับการดำเนินการเรียบร้อยแล้ว หรือยังไม่มีเอกสารใหม่ในระบบ</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Reference & AI Assistant Summary */}
        <div className="space-y-4">
          {/* 1. AI Assistant Card */}
          <div className="rounded-3xl p-5 border border-purple-200/80 bg-white/85 backdrop-blur-2xl space-y-3 shadow-[0_8px_25px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h4 className="font-black text-xs text-purple-950">AI Saraban Co-Pilot</h4>
                <p className="text-[10px] text-purple-700 font-medium">สรุปภาพรวมและประเด็นสำคัญประจำวัน</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200/60 text-xs text-slate-700 space-y-2">
              <p className="leading-relaxed font-serif text-[11px] text-purple-950">
                💡 ระบบสารบรรณอิเล็กทรอนิกส์ อบต.ดอยงาม พร้อมสำหรับการใช้งานจริงแล้ว สามารถเริ่มต้นด้วยการลงรับหนังสือเข้า หรือสร้างร่างหนังสือส่งใหม่ได้ทันที
              </p>
            </div>
          </div>

          {/* 2. Number Reservation Snapshot */}
          <div className="rounded-3xl p-5 bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_8px_25px_rgba(0,0,0,0.03)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-amber-600" />
                <h4 className="font-black text-xs text-slate-900">เลขหนังสือล่าสุด</h4>
              </div>
              <Link href="/numbers" className="text-[11px] font-bold text-[#0052FF] hover:underline">
                ดูสมุดทะเบียน
              </Link>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between">
                <span className="text-slate-500 font-medium">เลขรับกลางล่าสุด:</span>
                <span className="font-mono font-bold text-slate-500">ยังไม่มี (เริ่มต้น 1/2569)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between">
                <span className="text-slate-500 font-medium">เลขส่งกองคลัง:</span>
                <span className="font-mono font-bold text-slate-500">ยังไม่มี (เริ่มต้น 1/2569)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between">
                <span className="text-slate-500 font-medium">เลขส่งกองช่าง:</span>
                <span className="font-mono font-bold text-slate-500">ยังไม่มี (เริ่มต้น 1/2569)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Full-Screen Immersion Endorsement Studio Workspace */}
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
