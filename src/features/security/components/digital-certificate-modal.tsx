"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Lock,
  Calendar,
  Building2,
  KeyRound,
  FileText,
  X,
  ExternalLink,
  Download,
  AlertCircle,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DigitalCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle?: string;
  docNo?: string;
  signerName?: string;
  signDate?: string;
}

export function DigitalCertificateModal({
  isOpen,
  onClose,
  documentTitle = "โครงการตรวจสอบและเตรียมความพร้อมรับมืออุทกภัยและดินโคลนถล่ม ประจำปี ๒๕๖๙",
  docNo = "ชร ๐๐๒๓.๑/ว ๔๕๘๙",
  signerName = "นายประสิทธิ์ มั่นคง (นายก อบต.ดอยงาม)",
  signDate = "๒๘ สิงหาคม ๒๕๖๙ เวลา ๑๑:๓๔:๑๒ น.",
}: DigitalCertificateModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="glass-card rounded-3xl bg-white max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-50/90 via-indigo-50/80 to-white border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 border border-white">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-slate-900">
                  ใบรับรองดิจิทัล & ตราประทับอิเล็กทรอนิกส์
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  ✓ มีผลสมบูรณ์
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                PAdES Digital Signature (ETSI EN 319 142)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-500 flex items-center justify-center shadow-xs cursor-pointer border border-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Content */}
        <div className="p-5 sm:p-6 space-y-4 text-xs font-sans">
          {/* Document Summary */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
              เอกสารที่ได้รับการลงลายมือชื่อดิจิทัล
            </span>
            <p className="font-bold text-slate-900 text-sm leading-snug">{documentTitle}</p>
            <p className="text-xs text-blue-700 font-mono font-bold">เลขที่: {docNo}</p>
          </div>

          {/* Validation Status Checklist */}
          <div className="space-y-2 pt-1">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              ผลการตรวจสอบความสมบูรณ์ทางกฎหมาย (Legal Validity)
            </span>

            <div className="space-y-2">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-xs">เอกสารไม่ถูกแก้ไขหรือเปลี่ยนแปลงใดๆ (Integrity OK)</span>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    ค่าแฮช SHA-256 ตรงกับต้นฉบับในสมุดทะเบียนคลาวด์ทุกประการ
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-xs">ผู้ลงนามระบุตัวตนถูกต้อง (Identity Verified)</span>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    ลงนามโดย: <strong>{signerName}</strong> ผ่านกุญแจส่วนตัว PKI
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-xs">มีตราประทับเวลาที่เชื่อถือได้ (Qualified Timestamp)</span>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    ประทับเวลา: {signDate} (Time-Stamp Authority: TSA-DOPA-GOV)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Technical Meta */}
          <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-200 font-mono text-[11px] space-y-1.5 shadow-inner">
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span className="text-slate-400">Issuer (ผู้ออกใบรับรอง):</span>
              <span className="text-cyan-300 font-bold">Thailand Gov CA (NRCT / DGA Root)</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span className="text-slate-400">Subject (หน่วยงาน):</span>
              <span className="text-white">DOIGAM-SAO (อบต.ดอยงาม)</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span className="text-slate-400">Encryption:</span>
              <span className="text-emerald-400">RSA 4096-bit / SHA-256</span>
            </div>
            <div className="flex justify-between pt-0.5">
              <span className="text-slate-400">Doc Digest:</span>
              <span className="text-amber-300 truncate max-w-[240px]">
                e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 px-6 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            ตาม พ.ร.บ. ธุรกรรมทางอิเล็กทรอนิกส์ พ.ศ. ๒๕๔๔
          </span>
          <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl font-bold">
            ปิดหน้าต่าง
          </Button>
        </div>
      </div>
    </div>
  );
}
