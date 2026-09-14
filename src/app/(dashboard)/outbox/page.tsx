"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
  Send,
  Search,
  Plus,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { getOutgoingDocuments, StoredDocument } from "@/lib/document-store";
import { DocumentViewerWorkspace, DocumentData } from "@/components/documents/document-viewer-workspace";

export default function OutboxPage() {
  const [outboxDocs, setOutboxDocs] = useState<StoredDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedDocForViewer, setSelectedDocForViewer] = useState<DocumentData | null>(null);

  useEffect(() => {
    const loadDocs = () => {
      setOutboxDocs(getOutgoingDocuments());
    };
    loadDocs();

    window.addEventListener("smartsarabun_documents_updated", loadDocs);
    return () => {
      window.removeEventListener("smartsarabun_documents_updated", loadDocs);
    };
  }, []);

  const filteredDocs = outboxDocs.filter((doc) => {
    if (selectedType !== "ALL" && doc.docType !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.docNo.toLowerCase().includes(q) ||
        (doc.to && doc.to.toLowerCase().includes(q)) ||
        (doc.targetDept && doc.targetDept.toLowerCase().includes(q)) ||
        (doc.senderDept && doc.senderDept.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <PageHeader
        title="ทะเบียนหนังสือส่งออก (Outgoing Registry & Dispatch)"
        description="สมุดทะเบียนออกเลขหนังสือส่ง หนังสือภายใน คำสั่ง และประกาศ องค์การบริหารส่วนตำบลดอยงาม"
        action={
          <div className="flex items-center gap-2">
            <Button asChild className="bg-[#0052FF] hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm rounded-xl h-10 px-4 gap-2 shadow-sm transition-all active:scale-[0.98]">
              <Link href="/send">
                <Plus className="w-4 h-4 text-white" />
                <span>+ ร่างและออกเลขหนังสือส่ง</span>
              </Link>
            </Button>
          </div>
        }
      />

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาเลขที่ส่ง, เรื่อง, หรือหน่วยงานผู้รับ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0052FF] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "ภายใน", "ภายนอก", "คำสั่ง", "ประกาศ"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedType === type
                  ? "bg-[#0052FF] text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              {type === "ALL" ? "ทุกประเภท" : type}
            </button>
          ))}
        </div>
      </div>

      {/* Outbox Table Card */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-xs overflow-hidden">
        <div className="bg-slate-100/90 px-6 py-4 border-b border-slate-300 flex flex-row items-center justify-between">
          <div className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Send className="w-5 h-5 text-[#0052FF]" />
            <span>รายการหนังสือส่งออก ({filteredDocs.length} ฉบับ)</span>
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
                  <th className="p-3.5 w-[18%] whitespace-nowrap">เลขที่หนังสือ / วันที่ส่ง</th>
                  <th className="p-3.5 w-[12%] whitespace-nowrap">ประเภท</th>
                  <th className="p-3.5 w-[38%] min-w-[260px]">เรื่อง / ถึงหน่วยงาน</th>
                  <th className="p-3.5 w-[16%] whitespace-nowrap">ส่วนราชการเจ้าของเรื่อง</th>
                  <th className="p-3.5 w-[10%] text-center whitespace-nowrap">สถานะ</th>
                  <th className="p-3.5 text-center w-[6%] whitespace-nowrap">ดูหนังสือ</th>
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
                      <td className="p-3.5">
                        <span className="font-mono font-black text-slate-900 text-xs sm:text-sm block">
                          {doc.docNo}
                        </span>
                        <span className="text-[11px] text-slate-500">{doc.docDate}</span>
                      </td>

                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-950 border border-blue-200">
                          {doc.docType}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <p className="font-bold text-slate-900 text-xs sm:text-sm">{doc.title}</p>
                        <p className="text-[11px] text-slate-500 mt-1">ถึง: {doc.to || (doc as any).toOrg}</p>
                      </td>

                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 block w-fit">
                          {doc.senderDept || doc.targetDept || "สำนักปลัด"}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">{doc.senderName || "งานสารบรรณ"}</span>
                      </td>

                      <td className="p-3.5 text-center">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {doc.status || "อนุมัติแล้ว"}
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
                          พรีวิว
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400">
                      <Send className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                      <p className="font-bold text-slate-700 text-sm">ยังไม่มีหนังสือส่งในกล่องหนังสือส่ง</p>
                      <p className="text-xs text-slate-400 mt-0.5">เมื่อมีการออกเลขส่งหรือจัดส่งหนังสือ รายการหนังสือจะแสดงที่นี่</p>
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
          onSaveDoc={() => setOutboxDocs(getOutgoingDocuments())}
        />
      )}
    </div>
  );
}
