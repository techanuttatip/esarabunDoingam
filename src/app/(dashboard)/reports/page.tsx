"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  Clock,
  FileText,
  Send,
  Inbox,
  CheckCircle2,
  Download,
  Calendar,
  Building,
  Sparkles,
  Printer,
  FileSpreadsheet,
  AlertTriangle,
  Bookmark,
  Layers,
  Hash,
  Filter,
  Check,
  ShieldCheck,
  CornerDownRight,
  Ban,
  BookOpen,
} from "lucide-react";
import { BookLedgerModal } from "@/features/reports/components/book-ledger-modal";

export interface DepartmentReportItem {
  name: string;
  code: string;
  incoming: number;
  outgoing: number;
  completed: number;
  pending: number;
  overdue: number;
  rate: string;
}

const mockDeptReports: DepartmentReportItem[] = [
  { name: "สำนักปลัด (สารบรรณกลาง)", code: "ชร 52001", incoming: 120, outgoing: 85, completed: 195, pending: 10, overdue: 0, rate: "95%" },
  { name: "กองคลัง", code: "ชร 52002", incoming: 95, outgoing: 64, completed: 145, pending: 14, overdue: 1, rate: "91%" },
  { name: "กองช่าง", code: "ชร 52003", incoming: 142, outgoing: 110, completed: 230, pending: 22, overdue: 0, rate: "91%" },
  { name: "กองการศึกษา ศาสนาและวัฒนธรรม", code: "ชร 52004", incoming: 65, outgoing: 40, completed: 100, pending: 5, overdue: 0, rate: "95%" },
  { name: "กองสาธารณสุขและสิ่งแวดล้อม", code: "ชร 52005", incoming: 48, outgoing: 32, completed: 75, pending: 5, overdue: 0, rate: "94%" },
];

const mockOverdueList = [
  {
    id: "ov-1",
    docNo: "มท 0808.2/ว 5232",
    regNo: "2783/2569",
    title: "แนวทางการจัดสรรงบประมาณเงินอุดหนุนเฉพาะกิจและการจัดทำข้อบัญญัติงบประมาณรายจ่าย ประจำปี 2569",
    dept: "กองคลัง",
    staff: "นางวรรณา นามเงิน",
    dueDate: "25 ส.ค. 2569",
    daysOverdue: 6,
    speed: "ด่วนที่สุด",
  },
];

export default function ReportsPage() {
  const [activeReportTab, setActiveReportTab] = useState<
    "summary" | "incoming" | "outgoing" | "numbering" | "departments" | "overdue"
  >("summary");

  const [dateRange, setDateRange] = useState("month");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedYear, setSelectedYear] = useState("2569");
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);

  // Summary Metrics
  const totalIncoming = 470;
  const totalOutgoing = 331;
  const totalDocuments = totalIncoming + totalOutgoing;
  const totalCompleted = 745;
  const totalPending = 56;
  const totalOverdue = 1;
  const slaRate = "93.0%";

  // Numbering Metrics
  const numberingStats = {
    totalIssued: 801,
    activeReserved: 4,
    insertedSub: 1,
    cancelledVoid: 1,
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "สำนัก/กอง,รหัส,หนังสือเข้า,หนังสือส่ง,เสร็จสิ้น,ค้างดำเนินการ,เกินกำหนด,อัตราสำเร็จ\n" +
      mockDeptReports
        .map(
          (d) =>
            `"${d.name}",${d.code},${d.incoming},${d.outgoing},${d.completed},${d.pending},${d.overdue},${d.rate}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `รายงานสารบรรณ_อบต_ดอยงาม_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Export Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="ระบบรายงานสถิติและผลการดำเนินงาน (Reporting & Analytics Module)"
          description="สรุปรายงานสมุดทะเบียนรับ-ส่ง สถิติการใช้เลขสารบรรณ ผลงานรายกอง และดัชนีประสิทธิภาพ SLA องค์การบริหารส่วนตำบลดอยงาม"
        />

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="signature"
            onClick={() => setIsLedgerModalOpen(true)}
            className="h-10 text-xs font-bold gap-1.5 rounded-xl shadow-accent hover:shadow-accent-lg cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>พิมพ์สมุดทะเบียน PDF (หน้าคู่)</span>
          </Button>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-800 focus:outline-none h-10"
          >
            <option value="2569">ปีงบประมาณ 2569</option>
            <option value="2568">ปีงบประมาณ 2568</option>
          </select>

          <Button
            size="sm"
            variant="outline"
            onClick={handlePrint}
            className="h-10 text-xs font-bold gap-1.5 rounded-xl border-slate-300 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-700" />
            พิมพ์สรุป
          </Button>

          <Button
            size="sm"
            onClick={handleExportCsv}
            className="h-10 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white gap-1.5 rounded-xl shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            ส่งออก Excel / CSV
          </Button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> ช่วงเวลา :
          </span>
          {[
            { id: "today", label: "วันนี้" },
            { id: "week", label: "สัปดาห์นี้" },
            { id: "month", label: "เดือนนี้ (ส.ค. 69)" },
            { id: "quarter", label: "ไตรมาส 4" },
            { id: "year", label: "ทั้งปีงบประมาณ" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDateRange(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                dateRange === tab.id
                  ? "bg-navy-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 bg-white"
          >
            <option value="ALL">ทุกสำนัก/กอง (ทั้งองค์กร)</option>
            <option value="สำนักปลัด">สำนักปลัด (ชร 52001)</option>
            <option value="กองคลัง">กองคลัง (ชร 52002)</option>
            <option value="กองช่าง">กองช่าง (ชร 52003)</option>
            <option value="กองการศึกษาฯ">กองการศึกษาฯ (ชร 52004)</option>
            <option value="กองสาธารณสุข">กองสาธารณสุข (ชร 52005)</option>
          </select>
        </div>
      </div>

      {/* Executive Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-xs border-slate-200 rounded-2xl">
          <CardContent className="p-5">
            <span className="text-xs font-bold text-slate-500">หนังสือทั้งหมดที่ดำเนินการ</span>
            <div className="mt-2 flex items-baseline justify-between">
              <h3 className="text-2xl font-black text-slate-900">{totalDocuments} เรื่อง</h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                เข้า {totalIncoming} / ส่ง {totalOutgoing}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">สมุดทะเบียน อบต.ดอยงาม</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200 rounded-2xl">
          <CardContent className="p-5">
            <span className="text-xs font-bold text-slate-500">อัตราความสำเร็จตามกำหนด (SLA)</span>
            <div className="mt-2 flex items-baseline justify-between">
              <h3 className="text-2xl font-black text-emerald-700">{slaRate}</h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                เสร็จสิ้น {totalCompleted}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">ความเร็วเฉลี่ย 1.2 วัน/เรื่อง</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200 rounded-2xl">
          <CardContent className="p-5">
            <span className="text-xs font-bold text-slate-500">งานอยู่ระหว่างดำเนินการ</span>
            <div className="mt-2 flex items-baseline justify-between">
              <h3 className="text-2xl font-black text-amber-700">{totalPending} เรื่อง</h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                In-Progress
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">อยู่ในเกณฑ์ระยะเวลามาตรฐาน</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200 rounded-2xl">
          <CardContent className="p-5">
            <span className="text-xs font-bold text-slate-500">งานเกินกำหนดเวลา (SLA Overdue)</span>
            <div className="mt-2 flex items-baseline justify-between">
              <h3 className="text-2xl font-black text-red-700">{totalOverdue} เรื่อง</h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                ต้องติดตามด่วน
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">กองคลัง 1 เรื่อง</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-fit overflow-x-auto">
        <button
          onClick={() => setActiveReportTab("summary")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeReportTab === "summary" ? "bg-white text-navy-950 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          ภาพรวมและผลงานรายกอง
        </button>

        <button
          onClick={() => setActiveReportTab("numbering")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeReportTab === "numbering" ? "bg-white text-navy-950 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          สถิติการใช้เลขสารบรรณ ({numberingStats.totalIssued} เลข)
        </button>

        <button
          onClick={() => setActiveReportTab("overdue")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeReportTab === "overdue" ? "bg-white text-navy-950 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          ติดตามงานค้าง & เกินกำหนด ({totalOverdue})
        </button>
      </div>

      {/* =========================================================================
          TAB 1: DEPARTMENT BREAKDOWN
      ========================================================================= */}
      {activeReportTab === "summary" && (
        <Card className="shadow-xs border-slate-200 rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-100/90 px-6 py-4 border-b border-slate-200">
            <CardTitle className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-700" />
              รายงานปริมาณงานและอัตราความสำเร็จแยกตามสำนัก/กอง (Department Performance)
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px] text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200">
                    <th className="p-3.5">สำนัก / กอง</th>
                    <th className="p-3.5">รหัสพยัญชนะ</th>
                    <th className="p-3.5 text-center">หนังสือเข้า</th>
                    <th className="p-3.5 text-center">หนังสือส่ง</th>
                    <th className="p-3.5 text-center">เสร็จสิ้น</th>
                    <th className="p-3.5 text-center">ค้างอยู่</th>
                    <th className="p-3.5 text-center">เกินกำหนด</th>
                    <th className="p-3.5 text-center">อัตราสำเร็จ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {mockDeptReports.map((dept, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-blue-50/50 transition-colors ${
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                      }`}
                    >
                      <td className="p-3.5 font-bold text-slate-900">{dept.name}</td>
                      <td className="p-3.5 font-mono text-blue-900 font-bold">{dept.code}</td>
                      <td className="p-3.5 text-center font-semibold text-slate-800">{dept.incoming}</td>
                      <td className="p-3.5 text-center font-semibold text-slate-800">{dept.outgoing}</td>
                      <td className="p-3.5 text-center font-bold text-emerald-700">{dept.completed}</td>
                      <td className="p-3.5 text-center font-semibold text-amber-700">{dept.pending}</td>
                      <td className="p-3.5 text-center">
                        {dept.overdue > 0 ? (
                          <span className="font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                            {dept.overdue}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        <span className="font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full text-xs">
                          {dept.rate}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* =========================================================================
          TAB 2: NUMBERING STATS
      ========================================================================= */}
      {activeReportTab === "numbering" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card className="shadow-xs border-slate-200 rounded-2xl p-4 bg-emerald-50/50 border-emerald-200">
              <span className="text-xs font-bold text-emerald-800">เลขที่ออกเป็นทางการ (ISSUED)</span>
              <h4 className="text-2xl font-black text-emerald-950 mt-1">{numberingStats.totalIssued} เลข</h4>
              <p className="text-[10px] text-emerald-700 mt-0.5">ใช้งานครบถ้วน</p>
            </Card>

            <Card className="shadow-xs border-slate-200 rounded-2xl p-4 bg-amber-50/50 border-amber-200">
              <span className="text-xs font-bold text-amber-800">เลขที่จองล่วงหน้า (RESERVED)</span>
              <h4 className="text-2xl font-black text-amber-950 mt-1">{numberingStats.activeReserved} เลข</h4>
              <p className="text-[10px] text-amber-700 mt-0.5">มีอายุ 15 วันทำการ</p>
            </Card>

            <Card className="shadow-xs border-slate-200 rounded-2xl p-4 bg-purple-50/50 border-purple-200">
              <span className="text-xs font-bold text-purple-800">เลขแทรกย้อนหลัง (INSERTED /1)</span>
              <h4 className="text-2xl font-black text-purple-950 mt-1">{numberingStats.insertedSub} เลข</h4>
              <p className="text-[10px] text-purple-700 mt-0.5">2780/1/2569</p>
            </Card>

            <Card className="shadow-xs border-slate-200 rounded-2xl p-4 bg-red-50/50 border-red-200">
              <span className="text-xs font-bold text-red-800">เลขที่ขีดฆ่ายกเลิก (VOID)</span>
              <h4 className="text-2xl font-black text-red-950 mt-1">{numberingStats.cancelledVoid} เลข</h4>
              <p className="text-[10px] text-red-700 mt-0.5">ห้ามนำกลับมาออกซ้ำ</p>
            </Card>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: OVERDUE TRACKER
      ========================================================================= */}
      {activeReportTab === "overdue" && (
        <Card className="shadow-xs border-slate-200 rounded-2xl overflow-hidden">
          <CardHeader className="bg-red-50 px-6 py-4 border-b border-red-200 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-extrabold text-red-950 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              รายการหนังสือที่เกินกำหนดเวลาปฏิบัติราชการ (SLA Overdue Tracking)
            </CardTitle>
            <span className="text-xs font-bold text-red-800 bg-white px-2.5 py-0.5 rounded-full border border-red-200">
              เกินกำหนด 1 เรื่อง
            </span>
          </CardHeader>

          <CardContent className="p-0">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px] text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200">
                    <th className="p-3.5">เลขรับ / ที่หนังสือ</th>
                    <th className="p-3.5">เรื่อง</th>
                    <th className="p-3.5">กองผู้รับผิดชอบ</th>
                    <th className="p-3.5">เจ้าหน้าที่</th>
                    <th className="p-3.5">กำหนดส่ง</th>
                    <th className="p-3.5 text-center">เกินกำหนด</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {mockOverdueList.map((item) => (
                    <tr key={item.id} className="bg-red-50/30 hover:bg-red-50/60">
                      <td className="p-3.5">
                        <span className="font-mono font-bold text-slate-900 block">{item.regNo}</span>
                        <span className="text-[10px] text-slate-400">{item.docNo}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold text-slate-900 block">{item.title}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-md font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          {item.dept}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-700">{item.staff}</td>
                      <td className="p-3.5 font-bold text-slate-900">{item.dueDate}</td>
                      <td className="p-3.5 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-100 text-red-800 border border-red-200">
                          เกิน {item.daysOverdue} วัน
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Official Government 2-Page Spread Book Ledger Modal */}
      <BookLedgerModal
        isOpen={isLedgerModalOpen}
        onClose={() => setIsLedgerModalOpen(false)}
      />
    </div>
  );
}
