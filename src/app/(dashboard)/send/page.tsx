"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Send,
  Search,
  Plus,
  FilePlus,
  Edit,
  Eye,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  History,
  X,
  FileText,
  Building,
  Shield,
  Layers,
  ArrowRight,
  Printer,
  Archive,
  Ban,
  Clock,
  SendHorizontal,
  FileCheck,
} from "lucide-react";

import { getActiveDepartments, DepartmentOption } from "@/lib/departments";
import { useEffect } from "react";

export type SpeedLevel = "ปกติ" | "ด่วน" | "ด่วนมาก" | "ด่วนที่สุด";
export type SecretLevel = "ปกติ" | "ลับ" | "ลับมาก" | "ลับที่สุด";
export type OutgoingStatus = "draft" | "reserved" | "reviewed" | "issued" | "sent" | "archived" | "cancelled";

export interface OutgoingDocItem {
  id: string;
  docNo: string;
  regNo?: string;
  docDate: string;
  dispatchDate?: string;
  fromDept: string;
  fromSection?: string;
  toOrg: string;
  title: string;
  content?: string;
  docType: string;
  speed: SpeedLevel;
  secret: SecretLevel;
  seriesCode: string;
  responsibleStaff: string;
  notes?: string;
  dispatchChannel?: string;
  trackingNo?: string;
  status: OutgoingStatus;
  timeline: { action: string; time: string; actor: string; note: string }[];
}

const initialOutgoingList: OutgoingDocItem[] = [];

export default function SendPage() {
  const [documents, setDocuments] = useState<OutgoingDocItem[]>(initialOutgoingList);
  const [availableDepartments, setAvailableDepartments] = useState<DepartmentOption[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedSpeed, setSelectedSpeed] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  useEffect(() => {
    const depts = getActiveDepartments();
    setAvailableDepartments(depts);
    if (depts.length > 0) {
      setFormData((prev) => ({ ...prev, fromDept: depts[0].name }));
    }
  }, []);

  // Detail Modal State
  const [selectedDoc, setSelectedDoc] = useState<OutgoingDocItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    toOrg: "",
    content: "",
    docType: "หนังสือภายนอก",
    speed: "ปกติ" as SpeedLevel,
    secret: "ปกติ" as SecretLevel,
    fromDept: "",
    fromSection: "",
    seriesCode: "OUTGOING_DOC",
    docDate: "2026-08-28",
    responsibleStaff: "เจ้าหน้าที่ผู้รับผิดชอบ",
    notes: "",
  });

  // Send Modal State
  const [showSendModal, setShowSendModal] = useState(false);
  const [dispatchChannel, setDispatchChannel] = useState("ระบบสารบรรณอิเล็กทรอนิกส์ (E-Saraban)");
  const [trackingNo, setTrackingNo] = useState("");

  // Cancel Modal State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReasonText, setCancelReasonText] = useState("");

  const filteredDocs = documents.filter((doc) => {
    if (selectedDept !== "ALL" && doc.fromDept !== selectedDept) return false;
    if (selectedSpeed !== "ALL" && doc.speed !== selectedSpeed) return false;
    if (selectedStatus !== "ALL" && doc.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.docNo.toLowerCase().includes(q) ||
        doc.toOrg.toLowerCase().includes(q) ||
        doc.fromDept.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getPrefixByDept = (deptName: string) => {
    const found = availableDepartments.find((d) => d.name === deptName);
    if (found && found.docPrefix) return found.docPrefix;
    return "ชร ๕๒๐๐๑/ว";
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newDoc: OutgoingDocItem = {
      id: `out-${Date.now()}`,
      docNo: "ฉบับร่าง (ยังไม่ออกเลข)",
      docDate: formData.docDate,
      fromDept: formData.fromDept,
      fromSection: formData.fromSection,
      toOrg: formData.toOrg,
      title: formData.title,
      content: formData.content,
      docType: formData.docType,
      speed: formData.speed,
      secret: formData.secret,
      seriesCode: formData.seriesCode,
      responsibleStaff: formData.responsibleStaff,
      notes: formData.notes,
      status: "draft",
      timeline: [
        {
          action: "สร้างร่างหนังสือส่ง",
          time: "เมื่อสักครู่",
          actor: formData.responsibleStaff,
          note: `ร่างหนังสือส่งประจำ ${formData.fromDept}`,
        },
      ],
    };

    setDocuments([newDoc, ...documents]);
    setShowCreateModal(false);
    setFormData({
      title: "",
      toOrg: "",
      content: "",
      docType: "หนังสือภายนอก",
      speed: "ปกติ",
      secret: "ปกติ",
      fromDept: "กองช่าง",
      fromSection: "งานก่อสร้างและผังเมือง",
      seriesCode: "OUTGOING_ENG",
      docDate: "2026-08-28",
      responsibleStaff: "นายวิศวกร ช่างมั่น",
      notes: "",
    });
  };

  const handleReserveNumber = (doc: OutgoingDocItem) => {
    const prefix = getPrefixByDept(doc.fromDept);
    const nextNum = "0146";
    const reservedText = `${prefix} ${nextNum} (จองเลขแล้ว)`;

    const updated = {
      ...doc,
      docNo: reservedText,
      status: "reserved" as OutgoingStatus,
      timeline: [
        ...doc.timeline,
        {
          action: "ขอจองเลขหนังสือส่ง",
          time: "เมื่อสักครู่",
          actor: doc.responsibleStaff,
          note: `จองเลข ${prefix} ${nextNum} ล่วงหน้า`,
        },
      ],
    };

    setDocuments((prev) => prev.map((d) => (d.id === doc.id ? updated : d)));
    setSelectedDoc(updated);
  };

  const handleIssueNumber = (doc: OutgoingDocItem) => {
    const prefix = getPrefixByDept(doc.fromDept);
    const nextNum = "0146";
    const officialNo = `${prefix} ${nextNum}`;

    const updated = {
      ...doc,
      docNo: officialNo,
      regNo: `${nextNum}/2569`,
      status: "issued" as OutgoingStatus,
      timeline: [
        ...doc.timeline,
        {
          action: "ออกเลขส่งเป็นทางการ",
          time: "เมื่อสักครู่",
          actor: "งานสารบรรณ",
          note: `ออกเลข ${officialNo} เรียบร้อย`,
        },
      ],
    };

    setDocuments((prev) => prev.map((d) => (d.id === doc.id ? updated : d)));
    setSelectedDoc(updated);
  };

  const handleSendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc) return;

    const updated = {
      ...selectedDoc,
      status: "sent" as OutgoingStatus,
      dispatchChannel,
      trackingNo,
      dispatchDate: "28 ส.ค. 2569",
      timeline: [
        ...selectedDoc.timeline,
        {
          action: "จัดส่งหนังสือเรียบร้อย",
          time: "เมื่อสักครู่",
          actor: "เจ้าหน้าที่งานสารบรรณ",
          note: `จัดส่งผ่าน: ${dispatchChannel} ${trackingNo ? `(เลขติดตาม: ${trackingNo})` : ""}`,
        },
      ],
    };

    setDocuments((prev) => prev.map((d) => (d.id === selectedDoc.id ? updated : d)));
    setSelectedDoc(updated);
    setShowSendModal(false);
  };

  const handleArchive = (doc: OutgoingDocItem) => {
    const updated = {
      ...doc,
      status: "archived" as OutgoingStatus,
      timeline: [
        ...doc.timeline,
        {
          action: "จัดเก็บเข้าแฟ้มตู้ดิจิทัล",
          time: "เมื่อสักครู่",
          actor: doc.responsibleStaff,
          note: "จัดเก็บเข้าตู้เอกสารประจำปีงบประมาณ 2569",
        },
      ],
    };

    setDocuments((prev) => prev.map((d) => (d.id === doc.id ? updated : d)));
    setSelectedDoc(updated);
  };

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc) return;

    const updated = {
      ...selectedDoc,
      status: "cancelled" as OutgoingStatus,
      timeline: [
        ...selectedDoc.timeline,
        {
          action: "ยกเลิกหนังสือส่ง",
          time: "เมื่อสักครู่",
          actor: "ผู้บังคับบัญชา",
          note: `ยกเลิกเนื่องจาก: ${cancelReasonText}`,
        },
      ],
    };

    setDocuments((prev) => prev.map((d) => (d.id === selectedDoc.id ? updated : d)));
    setSelectedDoc(updated);
    setShowCancelModal(false);
    setCancelReasonText("");
  };

  const getStatusBadge = (status: OutgoingStatus) => {
    switch (status) {
      case "draft":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">ฉบับร่าง</span>;
      case "reserved":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">จองเลขแล้ว</span>;
      case "reviewed":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200">ตรวจแล้ว</span>;
      case "issued":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-200">ออกเลขแล้ว</span>;
      case "sent":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">ส่งแล้ว</span>;
      case "archived":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200">จัดเก็บแล้ว</span>;
      case "cancelled":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200 line-through">ยกเลิกแล้ว</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="ระบบหนังสือส่ง (Outgoing Document & Dispatch Engine)"
          description="ร่างหนังสือส่ง ขอจองเลขประจำกอง ตรวจสอบ อนุมัติออกเลข และบันทึกการจัดส่งไปยังหน่วยงานภายนอก"
        />

        <div className="flex items-center gap-2">
          <Link href="/create">
            <Button
              variant="outline"
              className="bg-indigo-50 border-indigo-200 text-indigo-900 hover:bg-indigo-100 font-bold text-xs sm:text-sm rounded-xl h-10 px-3.5 gap-2 shadow-2xs cursor-pointer"
            >
              <FilePlus className="w-4 h-4 text-purple-600" />
              พิมพ์ร่างหนังสือ (Studio)
            </Button>
          </Link>

          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs sm:text-sm rounded-xl h-10 px-4 gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            + ลงทะเบียนส่งใหม่
          </Button>
        </div>
      </div>

      {/* Data Table Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาเลขที่, เรื่อง หรือหน่วยงานปลายทาง..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-navy-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 bg-white"
          >
            <option value="ALL">ทุกสำนัก/กอง</option>
            {availableDepartments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name} {d.code ? `(${d.code})` : ""}
              </option>
            ))}
          </select>

          <select
            value={selectedSpeed}
            onChange={(e) => setSelectedSpeed(e.target.value)}
            className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 bg-white"
          >
            <option value="ALL">ทุกความเร่งด่วน</option>
            <option value="ปกติ">ปกติ</option>
            <option value="ด่วน">ด่วน</option>
            <option value="ด่วนมาก">ด่วนมาก</option>
            <option value="ด่วนที่สุด">ด่วนที่สุด</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 bg-white"
          >
            <option value="ALL">ทุกสถานะหนังสือ</option>
            <option value="draft">ฉบับร่าง</option>
            <option value="reserved">จองเลขแล้ว</option>
            <option value="issued">ออกเลขแล้ว</option>
            <option value="sent">ส่งแล้ว</option>
            <option value="archived">จัดเก็บแล้ว</option>
            <option value="cancelled">ยกเลิกแล้ว</option>
          </select>
        </div>
      </div>

      {/* Outgoing Documents Table */}
      <Card className="shadow-xs border-slate-200 overflow-hidden rounded-2xl">
        <CardHeader className="bg-slate-100/90 px-6 py-4 border-b border-slate-200 flex flex-row items-center justify-between">
          <CardTitle className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Send className="w-4.5 h-4.5 text-blue-700" />
            สมุดทะเบียนส่งหนังสือราชการ ({filteredDocs.length} รายการ)
          </CardTitle>
          <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
            ปีงบประมาณ 2569
          </span>
        </CardHeader>

        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[950px] text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200">
                  <th className="p-3.5 w-[18%]">เลขที่หนังสือส่ง</th>
                  <th className="p-3.5 w-[36%]">เรื่อง / ถึงหน่วยงาน</th>
                  <th className="p-3.5 w-[14%]">กองเจ้าของเรื่อง</th>
                  <th className="p-3.5 w-[12%]">สถานะงาน</th>
                  <th className="p-3.5 text-center w-[20%]">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredDocs.map((doc, idx) => (
                  <tr
                    key={doc.id}
                    className={`hover:bg-blue-50/60 transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                    } ${doc.status === "cancelled" ? "bg-red-50/20" : ""}`}
                  >
                    <td className="p-3.5">
                      <span
                        className={`font-mono font-black text-sm block ${
                          doc.status === "cancelled"
                            ? "text-red-600 line-through"
                            : doc.status === "draft"
                            ? "text-slate-400 font-normal italic"
                            : "text-navy-950"
                        }`}
                      >
                        {doc.docNo}
                      </span>
                      <span className="text-[10px] text-slate-400">วันที่: {doc.docDate}</span>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        {doc.speed === "ด่วนที่สุด" && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-red-100 text-red-800 border border-red-200 shrink-0">
                            ด่วนที่สุด
                          </span>
                        )}
                        <p className="font-bold text-slate-900 text-xs sm:text-sm">{doc.title}</p>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">ถึง: {doc.toOrg}</p>
                    </td>

                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 block w-fit">
                        {doc.fromDept}
                      </span>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">
                        เจ้าของเรื่อง: {doc.responsibleStaff}
                      </span>
                    </td>

                    <td className="p-3.5">{getStatusBadge(doc.status)}</td>

                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedDoc(doc);
                            setShowDetailModal(true);
                          }}
                          className="h-8 px-2.5 text-xs font-bold rounded-lg border-slate-300 text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          เปิดดู
                        </Button>

                        {doc.status === "draft" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReserveNumber(doc)}
                            className="h-8 px-2 text-xs font-bold rounded-lg border-amber-300 text-amber-800 hover:bg-amber-50"
                          >
                            <Bookmark className="w-3.5 h-3.5 mr-1" />
                            จองเลข
                          </Button>
                        )}

                        {(doc.status === "draft" || doc.status === "reserved") && (
                          <Button
                            size="sm"
                            onClick={() => handleIssueNumber(doc)}
                            className="h-8 px-2 text-xs font-bold rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white cursor-pointer"
                          >
                            <FileCheck className="w-3.5 h-3.5 mr-1" />
                            ออกเลข
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* =========================================================================
          MODAL 1: VIEW OUTGOING DETAIL & WORKFLOW TIMELINE
      ========================================================================= */}
      {showDetailModal && selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="bg-navy-950 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <Send className="w-5 h-5 text-amber-300" />
                <div>
                  <h3 className="font-extrabold text-base">รายละเอียดหนังสือส่ง: {selectedDoc.docNo}</h3>
                  <p className="text-xs text-slate-300">วันที่หนังสือ {selectedDoc.docDate} ({selectedDoc.fromDept})</p>
                </div>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block font-medium">เลขที่หนังสือ :</span>
                  <span className="font-mono font-black text-slate-900 text-sm">{selectedDoc.docNo}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">ลงวันที่ :</span>
                  <span className="font-bold text-slate-900">{selectedDoc.docDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">ความเร่งด่วน :</span>
                  <span className="font-bold text-red-700">{selectedDoc.speed}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">สถานะหนังสือ :</span>
                  {getStatusBadge(selectedDoc.status)}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="font-bold text-slate-500 block mb-1">เรื่อง :</span>
                  <h4 className="text-base font-extrabold text-slate-900">{selectedDoc.title}</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="text-slate-400 block">จากส่วนราชการ :</span>
                    <span className="font-bold text-slate-900">{selectedDoc.fromDept} {selectedDoc.fromSection ? `(${selectedDoc.fromSection})` : ""}</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="text-slate-400 block">ถึงผู้รับ :</span>
                    <span className="font-bold text-slate-900">{selectedDoc.toOrg}</span>
                  </div>
                </div>

                {selectedDoc.content && (
                  <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl">
                    <span className="font-bold text-blue-900 block mb-1">เนื้อหาหนังสือราชการ :</span>
                    <p className="text-slate-700 leading-relaxed">{selectedDoc.content}</p>
                  </div>
                )}
              </div>

              {/* Workflow Actions Bar */}
              <div className="flex items-center flex-wrap gap-2 p-3 bg-slate-100 rounded-2xl border border-slate-200">
                <span className="font-bold text-slate-700 text-xs mr-2">การดำเนินการ :</span>

                {selectedDoc.status === "draft" && (
                  <Button
                    size="sm"
                    onClick={() => handleReserveNumber(selectedDoc)}
                    className="bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl h-8 px-3 gap-1.5 cursor-pointer"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    จองเลขล่วงหน้า
                  </Button>
                )}

                {(selectedDoc.status === "draft" || selectedDoc.status === "reserved") && (
                  <Button
                    size="sm"
                    onClick={() => handleIssueNumber(selectedDoc)}
                    className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl h-8 px-3 gap-1.5 cursor-pointer"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    ออกเลขส่งเป็นทางการ
                  </Button>
                )}

                {selectedDoc.status === "issued" && (
                  <Button
                    size="sm"
                    onClick={() => setShowSendModal(true)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl h-8 px-3 gap-1.5 cursor-pointer"
                  >
                    <SendHorizontal className="w-3.5 h-3.5" />
                    บันทึกการจัดส่งหนังสือ
                  </Button>
                )}

                {selectedDoc.status === "sent" && (
                  <Button
                    size="sm"
                    onClick={() => handleArchive(selectedDoc)}
                    className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl h-8 px-3 gap-1.5 cursor-pointer"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    จัดเก็บเข้าตู้ดิจิทัล
                  </Button>
                )}

                {selectedDoc.status !== "cancelled" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowCancelModal(true)}
                    className="text-red-700 border-red-200 hover:bg-red-50 text-xs font-bold rounded-xl h-8 px-3 ml-auto"
                  >
                    <Ban className="w-3.5 h-3.5 mr-1" />
                    ยกเลิกหนังสือ
                  </Button>
                )}
              </div>

              {/* Timeline */}
              <div>
                <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5 mb-3">
                  <History className="w-4 h-4 text-blue-700" />
                  ประวัติเส้นทางหนังสือส่ง (Outgoing Workflow Timeline) :
                </span>

                <div className="relative border-l-2 border-slate-200 ml-3 space-y-4">
                  {selectedDoc.timeline.map((t, idx) => (
                    <div key={idx} className="relative pl-6">
                      <div className="absolute -left-2 top-0.5 w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-xs" />
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{t.action}</span>
                          <span className="text-[10px] text-slate-400">{t.time}</span>
                        </div>
                        <p className="text-slate-600 mt-1">{t.note}</p>
                        <p className="text-[10px] text-blue-900 mt-1">ผู้ปฏิบัติงาน: <strong>{t.actor}</strong></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
              <Button
                variant="outline"
                onClick={() => setShowDetailModal(false)}
                className="text-xs font-bold rounded-xl h-9 px-4 border-slate-300"
              >
                ปิดหน้าต่าง
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: CREATE OUTGOING DRAFT WITH LIVE OFFICIAL HEADER PREVIEW
      ========================================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="bg-navy-950 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <Plus className="w-5 h-5 text-amber-300" />
                <div>
                  <h3 className="font-extrabold text-base">สร้างร่างหนังสือส่ง / บันทึกข้อความ</h3>
                  <p className="text-xs text-slate-300">ระบุรายละเอียดและเลือกสมุดทะเบียนประจำกอง</p>
                </div>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Header Preview Banner */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-center space-y-1">
                <span className="text-[11px] font-bold text-amber-900 block">รหัสพยัญชนะประจำกอง :</span>
                <span className="text-xl font-mono font-black text-amber-950 block">
                  {getPrefixByDept(formData.fromDept)} (ลำดับถัดไป)
                </span>
                <span className="text-[10px] text-amber-700">องค์การบริหารส่วนตำบลดอยงาม อำเภอพาน จังหวัดเชียงราย</span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">ชื่อเรื่องหนังสือส่ง * :</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น รายงานผลการตรวจสอบความมั่นคงสะพานข้ามลำน้ำ..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">กองเจ้าของเรื่อง * :</label>
                  {availableDepartments.length > 0 ? (
                    <select
                      value={formData.fromDept}
                      onChange={(e) => setFormData({ ...formData, fromDept: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold bg-white"
                    >
                      {availableDepartments.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name} {d.docPrefix ? `(${d.docPrefix})` : ""}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      value={formData.fromDept}
                      onChange={(e) => setFormData({ ...formData, fromDept: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-amber-50 text-xs font-bold text-slate-700"
                    >
                      <option value="">(ยังไม่ได้สร้างกองงานในระบบ)</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">ถึงหน่วยงาน/บุคคลผู้รับ * :</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น ผู้ว่าราชการจังหวัดเชียงราย หรือ นายอำเภอพาน"
                    value={formData.toOrg}
                    onChange={(e) => setFormData({ ...formData, toOrg: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">ประเภทหนังสือ :</label>
                  <select
                    value={formData.docType}
                    onChange={(e) => setFormData({ ...formData, docType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold bg-white"
                  >
                    <option value="หนังสือภายนอก">หนังสือภายนอก</option>
                    <option value="หนังสือภายใน">หนังสือภายใน</option>
                    <option value="คำสั่ง">คำสั่ง</option>
                    <option value="ประกาศ">ประกาศ</option>
                    <option value="หนังสือประทับตรา">หนังสือประทับตรา</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">ความเร่งด่วน :</label>
                  <select
                    value={formData.speed}
                    onChange={(e) => setFormData({ ...formData, speed: e.target.value as SpeedLevel })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold bg-white"
                  >
                    <option value="ปกติ">ปกติ</option>
                    <option value="ด่วน">ด่วน</option>
                    <option value="ด่วนมาก">ด่วนมาก</option>
                    <option value="ด่วนที่สุด">ด่วนที่สุด</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">ชั้นความลับ :</label>
                  <select
                    value={formData.secret}
                    onChange={(e) => setFormData({ ...formData, secret: e.target.value as SecretLevel })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold bg-white"
                  >
                    <option value="ปกติ">ปกติ</option>
                    <option value="ลับ">ลับ</option>
                    <option value="ลับมาก">ลับมาก</option>
                    <option value="ลับที่สุด">ลับที่สุด</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">เนื้อหา / ร่างข้อความ :</label>
                <textarea
                  rows={3}
                  placeholder="ระบุข้อความหนังสือราชการ..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="text-xs font-bold rounded-xl h-10 px-4 border-slate-300"
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl h-10 px-5 shadow-xs cursor-pointer"
                >
                  บันทึกฉบับร่าง
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: SEND / DISPATCH MODAL
      ========================================================================= */}
      {showSendModal && selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SendHorizontal className="w-5 h-5 text-emerald-300" />
                <h3 className="font-extrabold text-base">บันทึกการจัดส่งหนังสือออก</h3>
              </div>
              <button onClick={() => setShowSendModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendSubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-emerald-900 font-bold block">เลขที่หนังสือที่จะจัดส่ง :</span>
                <span className="text-base font-mono font-black text-emerald-950">{selectedDoc.docNo}</span>
                <span className="text-[11px] text-emerald-800 block mt-0.5">ถึง: {selectedDoc.toOrg}</span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">ช่องทางการจัดส่ง * :</label>
                <select
                  value={dispatchChannel}
                  onChange={(e) => setDispatchChannel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold bg-white"
                >
                  <option value="ระบบสารบรรณอิเล็กทรอนิกส์ (E-Saraban)">ระบบสารบรรณอิเล็กทรอนิกส์ (E-Saraban)</option>
                  <option value="จดหมายไปรษณีย์ด่วนพิเศษ (EMS)">จดหมายไปรษณีย์ด่วนพิเศษ (EMS)</option>
                  <option value="พนักงานส่งเอกสาร (ถือหนังสือไปเอง)">พนักงานส่งเอกสาร (ถือหนังสือไปเอง)</option>
                  <option value="ไปรษณีย์อิเล็กทรอนิกส์ (E-mail)">ไปรษณีย์อิเล็กทรอนิกส์ (E-mail)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">เลขพัสดุ / หมายเหตุติดตาม :</label>
                <input
                  type="text"
                  placeholder="เช่น EMS-DOIGAM-2569-001 หรือ ผู้รับเอกสาร..."
                  value={trackingNo}
                  onChange={(e) => setTrackingNo(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSendModal(false)}
                  className="text-xs font-bold rounded-xl h-9 px-4 border-slate-300"
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl h-9 px-5 shadow-xs cursor-pointer"
                >
                  ยืนยันการจัดส่ง
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: CANCEL OUTGOING MODAL
      ========================================================================= */}
      {showCancelModal && selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="bg-red-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ban className="w-5 h-5 text-red-300" />
                <h3 className="font-extrabold text-base">ยกเลิกหนังสือส่ง</h3>
              </div>
              <button onClick={() => setShowCancelModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCancelSubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3.5 bg-red-50 rounded-xl border border-red-200">
                <span className="text-red-900 font-bold block">เลขที่หนังสือที่ต้องการยกเลิก :</span>
                <span className="text-base font-mono font-black text-red-950 line-through">{selectedDoc.docNo}</span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">ระบุเหตุผลการยกเลิก * :</label>
                <textarea
                  rows={3}
                  required
                  placeholder="เช่น ยกเลิกโครงการตามมติที่ประชุม หรือ พิมพ์ข้อความผิดพลาด..."
                  value={cancelReasonText}
                  onChange={(e) => setCancelReasonText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCancelModal(false)}
                  className="text-xs font-bold rounded-xl h-9 px-4 border-slate-300"
                >
                  ปิด
                </Button>
                <Button
                  type="submit"
                  className="bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl h-9 px-5 shadow-xs cursor-pointer"
                >
                  ยืนยันยกเลิก
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
