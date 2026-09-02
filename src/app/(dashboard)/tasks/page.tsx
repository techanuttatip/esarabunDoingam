"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ClipboardList,
  Search,
  Filter,
  Clock,
  AlertTriangle,
  CheckCircle2,
  PenTool,
  ArrowRight,
  Eye,
  Calendar,
  Building,
  User,
  Sparkles,
  Inbox,
  Send,
  SlidersHorizontal,
  FilePlus,
  Bookmark,
  Trash2,
  Printer,
} from "lucide-react";
import { useSession } from "@/components/providers/session-provider";
import { DocumentViewerWorkspace, DocumentData } from "@/components/documents/document-viewer-workspace";

export default function TasksPage() {
  const { data: session } = useSession();
  const [filterTab, setFilterTab] = useState<"all" | "drafts" | "today" | "near_due" | "overdue" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudioDoc, setSelectedStudioDoc] = useState<DocumentData | null>(null);

  // User-created drafts loaded from Generator Studio
  const [savedDrafts, setSavedDrafts] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("smartsarabun_user_drafts") || "[]");
        setSavedDrafts(stored);
      } catch (err) {
        console.error("Failed to read drafts from localStorage", err);
      }
    }
  }, []);

  const handleDeleteDraft = (id: string) => {
    const updated = savedDrafts.filter((d) => d.id !== id);
    setSavedDrafts(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("smartsarabun_user_drafts", JSON.stringify(updated));
    }
  };

  const initialTasks: any[] = [];

  // Convert drafts to task format for unified queue
  const draftTaskItems = savedDrafts.map((d) => ({
    id: d.id,
    docNo: d.docNo,
    regNo: "ฉบับร่าง",
    title: d.title,
    from: d.deptName || "สำนักปลัด",
    to: d.recipient || "นายก อบต.ดอยงาม",
    dept: d.deptName ? d.deptName.split(" ")[0] : "สำนักปลัด",
    speed: d.speed || "ปกติ",
    date: d.docDate || "วันนี้",
    dueDate: "ร่างส่วนตัว (ยังไม่ส่ง)",
    slaStatus: "ฉบับร่างของฉัน",
    slaType: "drafts",
    priority: "DRAFT",
    actionType: "เขียนต่อใน Studio",
    isDraft: true,
    rawDraft: d,
  }));

  const allTasks = [...draftTaskItems, ...initialTasks];

  const filteredTasks = allTasks.filter((t) => {
    if (filterTab !== "all" && t.slaType !== filterTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.docNo.toLowerCase().includes(q) ||
        t.from.toLowerCase().includes(q) ||
        t.dept.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="งานของฉัน (My Work Priority Hub)"
          description="ศูนย์รวมคิวงานที่ต้องดำเนินการ ฉบับร่างหนังสือราชการ ตรวจพิจารณา เกษียนความเห็น และลงนามตามลำดับความสำคัญ"
        />

        <div className="flex items-center gap-2">
          <Link href="/create">
            <Button
              variant="outline"
              className="bg-indigo-50 border-indigo-200 text-indigo-900 hover:bg-indigo-100 font-bold text-xs sm:text-sm rounded-xl h-10 px-3.5 gap-2 shadow-2xs cursor-pointer"
            >
              <FilePlus className="w-4 h-4 text-purple-600" />
              + สร้างร่างหนังสือใหม่
            </Button>
          </Link>

          <span className="text-xs font-bold text-slate-500 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs font-mono">
            คิวงานทั้งหมด: {allTasks.length} รายการ
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="glass-card rounded-3xl p-4 bg-white/80 border border-white/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl overflow-x-auto text-xs font-bold">
          {[
            { id: "all", label: "ทั้งหมด", count: allTasks.length },
            { id: "drafts", label: "ฉบับร่างของฉัน", count: savedDrafts.length },
            { id: "today", label: "ต้องทำวันนี้", count: 2 },
            { id: "near_due", label: "ใกล้ครบกำหนด", count: 1 },
            { id: "overdue", label: "เกินกำหนด SLA", count: 1 },
            { id: "completed", label: "เสร็จสิ้น", count: 1 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                filterTab === tab.id
                  ? "bg-white text-[#0052FF] shadow-2xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  filterTab === tab.id
                    ? "bg-blue-100 text-[#0052FF]"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาในคิวงาน..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Task Queue List */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`glass-card rounded-3xl p-5 border shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 group ${
                task.isDraft
                  ? "bg-purple-50/40 border-purple-200 hover:border-purple-300"
                  : "bg-white/90 border-white/90 hover:border-blue-300"
              }`}
            >
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg border ${
                    task.isDraft
                      ? "text-purple-900 bg-purple-100 border-purple-300"
                      : "text-blue-700 bg-blue-50 border-blue-200"
                  }`}>
                    {task.docNo}
                  </span>
                  
                  {task.isDraft ? (
                    <span className="font-bold text-xs text-purple-700 bg-purple-100 px-2 py-0.5 rounded-lg border border-purple-200 flex items-center gap-1">
                      <Bookmark className="w-3 h-3 text-purple-600" />
                      ฉบับร่างส่วนตัว
                    </span>
                  ) : (
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                      เลขรับ: {task.regNo}
                    </span>
                  )}

                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                      task.priority === "CRITICAL"
                        ? "bg-red-100 text-red-800 border border-red-300"
                        : task.priority === "HIGH"
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : task.priority === "DRAFT"
                        ? "bg-purple-100 text-purple-800 border border-purple-200"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {task.speed}
                  </span>

                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg">
                    {task.dept}
                  </span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                  {task.title}
                </h3>

                <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>จาก: {task.from}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono font-bold text-slate-700">
                      {task.isDraft ? "สร้างเมื่อ: " + task.date : "กำหนดส่ง: " + task.dueDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        task.slaType === "overdue"
                          ? "bg-rose-100 text-rose-800 border border-rose-300 font-black"
                          : task.slaType === "today"
                          ? "bg-amber-100 text-amber-800 font-bold"
                          : task.slaType === "drafts"
                          ? "bg-purple-100 text-purple-800 font-bold"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {task.slaStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                {task.isDraft ? (
                  <div className="flex items-center gap-2">
                    <Link href="/create">
                      <Button
                        size="sm"
                        className="bg-purple-700 hover:bg-purple-800 text-white h-10 px-4 rounded-xl text-xs font-bold gap-1.5 shadow-xs cursor-pointer"
                      >
                        <PenTool className="w-4 h-4" />
                        <span>แก้ไขใน Studio</span>
                      </Button>
                    </Link>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteDraft(task.id)}
                      className="h-10 px-3 rounded-xl text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                      title="ลบฉบับร่าง"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
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
                        contentParagraphs: [
                          "ด้วยหนังสือสั่งการดังกล่าว มีแนวทางและระเบียบปฏิบัติที่เกี่ยวข้องกับการบริหารราชการขององค์กรปกครองส่วนท้องถิ่น",
                          "จึงเรียนเสนอเพื่อโปรดพิจารณาและสั่งการดำเนินการตามระเบียบต่อไป",
                        ],
                        endorsements: [],
                      });
                    }}
                    className="h-10 px-4 rounded-xl text-xs font-bold gap-1.5 shadow-accent cursor-pointer"
                  >
                    <PenTool className="w-4 h-4" />
                    <span>เปิดตรวจเกษียน (Workspace)</span>
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card rounded-3xl p-16 text-center text-slate-400 bg-white/80 border border-white/90 space-y-3">
            <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500" />
            <h3 className="font-extrabold text-base text-slate-800">
              ไม่มีงานค้างในหมวดหมู่นี้
            </h3>
            <p className="text-xs text-slate-500">
              รายการเอกสารทั้งหมดได้รับการดำเนินการเรียบร้อยแล้ว หรือยังไม่มีฉบับร่างที่บันทึกไว้
            </p>
          </div>
        )}
      </div>

      {/* Full-Screen Immersion Endorsement Studio Workspace */}
      {selectedStudioDoc && (
        <DocumentViewerWorkspace
          document={selectedStudioDoc}
          onClose={() => setSelectedStudioDoc(null)}
        />
      )}
    </div>
  );
}
