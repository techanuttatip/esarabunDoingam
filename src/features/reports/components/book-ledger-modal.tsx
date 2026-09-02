"use client";

import { useState } from "react";
import {
  Printer,
  Download,
  X,
  BookOpen,
  Filter,
  FileSpreadsheet,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBookType?: "INCOMING" | "OUTGOING";
}

interface LedgerRow {
  regNo: string;
  regDate: string;
  regTime: string;
  fromOrg: string;
  toOrg: string;
  title: string;
  docNo: string;
  docDate: string;
  targetDept: string;
  receiver: string;
  note: string;
}

const mockIncomingLedger: LedgerRow[] = [
  {
    regNo: "๒๗๘๔/๒๕๖๙",
    regDate: "๒๘ ส.ค. ๖๙",
    regTime: "๐๙.๑๕ น.",
    fromOrg: "อำเภอพาน จ.เชียงราย",
    toOrg: "นายก อบต.ดอยงาม",
    title: "โครงการตรวจสอบและเตรียมความพร้อมรับมืออุทกภัยและดินโคลนถล่ม ประจำปี ๒๕๖๙",
    docNo: "ชร ๐๐๒๓.๑/ว ๔๕๘๙",
    docDate: "๒๗ ส.ค. ๖๙",
    targetDept: "กองช่าง",
    receiver: "นายวิศวกร ช่างมั่น",
    note: "ด่วนที่สุด - ปฏิบัติการทันที",
  },
  {
    regNo: "๒๗๘๓/๒๕๖๙",
    regDate: "๒๘ ส.ค. ๖๙",
    regTime: "๑๐.๓๐ น.",
    fromOrg: "กรมส่งเสริมการปกครองท้องถิ่น",
    toOrg: "นายก อบต.ดอยงาม",
    title: "แนวทางการจัดสรรงบประมาณเงินอุดหนุนเฉพาะกิจและการจัดทำข้อบัญญัติงบประมาณรายจ่าย ประจำปี ๒๕๖๙",
    docNo: "มท ๐๘๐๘.๒/ว ๕๒๓๒",
    docDate: "๒๕ ส.ค. ๖๙",
    targetDept: "กองคลัง",
    receiver: "นางวรรณา นามเงิน",
    note: "ด่วนที่สุด - เสนอผู้บริหาร",
  },
  {
    regNo: "๒๗๘๒/๒๕๖๙",
    regDate: "๒๗ ส.ค. ๖๙",
    regTime: "๑๔.๒๐ น.",
    fromOrg: "สพป. เชียงราย เขต ๒",
    toOrg: "นายก อบต.ดอยงาม",
    title: "โครงการสนับสนุนค่าใช้จ่ายการจัดการศึกษาและอาหารกลางวันโรงเรียนบ้านดอยงาม",
    docNo: "ศธ ๐๔๐๐๑/ว ๑๑๒๐",
    docDate: "๒๖ ส.ค. ๖๙",
    targetDept: "กองการศึกษาฯ",
    receiver: "นางสาวสมหญิง นามครู",
    note: "ด่วน - มอบหมายดำเนินการ",
  },
  {
    regNo: "๒๗๘๑/๒๕๖๙",
    regDate: "๒๗ ส.ค. ๖๙",
    regTime: "๑๖.๐๐ น.",
    fromOrg: "สำนักงานเกษตรอำเภอพาน",
    toOrg: "นายก อบต.ดอยงาม",
    title: "ขอความอนุเคราะห์ประชาสัมพันธ์มาตรการช่วยเหลือเกษตรกรผู้ปลูกข้าวนาปี ๒๕๖๙",
    docNo: "กษ ๑๒๐๕/ว ๐๔๑๒",
    docDate: "๒๗ ส.ค. ๖๙",
    targetDept: "สำนักปลัด",
    receiver: "นายสมศักดิ์ สุขใจ",
    note: "ปกติ - แจ้งผู้ใหญ่บ้านทุกหมู่",
  },
];

export function BookLedgerModal({ isOpen, onClose, defaultBookType = "INCOMING" }: BookLedgerModalProps) {
  const [bookType, setBookType] = useState<"INCOMING" | "OUTGOING">(defaultBookType);
  const [fiscalYear, setFiscalYear] = useState("๒๕๖๙");
  const [department, setDepartment] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="glass-card rounded-3xl bg-white max-w-6xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-slate-50/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0052FF] flex items-center justify-center border border-blue-200 shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-slate-900">
                  {bookType === "INCOMING" ? "สมุดทะเบียนหนังสือรับ (แบบ ๑)" : "สมุดทะเบียนหนังสือส่ง (แบบ ๒)"}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-100 text-blue-800">
                  มาตรฐานระเบียบสำนักนายกฯ
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                องค์การบริหารส่วนตำบลดอยงาม • พิมพ์หน้าคู่แบบเปิดกว้าง (A4 แนวนอน หน้าซ้าย-หน้าขวา)
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-200 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setBookType("INCOMING")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  bookType === "INCOMING" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                ทะเบียนรับ (แบบ ๑)
              </button>
              <button
                onClick={() => setBookType("OUTGOING")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  bookType === "OUTGOING" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                ทะเบียนส่ง (แบบ ๒)
              </button>
            </div>

            <Button size="sm" variant="signature" onClick={handlePrint} className="gap-1.5 rounded-xl shadow-xs">
              <Printer className="w-4 h-4" />
              <span>พิมพ์สมุดทะเบียน PDF (หน้าคู่)</span>
            </Button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="p-3 bg-white border-b border-slate-100 px-6 flex flex-wrap items-center justify-between text-xs text-slate-600 shrink-0">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-bold">ปีงบประมาณ:</span>
              <select
                value={fiscalYear}
                onChange={(e) => setFiscalYear(e.target.value)}
                className="p-1 rounded-lg border border-slate-200 font-bold text-slate-800 bg-slate-50 font-mono"
              >
                <option value="๒๕๖๙">พ.ศ. ๒๕๖๙</option>
                <option value="๒๕๖๘">พ.ศ. ๒๕๖๘</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-bold">สำนัก/กอง:</span>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="p-1 rounded-lg border border-slate-200 font-bold text-slate-800 bg-slate-50"
              >
                <option value="ALL">ทุกสำนัก/กอง (ทะเบียนรับกลาง)</option>
                <option value="กองช่าง">กองช่าง</option>
                <option value="กองคลัง">กองคลัง</option>
                <option value="กองการศึกษาฯ">กองการศึกษาฯ</option>
                <option value="สำนักปลัด">สำนักปลัด</option>
              </select>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            แสดงรายการที่ ๑ - ๔ จากทั้งหมด ๘๐๑ รายการ
          </div>
        </div>

        {/* 2-PAGE SPREAD TABLE VIEW (GOVERNMENT OFFICIAL FORMAT) */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-100/60 font-sans">
          <div className="bg-white rounded-2xl border border-slate-300 shadow-md p-6 max-w-5xl mx-auto space-y-4 print:shadow-none print:border-none print:p-0">
            {/* Government Official Header */}
            <div className="text-center space-y-1 pb-3 border-b-2 border-slate-900">
              <h2 className="text-lg font-bold text-slate-900 tracking-wide font-sans">
                {bookType === "INCOMING" ? "ทะเบียนหนังสือรับ (แบบ ๑)" : "ทะเบียนหนังสือส่ง (แบบ ๒)"}
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                องค์การบริหารส่วนตำบลดอยงาม อำเภอพาน จังหวัดเชียงราย • ประจำปีงบประมาณ พ.ศ. {fiscalYear}
              </p>
            </div>

            {/* The 2-Page Spread Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border-2 border-slate-900 text-xs">
                <thead>
                  {/* Top Level Grouping Headers (หน้าซ้าย vs หน้าขวา) */}
                  <tr className="bg-slate-100 border-b border-slate-900 text-slate-900 font-bold">
                    <th colSpan={5} className="py-2 px-3 border-r-2 border-slate-900 text-center font-bold text-blue-900">
                      ← หน้าซ้าย (ข้อมูลการรับและสาระสำคัญของหนังสือ)
                    </th>
                    <th colSpan={4} className="py-2 px-3 text-center font-bold text-emerald-900">
                      หน้าขวา (การส่งต่อและผลการปฏิบัติ) →
                    </th>
                  </tr>
                  {/* Column Headers */}
                  <tr className="bg-slate-50 border-b-2 border-slate-900 text-slate-900 font-bold text-center">
                    <th className="py-2 px-2 border-r border-slate-400 w-20">ทะเบียนรับที่</th>
                    <th className="py-2 px-2 border-r border-slate-400 w-24">วัน เดือน ปี / เวลา</th>
                    <th className="py-2 px-2 border-r border-slate-400 w-32">จาก</th>
                    <th className="py-2 px-2 border-r border-slate-400 w-32">ถึง</th>
                    <th className="py-2 px-3 border-r-2 border-slate-900">เรื่อง</th>
                    <th className="py-2 px-2 border-r border-slate-400 w-28">เลขที่ / วันที่หนังสือ</th>
                    <th className="py-2 px-2 border-r border-slate-400 w-24">การปฏิบัติ / กอง</th>
                    <th className="py-2 px-2 border-r border-slate-400 w-28">ผู้รับเอกสาร</th>
                    <th className="py-2 px-2 w-28">หมายเหตุ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {mockIncomingLedger.map((row, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                      {/* Left Page Columns */}
                      <td className="py-2.5 px-2 border-r border-slate-400 text-center font-mono font-bold text-[#0052FF]">
                        {row.regNo}
                      </td>
                      <td className="py-2.5 px-2 border-r border-slate-400 text-center text-[11px]">
                        <div>{row.regDate}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{row.regTime}</div>
                      </td>
                      <td className="py-2.5 px-2 border-r border-slate-400 text-slate-800 font-medium">
                        {row.fromOrg}
                      </td>
                      <td className="py-2.5 px-2 border-r border-slate-400 text-slate-800">
                        {row.toOrg}
                      </td>
                      <td className="py-2.5 px-3 border-r-2 border-slate-900 text-slate-900 font-bold leading-snug">
                        {row.title}
                      </td>

                      {/* Right Page Columns */}
                      <td className="py-2.5 px-2 border-r border-slate-400 text-center text-[11px]">
                        <div className="font-mono font-bold text-slate-800">{row.docNo}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{row.docDate}</div>
                      </td>
                      <td className="py-2.5 px-2 border-r border-slate-400 text-center font-bold text-slate-700">
                        {row.targetDept}
                      </td>
                      <td className="py-2.5 px-2 border-r border-slate-400 text-center text-slate-800">
                        {row.receiver}
                      </td>
                      <td className="py-2.5 px-2 text-slate-600 text-[11px]">
                        {row.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Official Certification Signature Block */}
            <div className="pt-6 flex justify-between items-end text-xs text-slate-700 font-medium">
              <div className="space-y-1">
                <p>พิมพ์จาก: ระบบสารบรรณอิเล็กทรอนิกส์ SmartSarabun (องค์การบริหารส่วนตำบลดอยงาม)</p>
                <p className="text-[11px] text-slate-400">วันเวลาที่พิมพ์: ๓๑ สิงหาคม ๒๕๖๙ เวลา ๑๓:๒๐ น. (เข้ารหัสความสมบูรณ์ SHA-256)</p>
              </div>

              <div className="text-center space-y-4">
                <p>ลงชื่อ..........................................................ผู้ตรวจทาน</p>
                <p>( นางสาวนภา วงศ์ใหญ่ )</p>
                <p className="text-[11px] text-slate-500">เจ้าพนักงานธุรการชำนาญงาน</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>รับรองความถูกต้องตามระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ พ.ศ. ๒๕๒๖</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl">
              ปิดหน้าต่าง
            </Button>
            <Button variant="signature" size="sm" onClick={handlePrint} className="gap-1.5 rounded-xl shadow-xs">
              <Printer className="w-4 h-4" />
              <span>พิมพ์สมุดทะเบียน</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
