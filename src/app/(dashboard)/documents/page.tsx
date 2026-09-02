"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Inbox,
  Send,
  Search,
  Filter,
  Plus,
  Eye,
  Download,
  FileSpreadsheet,
  Layers,
  Sparkles,
  ShieldCheck,
  History,
  Archive,
  FolderArchive,
  QrCode,
} from "lucide-react";
import Link from "next/link";
import { PdfViewerModal } from "@/features/files/components/pdf-viewer-modal";
import { DocVerificationSeal } from "@/components/shared/doc-verification-seal";

interface DocumentCatalogItem {
  id: string;
  docNo: string;
  regNo: string;
  title: string;
  type: "หนังสือเข้า" | "หนังสือส่ง" | "คำสั่ง" | "ประกาศ" | "แฟ้มจัดเก็บ";
  dept: string;
  date: string;
  speed: "ปกติ" | "ด่วน" | "ด่วนที่สุด";
  status: "อนุมัติแล้ว" | "รอเกษียน" | "เสร็จสิ้น" | "กำลังดำเนินการ" | "จัดเก็บถาวร";
  archiveFolder?: string;
  retention?: string;
}

const mockCatalog: DocumentCatalogItem[] = [];

export default function DocumentsPage() {
  const [activeType, setActiveType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedViewerDoc, setSelectedViewerDoc] = useState<DocumentCatalogItem | null>(null);

  const filteredCatalog = mockCatalog.filter((item) => {
    if (activeType !== "ALL" && item.type !== activeType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.docNo.toLowerCase().includes(q) ||
        item.regNo.toLowerCase().includes(q) ||
        item.dept.toLowerCase().includes(q) ||
        (item.archiveFolder && item.archiveFolder.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="ระบบสารบรรณและคลังเอกสารราชการ (Document File & Archive Repository)"
          description="ศูนย์รวมทะเบียนหนังสือรับ หนังสือส่ง คำสั่ง ประกาศ และแฟ้มคลังเอกสารจัดเก็บตามระเบียบสารบรรณ"
        />

        <div className="flex items-center gap-2">
          <Link href="/create">
            <Button variant="outline" className="text-xs sm:text-sm font-bold rounded-xl h-10 px-3.5 border-slate-300">
              สร้างร่างหนังสือ
            </Button>
          </Link>

          <Link href="/receive">
            <Button className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs sm:text-sm rounded-xl h-10 px-4 gap-2 shadow-xs cursor-pointer">
              <Plus className="w-4 h-4 text-amber-300" />
              + ลงรับหนังสือเข้า
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: "เอกสารทั้งหมด" },
            { id: "หนังสือเข้า", label: "หนังสือเข้า" },
            { id: "หนังสือส่ง", label: "หนังสือส่ง" },
            { id: "คำสั่ง", label: "คำสั่ง" },
            { id: "ประกาศ", label: "ประกาศ" },
            { id: "แฟ้มจัดเก็บ", label: "🗂️ แฟ้มจัดเก็บ (Archived)" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveType(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeType === tab.id
                  ? "bg-navy-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาเลขที่, เรื่อง หรือชื่อแฟ้ม..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-navy-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Catalog Table */}
      <Card className="rounded-2xl border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">เลขที่หนังสือ / เลขรับ</th>
                <th className="py-3.5 px-4 min-w-[280px]">ชื่อเรื่อง / หมวดหมู่</th>
                <th className="py-3.5 px-4">ประเภท</th>
                <th className="py-3.5 px-4">กองเจ้าของเรื่อง</th>
                <th className="py-3.5 px-4">วันที่</th>
                <th className="py-3.5 px-4">สถานะ / การจัดเก็บ</th>
                <th className="py-3.5 px-4 text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredCatalog.length > 0 ? (
                filteredCatalog.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900">{item.docNo}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {item.type === "แฟ้มจัดเก็บ" ? "รหัสจัดเก็บ: " + item.regNo : "เลขรับ: " + item.regNo}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-xs line-clamp-1">{item.title}</div>
                      {item.archiveFolder ? (
                        <div className="text-[10px] text-purple-700 font-bold mt-0.5 flex items-center gap-1">
                          <FolderArchive className="w-3 h-3 text-purple-600" />
                          <span>{item.archiveFolder}</span>
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-400 mt-0.5 font-mono">ID: {item.id}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.type === "หนังสือเข้า"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : item.type === "หนังสือส่ง"
                          ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                          : item.type === "คำสั่ง"
                          ? "bg-amber-100 text-amber-900 border border-amber-200"
                          : item.type === "แฟ้มจัดเก็บ"
                          ? "bg-purple-100 text-purple-900 border border-purple-200"
                          : "bg-slate-100 text-slate-800"
                      }`}>
                        {item.type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-800">{item.dept}</td>
                    <td className="py-3.5 px-4 text-slate-600">{item.date}</td>

                    <td className="py-3.5 px-4">
                      {item.retention ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {item.retention}
                        </span>
                      ) : (
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === "เสร็จสิ้น"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.status === "อนุมัติแล้ว"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-900"
                        }`}>
                          {item.status}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Link href={`/verify/${encodeURIComponent(item.id)}`} target="_blank">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2.5 text-[11px] font-bold gap-1 rounded-lg border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                            title="สแกน / ตรวจสอบความถูกต้อง QR Code"
                          >
                            <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                            <span>ตรวจ QR</span>
                          </Button>
                        </Link>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedViewerDoc(item)}
                          className="h-8 px-2.5 text-[11px] font-bold gap-1 rounded-lg border-slate-300"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-600" />
                          <span>ดู PDF</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    ไม่พบเอกสารในหมวดหมู่นี้
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* PDF Viewer Modal */}
      {selectedViewerDoc && (
        <PdfViewerModal
          isOpen={!!selectedViewerDoc}
          onClose={() => setSelectedViewerDoc(null)}
          documentTitle={selectedViewerDoc.title}
          docNo={selectedViewerDoc.docNo}
        />
      )}
    </div>
  );
}
