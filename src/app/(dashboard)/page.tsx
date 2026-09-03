"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "@/components/providers/session-provider";
import { DocumentViewerWorkspace, DocumentData } from "@/components/documents/document-viewer-workspace";
import { getDocumentStats, getAllDocuments, StoredDocument } from "@/lib/document-store";
import { formatThaiDate } from "@/lib/formatters/thai-date";

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

  const userName = session?.user?.name || "ผู้ใช้งานสารบรรณ";
  const userPosition = session?.user?.position || "เจ้าหน้าที่สารบรรณ";
  const userDept = session?.user?.department || "สำนักปลัด";
  const todayThai = formatThaiDate(new Date());

  useEffect(() => {
    const refreshData = () => {
      setAllDocs(getAllDocuments());
      setStats(getDocumentStats());
    };
    refreshData();

    window.addEventListener("smartsarabun_documents_updated", refreshData);
    return () => {
      window.removeEventListener("smartsarabun_documents_updated", refreshData);
    };
  }, []);

  // Filter documents by tab, search, and department
  const filteredDocs = allDocs.filter((doc) => {
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

  const incomingCount = allDocs.filter((d) => d.direction !== "outgoing").length;
  const outgoingCount = allDocs.filter((d) => d.direction === "outgoing").length;
  const pendingCount = allDocs.filter((d) => d.status !== "completed" && d.status !== "sent").length;

  return (
    <div className="space-y-5 pb-16 font-sans">
      {/* ========================================================================= */}
      {/* 1. EMPLOYEE HEADER BAR (เน้นความชัดเจนและปุ่มทางลัดที่ใช้ทุกวัน)             */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 font-sans tracking-tight">
              ระบบงานสารบรรณ อบต.ดอยงาม
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-[#0052FF] border border-blue-200">
              งานประจำวัน
            </span>
          </div>
          <p className="text-xs text-slate-600">
            ผู้ใช้งาน: <strong className="text-slate-800">{userName}</strong> ({userPosition}) • {userDept} | ประจำวันที่ <strong>{todayThai}</strong>
          </p>
        </div>

        {/* Action Buttons ที่พนักงานกดใช้จริง */}
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <Link href="/receive" className="flex-1 sm:flex-initial">
            <Button
              size="sm"
              className="w-full h-9 px-3.5 bg-[#0052FF] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs gap-1.5 cursor-pointer"
            >
              <Inbox className="w-4 h-4" />
              <span>ลงรับหนังสือเข้า</span>
            </Button>
          </Link>

          <Link href="/send" className="flex-1 sm:flex-initial">
            <Button
              size="sm"
              variant="outline"
              className="w-full h-9 px-3.5 border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4 text-slate-600" />
              <span>ออกเลขหนังสือส่ง</span>
            </Button>
          </Link>

          <Link href="/cabinet" className="hidden md:inline-flex">
            <Button
              size="sm"
              variant="outline"
              className="h-9 px-3 border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl gap-1.5 cursor-pointer"
            >
              <FolderOpen className="w-4 h-4 text-amber-600" />
              <span>ตู้เอกสาร</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. 4 CORE METRIC CARDS (ตัวเลขงานจริง ไม่มีข้อมูล Mock หรือการ์ดตกแต่ง)     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* หนังสือเข้าวันนี้ */}
        <Link href="/inbox" className="group">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-blue-400 hover:shadow-sm transition-all">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
              <span className="flex items-center gap-1.5">
                <Inbox className="w-4 h-4 text-blue-600" />
                หนังสือเข้าวันนี้
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
                {stats.incomingToday}
              </span>
              <span className="text-xs font-bold text-slate-500">ฉบับ</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">ลงรับแล้วในสมุดทะเบียนรับ</p>
          </div>
        </Link>

        {/* หนังสือส่งวันนี้ */}
        <Link href="/outbox" className="group">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-blue-400 hover:shadow-sm transition-all">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
              <span className="flex items-center gap-1.5">
                <Send className="w-4 h-4 text-emerald-600" />
                หนังสือส่งวันนี้
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
                {stats.outgoingToday}
              </span>
              <span className="text-xs font-bold text-slate-500">ฉบับ</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">ออกเลขและส่งออกแล้ว</p>
          </div>
        </Link>

        {/* งานรอดำเนินการ / เกษียน */}
        <Link href="/approvals" className="group">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-amber-400 hover:shadow-sm transition-all">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                รอดำเนินการ / เกษียน
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition-colors" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-amber-600 font-sans">
                {stats.pendingCount}
              </span>
              <span className="text-xs font-bold text-slate-500">ฉบับ</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">รอการเกษียนหรือพิจารณา</p>
          </div>
        </Link>

        {/* หนังสือทั้งหมดในระบบ */}
        <Link href="/documents" className="group">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-blue-400 hover:shadow-sm transition-all">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-600" />
                เอกสารทั้งหมด
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
                {allDocs.length}
              </span>
              <span className="text-xs font-bold text-slate-500">ฉบับ</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">บันทึกอยู่ในฐานข้อมูลจริง</p>
          </div>
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN WORK QUEUE: รายการหนังสือราชการ (ตารางที่ใช้งานจริงเต็มจอ)          */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-3">
        {/* Controls: Tabs & Search Filter */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold shrink-0">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === "all" ? "bg-white text-slate-900 shadow-xs font-black" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ทั้งหมด ({allDocs.length})
            </button>
            <button
              onClick={() => setActiveTab("incoming")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === "incoming" ? "bg-white text-[#0052FF] shadow-xs font-black" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              หนังสือเข้า ({incomingCount})
            </button>
            <button
              onClick={() => setActiveTab("outgoing")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === "outgoing" ? "bg-white text-emerald-700 shadow-xs font-black" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              หนังสือส่ง ({outgoingCount})
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === "pending" ? "bg-white text-amber-700 shadow-xs font-black" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              รอดำเนินการ ({pendingCount})
            </button>
          </div>

          {/* Search & Dept Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหาเลขที่, ชื่อเรื่อง, หน่วยงาน..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0052FF]"
              />
            </div>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="py-1.5 px-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:outline-none"
            >
              <option value="ALL">ทุกกอง/สำนัก</option>
              <option value="สำนักปลัด">สำนักปลัด</option>
              <option value="กองคลัง">กองคลัง</option>
              <option value="กองช่าง">กองช่าง</option>
              <option value="กองการศึกษาฯ">กองการศึกษาฯ</option>
              <option value="กองสาธารณสุข">กองสาธารณสุข</option>
            </select>
          </div>
        </div>

        {/* Real Document Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-2.5 px-3 whitespace-nowrap">เลขที่หนังสือ / เลขรับ</th>
                <th className="py-2.5 px-3 whitespace-nowrap">วันที่</th>
                <th className="py-2.5 px-3 min-w-[240px]">ชื่อเรื่อง</th>
                <th className="py-2.5 px-3 whitespace-nowrap">จากหน่วยงาน</th>
                <th className="py-2.5 px-3 whitespace-nowrap">กองผู้รับผิดชอบ</th>
                <th className="py-2.5 px-3 text-center whitespace-nowrap">ความเร่งด่วน</th>
                <th className="py-2.5 px-3 text-center whitespace-nowrap">สถานะ</th>
                <th className="py-2.5 px-3 text-center whitespace-nowrap">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc, idx) => {
                  const speedBadge =
                    doc.speed === "ด่วนที่สุด" ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        ด่วนที่สุด
                      </span>
                    ) : doc.speed === "ด่วนมาก" ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
                        ด่วนมาก
                      </span>
                    ) : doc.speed === "ด่วน" ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        ด่วน
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                        ปกติ
                      </span>
                    );

                  const statusBadge =
                    doc.status === "completed" || doc.status === "sent" ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {doc.direction === "outgoing" ? "ส่งแล้ว" : "เสร็จสิ้น"}
                      </span>
                    ) : doc.status === "forwarded" ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                        ส่งต่อกองแล้ว
                      </span>
                    ) : doc.status === "assigned" ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                        มอบหมายแล้ว
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        รอดำเนินการ
                      </span>
                    );

                  return (
                    <tr
                      key={doc.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                      }`}
                    >
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-mono font-bold text-blue-900">{doc.docNo}</div>
                        {doc.regNo && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            เลขรับ: {doc.regNo}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                        {doc.docDate || "-"}
                      </td>
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => setSelectedDoc(doc)}
                          className="font-bold text-slate-900 hover:text-[#0052FF] text-left leading-snug cursor-pointer transition-colors block"
                        >
                          {doc.title}
                        </button>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {doc.direction === "outgoing" ? "หนังสือส่งออก" : "หนังสือรับเข้า"}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-slate-700">
                        {doc.from || (doc as any).fromOrg || "ส่วนราชการ"}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap font-semibold text-slate-700">
                        {doc.targetDept || doc.senderDept || "สำนักปลัด"}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {speedBadge}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {statusBadge}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <Button
                          size="sm"
                          onClick={() => setSelectedDoc(doc)}
                          className="h-7 px-3 bg-[#0052FF] hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg gap-1 cursor-pointer"
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
      {/* 4. WORKSPACE MODAL (เปิดอ่าน, ประทับตรายาง, และเกษียนหนังสือฉบับจริง)         */}
      {/* ========================================================================= */}
      {selectedDoc && (
        <DocumentViewerWorkspace
          document={selectedDoc}
          onClose={() => setSelectedDoc(null)}
          onSaveDoc={() => {
            setAllDocs(getAllDocuments());
            setStats(getDocumentStats());
          }}
        />
      )}
    </div>
  );
}
