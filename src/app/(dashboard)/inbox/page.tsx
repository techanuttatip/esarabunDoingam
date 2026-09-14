"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
  Inbox,
  Search,
  BookOpen,
  Plus,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { getIncomingDocuments, StoredDocument } from "@/lib/document-store";
import { DocumentViewerWorkspace, DocumentData } from "@/components/documents/document-viewer-workspace";

export default function InboxPage() {
  const [inboxDocs, setInboxDocs] = useState<StoredDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedSpeed, setSelectedSpeed] = useState("ALL");
  const [selectedDocForViewer, setSelectedDocForViewer] = useState<DocumentData | null>(null);

  useEffect(() => {
    const loadDocs = () => {
      setInboxDocs(getIncomingDocuments());
    };
    loadDocs();

    window.addEventListener("smartsarabun_documents_updated", loadDocs);
    return () => {
      window.removeEventListener("smartsarabun_documents_updated", loadDocs);
    };
  }, []);

  const filteredDocs = inboxDocs.filter((doc) => {
    if (selectedDept !== "ALL" && doc.targetDept !== selectedDept) return false;
    if (selectedSpeed !== "ALL" && doc.speed !== selectedSpeed) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.docNo.toLowerCase().includes(q) ||
        (doc.regNo && doc.regNo.toLowerCase().includes(q)) ||
        (doc.from && doc.from.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <PageHeader
        title="กล่องหนังสือเข้า (Incoming Registry Inbox)"
        description="ทะเบียนรับหนังสือราชการภายนอก และงานที่ส่งต่อเข้าสู่ส่วนราชการ อบต.ดอยงาม"
        action={
          <div className="flex items-center gap-2 flex-wrap">
            <Button asChild variant="outline" className="text-xs font-extrabold rounded-xl h-10 px-4 gap-1.5 border-slate-300 text-slate-700 hover:bg-slate-100 shadow-2xs">
              <Link href="/receive">
                <BookOpen className="w-4 h-4 text-[#0052FF]" />
                <span>สมุดทะเบียนรับฉบับเต็ม</span>
              </Link>
            </Button>

            <Button asChild className="bg-[#0052FF] hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm rounded-xl h-10 px-4 gap-2 shadow-sm transition-all active:scale-[0.98]">
              <Link href="/receive">
                <Plus className="w-4 h-4 text-white" />
                <span>+ ลงรับหนังสือภายนอก</span>
              </Link>
            </Button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาเลขที่, เลขรับ, เรื่อง, หรือหน่วยงานต้นทาง..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0052FF] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-[#0052FF] focus:outline-none cursor-pointer"
          >
            <option value="ALL">ทุกกอง/สำนัก</option>
            <option value="สำนักปลัด">สำนักปลัด</option>
            <option value="กองคลัง">กองคลัง</option>
            <option value="กองช่าง">กองช่าง</option>
            <option value="กองการศึกษาฯ">กองการศึกษาฯ</option>
            <option value="กองสาธารณสุข">กองสาธารณสุข</option>
          </select>

          <select
            value={selectedSpeed}
            onChange={(e) => setSelectedSpeed(e.target.value)}
            className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-[#0052FF] focus:outline-none cursor-pointer"
          >
            <option value="ALL">ทุกชั้นความเร็ว</option>
            <option value="ปกติ">ปกติ</option>
            <option value="ด่วน">ด่วน</option>
            <option value="ด่วนมาก">ด่วนมาก</option>
            <option value="ด่วนที่สุด">ด่วนที่สุด</option>
          </select>
        </div>
      </div>

      {/* Inbox Documents Table Card */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-xs overflow-hidden">
        <div className="bg-slate-100/90 px-6 py-4 border-b border-slate-300 flex flex-row items-center justify-between">
          <div className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Inbox className="w-5 h-5 text-[#0052FF]" />
            <span>รายการหนังสือเข้ารอจัดการ ({filteredDocs.length} ฉบับ)</span>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-300 shadow-2xs">
            ปีงบประมาณ ๒๕๖๙
          </span>
        </div>

        <div className="p-0">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px] text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-extrabold border-b-2 border-slate-300">
                  <th className="p-3.5 w-[14%] whitespace-nowrap">เลขทะเบียนรับ</th>
                  <th className="p-3.5 w-[16%] whitespace-nowrap">ที่หนังสือ / ลงวันที่</th>
                  <th className="p-3.5 w-[38%] min-w-[260px]">เรื่อง / จากหน่วยงาน</th>
                  <th className="p-3.5 w-[14%] whitespace-nowrap">กองผู้รับผิดชอบ</th>
                  <th className="p-3.5 w-[10%] text-center whitespace-nowrap">สถานะ</th>
                  <th className="p-3.5 text-center w-[8%] whitespace-nowrap">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredDocs.length > 0 ? (
                  filteredDocs.map((doc, idx) => (
                    <tr
                      key={doc.id}
                      className={`hover:bg-blue-50/60 transition-colors ${
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                      }`}
                    >
                      <td className="p-3.5 font-extrabold text-slate-900 text-sm">
                        {doc.regNo}
                        <span className="text-[10px] text-slate-400 block font-normal mt-0.5">
                          รับเมื่อ: {doc.regDate}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className="font-mono font-bold text-blue-900 block">{doc.docNo}</span>
                        <span className="text-[11px] text-slate-500">{doc.docDate}</span>
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          {doc.speed === "ด่วนที่สุด" && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-red-100 text-red-800 border border-red-200 shrink-0">
                              ด่วนที่สุด
                            </span>
                          )}
                          {doc.speed === "ด่วน" && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                              ด่วน
                            </span>
                          )}
                          <p className="font-bold text-slate-900 text-xs sm:text-sm">{doc.title}</p>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">จาก: {doc.from || (doc as any).fromOrg}</p>
                      </td>

                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          {doc.targetDept}
                        </span>
                      </td>

                      <td className="p-3.5 text-center">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
                          {doc.status || "ลงรับแล้ว"}
                        </span>
                      </td>

                      <td className="p-3.5 text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedDocForViewer(doc)}
                          className="h-8 px-2.5 text-xs font-bold rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1 text-[#0052FF]" />
                          เปิดดู
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400">
                      <Inbox className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                      <p className="font-bold text-slate-700 text-sm">ยังไม่มีหนังสือเข้าในกล่องหนังสือรับ</p>
                      <p className="text-xs text-slate-400 mt-0.5">เมื่อมีการลงรับหนังสือจากภายนอก รายการหนังสือจะแสดงที่นี่</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {selectedDocForViewer && (
        <DocumentViewerWorkspace
          document={selectedDocForViewer}
          onClose={() => setSelectedDocForViewer(null)}
          onSaveDoc={() => setInboxDocs(getIncomingDocuments())}
        />
      )}
    </div>
  );
}
