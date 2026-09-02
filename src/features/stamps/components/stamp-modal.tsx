"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Stamp,
  SlidersHorizontal,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  History,
  X,
  Building,
  RotateCw,
  Eye,
} from "lucide-react";

export interface StampTemplateConfig {
  id: string;
  name: string;
  orgName: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  fontSize: number;
  borderColor: string;
  targetPage: "FIRST" | "LAST" | "ALL";
  showLogo: boolean;
  customText?: string;
}

interface StampModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  documentTitle: string;
  regNo: string;
  regDate: string;
  regTime: string;
  onStampSuccess?: () => void;
}

const defaultTemplate: StampTemplateConfig = {
  id: "tpl-01",
  name: "ตรายางรับหนังสือมาตรฐาน อบต.ดอยงาม",
  orgName: "อบต.ดอยงาม",
  positionX: 420,
  positionY: 40,
  width: 150,
  height: 75,
  fontSize: 12,
  borderColor: "#dc2626", // Red Rubber Stamp
  targetPage: "FIRST",
  showLogo: false,
  customText: "รับเอกสารผ่านระบบอิเล็กทรอนิกส์",
};

export function StampModal({
  isOpen,
  onClose,
  documentId,
  documentTitle,
  regNo,
  regDate,
  regTime,
  onStampSuccess,
}: StampModalProps) {
  const [template, setTemplate] = useState<StampTemplateConfig>(defaultTemplate);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStampedSuccess, setIsStampedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"apply" | "settings">("apply");

  if (!isOpen) return null;

  const handleApplyStamp = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsStampedSuccess(true);
      if (onStampSuccess) onStampSuccess();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-navy-950 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Stamp className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-extrabold text-base">ระบบประทับตรายางรับหนังสือ (Automatic Receive Stamp)</h3>
              <p className="text-xs text-slate-300">สร้างเวอร์ชัน Stamped PDF ใหม่โดยไม่แตะ Original</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="bg-slate-100 px-6 py-2 border-b border-slate-200 flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab("apply")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "apply" ? "bg-white text-navy-950 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ปั๊มตรารับลง PDF
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "settings" ? "bg-white text-navy-950 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ตั้งค่าพิกัดเทมเพลต (X, Y, ขนาด)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {isStampedSuccess ? (
            <div className="p-8 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-900">ประทับตรารับหนังสือสำเร็จเรียบร้อย!</h4>
                <p className="text-xs text-slate-500 mt-1">
                  ระบบได้สร้างไฟล์ <strong>stamped_{regNo.replace("/", "_")}.pdf</strong> ในโฟลเดอร์ <code>stamped/</code> เรียบร้อยแล้ว
                </p>
                <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold">
                  <Lock className="w-3.5 h-3.5" />
                  ไฟล์ต้นฉบับ (Original PDF) ยังคงสมบูรณ์ ไม่มีการเปลี่ยนแปลงใดๆ
                </div>
              </div>

              <div className="pt-4 flex justify-center gap-2">
                <Button
                  onClick={onClose}
                  className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl h-10 px-6 cursor-pointer"
                >
                  เสร็จสิ้น / ปิดหน้าต่าง
                </Button>
              </div>
            </div>
          ) : activeTab === "apply" ? (
            <div className="space-y-6">
              {/* Document Summary Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-500">เอกสารเป้าหมาย :</span>
                  <span className="font-mono font-black text-blue-900 text-sm">เลขรับ {regNo}</span>
                </div>
                <p className="font-bold text-slate-900 text-sm">{documentTitle}</p>
                <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                  <span>วันที่รับ: <strong>{regDate}</strong></span>
                  <span>เวลาที่รับ: <strong>{regTime}</strong></span>
                  <span>หน่วยงาน: <strong>{template.orgName}</strong></span>
                </div>
              </div>

              {/* Rubber Stamp Live Preview */}
              <div>
                <span className="font-bold text-slate-700 block mb-2">ตัวอย่างตรายางที่จะประทับลงบนเอกสาร :</span>
                <div className="p-8 bg-slate-900/5 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center">
                  <div
                    style={{
                      width: `${template.width}px`,
                      height: `${template.height}px`,
                      borderColor: template.borderColor,
                      color: template.borderColor,
                    }}
                    className="border-2 border-dashed bg-white/90 p-2.5 rounded-lg text-center font-bold relative shadow-xs flex flex-col justify-between"
                  >
                    <p className="font-black text-xs">{template.orgName}</p>
                    <div className="text-[10px] space-y-0.5 font-mono">
                      <p>เลขรับ: {regNo}</p>
                      <p>วันที่: {regDate}</p>
                      <p>เวลา: {regTime}</p>
                    </div>
                    {template.customText && (
                      <p className="text-[8px] opacity-80 truncate">{template.customText}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="text-xs font-bold rounded-xl h-10 px-4 border-slate-300"
                >
                  ยกเลิก
                </Button>
                <Button
                  onClick={handleApplyStamp}
                  disabled={isProcessing}
                  className="bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl h-10 px-6 gap-2 shadow-xs cursor-pointer"
                >
                  <Stamp className="w-4 h-4" />
                  {isProcessing ? "กำลังประทับตราและสร้าง PDF..." : "ยืนยันปั๊มตรารับลง PDF"}
                </Button>
              </div>
            </div>
          ) : (
            /* Tab 2: Settings */
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">ชื่อหน่วยงานในตรายาง :</label>
                  <input
                    type="text"
                    value={template.orgName}
                    onChange={(e) => setTemplate({ ...template, orgName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">สีตรายาง :</label>
                  <select
                    value={template.borderColor}
                    onChange={(e) => setTemplate({ ...template, borderColor: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold bg-white"
                  >
                    <option value="#dc2626">แดง (Red Rubber Stamp - มาตรฐาน)</option>
                    <option value="#1d4ed8">น้ำเงิน (Blue Rubber Stamp)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">พิกัด X (pt) :</label>
                  <input
                    type="number"
                    value={template.positionX}
                    onChange={(e) => setTemplate({ ...template, positionX: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">พิกัด Y (pt) :</label>
                  <input
                    type="number"
                    value={template.positionY}
                    onChange={(e) => setTemplate({ ...template, positionY: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">ความกว้าง :</label>
                  <input
                    type="number"
                    value={template.width}
                    onChange={(e) => setTemplate({ ...template, width: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">ความสูง :</label>
                  <input
                    type="number"
                    value={template.height}
                    onChange={(e) => setTemplate({ ...template, height: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">หน้าที่ประทับตรา :</label>
                <select
                  value={template.targetPage}
                  onChange={(e) => setTemplate({ ...template, targetPage: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold bg-white"
                >
                  <option value="FIRST">หน้าแรกเท่านั้น (First Page - มาตรฐานราชการ)</option>
                  <option value="LAST">หน้าสุดท้าย (Last Page)</option>
                  <option value="ALL">ทุกหน้า (All Pages)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  onClick={() => setActiveTab("apply")}
                  className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl h-10 px-5 cursor-pointer"
                >
                  บันทึกการตั้งค่าเทมเพลต
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
