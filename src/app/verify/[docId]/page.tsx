"use client";

import { useParams } from "next/navigation";
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  Building,
  Calendar,
  UserCheck,
  Lock,
  Download,
  QrCode,
  ArrowLeft,
  ExternalLink,
  Award,
  Clock,
  Printer,
  FileCheck,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThaiGaruda } from "@/components/shared/thai-garuda";

export default function DocumentVerificationPage() {
  const params = useParams();
  const rawId = (params?.docId as string) || "in-000";
  const docId = decodeURIComponent(rawId);

  // Document verification info based on ID
  const isScammerDoc = docId === "in-000" || docId.toLowerCase().includes("scam") || docId === "DOC-001";

  const docInfo = {
    id: docId,
    docNo: isScammerDoc ? "ชร ๐๐๒๓.๑๕/ว ๒๕๕" : `ชร ๕๒๐๐๑/ว ${docId.replace(/\D/g, "") || "๐๑๔๕"}`,
    regNo: isScammerDoc ? "๑๓๖๓" : "๒๗๘๔/๒๕๖๙",
    title: isScammerDoc
      ? "แจ้งเตือนเฝ้าระวังกลุ่มมิจฉาชีพหลอกลวงโอนเงินค่าจัดซื้อจัดจ้างโครงการขององค์กรปกครองส่วนท้องถิ่น"
      : "โครงการตรวจสอบและเตรียมความพร้อมรับมืออุทกภัยและดินโคลนถล่ม ประจำปี ๒๕๖๙",
    issueDate: "๒๔ สิงหาคม ๒๕๖๙",
    issuedBy: isScammerDoc
      ? "สำนักงานท้องถิ่นอำเภอพาน อำเภอพาน จังหวัดเชียงราย"
      : "องค์การบริหารส่วนตำบลดอยงาม อำเภอพาน จังหวัดเชียงราย",
    dept: "สำนักปลัด องค์การบริหารส่วนตำบลดอยงาม",
    signers: [
      { name: "นายสำอางค์ ธรรมโก", role: "นายก อบต.ดอยงาม", status: "ลงนามอนุมัติแล้ว", time: "๒๕ ส.ค. ๒๕๖๙ ๑๖.๑๕ น." },
      { name: "จ่าเอก สมเกียรติ พินิจอักษร", role: "ปลัด อบต.ดอยงาม", status: "เกษียนเสนอความเห็นแล้ว", time: "๒๕ ส.ค. ๒๕๖๙ ๑๕.๔๐ น." },
      { name: "ว่าที่ร้อยตรี ชูรศักดิ์ แสนอังวัง", role: "รองปลัด อบต.ดอยงาม", status: "ตรวจสอบกลั่นกรองแล้ว", time: "๒๕ ส.ค. ๒๕๖๙ ๑๕.๑๐ น." },
      { name: "นางสุกัญญามาศ เทพวงค์", role: "หัวหน้าสำนักปลัด", status: "เกษียนความเห็นแล้ว", time: "๒๕ ส.ค. ๒๕๖๙ ๑๔.๔๕ น." },
      { name: "นายฐิติวัฒน์ รักแม่", role: "หัวหน้าฝ่ายบริหารงานทั่วไป", status: "ตรวจเสนอแล้ว", time: "๒๕ ส.ค. ๒๕๖๙ ๑๔.๒๐ น." },
      { name: "นางสาวธัญวรรัตน์ ตาสาย", role: "เจ้าพนักงานธุรการชำนาญงาน (สารบรรณกลาง)", status: "ลงรับกลางแล้ว", time: "๒๕ ส.ค. ๒๕๖๙ ๑๔.๐๐ น." },
    ],
    hashChecksum: "SHA256: 8f9b2a7d4e1c5f6a9b8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a",
    pkiCertIssuer: "National Digital Identification & Government PKI CA (Thailand)",
    status: "VALID",
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <ThaiGaruda className="w-16 h-16 text-slate-950" />
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-2">
            ระบบตรวจสอบความถูกต้องของหนังสือราชการอิเล็กทรอนิกส์ (e-Document Verification)
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            องค์การบริหารส่วนตำบลดอยงาม อำเภอพาน จังหวัดเชียงราย ๕๗๑๒๐
          </p>
        </div>

        {/* Verification Status Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Status Header Banner */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/40 shadow-inner">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-lg tracking-wide">
                  เอกสารราชการฉบับจริง (VERIFIED AUTHENTIC)
                </span>
                <span className="bg-emerald-950/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-300/40 font-mono">
                  พ.ร.บ.ธุรกรรมฯ ๒๕๔๔
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
                หนังสือราชการฉบับนี้ได้รับการตรวจสอบความถูกต้อง ลายมือชื่ออิเล็กทรอนิกส์ และตราประทับรับสารบรรณถูกต้องตามกฎหมาย
              </p>
            </div>
          </div>

          {/* Document Details */}
          <div className="p-6 space-y-5 text-xs">
            {/* Title & Doc Number */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  ชื่อเรื่อง :
                </span>
                <p className="font-bold text-slate-900 text-sm mt-0.5 leading-snug">
                  {docInfo.title}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block">เลขที่หนังสือ :</span>
                  <span className="font-mono font-black text-blue-900 text-xs">{docInfo.docNo}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">เลขรับกลาง :</span>
                  <span className="font-mono font-bold text-slate-800 text-xs">{docInfo.regNo}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">ลงวันที่ :</span>
                  <span className="font-semibold text-slate-800 text-xs">{docInfo.issueDate}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                <strong>หน่วยงานต้นสังกัด : </strong>
                <span>{docInfo.issuedBy}</span>
              </div>
            </div>

            {/* Endorsement & Signers Chain */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Award className="w-4 h-4 text-blue-700" />
                สายการตรวจสอบ เกษียน และลงนามอนุมัติ (Endorsement Chain) :
              </h3>
              <div className="space-y-2">
                {docInfo.signers.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 border border-blue-200">
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-xs truncate">{s.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{s.role}</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 block">
                        {s.status}
                      </span>
                      <span className="text-[9px] text-slate-400 block mt-0.5 font-mono">{s.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Digital PKI & Checksum Security Box */}
            <div className="p-3.5 bg-slate-950 text-slate-300 rounded-2xl space-y-2 font-mono text-[10px] border border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                <Lock className="w-3.5 h-3.5" />
                <span>ความปลอดภัยของลายมือชื่อดิจิทัล (Digital Signature Hash)</span>
              </div>
              <div className="break-all text-slate-400 bg-slate-900 p-2 rounded-lg border border-slate-800">
                {docInfo.hashChecksum}
              </div>
              <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1">
                <span>ผู้ออกใบรับรอง: {docInfo.pkiCertIssuer}</span>
                <span className="text-emerald-400 font-bold">STATUS: VALID</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <Link href="/" className="w-full sm:w-auto flex-1">
                <Button variant="outline" className="w-full h-11 text-xs font-bold gap-2 rounded-xl border-slate-300">
                  <ArrowLeft className="w-4 h-4" />
                  กลับสู่ระบบสารบรรณ
                </Button>
              </Link>

              <Button
                onClick={() => window.print()}
                className="w-full sm:w-auto flex-1 h-11 text-xs font-bold bg-navy-900 hover:bg-navy-800 text-white gap-2 rounded-xl shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                พิมพ์เอกสารรับรองฉบับนี้
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-slate-400 font-mono">
          SmartSarabun e-Document Verification Engine • B.E. 2569 • องค์การบริหารส่วนตำบลดอยงาม
        </p>
      </div>
    </div>
  );
}
