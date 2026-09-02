"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckSquare,
  PenTool,
  Clock,
  CheckCircle2,
  FileText,
  Eye,
  Send,
  Zap,
  Filter,
  Check,
  AlertTriangle,
  UserCheck,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { DocumentViewerWorkspace, DocumentData } from "@/components/documents/document-viewer-workspace";
import { useSession } from "@/components/providers/session-provider";

interface ApprovalDoc extends DocumentData {
  senderDept: string;
  senderStaff: string;
  waitingFor: string;
  urgency: "ปกติ" | "ด่วน" | "ด่วนมาก" | "ด่วนที่สุด";
  slaRemaining: string;
}

const mockApprovalDocs: ApprovalDoc[] = [];

export default function ApprovalsPage() {
  const { data: session } = useSession();
  const [approvalList, setApprovalList] = useState<ApprovalDoc[]>(mockApprovalDocs);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedDocForViewer, setSelectedDocForViewer] = useState<ApprovalDoc | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const handleSelectAll = () => {
    if (selectedIds.length === approvalList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(approvalList.map((d) => d.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBatchApprove = () => {
    if (selectedIds.length === 0) return;
    setApprovalList(approvalList.filter((d) => !selectedIds.includes(d.id)));
    setSelectedIds([]);
    setActionSuccessMsg(`อนุมัติและลงนามเกษียนรวดเดียว ${selectedIds.length} ฉบับเรียบร้อยแล้ว`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const handleQuickSingleApprove = (doc: ApprovalDoc) => {
    setApprovalList(approvalList.filter((d) => d.id !== doc.id));
    setActionSuccessMsg(`อนุมัติและลงนามหนังสือเลขที่ "${doc.docNo}" เรียบร้อยแล้ว`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <PageHeader
          title="คิวงานรอการพิจารณา / อนุมัติ (Executive Approvals)"
          description="รายการหนังสือราชการที่เสนอถึงท่านเพื่อพิจารณากลั่นกรอง เกษียนสั่งการ หรือลงนามอนุมัติ"
        />

        {selectedIds.length > 0 && (
          <Button
            onClick={handleBatchApprove}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl h-10 px-5 gap-2 shadow-md animate-in zoom-in-95 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            อนุมัติรายการที่เลือก ({selectedIds.length} ฉบับ)
          </Button>
        )}
      </div>

      {actionSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-amber-500 shadow-xs rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500">รอท่านพิจารณา</p>
              <p className="text-2xl font-black text-amber-700 mt-1">
                {approvalList.length} ฉบับ
              </p>
              <span className="text-[10px] text-slate-500 font-medium">เฉลี่ย SLA 24 ชม.</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 shadow-xs rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500">หนังสือด่วนที่สุด</p>
              <p className="text-2xl font-black text-red-600 mt-1">
                {approvalList.filter((d) => d.speed === "ด่วนที่สุด").length} ฉบับ
              </p>
              <span className="text-[10px] text-red-600 font-bold">ต้องดำเนินการทันที</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-600 shadow-xs rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500">อนุมัติแล้วเดือนนี้</p>
              <p className="text-2xl font-black text-slate-800 mt-1">48 ฉบับ</p>
              <span className="text-[10px] text-emerald-600 font-bold">เฉลี่ย 2.5 ชม. / ฉบับ</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Approval Table */}
      <Card className="shadow-xs border-slate-200 overflow-hidden rounded-2xl">
        <CardHeader className="bg-slate-100/90 px-6 py-4 border-b border-slate-200 flex flex-row items-center justify-between">
          <CardTitle className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-blue-700" />
            รายการหนังสือรอการพิจารณา / สั่งการ
          </CardTitle>
          <div className="flex items-center gap-2 text-xs">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSelectAll}
              className="text-xs rounded-xl h-8 font-bold border-slate-300"
            >
              {selectedIds.length === approvalList.length ? "ยกเลิกการเลือกทั้งหมด" : "เลือกทั้งหมด"}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200 text-xs">
                  <th className="p-3.5 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.length > 0 && selectedIds.length === approvalList.length}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-navy-700 cursor-pointer"
                    />
                  </th>
                  <th className="p-3.5 whitespace-nowrap">ความเร็ว</th>
                  <th className="p-3.5 whitespace-nowrap">เลขที่หนังสือ</th>
                  <th className="p-3.5 min-w-[280px]">เรื่อง</th>
                  <th className="p-3.5 whitespace-nowrap">เสนอมาจาก</th>
                  <th className="p-3.5 whitespace-nowrap">สถานะ / กำหนดเวลา</th>
                  <th className="p-3.5 text-center whitespace-nowrap">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {approvalList.length > 0 ? (
                  approvalList.map((doc, idx) => {
                    const isChecked = selectedIds.includes(doc.id);
                    return (
                      <tr
                        key={doc.id}
                        className={`hover:bg-blue-50/60 transition-colors ${
                          isChecked ? "bg-blue-50/70" : idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                        }`}
                      >
                        <td className="p-3.5 text-center align-middle">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSelect(doc.id)}
                            className="rounded border-slate-300 text-navy-700 cursor-pointer"
                          />
                        </td>
                        <td className="p-3.5 whitespace-nowrap align-middle">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                              doc.speed === "ด่วนที่สุด"
                                ? "bg-red-100 text-red-700 border border-red-200"
                                : doc.speed === "ด่วน"
                                ? "bg-amber-100 text-amber-700 border border-amber-200"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                            }`}
                          >
                            {doc.speed}
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-navy-950 whitespace-nowrap align-middle">
                          {doc.docNo}
                        </td>
                        <td className="p-3.5 font-bold text-slate-900 align-middle">
                          <p className="line-clamp-2">{doc.title}</p>
                        </td>
                        <td className="p-3.5 whitespace-nowrap align-middle">
                          <p className="font-bold text-slate-800">{doc.senderStaff}</p>
                          <p className="text-[10px] text-slate-500">{doc.senderDept}</p>
                        </td>
                        <td className="p-3.5 whitespace-nowrap align-middle">
                          <span className="font-bold text-navy-900 block">{doc.waitingFor}</span>
                          <span className="text-[10px] text-amber-700 font-semibold">
                            {doc.slaRemaining}
                          </span>
                        </td>
                        <td className="p-3.5 text-center whitespace-nowrap align-middle">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Fast Single Approve */}
                            <Button
                              size="sm"
                              onClick={() => handleQuickSingleApprove(doc)}
                              className="h-8 px-2.5 text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold gap-1 rounded-xl shadow-xs cursor-pointer"
                              title="อนุมัติและประทับตรายางเกษียนด่วน"
                            >
                              <Check className="w-3.5 h-3.5" />
                              อนุมัติ
                            </Button>

                            {/* Open Full Workspace */}
                            <Button
                              size="sm"
                              onClick={() => setSelectedDocForViewer(doc)}
                              className="h-8 px-3 text-xs bg-navy-900 hover:bg-navy-800 text-white font-bold gap-1 rounded-xl shadow-xs cursor-pointer"
                            >
                              <PenTool className="w-3.5 h-3.5 text-amber-300" />
                              เปิดตรวจ & เกษียน
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-400 font-medium">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                      ไม่มีหนังสือรอการพิจารณาในคิวของคุณ
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Document Workspace Integration */}
      {selectedDocForViewer && (
        <DocumentViewerWorkspace
          document={selectedDocForViewer}
          onClose={() => setSelectedDocForViewer(null)}
        />
      )}
    </div>
  );
}
