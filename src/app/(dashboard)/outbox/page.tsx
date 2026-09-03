"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Send,
  Search,
  FileText,
  Plus,
  Printer,
  Eye,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface OutgoingItem {
  id: string;
  docNo: string;
  docDate: string;
  toOrg: string;
  title: string;
  docType: "ภายใน" | "ภายนอก" | "คำสั่ง" | "ประกาศ";
  senderDept: string;
  senderName: string;
  status: "อนุมัติแล้ว" | "กำลังส่ง" | "รออนุมัติ";
}

const mockOutboxDocs: OutgoingItem[] = [];

export default function OutboxPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");

  const filteredDocs = mockOutboxDocs.filter((doc) => {
    if (selectedType !== "ALL" && doc.docType !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.docNo.toLowerCase().includes(q) ||
        doc.toOrg.toLowerCase().includes(q) ||
        doc.senderDept.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="ทะเบียนหนังสือส่งออก (Outgoing Registry & Dispatch)"
          description="สมุดทะเบียนออกเลขหนังสือส่ง หนังสือภายใน คำสั่ง และประกาศ องค์การบริหารส่วนตำบลดอยงาม"
        />

        <div className="flex items-center gap-2">
          <Button asChild className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs sm:text-sm rounded-xl h-10 px-4 gap-2 shadow-xs">
            <Link href="/send">
              <Plus className="w-4 h-4 text-amber-300" />
              + ร่างและออกเลขหนังสือส่ง
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาเลขที่ส่ง, เรื่อง, หรือหน่วยงานผู้รับ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-navy-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "ภายใน", "ภายนอก", "คำสั่ง", "ประกาศ"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedType === type
                  ? "bg-navy-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {type === "ALL" ? "ทุกประเภท" : type}
            </button>
          ))}
        </div>
      </div>

      {/* Outbox Table */}
      <Card className="shadow-xs border-slate-200 overflow-hidden rounded-2xl">
        <CardHeader className="bg-slate-100/90 px-6 py-4 border-b border-slate-200 flex flex-row items-center justify-between">
          <CardTitle className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Send className="w-4.5 h-4.5 text-blue-700" />
            รายการหนังสือส่งออก ({filteredDocs.length} ฉบับ)
          </CardTitle>
          <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
            ปีงบประมาณ 2569
          </span>
        </CardHeader>

        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px] text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200">
                  <th className="p-3.5 w-[18%]">เลขที่หนังสือ / วันที่ส่ง</th>
                  <th className="p-3.5 w-[12%]">ประเภท</th>
                  <th className="p-3.5 w-[38%]">เรื่อง / ถึงหน่วยงาน</th>
                  <th className="p-3.5 w-[16%]">ส่วนราชการเจ้าของเรื่อง</th>
                  <th className="p-3.5 w-[10%]">สถานะ</th>
                  <th className="p-3.5 text-center w-[6%]">ดูหนังสือ</th>
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
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-navy-50 text-navy-900 border border-navy-200">
                          {doc.docType}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <p className="font-bold text-slate-900 text-xs sm:text-sm">{doc.title}</p>
                        <p className="text-[11px] text-slate-500 mt-1">ถึง: {doc.toOrg}</p>
                      </td>

                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 block w-fit">
                          {doc.senderDept}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">{doc.senderName}</span>
                      </td>

                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {doc.status}
                        </span>
                      </td>

                      <td className="p-3.5 text-center">
                        <Button asChild size="sm" variant="outline" className="h-8 px-2.5 text-xs font-bold rounded-lg border-slate-300 text-blue-700 hover:bg-blue-50">
                          <Link href="/send">
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            พรีวิว
                          </Link>
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
        </CardContent>
      </Card>
    </div>
  );
}
