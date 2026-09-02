"use client";

import { useState } from "react";
import {
  Download,
  HardDrive,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Clock,
  FileArchive,
  Database,
  FileText,
  Lock,
  Sparkles,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface BackupItem {
  id: string;
  name: string;
  date: string;
  size: string;
  docCount: number;
  status: "READY" | "IN_PROGRESS";
  sha256: string;
}

const mockBackups: BackupItem[] = [
  {
    id: "bk-01",
    name: "SMARTSARABUN_DOIGAM_BACKUP_2569_08_31.zip",
    date: "๓๑ ส.ค. ๒๕๖๙ ๑๒:๐๐ น.",
    size: "1.42 GB",
    docCount: 801,
    status: "READY",
    sha256: "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
  },
  {
    id: "bk-02",
    name: "SMARTSARABUN_DOIGAM_BACKUP_2569_07_31.zip",
    date: "๓๑ ก.ค. ๒๕๖๙ ๒๓:๕๙ น.",
    size: "1.18 GB",
    docCount: 654,
    status: "READY",
    sha256: "3a52f9c5e2d6b38c20d7503692d2b5ff883dfc0678b809d32d3080512683dd37",
  },
];

export function TenantBackupHub() {
  const [backups, setBackups] = useState<BackupItem[]>(mockBackups);
  const [isExporting, setIsExporting] = useState(false);

  const handleCreateBackup = () => {
    setIsExporting(true);
    setTimeout(() => {
      const newBackup: BackupItem = {
        id: `bk-${Date.now()}`,
        name: `SMARTSARABUN_DOIGAM_BACKUP_2569_08_${Math.floor(10 + Math.random() * 20)}.zip`,
        date: "๓๑ ส.ค. ๒๕๖๙ (สร้างเสร็จสดๆ ร้อนๆ)",
        size: "1.45 GB",
        docCount: 801,
        status: "READY",
        sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      };
      setBackups([newBackup, ...backups]);
      setIsExporting(false);
    }, 2000);
  };

  const handleDownload = (backup: BackupItem) => {
    alert(`เริ่มดาวน์โหลดแพ็กเกจสำรองข้อมูลของ อบต.ดอยงาม:\n${backup.name}\n(ขนาด ${backup.size}, บันทึกสมบูรณ์ ${backup.docCount} เรื่อง)`);
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white/80 backdrop-blur-2xl border border-white/90 shadow-sm space-y-6">
      {/* Header & Export CTA */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200 shadow-2xs">
              <FileArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900">
                ระบบสำรองข้อมูล & ดาวน์โหลดคลังเอกสารขององค์กร (Self-Service Data Sovereignty)
              </h3>
              <p className="text-xs text-slate-500">
                อปท. สามารถกดสำรองและดาวน์โหลดไฟล์เอกสาร PDF + ฐานข้อมูล + ประวัติทั้งหมดเป็น ZIP ได้ตลอดเวลา (ป้องกันการผูกขาด)
              </p>
            </div>
          </div>
        </div>

        <Button
          size="lg"
          variant="signature"
          disabled={isExporting}
          onClick={handleCreateBackup}
          className="gap-2 shrink-0 rounded-2xl shadow-accent hover:shadow-accent-lg"
        >
          {isExporting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>กำลังบีบอัดแพ็กเกจ ZIP...</span>
            </>
          ) : (
            <>
              <HardDrive className="w-4 h-4 text-amber-300" />
              <span>สร้างแพ็กเกจสำรองข้อมูล ZIP ประจำเดือน</span>
            </>
          )}
        </Button>
      </div>

      {/* Package Contents Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
          <div className="flex items-center gap-2 text-blue-700 font-bold">
            <Database className="w-4 h-4" />
            <span>๑. ฐานข้อมูลและเมทาดาทา (SQL & JSON)</span>
          </div>
          <p className="text-[11px] text-slate-500">
            สมุดทะเบียนรับ-ส่ง, ผู้รับผิดชอบ, บันทึกการเกษียน, และสายการบังคับบัญชาทั้งหมด
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
          <div className="flex items-center gap-2 text-indigo-700 font-bold">
            <FileText className="w-4 h-4" />
            <span>๒. ไฟล์เอกสาร PDF และตราประทับครบ ๑๐๐%</span>
          </div>
          <p className="text-[11px] text-slate-500">
            ไฟล์ PDF ฉบับจริง, ฉบับประทับตรายาง, และไฟล์แนบทุกหน้า จัดโครงสร้างแยกตามปี/กอง
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
          <div className="flex items-center gap-2 text-emerald-700 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>๓. ลายมือชื่อ SHA-256 & Audit Logs</span>
          </div>
          <p className="text-[11px] text-slate-500">
            บันทึกประวัติการเปิดอ่าน/ลงนาม ๑๐ ปี พร้อมรหัสแฮชตรวจสอบความสมบูรณ์
          </p>
        </div>
      </div>

      {/* Backup History Table */}
      <div className="space-y-3 pt-2">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
          ประวัติแพ็กเกจสำรองข้อมูลที่พร้อมดาวน์โหลด:
        </span>

        <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden bg-white">
          {backups.map((bk) => (
            <div
              key={bk.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileArchive className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="font-bold text-xs sm:text-sm text-slate-900 font-mono">{bk.name}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ✓ สำรองสมบูรณ์
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                  <span>วันที่สร้าง: <strong>{bk.date}</strong></span>
                  <span>ขนาด: <strong className="font-mono text-slate-800">{bk.size}</strong></span>
                  <span>เอกสาร: <strong className="text-blue-700">{bk.docCount} เรื่อง</strong></span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono truncate max-w-xl">
                  SHA-256: {bk.sha256}
                </p>
              </div>

              <div className="shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(bk)}
                  className="rounded-xl text-xs font-bold gap-1.5 hover:border-blue-400 hover:text-blue-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ดาวน์โหลด ZIP</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
