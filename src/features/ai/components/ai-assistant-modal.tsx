"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building,
  User,
  Clock,
  ShieldCheck,
  X,
  Check,
  Edit3,
  Bot,
  RefreshCw,
  Lock,
} from "lucide-react";

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExtraction?: (data: any) => void;
}

export function AiAssistantModal({
  isOpen,
  onClose,
  onConfirmExtraction,
}: AiAssistantModalProps) {
  const [step, setStep] = useState<"upload" | "scanning" | "review">("upload");
  const [fileName, setFileName] = useState("");

  const [extractedData, setExtractedData] = useState({
    docNo: "ชร 0023.1/ว 4589",
    docDate: "2026-08-28",
    fromOrg: "ที่ว่าการอำเภอพาน จังหวัดเชียงราย",
    toOrg: "นายกองค์การบริหารส่วนตำบลดอยงาม",
    title: "โครงการตรวจสอบและเตรียมความพร้อมรับมืออุทกภัยและดินโคลนถล่ม ประจำปี 2569",
    docType: "หนังสือภายนอก",
    summary:
      "แจ้งเตือนสถานการณ์สภาพอากาศแปรปรวนในพื้นที่อำเภอพาน ขอให้อบต.ดอยงาม จัดเตรียมเครื่องสูบน้ำ ยานพาหนะ และบุคลากรให้พร้อมปฏิบัติการตลอด 24 ชั่วโมง",
    suggestedDept: "กองช่าง",
    suggestedOfficer: "นายวิศวกร ช่างมั่น",
  });

  const confidenceScores = {
    docNo: 98,
    docDate: 96,
    fromOrg: 94,
    toOrg: 99,
    title: 97,
    docType: 95,
    suggestedDept: 96,
    suggestedOfficer: 92,
  };

  if (!isOpen) return null;

  const handleFileUpload = (name: string) => {
    setFileName(name);
    setStep("scanning");

    setTimeout(() => {
      if (name.includes("มท") || name.includes("5232")) {
        setExtractedData({
          docNo: "มท 0808.2/ว 5232",
          docDate: "2026-08-28",
          fromOrg: "กรมส่งเสริมการปกครองท้องถิ่น",
          toOrg: "นายกองค์การบริหารส่วนตำบลดอยงาม",
          title: "แนวทางการจัดสรรงบประมาณเงินอุดหนุนเฉพาะกิจ ประจำปี 2569",
          docType: "หนังสือภายนอก",
          summary: "แนวทางการจัดทำข้อบัญญัติงบประมาณรายจ่ายและการจัดสรรงบประมาณเงินอุดหนุนเฉพาะกิจเพื่อการพัฒนาท้องถิ่น",
          suggestedDept: "กองคลัง",
          suggestedOfficer: "นางวรรณา นามเงิน",
        });
      }
      setStep("review");
    }, 1200);
  };

  const handleConfirm = () => {
    if (onConfirmExtraction) {
      onConfirmExtraction(extractedData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-indigo-950 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base">ระบบผู้ช่วยปัญญาประดิษฐ์ (AI OCR Assistant)</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Google Gemini 2.5 Flash
                </span>
              </div>
              <p className="text-xs text-slate-300">
                สกัดข้อมูลหนังสือราชการ สรุปสาระสำคัญ และเสนอแนะสำนัก/กองอัตโนมัติ
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {step === "upload" && (
            <div className="py-10 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-3xl bg-slate-50/50 hover:bg-slate-50 transition-all p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900">
                  อัปโหลดไฟล์หนังสือราชการ (PDF หรือ รูปภาพ)
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  ระบบจะตรวจจับตราครุฑ สกัดเลขที่หนังสือ วันที่ เรื่อง หน่วยงานต้นทาง และสรุปสาระสำคัญ
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <Button
                  onClick={() => handleFileUpload("หนังสืออำเภอพาน_อุทกภัย.pdf")}
                  className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl h-10 px-5 gap-2 shadow-xs cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-amber-300" />
                  ทดสอบสแกน: หนังสือ อ.พาน (ชร 0023.1)
                </Button>
                <Button
                  onClick={() => handleFileUpload("หนังสือ สถ_งบประมาณ_5232.pdf")}
                  variant="outline"
                  className="font-bold text-xs rounded-xl h-10 px-5 gap-2 border-slate-300 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  ทดสอบสแกน: หนังสือ สถ. (มท 0808.2)
                </Button>
              </div>
            </div>
          )}

          {step === "scanning" && (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto animate-spin">
                <RefreshCw className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900">
                  กำลังประมวลผล OCR และวิเคราะห์เอกสารด้วย AI...
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  กำลังตรวจจับตราครุฑ แยกโครงสร้างฟิลด์ และจำแนกความเร่งด่วน
                </p>
              </div>
            </div>
          )}

          {step === "review" && (
            <div className="space-y-6">
              {/* Human-in-the-Loop Safety Alert */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900">
                <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-extrabold text-xs">
                    ข้อกำหนดความปลอดภัยข้อมูลราชการ (Human-in-the-Loop Verification)
                  </p>
                  <p className="text-[11px] text-amber-800">
                    ข้อมูลด้านล่างเป็น <strong>ข้อเสนอแนะจาก AI (PENDING_REVIEW)</strong>{" "}
                    เจ้าหน้าที่ต้องตรวจสอบความถูกต้องก่อนกดยืนยันบันทึกเป็นข้อมูลทางการ
                  </p>
                </div>
              </div>

              {/* Extracted Fields Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Doc No */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">ที่หนังสือ :</label>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ความมั่นใจ {confidenceScores.docNo}%
                    </span>
                  </div>
                  <input
                    type="text"
                    value={extractedData.docNo}
                    onChange={(e) => setExtractedData({ ...extractedData, docNo: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold bg-slate-50 focus:bg-white"
                  />
                </div>

                {/* 2. Doc Date */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">ลงวันที่ :</label>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ความมั่นใจ {confidenceScores.docDate}%
                    </span>
                  </div>
                  <input
                    type="date"
                    value={extractedData.docDate}
                    onChange={(e) => setExtractedData({ ...extractedData, docDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold bg-slate-50 focus:bg-white"
                  />
                </div>

                {/* 3. From Org */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">จากหน่วยงาน :</label>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ความมั่นใจ {confidenceScores.fromOrg}%
                    </span>
                  </div>
                  <input
                    type="text"
                    value={extractedData.fromOrg}
                    onChange={(e) => setExtractedData({ ...extractedData, fromOrg: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold bg-slate-50 focus:bg-white"
                  />
                </div>

                {/* 4. To Org */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">ถึง :</label>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ความมั่นใจ {confidenceScores.toOrg}%
                    </span>
                  </div>
                  <input
                    type="text"
                    value={extractedData.toOrg}
                    onChange={(e) => setExtractedData({ ...extractedData, toOrg: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* 5. Subject */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">เรื่อง :</label>
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    ความมั่นใจ {confidenceScores.title}%
                  </span>
                </div>
                <input
                  type="text"
                  value={extractedData.title}
                  onChange={(e) => setExtractedData({ ...extractedData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-extrabold text-sm bg-slate-50 focus:bg-white"
                />
              </div>

              {/* 6. AI Summary */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  สรุปสาระสำคัญโดย AI (Executive Summary) :
                </label>
                <textarea
                  rows={2}
                  value={extractedData.summary}
                  onChange={(e) => setExtractedData({ ...extractedData, summary: e.target.value })}
                  className="w-full p-3.5 rounded-xl border border-slate-300 bg-blue-50/50 text-slate-800 leading-relaxed font-medium"
                />
              </div>

              {/* 7. Suggested Department & Officer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">เสนอแนะสำนัก/กอง :</label>
                  <select
                    value={extractedData.suggestedDept}
                    onChange={(e) =>
                      setExtractedData({ ...extractedData, suggestedDept: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold bg-white"
                  >
                    <option value="กองช่าง">กองช่าง (ชร 52003)</option>
                    <option value="กองคลัง">กองคลัง (ชร 52002)</option>
                    <option value="สำนักปลัด">สำนักปลัด (ชร 52001)</option>
                    <option value="กองการศึกษาฯ">กองการศึกษาฯ (ชร 52004)</option>
                    <option value="กองสาธารณสุข">กองสาธารณสุข (ชร 52005)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">เสนอแนะเจ้าหน้าที่ :</label>
                  <input
                    type="text"
                    value={extractedData.suggestedOfficer}
                    onChange={(e) =>
                      setExtractedData({ ...extractedData, suggestedOfficer: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold bg-white"
                  />
                </div>
              </div>

              {/* Provenance Metadata */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 font-mono">
                <span>Model: Google-Gemini-2.5-Flash / OCR-TH-v2</span>
                <span className="flex items-center gap-1 text-emerald-600 font-bold">
                  <Check className="w-3.5 h-3.5" /> STATUS: PENDING_HUMAN_REVIEW
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {step === "review" && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep("upload")}
              className="text-xs font-bold rounded-xl h-10 px-4 border-slate-300 cursor-pointer"
            >
              สแกนไฟล์อื่นใหม่
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="text-xs font-bold rounded-xl h-10 px-4 border-slate-300 text-red-600 hover:bg-red-50 cursor-pointer"
              >
                ✕ ปฏิเสธคำแนะนำ
              </Button>

              <Button
                type="button"
                onClick={handleConfirm}
                className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl h-10 px-6 gap-2 shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ✓ ยืนยันข้อมูลเข้าสู่ระบบราชการ
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
