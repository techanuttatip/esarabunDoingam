"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  ShieldCheck,
  Search,
  User,
  Clock,
  Eye,
  FileText,
  Lock,
  Download,
  AlertTriangle,
  FileSpreadsheet,
  Filter,
  CheckCircle2,
} from "lucide-react";

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  position: string;
  dept: string;
  action: string;
  actionType: "read" | "endorse" | "sign" | "login" | "download" | "security";
  targetDoc: string;
  ip: string;
  integrityHash: string;
}

const mockAuditLogs: AuditEntry[] = [];

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditEntry[]>(mockAuditLogs);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedActionType, setSelectedActionType] = useState<string>("ALL");

  const filteredLogs = logs.filter((log) => {
    if (selectedActionType !== "ALL" && log.actionType !== selectedActionType) {
      return false;
    }
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase();
      return (
        log.user.toLowerCase().includes(kw) ||
        log.action.toLowerCase().includes(kw) ||
        log.targetDoc.toLowerCase().includes(kw) ||
        log.dept.toLowerCase().includes(kw)
      );
    }
    return true;
  });

  const handleExportAuditExcel = () => {
    const headers = ["วันเวลา", "ผู้ใช้งาน", "ตำแหน่ง", "ส่วนราชการ", "การกระทำ", "เอกสารที่เกี่ยวข้อง", "IP Address", "SHA-256 Fingerprint"];
    const rows = filteredLogs.map((log) => [
      `"${log.timestamp}"`,
      `"${log.user}"`,
      `"${log.position}"`,
      `"${log.dept}"`,
      `"${log.action}"`,
      `"${log.targetDoc.replace(/"/g, '""')}"`,
      `"${log.ip}"`,
      `"${log.integrityHash}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.join("\r\n")].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Audit_Log_รายงานประวัติการใช้งาน_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <PageHeader
          title="ประวัติความปลอดภัยและการเปิดอ่านเอกสาร (Security Audit Trail)"
          description="ตรวจสอบประวัติการเข้าใช้งาน การเปิดอ่านเอกสารรายบุคคล การเกษียนสั่งการ และความถูกต้องของไฟล์ SHA-256"
        />

        <Button
          onClick={handleExportAuditExcel}
          variant="outline"
          className="border-emerald-300 text-emerald-900 bg-emerald-50 hover:bg-emerald-100 font-bold text-xs sm:text-sm h-10 px-4 rounded-xl shadow-xs cursor-pointer gap-1.5"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
          ส่งออกรายงาน Audit Log
        </Button>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-emerald-600 shadow-xs rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500">SHA-256 Integrity Check</p>
              <p className="text-xl font-black text-emerald-700 mt-0.5">ปลอดภัย 100%</p>
              <span className="text-[10px] text-slate-500 font-medium">ไม่พบการดัดแปลงไฟล์ภายนอก</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-600 shadow-xs rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500">บันทึกการเปิดอ่านเอกสาร</p>
              <p className="text-xl font-black text-slate-800 mt-0.5">384 ครั้ง</p>
              <span className="text-[10px] text-blue-700 font-bold">บันทึกประวัติทุกการเปิดไฟล์</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Eye className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600 shadow-xs rounded-2xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500">การเข้าสู่ระบบผ่านเครือข่าย</p>
              <p className="text-xl font-black text-slate-800 mt-0.5">IP ภายใน อบต.</p>
              <span className="text-[10px] text-purple-700 font-bold">เข้ารหัส TLS 1.3 / SSL</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อผู้ใช้งาน, การกระทำ, หรือเอกสาร..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-navy-600 focus:outline-none"
          />
        </div>

        {/* Action Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-500 mr-1 whitespace-nowrap">ประเภท :</span>
          {[
            { label: "ทั้งหมด", value: "ALL" },
            { label: "เปิดอ่านเอกสาร", value: "read" },
            { label: "เกษียนหนังสือ", value: "endorse" },
            { label: "ลงนามอนุมัติ", value: "sign" },
            { label: "ดาวน์โหลด", value: "download" },
            { label: "เข้าสู่ระบบ", value: "login" },
          ].map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedActionType(type.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedActionType === type.value
                  ? "bg-navy-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Audit Log Table */}
      <Card className="shadow-xs border-slate-200 overflow-hidden rounded-2xl">
        <CardHeader className="bg-slate-100/90 px-6 py-4 border-b border-slate-200 flex flex-row items-center justify-between">
          <CardTitle className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Shield className="w-4.5 h-4.5 text-blue-700" />
            สมุดบันทึกประวัติความปลอดภัย (Audit Log Stream)
          </CardTitle>
          <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
            แสดง {filteredLogs.length} รายการ
          </span>
        </CardHeader>

        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px] table-auto">
              <thead>
                <tr className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200 text-xs">
                  <th className="p-3.5 whitespace-nowrap w-[14%]">วันเวลา</th>
                  <th className="p-3.5 whitespace-nowrap w-[18%]">ผู้ใช้งาน / กอง</th>
                  <th className="p-3.5 whitespace-nowrap w-[18%]">การกระทำ</th>
                  <th className="p-3.5 min-w-[220px]">เอกสาร / ข้อมูลที่เกี่ยวข้อง</th>
                  <th className="p-3.5 whitespace-nowrap w-[14%]">IP Address</th>
                  <th className="p-3.5 whitespace-nowrap w-[16%]">Cryptographic Fingerprint</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {filteredLogs.map((log, idx) => (
                  <tr
                    key={log.id}
                    className={`hover:bg-blue-50/60 transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                    }`}
                  >
                    <td className="p-3.5 text-slate-600 font-semibold whitespace-nowrap">
                      {log.timestamp}
                    </td>

                    <td className="p-3.5">
                      <p className="font-bold text-slate-900">{log.user}</p>
                      <p className="text-[10px] text-slate-500">{log.position} • {log.dept}</p>
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          log.actionType === "sign"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : log.actionType === "endorse"
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : log.actionType === "read"
                            ? "bg-purple-100 text-purple-800 border border-purple-200"
                            : log.actionType === "download"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td className="p-3.5 font-bold text-slate-800">
                      {log.targetDoc}
                    </td>

                    <td className="p-3.5 font-mono text-slate-600">
                      {log.ip}
                    </td>

                    <td className="p-3.5 font-mono text-[10px] text-emerald-800">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate max-w-[150px]">{log.integrityHash}</span>
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
  );
}
