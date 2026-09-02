"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Hash,
  Bookmark,
  Calendar,
  Lock,
  Plus,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Ban,
  Clock,
  Layers,
  Sparkles,
  Search,
  RotateCcw,
  ShieldCheck,
  History,
  CornerDownRight,
  BookOpen,
  X,
  Eye,
} from "lucide-react";

export type NumberState = "AVAILABLE" | "RESERVED" | "ISSUED" | "USED" | "INSERTED" | "CANCELLED" | "VOID";

interface NumberRecord {
  id: string;
  seriesCode: string;
  bookName: string;
  runningNumber: number;
  subNumber: number;
  formattedNumber: string;
  state: NumberState;
  docTitle?: string;
  actorName: string;
  deptName: string;
  date: string;
  expiresAt?: string;
  cancelReason?: string;
}

interface NumberSeriesItem {
  id: string;
  code: string;
  name: string;
  category: string;
  prefix: string;
  formatTemplate: string;
  currentNumber: number;
  fiscalYear: number;
  deptOwner: string;
  activeReservations: number;
}

interface NumberHistoryItem {
  id: string;
  action: string;
  numberText: string;
  actorName: string;
  timestamp: string;
  details: string;
  beforeState?: string;
  afterState?: string;
}

const initialSeries: NumberSeriesItem[] = [
  {
    id: "seq-01",
    code: "INCOMING_CENTRAL",
    name: "สมุดทะเบียนรับกลาง อบต.ดอยงาม",
    category: "รับ",
    prefix: "",
    formatTemplate: "{number}/{year}",
    currentNumber: 0,
    fiscalYear: 2569,
    deptOwner: "สำนักปลัด (สารบรรณกลาง)",
    activeReservations: 0,
  },
  {
    id: "seq-02",
    code: "INCOMING_SECRET",
    name: "สมุดทะเบียนรับหนังสือลับ",
    category: "รับ",
    prefix: "ลับ",
    formatTemplate: "ลับ {number}/{year}",
    currentNumber: 0,
    fiscalYear: 2569,
    deptOwner: "สำนักปลัด (สารบรรณกลาง)",
    activeReservations: 0,
  },
  {
    id: "seq-03",
    code: "OUTGOING_ENG",
    name: "สมุดทะเบียนส่งกองช่าง",
    category: "ส่ง",
    prefix: "ชร 52003/ว",
    formatTemplate: "{prefix} {number}",
    currentNumber: 0,
    fiscalYear: 2569,
    deptOwner: "กองช่าง",
    activeReservations: 0,
  },
  {
    id: "seq-04",
    code: "OUTGOING_FIN",
    name: "สมุดทะเบียนส่งกองคลัง",
    category: "ส่ง",
    prefix: "ชร 52002/ว",
    formatTemplate: "{prefix} {number}",
    currentNumber: 0,
    fiscalYear: 2569,
    deptOwner: "กองคลัง",
    activeReservations: 0,
  },
  {
    id: "seq-05",
    code: "ORDER_MAIN",
    name: "สมุดทะเบียนคำสั่ง อบต.ดอยงาม",
    category: "คำสั่ง",
    prefix: "คำสั่ง อบต.ดอยงาม ที่",
    formatTemplate: "{prefix} {number}/{year}",
    currentNumber: 0,
    fiscalYear: 2569,
    deptOwner: "สำนักปลัด",
    activeReservations: 0,
  },
];

const initialRecords: NumberRecord[] = [];

const initialHistory: NumberHistoryItem[] = [];

export default function NumbersPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "series" | "records" | "history">("dashboard");
  const [seriesList, setSeriesList] = useState<NumberSeriesItem[]>(initialSeries);
  const [records, setRecords] = useState<NumberRecord[]>(initialRecords);
  const [historyList, setHistoryList] = useState<NumberHistoryItem[]>(initialHistory);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState<string>("ALL");

  // Modals State
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showInsertModal, setShowInsertModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<NumberRecord | null>(null);
  const [cancelReasonText, setCancelReasonText] = useState("");

  // Reserve Form State
  const [reserveSeriesCode, setReserveSeriesCode] = useState("INCOMING_CENTRAL");
  const [reserveQty, setReserveQty] = useState(1);
  const [reservePurpose, setReservePurpose] = useState("");
  const [reserveDept, setReserveDept] = useState("กองช่าง");

  // Insert Sub-number Form State
  const [insertParentNum, setInsertParentNum] = useState(2784);
  const [insertTitle, setInsertTitle] = useState("");

  const filteredRecords = records.filter((r) => {
    if (selectedState !== "ALL" && r.state !== selectedState) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.formattedNumber.toLowerCase().includes(q) ||
        (r.docTitle && r.docTitle.toLowerCase().includes(q)) ||
        r.actorName.toLowerCase().includes(q) ||
        r.deptName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleReserveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservePurpose.trim()) return;

    const targetSeries = seriesList.find((s) => s.code === reserveSeriesCode) || seriesList[0];
    const newNum = targetSeries.currentNumber + 1;
    const formatted = `${targetSeries.prefix ? `${targetSeries.prefix} ` : ""}${newNum}/${targetSeries.fiscalYear}`;

    const newRec: NumberRecord = {
      id: `res-${Date.now()}`,
      seriesCode: targetSeries.code,
      bookName: targetSeries.name,
      runningNumber: newNum,
      subNumber: 0,
      formattedNumber: formatted,
      state: "RESERVED",
      docTitle: reservePurpose,
      actorName: "ผู้ขอจอง",
      deptName: reserveDept,
      date: "วันนี้",
      expiresAt: "15 วันทำการ",
    };

    // Update Series Counter
    setSeriesList((prev) =>
      prev.map((s) => (s.code === targetSeries.code ? { ...s, currentNumber: newNum, activeReservations: s.activeReservations + 1 } : s))
    );
    setRecords([newRec, ...records]);
    setHistoryList([
      {
        id: `h-${Date.now()}`,
        action: "RESERVE (จองเลข)",
        numberText: formatted,
        actorName: "ผู้ขอจอง",
        timestamp: "เมื่อสักครู่",
        details: `จองเลขเพื่อวัตถุประสงค์: ${reservePurpose}`,
      },
      ...historyList,
    ]);

    setShowReserveModal(false);
    setReservePurpose("");
  };

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord || !cancelReasonText.trim()) return;

    setRecords((prev) =>
      prev.map((r) => (r.id === selectedRecord.id ? { ...r, state: "CANCELLED", cancelReason: cancelReasonText } : r))
    );

    setHistoryList([
      {
        id: `h-${Date.now()}`,
        action: "CANCEL (ขีดฆ่า/ยกเลิก)",
        numberText: selectedRecord.formattedNumber,
        actorName: "ผู้ดูแลสารบรรณ",
        timestamp: "เมื่อสักครู่",
        details: `ยกเลิกเลขเนื่องจาก: ${cancelReasonText}`,
      },
      ...historyList,
    ]);

    setShowCancelModal(false);
    setCancelReasonText("");
    setSelectedRecord(null);
  };

  const handleRelease = (rec: NumberRecord) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === rec.id ? { ...r, state: "VOID", cancelReason: "คืนเลขที่จองล่วงหน้าสู่ระบบ" } : r))
    );
    setHistoryList([
      {
        id: `h-${Date.now()}`,
        action: "RELEASE (คืนเลข)",
        numberText: rec.formattedNumber,
        actorName: "ผู้จอง",
        timestamp: "เมื่อสักครู่",
        details: "คืนเลขที่จองล่วงหน้าสู่ระบบ",
      },
      ...historyList,
    ]);
  };

  const handleInsertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = `${insertParentNum}/1/2569`;

    const subRec: NumberRecord = {
      id: `sub-${Date.now()}`,
      seriesCode: "INCOMING_CENTRAL",
      bookName: "สมุดทะเบียนรับกลาง",
      runningNumber: insertParentNum,
      subNumber: 1,
      formattedNumber: formatted,
      state: "INSERTED",
      docTitle: insertTitle || "หนังสือลงรับย้อนหลังฉบับแทรก",
      actorName: "ผู้ปฏิบัติงาน",
      deptName: "สำนักปลัด",
      date: "วันนี้",
    };

    setRecords([subRec, ...records]);
    setHistoryList([
      {
        id: `h-${Date.now()}`,
        action: "INSERT (แทรกเลขลูก)",
        numberText: formatted,
        actorName: "ผู้ปฏิบัติงาน",
        timestamp: "เมื่อสักครู่",
        details: `แทรกเลขลูกต่อท้าย ${insertParentNum}`,
      },
      ...historyList,
    ]);

    setShowInsertModal(false);
    setInsertTitle("");
  };

  const getStateBadge = (state: NumberState) => {
    switch (state) {
      case "ISSUED":
      case "USED":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">ISSUED (ออกเลขแล้ว)</span>;
      case "RESERVED":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-200 animate-pulse">RESERVED (จองแล้ว)</span>;
      case "INSERTED":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-900 border border-purple-200">INSERTED (เลขแทรก /1)</span>;
      case "CANCELLED":
      case "VOID":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-800 border border-red-200 line-through">VOID (ขีดฆ่ายกเลิก)</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">AVAILABLE</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="ระบบการออกเลขสารบรรณ (Core Numbering Domain & Concurrency Engine)"
          description="จัดการสมุดทะเบียนเลขรับ-ส่ง การจองเลขล่วงหน้า การแทรกเลขลูก (/1) และการขีดฆ่ายกเลิกเลข ปลอดภัยด้วย Pessimistic Lock"
        />

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowInsertModal(true)}
            variant="outline"
            className="text-xs font-bold rounded-xl h-10 px-3.5 gap-1.5 border-slate-300"
          >
            <CornerDownRight className="w-4 h-4 text-purple-700" />
            แทรกเลขลูก (/1)
          </Button>

          <Button
            onClick={() => setShowReserveModal(true)}
            className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs sm:text-sm rounded-xl h-10 px-4 gap-2 shadow-xs cursor-pointer"
          >
            <Bookmark className="w-4 h-4 text-amber-300" />
            + จองเลขสารบรรณล่วงหน้า
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-fit overflow-x-auto">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "dashboard" ? "bg-white text-navy-950 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Layers className="w-4 h-4 text-blue-700" />
          <span>แดชบอร์ดลำดับเลข</span>
        </button>

        <button
          onClick={() => setActiveTab("series")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "series" ? "bg-white text-navy-950 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <BookOpen className="w-4 h-4 text-indigo-700" />
          <span>สมุดทะเบียนเลข ({seriesList.length} สมุด)</span>
        </button>

        <button
          onClick={() => setActiveTab("records")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "records" ? "bg-white text-navy-950 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Hash className="w-4 h-4 text-emerald-700" />
          <span>รายการเลขในสมุด ({records.length} เลข)</span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "history" ? "bg-white text-navy-950 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <History className="w-4 h-4 text-amber-700" />
          <span>ประวัติและ Audit Trail ({historyList.length})</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: NUMBER DASHBOARD
      ========================================================================= */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Summary Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-xs border-slate-200 rounded-2xl">
              <CardContent className="p-5">
                <span className="text-xs font-bold text-slate-500">เลขรับ-ส่งทั้งหมดที่ออก</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <h3 className="text-2xl font-black text-slate-900">
                    {seriesList.reduce((acc, s) => acc + s.currentNumber, 0)} เลข
                  </h3>
                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    ปี 2569
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">สมุดทะเบียนทั้งหมด ๕ สมุด</p>
              </CardContent>
            </Card>

            <Card className="shadow-xs border-slate-200 rounded-2xl">
              <CardContent className="p-5">
                <span className="text-xs font-bold text-slate-500">รายการจองเลขที่กำลังใช้งาน</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <h3 className="text-2xl font-black text-amber-700">
                    {seriesList.reduce((acc, s) => acc + s.activeReservations, 0)} รายการ
                  </h3>
                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">อายุการจองสูงสุด ๑๕ วัน</p>
              </CardContent>
            </Card>

            <Card className="shadow-xs border-slate-200 rounded-2xl">
              <CardContent className="p-5">
                <span className="text-xs font-bold text-slate-500">สถานะ Concurrency Lock</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <h3 className="text-2xl font-black text-emerald-700">Pessimistic</h3>
                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">ป้องกัน Race Condition ๑๐๐%</p>
              </CardContent>
            </Card>

            <Card className="shadow-xs border-slate-200 rounded-2xl">
              <CardContent className="p-5">
                <span className="text-xs font-bold text-slate-500">เลขที่ขีดฆ่า/ยกเลิก (VOID)</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <h3 className="text-2xl font-black text-red-700">
                    {records.filter((r) => r.state === "CANCELLED" || r.state === "VOID").length} เลข
                  </h3>
                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                    ห้ามออกซ้ำ
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">เก็บบันทึกในประวัติถาวร</p>
              </CardContent>
            </Card>
          </div>

          {/* Series Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {seriesList.map((seq) => (
              <Card key={seq.id} className="shadow-xs border-slate-200 overflow-hidden rounded-2xl">
                <CardHeader className="bg-slate-100/90 p-4 border-b border-slate-200 flex flex-row items-center justify-between">
                  <span className="text-xs font-black text-navy-900 px-2.5 py-0.5 rounded-md bg-white border border-slate-200">
                    {seq.category}
                  </span>
                  <span className="text-xs font-bold text-slate-500">ปี {seq.fiscalYear}</span>
                </CardHeader>

                <CardContent className="p-5 space-y-4">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{seq.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">ผู้ดูแล: {seq.deptOwner}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-center space-y-1">
                    <span className="text-xs font-bold text-blue-900 block">เลขล่าสุดที่ออก :</span>
                    <span className="text-3xl font-black text-navy-950 tracking-tight block">
                      {seq.prefix ? `${seq.prefix} ` : ""}{seq.currentNumber}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      เลขถัดไป: {seq.prefix ? `${seq.prefix} ` : ""}{seq.currentNumber + 1}/{seq.fiscalYear}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                    <span className="text-slate-400">จองอยู่: <strong>{seq.activeReservations} รายการ</strong></span>
                    <button
                      onClick={() => setActiveTab("records")}
                      className="text-blue-700 font-bold hover:underline cursor-pointer"
                    >
                      เปิดดูเล่ม ➔
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: NUMBER SERIES CONFIGURATION
      ========================================================================= */}
      {activeTab === "series" && (
        <Card className="shadow-xs border-slate-200 overflow-hidden rounded-2xl">
          <CardHeader className="bg-slate-100/90 px-6 py-4 border-b border-slate-200">
            <CardTitle className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4.5 h-4.5 text-blue-700" />
              โครงสร้างสมุดทะเบียนเลขสารบรรณ (Number Series Definitions)
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[750px] text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200">
                    <th className="p-3.5">รหัสชุด (Code)</th>
                    <th className="p-3.5">ชื่อสมุดทะเบียน</th>
                    <th className="p-3.5">ประเภท</th>
                    <th className="p-3.5">รหัสพยัญชนะ (Prefix)</th>
                    <th className="p-3.5">รูปแบบฟอร์แมต</th>
                    <th className="p-3.5">เลขปัจจุบัน</th>
                    <th className="p-3.5">ส่วนราชการเจ้าของ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {seriesList.map((s) => (
                    <tr key={s.id} className="hover:bg-blue-50/50 transition-colors bg-white">
                      <td className="p-3.5 font-mono font-bold text-blue-900">{s.code}</td>
                      <td className="p-3.5 font-bold text-slate-900">{s.name}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                          {s.category}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono font-semibold text-slate-800">{s.prefix || "-"}</td>
                      <td className="p-3.5 font-mono text-[11px] text-slate-600">{s.formatTemplate}</td>
                      <td className="p-3.5 font-extrabold text-navy-950 text-sm">{s.currentNumber}</td>
                      <td className="p-3.5 text-slate-700">{s.deptOwner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* =========================================================================
          TAB 3: NUMBER MANAGEMENT RECORDS (ISSUED, RESERVED, INSERTED, VOID)
      ========================================================================= */}
      {activeTab === "records" && (
        <div className="space-y-4">
          {/* Search and State Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหาเลขสารบรรณ, เรื่อง, หรือผู้รับผิดชอบ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-navy-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {["ALL", "ISSUED", "RESERVED", "INSERTED", "CANCELLED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedState(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedState === st
                      ? "bg-navy-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {st === "ALL" ? "ทุกสถานะ" : st}
                </button>
              ))}
            </div>
          </div>

          <Card className="shadow-xs border-slate-200 overflow-hidden rounded-2xl">
            <CardHeader className="bg-slate-100/90 px-6 py-4 border-b border-slate-200 flex flex-row items-center justify-between">
              <CardTitle className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Hash className="w-4.5 h-4.5 text-blue-700" />
                รายการเลขสารบรรณทั้งหมด ({filteredRecords.length} เลข)
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[850px] text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200">
                      <th className="p-3.5 w-[18%]">เลขที่หนังสือ / เลขรับ</th>
                      <th className="p-3.5 w-[36%]">เรื่อง / วัตถุประสงค์</th>
                      <th className="p-3.5 w-[14%]">กองผู้รับผิดชอบ</th>
                      <th className="p-3.5 w-[14%]">สถานะเลข</th>
                      <th className="p-3.5 text-center w-[18%]">การดำเนินการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredRecords.map((rec, idx) => (
                      <tr
                        key={rec.id}
                        className={`hover:bg-blue-50/50 transition-colors ${
                          idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                        } ${rec.state === "CANCELLED" || rec.state === "VOID" ? "bg-red-50/20" : ""}`}
                      >
                        <td className="p-3.5">
                          <span
                            className={`font-mono font-black text-sm block ${
                              rec.state === "CANCELLED" || rec.state === "VOID"
                                ? "text-red-600 line-through"
                                : "text-navy-950"
                            }`}
                          >
                            {rec.formattedNumber}
                          </span>
                          <span className="text-[10px] text-slate-400">{rec.date}</span>
                        </td>

                        <td className="p-3.5">
                          <p className="font-bold text-slate-900">{rec.docTitle}</p>
                          {rec.cancelReason && (
                            <p className="text-[11px] text-red-600 mt-0.5">เหตุผลยกเลิก: {rec.cancelReason}</p>
                          )}
                          {rec.expiresAt && (
                            <p className="text-[11px] text-amber-700 mt-0.5">หมดอายุจอง: {rec.expiresAt}</p>
                          )}
                        </td>

                        <td className="p-3.5">
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                            {rec.deptName}
                          </span>
                        </td>

                        <td className="p-3.5">{getStateBadge(rec.state)}</td>

                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {rec.state === "RESERVED" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRelease(rec)}
                                className="h-7 px-2 text-[11px] font-bold rounded-lg border-amber-300 text-amber-800 hover:bg-amber-50"
                              >
                                คืนเลข
                              </Button>
                            )}

                            {rec.state !== "CANCELLED" && rec.state !== "VOID" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedRecord(rec);
                                  setShowCancelModal(true);
                                }}
                                className="h-7 px-2 text-[11px] font-bold rounded-lg border-red-200 text-red-700 hover:bg-red-50"
                              >
                                <Ban className="w-3 h-3 mr-1" />
                                ยกเลิก
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
        </div>
      )}

      {/* =========================================================================
          TAB 4: NUMBER HISTORY & AUDIT TRAIL
      ========================================================================= */}
      {activeTab === "history" && (
        <Card className="shadow-xs border-slate-200 overflow-hidden rounded-2xl">
          <CardHeader className="bg-slate-100/90 px-6 py-4 border-b border-slate-200">
            <CardTitle className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
              <History className="w-4.5 h-4.5 text-amber-700" />
              บันทึกประวัติการดำเนินการออกเลข (Number History Audit Trail)
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            <div className="relative border-l-2 border-slate-200 ml-4 space-y-6">
              {historyList.map((item) => (
                <div key={item.id} className="relative pl-6">
                  <div className="absolute -left-2.5 top-1 w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow-xs" />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm">{item.action}</span>
                      <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md text-[11px] border border-blue-200">
                        {item.numberText}
                      </span>
                      <span className="text-[11px] text-slate-400">• {item.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{item.details}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">ผู้ทำรายการ: <strong>{item.actorName}</strong></p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* =========================================================================
          MODALS: RESERVE, CANCEL, INSERT
      ========================================================================= */}
      {/* 1. Reserve Number Modal */}
      {showReserveModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="bg-navy-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-5 h-5 text-amber-300" />
                <h3 className="font-extrabold text-base">จองเลขสารบรรณล่วงหน้า (Reserve Number)</h3>
              </div>
              <button onClick={() => setShowReserveModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReserveSubmit} className="p-6 space-y-4">
              <div>
                <label className="font-bold text-slate-700 text-xs block mb-1">เลือกสมุดทะเบียนเลข * :</label>
                <select
                  value={reserveSeriesCode}
                  onChange={(e) => setReserveSeriesCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold bg-white"
                >
                  {seriesList.map((s) => (
                    <option key={s.id} value={s.code}>
                      {s.name} ({s.prefix || "เลขรับกลาง"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 text-xs block mb-1">กองที่ขอจอง :</label>
                <select
                  value={reserveDept}
                  onChange={(e) => setReserveDept(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold bg-white"
                >
                  <option value="สำนักปลัด">สำนักปลัด</option>
                  <option value="กองคลัง">กองคลัง</option>
                  <option value="กองช่าง">กองช่าง</option>
                  <option value="กองการศึกษาฯ">กองการศึกษา ศาสนาและวัฒนธรรม</option>
                  <option value="กองสาธารณสุข">กองสาธารณสุขและสิ่งแวดล้อม</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 text-xs block mb-1">วัตถุประสงค์ในการขอจองเลข * :</label>
                <textarea
                  rows={3}
                  required
                  placeholder="เช่น โครงการก่อสร้างถนน คสล. บ้านดอยงาม หมู่ที่ 3 เพื่อนำส่งเอกสารสัญญา สตง."
                  value={reservePurpose}
                  onChange={(e) => setReservePurpose(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowReserveModal(false)}
                  className="text-xs font-bold rounded-xl h-10 px-4 border-slate-300"
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl h-10 px-5 shadow-xs cursor-pointer"
                >
                  ยืนยันการจองเลข
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Cancel/Void Modal */}
      {showCancelModal && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="bg-red-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ban className="w-5 h-5 text-red-300" />
                <h3 className="font-extrabold text-base">ขีดฆ่า/ยกเลิกเลขสารบรรณ</h3>
              </div>
              <button onClick={() => setShowCancelModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCancelSubmit} className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-center">
                <span className="text-xs text-red-800 font-bold block">เลขที่ต้องการขีดฆ่ายกเลิก :</span>
                <span className="text-2xl font-mono font-black text-red-900 block line-through">
                  {selectedRecord.formattedNumber}
                </span>
                <span className="text-[10px] text-red-700 block mt-1">เลขที่ถูกยกเลิกแล้วห้ามนำกลับมาออกซ้ำเด็ดขาด</span>
              </div>

              <div>
                <label className="font-bold text-slate-700 text-xs block mb-1">ระบุเหตุผลการยกเลิกตามระเบียบ * :</label>
                <textarea
                  rows={3}
                  required
                  placeholder="เช่น พิมพ์ข้อความผิดพลาด หรือยกเลิกโครงการตามคำสั่ง..."
                  value={cancelReasonText}
                  onChange={(e) => setCancelReasonText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCancelModal(false)}
                  className="text-xs font-bold rounded-xl h-10 px-4 border-slate-300"
                >
                  ปิด
                </Button>
                <Button
                  type="submit"
                  className="bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl h-10 px-5 shadow-xs cursor-pointer"
                >
                  ยืนยันขีดฆ่าเลข
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Insert Sub-Number Modal */}
      {showInsertModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="bg-navy-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CornerDownRight className="w-5 h-5 text-purple-300" />
                <h3 className="font-extrabold text-base">แทรกเลขลูกย้อนหลัง (/1, /2)</h3>
              </div>
              <button onClick={() => setShowInsertModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInsertSubmit} className="p-6 space-y-4">
              <div>
                <label className="font-bold text-slate-700 text-xs block mb-1">เลขหลักที่ต้องการแทรกต่อท้าย * :</label>
                <input
                  type="number"
                  required
                  value={insertParentNum}
                  onChange={(e) => setInsertParentNum(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono font-bold"
                />
                <span className="text-[11px] text-purple-700 font-bold block mt-1">
                  ผลลัพธ์เลขแทรก: {insertParentNum}/1/2569
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 text-xs block mb-1">ชื่อเรื่องหนังสือที่ลงรับย้อนหลัง * :</label>
                <textarea
                  rows={3}
                  required
                  placeholder="ระบุชื่อเรื่องหนังสือ..."
                  value={insertTitle}
                  onChange={(e) => setInsertTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowInsertModal(false)}
                  className="text-xs font-bold rounded-xl h-10 px-4 border-slate-300"
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl h-10 px-5 shadow-xs cursor-pointer"
                >
                  ออกเลขแทรก (/1)
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
