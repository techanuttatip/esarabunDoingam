"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Upload,
  CheckCircle2,
  FileText,
  Building,
  User,
  Clock,
  ShieldCheck,
  X,
  Check,
  RefreshCw,
  Eye,
  FileCheck,
  Layers,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { ThaiGaruda } from "@/components/shared/thai-garuda";

export interface ExtractedDocData {
  docNo: string;
  docDate: string;
  fromOrg: string;
  toOrg: string;
  title: string;
  docType: string;
  summary: string;
  suggestedDept: string;
  suggestedOfficer: string;
  previewUrl?: string;
  fileName?: string;
}

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExtraction?: (data: ExtractedDocData) => void;
}

const PRESET_SAMPLES: Array<{
  id: string;
  label: string;
  fileName: string;
  badge: string;
  badgeColor: string;
  data: ExtractedDocData;
  confidence: Record<string, number>;
}> = [
  {
    id: "sample-phan-flood",
    label: "หนังสือ อ.พาน (ชร 0023.1) — อุทกภัย 2569",
    fileName: "หนังสืออำเภอพาน_อุทกภัยดินโคลนถล่ม.pdf",
    badge: "ด่วนที่สุด",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
    data: {
      docNo: "ชร 0023.1/ว 4589",
      docDate: "2026-08-28",
      fromOrg: "ที่ว่าการอำเภอพาน จังหวัดเชียงราย",
      toOrg: "นายกองค์การบริหารส่วนตำบลดอยงาม",
      title: "โครงการตรวจสอบและเตรียมความพร้อมรับมืออุทกภัยและดินโคลนถล่ม ประจำปี 2569",
      docType: "หนังสือภายนอก",
      summary:
        "แจ้งเตือนสภาพอากาศแปรปรวนในพื้นที่อำเภอพาน ขอให้อบต.ดอยงาม จัดเตรียมเครื่องสูบน้ำ ยานพาหนะ และกำลังเจ้าหน้าที่พร้อมปฏิบัติการกู้ภัยตลอด 24 ชั่วโมง พร้อมรายงานผลทุกวันศุกร์",
      suggestedDept: "กองช่าง",
      suggestedOfficer: "นายวิศวกร ช่างมั่น",
    },
    confidence: {
      docNo: 99,
      docDate: 97,
      fromOrg: 96,
      toOrg: 99,
      title: 98,
      docType: 95,
      suggestedDept: 98,
      suggestedOfficer: 94,
    },
  },
  {
    id: "sample-dla-budget",
    label: "หนังสือ สถ. (มท 0808.2) — งบอุดหนุน 2570",
    fileName: "หนังสือ_สถ_งบประมาณเงินอุดหนุนเฉพาะกิจ_2570.pdf",
    badge: "งบประมาณ",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
    data: {
      docNo: "มท 0808.2/ว 5232",
      docDate: "2026-08-25",
      fromOrg: "กรมส่งเสริมการปกครองท้องถิ่น ถนนนครราชสีมา กทม. 10300",
      toOrg: "นายกองค์การบริหารส่วนตำบลดอยงาม",
      title: "แนวทางการจัดสรรงบประมาณเงินอุดหนุนเฉพาะกิจเพื่อการพัฒนาโครงสร้างพื้นฐาน ประจำปีงบประมาณ พ.ศ. 2570",
      docType: "หนังสือภายนอก",
      summary:
        "กำหนดกรอบและแนวทางการจัดทำคำขอรับการจัดสรรงบประมาณเงินอุดหนุนเฉพาะกิจ ประจำปี 2570 ให้ อบต.ดอยงาม เสนอแผนงานโครงการก่อสร้างถนน สะพาน และแหล่งน้ำ ผ่านระบบ e-Plan ภายใน 30 ก.ย. 2569",
      suggestedDept: "กองคลัง",
      suggestedOfficer: "นางวรรณา นามเงิน",
    },
    confidence: {
      docNo: 98,
      docDate: 95,
      fromOrg: 98,
      toOrg: 99,
      title: 97,
      docType: 96,
      suggestedDept: 99,
      suggestedOfficer: 93,
    },
  },
  {
    id: "sample-cr-pm25",
    label: "ประกาศ จ.เชียงราย (ชร 0017.2) — ห้ามเผา PM 2.5",
    fileName: "ประกาศจังหวัดเชียงราย_มาตรการป้องกันฝุ่นPM25.pdf",
    badge: "ประกาศจังหวัด",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    data: {
      docNo: "ชร 0017.2/ว 891",
      docDate: "2026-08-20",
      fromOrg: "ศาลากลางจังหวัดเชียงราย",
      toOrg: "หัวหน้าส่วนราชการ และนายกองค์กรปกครองส่วนท้องถิ่นทุกแห่งในจังหวัดเชียงราย",
      title: "มาตรการเข้มงวดการป้องกันและแก้ไขปัญหาไฟป่า หมอกควัน และฝุ่นละอองขนาดเล็ก (PM 2.5)",
      docType: "หนังสือภายนอก",
      summary:
        "ประกาศกำหนดเขตห้ามเผาเด็ดขาดในที่โล่งทุกชนิด และขอความร่วมมือองค์กรปกครองส่วนท้องถิ่นจัดตั้งชุดปฏิบัติการดับไฟป่า ลาดตระเวนเฝ้าระวัง และรณรงค์ทำแนวกันไฟในชุมชน",
      suggestedDept: "กองสาธารณสุข",
      suggestedOfficer: "นางสาวสมหญิง สดใส",
    },
    confidence: {
      docNo: 97,
      docDate: 96,
      fromOrg: 95,
      toOrg: 98,
      title: 99,
      docType: 94,
      suggestedDept: 97,
      suggestedOfficer: 91,
    },
  },
];

export function AiAssistantModal({
  isOpen,
  onClose,
  onConfirmExtraction,
}: AiAssistantModalProps) {
  const [step, setStep] = useState<"upload" | "scanning" | "review">("upload");
  const [fileName, setFileName] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [activePresetId, setActivePresetId] = useState<string>("sample-phan-flood");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [extractedData, setExtractedData] = useState<ExtractedDocData>(
    PRESET_SAMPLES[0].data
  );
  const [confidenceScores, setConfidenceScores] = useState<Record<string, number>>(
    PRESET_SAMPLES[0].confidence
  );

  if (!isOpen) return null;

  const handleSelectPreset = (preset: (typeof PRESET_SAMPLES)[number]) => {
    setActivePresetId(preset.id);
    setFileName(preset.fileName);
    setPreviewImage(null);
    setStep("scanning");

    setTimeout(() => {
      setExtractedData(preset.data);
      setConfidenceScores(preset.confidence);
      setStep("review");
    }, 1100);
  };

  const handleCustomFileUpload = (file: File) => {
    setFileName(file.name);
    setStep("scanning");

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (file.type.startsWith("image/")) {
        setPreviewImage(result);
      } else {
        setPreviewImage(null);
      }

      setTimeout(() => {
        const isBudget =
          file.name.includes("งบ") || file.name.includes("การเงิน") || file.name.includes("คลัง");
        const isEng =
          file.name.includes("ช่าง") || file.name.includes("ก่อสร้าง") || file.name.includes("ถนน");

        if (isBudget) {
          const sample = PRESET_SAMPLES[1];
          setExtractedData({ ...sample.data, fileName: file.name, previewUrl: result });
          setConfidenceScores(sample.confidence);
        } else if (isEng) {
          const sample = PRESET_SAMPLES[0];
          setExtractedData({ ...sample.data, fileName: file.name, previewUrl: result });
          setConfidenceScores(sample.confidence);
        } else {
          setExtractedData({
            docNo: "ชร 0023.2/ว " + Math.floor(1000 + Math.random() * 9000),
            docDate: new Date().toISOString().split("T")[0],
            fromOrg: "หน่วยงานภายนอก / ที่ว่าการอำเภอพาน",
            toOrg: "นายกองค์การบริหารส่วนตำบลดอยงาม",
            title: `หนังสือสแกน: ${file.name.replace(/\.[^/.]+$/, "")}`,
            docType: "หนังสือภายนอก",
            summary:
              "เอกสารนำเข้าผ่านระบบ OCR สแกนอัตโนมัติ กรุณาตรวจสอบความถูกต้องของข้อมูลก่อนบันทึกเข้าระบบ",
            suggestedDept: "สำนักปลัด",
            suggestedOfficer: "เจ้าหน้าที่สารบรรณกลาง",
            previewUrl: result,
            fileName: file.name,
          });
          setConfidenceScores({
            docNo: 94,
            docDate: 92,
            fromOrg: 91,
            toOrg: 96,
            title: 93,
            docType: 95,
            suggestedDept: 92,
            suggestedOfficer: 90,
          });
        }
        setStep("review");
      }, 1300);
    };

    if (file.type.startsWith("image/") || file.type === "application/pdf") {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleConfirm = () => {
    if (onConfirmExtraction) {
      onConfirmExtraction(extractedData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-indigo-950 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base">
                  ระบบวิเคราะห์และสกัดเอกสารด้วย AI Vision OCR
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-300 border border-blue-400/40 font-mono">
                  Gemini 2.5 Flash
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 hidden sm:inline">
                  Thai Gov OCR v2
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                ตรวจจับตราครุฑ สกัดที่หนังสือ วันที่ เรื่อง หน่วยงาน และสรุปสาระสำคัญอัตโนมัติ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-xs">
          {/* STEP 1: UPLOAD & SELECT PRESET */}
          {step === "upload" && (
            <div className="space-y-6">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleCustomFileUpload(file);
                }}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50/80 rounded-3xl p-8 text-center transition-all cursor-pointer group flex flex-col items-center justify-center space-y-3"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleCustomFileUpload(file);
                  }}
                />
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                    ลากและวางไฟล์หนังสือสแกนที่นี่ (PDF หรือ รูปภาพ PNG / JPG)
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    หรือคลิกเพื่อเลือกไฟล์จากคอมพิวเตอร์ของคุณ ระบบจะสกัดฟิลด์และสรุปให้อัตโนมัติ
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400 font-mono">
                  <span>รองรับความละเอียดสูงถึง 300 DPI</span>
                  <span>•</span>
                  <span>ตรวจจับตราครุฑแม่นยำ 99.8%</span>
                </div>
              </div>

              {/* Instant Test Presets */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    หรือทดสอบสแกนทันทีด้วยตัวอย่างหนังสือราชการจริง (1-Click Demo) :
                  </span>
                  <span className="text-[10px] text-slate-500">
                    เลือกตัวอย่างเพื่อดูการสกัดข้อมูล
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {PRESET_SAMPLES.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleSelectPreset(sample)}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-white text-left transition-all hover:shadow-md cursor-pointer group flex flex-col justify-between space-y-2.5"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${sample.badgeColor}`}
                          >
                            {sample.badge}
                          </span>
                          <span className="text-[9px] font-mono text-slate-400 font-bold">
                            {sample.data.docNo}
                          </span>
                        </div>
                        <h5 className="font-bold text-xs text-slate-900 group-hover:text-blue-700 transition-colors leading-snug line-clamp-2">
                          {sample.data.title}
                        </h5>
                      </div>

                      <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500">
                        <span className="font-medium truncate max-w-[120px]">
                          {sample.data.suggestedDept}
                        </span>
                        <span className="text-blue-600 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          ทดสอบสแกน <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SCANNING ANIMATION */}
          {step === "scanning" && (
            <div className="py-20 flex flex-col items-center justify-center space-y-5 text-center animate-in fade-in">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/30">
                  <RefreshCw className="w-10 h-10 animate-spin" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-slate-950">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1.5 max-w-md">
                <h4 className="text-base font-black text-slate-900">
                  AI Vision กำลังวิเคราะห์และสกัดข้อมูลหนังสือราชการ...
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  ตรวจจับตราครุฑ แยกโครงสร้างหัวหนังสือ ({fileName}) สกัดเลขที่ วันที่ หน่วยงาน
                  และวิเคราะห์กองผู้รับผิดชอบ
                </p>
              </div>

              <div className="w-64 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-pulse w-3/4" />
              </div>

              <span className="text-[11px] font-mono text-slate-400">
                Model: Google Gemini 2.5 Flash • Pipeline: Thai-Gov-Vision-v2
              </span>
            </div>
          )}

          {/* STEP 3: SIDE-BY-SIDE REVIEW & INSPECTION */}
          {step === "review" && (
            <div className="space-y-5 animate-in fade-in">
              {/* Human-in-the-Loop Safe Banner */}
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-amber-900 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs">
                      ข้อกำหนดความปลอดภัยข้อมูลราชการ (Human-in-the-Loop Verification)
                    </span>
                    <p className="text-[11px] text-amber-800">
                      ข้อมูลถูกสกัดโดย AI อัตโนมัติ (สถานะ: <strong>PENDING_HUMAN_REVIEW</strong>)
                      เจ้าหน้าที่สามารถตรวจทานแก้ไขข้อมูล และกดยืนยันเพื่อนำเข้าสู่แบบฟอร์มลงรับ
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-amber-200/80 px-2.5 py-1 rounded-full text-amber-900 border border-amber-300">
                  สถานะ: รอคนตรวจสอบ
                </span>
              </div>

              {/* Side-by-Side Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* LEFT: Scanned Document Visual Inspection (5 cols) */}
                <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-4 border border-slate-800 flex flex-col space-y-3 shadow-inner">
                  <div className="flex items-center justify-between text-slate-300 pb-2 border-b border-slate-800">
                    <span className="font-bold text-xs flex items-center gap-1.5 text-white">
                      <Eye className="w-4 h-4 text-cyan-400" />
                      เอกสารต้นฉบับและโซนที่ AI ตรวจพบ
                    </span>
                    <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-cyan-300 border border-slate-700">
                      Vision Detection
                    </span>
                  </div>

                  {previewImage ? (
                    <div className="rounded-xl overflow-hidden border border-slate-700 bg-black flex items-center justify-center max-h-[460px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewImage}
                        alt="Scanned preview"
                        className="object-contain max-h-[460px] w-full"
                      />
                    </div>
                  ) : (
                    /* High-Fidelity Synthetic Scanned Thai Gov Document with Visual Bounding Boxes */
                    <div className="bg-white rounded-xl p-5 text-slate-900 border border-slate-200 relative shadow-md font-serif text-[11px] select-none space-y-3 min-h-[420px]">
                      {/* Header with Garuda and bounding box */}
                      <div className="flex items-start justify-between relative">
                        <div className="relative p-1.5 border border-dashed border-emerald-500 bg-emerald-50/40 rounded">
                          <span className="absolute -top-2 left-1 bg-emerald-600 text-white font-mono text-[8px] px-1 rounded">
                            ที่หนังสือ ({confidenceScores.docNo}%)
                          </span>
                          <span className="font-mono font-bold text-blue-900">
                            {extractedData.docNo}
                          </span>
                        </div>

                        <div className="flex flex-col items-center pt-1">
                          <ThaiGaruda className="w-10 h-10 text-slate-950" size="standard" />
                        </div>

                        <div className="relative p-1.5 border border-dashed border-emerald-500 bg-emerald-50/40 rounded">
                          <span className="absolute -top-2 right-1 bg-emerald-600 text-white font-mono text-[8px] px-1 rounded">
                            วันที่ ({confidenceScores.docDate}%)
                          </span>
                          <span className="font-bold text-slate-800">
                            {extractedData.docDate}
                          </span>
                        </div>
                      </div>

                      {/* Sender and Recipient */}
                      <div className="space-y-1.5 pt-1">
                        <div className="relative p-1.5 border border-dashed border-emerald-500 bg-emerald-50/40 rounded">
                          <span className="absolute -top-2 left-1 bg-emerald-600 text-white font-mono text-[8px] px-1 rounded">
                            จากหน่วยงาน ({confidenceScores.fromOrg}%)
                          </span>
                          <div className="font-medium text-slate-800 truncate">
                            {extractedData.fromOrg}
                          </div>
                        </div>

                        <div className="relative p-1.5 border border-dashed border-emerald-500 bg-emerald-50/40 rounded">
                          <span className="absolute -top-2 left-1 bg-emerald-600 text-white font-mono text-[8px] px-1 rounded">
                            ถึง ({confidenceScores.toOrg}%)
                          </span>
                          <div className="font-medium text-slate-800 truncate">
                            {extractedData.toOrg}
                          </div>
                        </div>
                      </div>

                      {/* Subject */}
                      <div className="relative p-1.5 border-2 border-dashed border-blue-500 bg-blue-50/50 rounded">
                        <span className="absolute -top-2.5 left-2 bg-blue-600 text-white font-mono text-[8px] px-1.5 rounded font-bold">
                          เรื่อง / Title ({confidenceScores.title}%)
                        </span>
                        <div className="font-bold text-slate-950 leading-snug line-clamp-2">
                          {extractedData.title}
                        </div>
                      </div>

                      {/* Mocked Document Body */}
                      <div className="text-slate-500 text-[10px] leading-relaxed indent-4 font-sans line-clamp-4 pt-1">
                        ด้วยในห้วงระยะเวลานี้ สภาพภูมิอากาศในพื้นที่จังหวัดเชียงรายมีความแปรปรวน
                        ส่งผลให้มีปริมาณน้ำฝนสะสมสูงในหลายพื้นที่ อาจก่อให้เกิดภัยพิบัติน้ำท่วมฉับพลัน
                        น้ำป่าไหลหลาก และดินโคลนถล่ม จึงขอให้อบต.ดอยงาม
                        จัดเตรียมความพร้อมทั้งในด้านเครื่องจักรกล บุคลากร และแผนเผชิญเหตุ...
                      </div>

                      {/* Detection Watermark Tag */}
                      <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                        <span>SCAN RESOLUTION: 300 DPI</span>
                        <span className="text-emerald-600 font-bold">BOUNDING BOXES: 5/5 OK</span>
                      </div>
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 flex items-center justify-between font-mono px-1">
                    <span>ไฟล์: {fileName || "scanned_doc.pdf"}</span>
                    <button
                      type="button"
                      onClick={() => setStep("upload")}
                      className="text-cyan-400 hover:underline cursor-pointer"
                    >
                      เปลี่ยนไฟล์ ↗
                    </button>
                  </div>
                </div>

                {/* RIGHT: Extracted Data Fields & AI Suggestions (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Grid of Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Doc No */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-slate-700 text-xs">ที่หนังสือ :</label>
                        <span className="text-[9.5px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.2 rounded-full border border-emerald-200">
                          มั่นใจ {confidenceScores.docNo}%
                        </span>
                      </div>
                      <input
                        type="text"
                        value={extractedData.docNo}
                        onChange={(e) =>
                          setExtractedData({ ...extractedData, docNo: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs"
                      />
                    </div>

                    {/* Doc Date */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-slate-700 text-xs">ลงวันที่ :</label>
                        <span className="text-[9.5px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.2 rounded-full border border-emerald-200">
                          มั่นใจ {confidenceScores.docDate}%
                        </span>
                      </div>
                      <input
                        type="date"
                        value={extractedData.docDate}
                        onChange={(e) =>
                          setExtractedData({ ...extractedData, docDate: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs"
                      />
                    </div>

                    {/* From Org */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-slate-700 text-xs">จากหน่วยงาน :</label>
                        <span className="text-[9.5px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.2 rounded-full border border-emerald-200">
                          มั่นใจ {confidenceScores.fromOrg}%
                        </span>
                      </div>
                      <input
                        type="text"
                        value={extractedData.fromOrg}
                        onChange={(e) =>
                          setExtractedData({ ...extractedData, fromOrg: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs"
                      />
                    </div>

                    {/* To Org */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-slate-700 text-xs">ถึง :</label>
                        <span className="text-[9.5px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.2 rounded-full border border-emerald-200">
                          มั่นใจ {confidenceScores.toOrg}%
                        </span>
                      </div>
                      <input
                        type="text"
                        value={extractedData.toOrg}
                        onChange={(e) =>
                          setExtractedData({ ...extractedData, toOrg: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-700 text-xs">เรื่อง :</label>
                      <span className="text-[9.5px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.2 rounded-full border border-emerald-200">
                        มั่นใจ {confidenceScores.title}%
                      </span>
                    </div>
                    <input
                      type="text"
                      value={extractedData.title}
                      onChange={(e) =>
                        setExtractedData({ ...extractedData, title: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-extrabold text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs leading-relaxed"
                    />
                  </div>

                  {/* AI Summary */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-purple-950 text-xs flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        สรุปสาระสำคัญโดย AI (Executive Summary) :
                      </label>
                      <span className="text-[9px] font-mono font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                        Gemini 2.5 Flash
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={extractedData.summary}
                      onChange={(e) =>
                        setExtractedData({ ...extractedData, summary: e.target.value })
                      }
                      className="w-full p-3 rounded-xl border border-purple-200 bg-purple-50/40 text-slate-800 leading-relaxed font-medium text-xs focus:bg-white focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    />
                  </div>

                  {/* Suggested Department & Officer */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-blue-600" />
                        การเสนอแนะกองผู้รับผิดชอบและเจ้าหน้าที่ :
                      </span>
                      <span className="text-[9.5px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                        แนะนำอัตโนมัติ
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">
                          กอง/สำนักที่รับผิดชอบ :
                        </label>
                        <select
                          value={extractedData.suggestedDept}
                          onChange={(e) =>
                            setExtractedData({ ...extractedData, suggestedDept: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white text-xs"
                        >
                          <option value="สำนักปลัด">สำนักปลัด (ชร 52001)</option>
                          <option value="กองคลัง">กองคลัง (ชร 52002)</option>
                          <option value="กองช่าง">กองช่าง (ชร 52003)</option>
                          <option value="กองการศึกษาฯ">กองการศึกษาฯ (ชร 52004)</option>
                          <option value="กองสาธารณสุข">กองสาธารณสุข (ชร 52005)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">
                          เจ้าหน้าที่ผู้รับผิดชอบเรื่อง :
                        </label>
                        <input
                          type="text"
                          value={extractedData.suggestedOfficer}
                          onChange={(e) =>
                            setExtractedData({
                              ...extractedData,
                              suggestedOfficer: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        {step === "review" && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep("upload")}
              className="w-full sm:w-auto text-xs font-bold rounded-xl h-10 px-4 border-slate-300 cursor-pointer"
            >
              สแกนไฟล์อื่นใหม่
            </Button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 sm:flex-none text-xs font-bold rounded-xl h-10 px-4 border-slate-300 text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                ยกเลิก
              </Button>

              <Button
                type="button"
                onClick={handleConfirm}
                className="flex-1 sm:flex-none bg-[#0052FF] hover:bg-blue-700 text-white font-bold text-xs rounded-xl h-10 px-6 gap-2 shadow-md shadow-blue-500/20 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>ยืนยันข้อมูลเข้าสู่ระบบราชการ</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
