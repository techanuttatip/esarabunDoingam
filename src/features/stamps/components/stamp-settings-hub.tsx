"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Stamp,
  Sliders,
  CheckCircle2,
  Sparkles,
  Building,
  RotateCcw,
  Upload,
  Image as ImageIcon,
  Trash2,
  Eye,
  Check,
  Palette,
  Layers,
  Settings2,
  FileText,
  Volume2,
  Building2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { ThaiGaruda } from "@/components/shared/thai-garuda";

export interface DepartmentStampConfig {
  id: string;
  deptKey: string;
  deptDisplayName: string;
  stampTitle: string;
  prefixFormat: string;
  borderColor: string;
  textColor: string;
  rotation: number;
  showSubDivisions: boolean; // false for standard SAO (อบต.ดอยงาม), true for large Municipalities
  subDivisions: string[];
}

export interface StampSettingsState {
  // 1. ตรายางรับสารบรรณกลาง (Central Inward Stamp)
  centralStamp: {
    orgName: string;
    subText: string;
    borderColor: string;
    textColor: string;
    borderStyle: "double" | "solid" | "rounded";
    rotation: number;
    showTime: boolean;
    showReceiver: boolean;
    receiverText: string;
  };
  // 2. ตรายางรับประจำกองครบทุกกอง (All Department Stamps)
  deptStamps: DepartmentStampConfig[];
  // 3. ตรายางส่งต่อสารบรรณ (Routing / Forward Stamp)
  routingStamp: {
    title: string;
    officerName: string;
    deptList: string[];
    borderColor: string;
    textColor: string;
    rotation: number;
  };
  // 4. ตรายางด่วน/ลับ
  speedStamp: {
    text: string;
    color: string;
    borderWidth: number;
  };
  // 5. ภาพตรายางจริงที่อัปโหลด (Uploaded Real Scanned Stamp)
  customStampImage?: string;
  useCustomImage: boolean;
}

export const INITIAL_DEPT_STAMPS: DepartmentStampConfig[] = [
  {
    id: "dept-sec",
    deptKey: "สำนักปลัด",
    deptDisplayName: "สำนักปลัด",
    stampTitle: "สำนักปลัด (ลงรับแล้ว)",
    prefixFormat: "สป-xxx/2569",
    borderColor: "#b91c1c",
    textColor: "#991b1b",
    rotation: -1,
    showSubDivisions: false, // Default SAO (ไม่มีฝ่ายย่อย)
    subDivisions: [
      "งานบริหารงานทั่วไป",
      "งานนโยบายและแผน",
      "งานกฎหมายและคดี",
      "งานป้องกันและบรรเทาสาธารณภัย",
    ],
  },
  {
    id: "dept-fin",
    deptKey: "กองคลัง",
    deptDisplayName: "กองคลัง",
    stampTitle: "กองคลัง (ลงรับแล้ว)",
    prefixFormat: "คลัง-xxx/2569",
    borderColor: "#b91c1c",
    textColor: "#991b1b",
    rotation: -1,
    showSubDivisions: false, // Default SAO (ไม่มีฝ่ายย่อย)
    subDivisions: [
      "งานธุรการ",
      "งานการเงินและบัญชี",
      "งานพัสดุและทรัพย์สิน",
      "งานพัฒนารายได้",
      "งานแผนที่ภาษี",
    ],
  },
  {
    id: "dept-eng",
    deptKey: "กองช่าง",
    deptDisplayName: "กองช่าง",
    stampTitle: "กองช่าง (ลงรับแล้ว)",
    prefixFormat: "ช่าง-xxx/2569",
    borderColor: "#b91c1c",
    textColor: "#991b1b",
    rotation: -1,
    showSubDivisions: false, // Default SAO (ไม่มีฝ่ายย่อย)
    subDivisions: [
      "งานก่อสร้างและผังเมือง",
      "งานออกแบบและควบคุมอาคาร",
      "งานประสานสาธารณูปโภค",
    ],
  },
  {
    id: "dept-edu",
    deptKey: "กองการศึกษาฯ",
    deptDisplayName: "กองการศึกษา ศาสนาและวัฒนธรรม",
    stampTitle: "กองการศึกษาฯ (ลงรับแล้ว)",
    prefixFormat: "ศธ-xxx/2569",
    borderColor: "#b91c1c",
    textColor: "#991b1b",
    rotation: -1,
    showSubDivisions: false, // Default SAO (ไม่มีฝ่ายย่อย)
    subDivisions: [
      "งานการศึกษาปฐมวัย / ศพด.",
      "งานส่งเสริมการศึกษา ศาสนาและวัฒนธรรม",
      "งานกีฬาและนันทนาการ",
    ],
  },
  {
    id: "dept-health",
    deptKey: "กองสาธารณสุข",
    deptDisplayName: "กองสาธารณสุขและสิ่งแวดล้อม",
    stampTitle: "กองสาธารณสุขฯ (ลงรับแล้ว)",
    prefixFormat: "สธ-xxx/2569",
    borderColor: "#b91c1c",
    textColor: "#991b1b",
    rotation: -1,
    showSubDivisions: false, // Default SAO (ไม่มีฝ่ายย่อย)
    subDivisions: [
      "งานอนามัยและสิ่งแวดล้อม",
      "งานรักษาความสะอาดและขยะมูลฝอย",
      "งานส่งเสริมสุขภาพและสาธารณสุข",
    ],
  },
  {
    id: "dept-audit",
    deptKey: "หน่วยตรวจสอบภายใน",
    deptDisplayName: "หน่วยตรวจสอบภายใน",
    stampTitle: "หน่วยตรวจสอบภายใน (ลงรับแล้ว)",
    prefixFormat: "ตสน-xxx/2569",
    borderColor: "#b91c1c",
    textColor: "#991b1b",
    rotation: -1,
    showSubDivisions: false, // Default SAO (ไม่มีฝ่ายย่อย)
    subDivisions: [
      "งานตรวจสอบการเงินและบัญชี",
      "งานตรวจสอบการดำเนินงาน",
    ],
  },
];

export const DEFAULT_STAMP_SETTINGS: StampSettingsState = {
  centralStamp: {
    orgName: "องค์การบริหารส่วนตำบลดอยงาม",
    subText: "สารบรรณกลาง",
    borderColor: "#003399",
    textColor: "#003399",
    borderStyle: "double",
    rotation: 1,
    showTime: true,
    showReceiver: true,
    receiverText: "ผู้รับ......................",
  },
  deptStamps: INITIAL_DEPT_STAMPS,
  routingStamp: {
    title: "๑. ตราส่งกอง (สารบรรณ)",
    officerName: "โศรดา",
    deptList: ["สำนักปลัด", "กองคลัง", "กองช่าง", "กองการศึกษาฯ", "กองสาธารณสุข", "หน่วยตรวจสอบภายใน"],
    borderColor: "#003399",
    textColor: "#003399",
    rotation: -1,
  },
  speedStamp: {
    text: "ด่วนที่สุด",
    color: "#dc2626",
    borderWidth: 2,
  },
  useCustomImage: false,
};

export function StampSettingsHub() {
  const [settings, setSettings] = useState<StampSettingsState>(DEFAULT_STAMP_SETTINGS);
  const [activeStampType, setActiveStampType] = useState<"central" | "dept" | "routing" | "speed" | "upload">("dept");
  const [selectedDeptIndex, setSelectedDeptIndex] = useState<number>(1); // default to กองคลัง
  const [isSaved, setIsSaved] = useState(false);
  const [isStampAnimating, setIsStampAnimating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("smartsarabun_stamp_settings");
        if (saved) {
          const parsed = JSON.parse(saved);
          // ensure deptStamps exists
          if (!parsed.deptStamps || parsed.deptStamps.length === 0) {
            parsed.deptStamps = INITIAL_DEPT_STAMPS;
          }
          setSettings(parsed);
        }
      } catch (e) {
        console.error("Failed to load stamp settings", e);
      }
    }
  }, []);

  const handleSave = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("smartsarabun_stamp_settings", JSON.stringify(settings));
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      } catch (e) {
        console.error("Failed to save stamp settings", e);
      }
    }
  };

  const handleReset = () => {
    setSettings(DEFAULT_STAMP_SETTINGS);
    if (typeof window !== "undefined") {
      localStorage.removeItem("smartsarabun_stamp_settings");
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setSettings((prev) => ({
          ...prev,
          customStampImage: dataUrl,
          useCustomImage: true,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTriggerStampAnimation = () => {
    setIsStampAnimating(true);
    setTimeout(() => setIsStampAnimating(false), 600);
  };

  const currentDept = settings.deptStamps[selectedDeptIndex] || settings.deptStamps[0];

  const updateCurrentDept = (updates: Partial<DepartmentStampConfig>) => {
    const updatedList = [...settings.deptStamps];
    updatedList[selectedDeptIndex] = {
      ...updatedList[selectedDeptIndex],
      ...updates,
    };
    setSettings({
      ...settings,
      deptStamps: updatedList,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Stamp className="w-5 h-5 text-blue-700" />
            <span>ตั้งค่าตรายางและตราประทับราชการ (Official Stamps Studio)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            กำหนดตรายางครบทุกกองงานใน อบต.ดอยงาม (สำนักปลัด, กองคลัง, กองช่าง, กองการศึกษา, กองสาธารณสุข, หน่วยตรวจสอบภายใน)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSaved && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              บันทึกการตั้งค่าตรายางเรียบร้อย!
            </span>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="text-xs font-bold rounded-xl h-10 px-3.5 border-slate-300 gap-1.5 hover:bg-slate-100 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
            คืนค่าเริ่มต้น
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl h-10 px-5 gap-1.5 shadow-xs cursor-pointer"
          >
            <Check className="w-4 h-4 text-emerald-300" />
            บันทึกการตั้งค่า
          </Button>
        </div>
      </div>

      {/* Main Grid: Left Controls (50%) | Right Live Paper Canvas Preview (50%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =================================================================== */}
        {/* LEFT COLUMN: STAMP CONFIGURATION TABS & CONTROLS */}
        {/* =================================================================== */}
        <div className="lg:col-span-6 space-y-4">
          {/* Stamp Type Selector Pills */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
            {[
              { id: "dept", label: "🔴 ตรายางรับครบทุกกอง (๖ กอง)", desc: "กองคลัง, ช่าง, ปลัด ฯลฯ" },
              { id: "central", label: "🔵 ตรายางรับสารบรรณกลาง", desc: "อบต.ดอยงาม" },
              { id: "routing", label: "📋 ตราส่งต่อสารบรรณ", desc: "เลือกติ๊กส่งกอง" },
              { id: "speed", label: "⚡ ตราด่วน/ลับ", desc: "ด่วนที่สุด" },
              { id: "upload", label: "📷 ตรายางจริง (Upload)", desc: "ภาพสแกน PNG" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveStampType(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex flex-col items-start ${
                  activeStampType === tab.id
                    ? "bg-navy-900 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] ${activeStampType === tab.id ? "text-slate-300" : "text-slate-400"}`}>
                  {tab.desc}
                </span>
              </button>
            ))}
          </div>

          {/* 1. ALL DEPARTMENT INWARD STAMPS (ครบทุกกอง + Toggle ฝ่ายย่อย) */}
          {activeStampType === "dept" && (
            <Card className="rounded-3xl border-slate-200 shadow-xs bg-white">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-extrabold text-slate-900 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-red-600" />
                    <span>ตั้งค่าตรายางลงรับประจำกอง (ครบทุก ๖ กองงาน)</span>
                  </div>
                  <span className="text-[10px] font-bold bg-red-50 text-red-700 px-2 py-0.5 rounded-full border border-red-200">
                    {settings.deptStamps.length} กองงาน
                  </span>
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  เลือกกองงานเพื่อปรับแต่งข้อความตรายาง รูปแบบเลขรับ และเปิด/ปิดโหมดแสดงฝ่ายย่อย
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-4 text-xs">
                {/* Department Selection Tabs */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">เลือกกองงานที่ต้องการตั้งค่าตรายาง :</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {settings.deptStamps.map((dept, idx) => (
                      <button
                        key={dept.id}
                        type="button"
                        onClick={() => setSelectedDeptIndex(idx)}
                        className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                          selectedDeptIndex === idx
                            ? "bg-red-50 border-red-300 text-red-950 font-black shadow-xs ring-1 ring-red-400"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold"
                        }`}
                      >
                        <div className="text-[11px] truncate">{dept.deptDisplayName}</div>
                        <div className="text-[9px] font-mono text-slate-500">{dept.prefixFormat}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Department Settings Form */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-black text-slate-900 text-xs">
                      กำลังตั้งค่า: {currentDept.deptDisplayName}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-red-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {currentDept.stampTitle}
                    </span>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">ข้อความหัวตรายางประจำกอง * :</label>
                    <input
                      type="text"
                      value={currentDept.stampTitle}
                      onChange={(e) => updateCurrentDept({ stampTitle: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">รูปแบบเลขรับประจำกอง :</label>
                      <input
                        type="text"
                        value={currentDept.prefixFormat}
                        onChange={(e) => updateCurrentDept({ prefixFormat: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 bg-white"
                        placeholder="เช่น คลัง-xxx/2569"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">สีหมึกตรายางกอง :</label>
                      <div className="flex items-center gap-2 pt-1">
                        {[
                          { color: "#b91c1c", name: "แดงชาด (มาตรฐาน)" },
                          { color: "#dc2626", name: "แดงสว่าง" },
                          { color: "#003399", name: "น้ำเงินสารบรรณ" },
                          { color: "#6b21a8", name: "ม่วงตรายาง" },
                        ].map((item) => (
                          <button
                            key={item.color}
                            type="button"
                            onClick={() =>
                              updateCurrentDept({
                                borderColor: item.color,
                                textColor: item.color,
                              })
                            }
                            style={{ backgroundColor: item.color }}
                            className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                              currentDept.borderColor === item.color
                                ? "border-amber-400 scale-110 shadow-xs ring-2 ring-red-300"
                                : "border-white"
                            }`}
                            title={item.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* SUB-DIVISIONS TOGGLE (ตามที่ผู้ใช้ระบุ: อบต.ปกติไม่มีฝ่ายย่อย แต่ทำเผื่อเทศบาลขนาดใหญ่) */}
                  <div className="pt-2 border-t border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                      <div>
                        <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          <span>🏢 โหมดแสดงรายการฝ่ายย่อยภายในกอง (สำหรับเทศบาลขนาดใหญ่)</span>
                        </div>
                        <p className="text-[10px] text-slate-500">
                          {currentDept.showSubDivisions
                            ? "✅ เปิดใช้งาน: แสดงกล่องเช็คบ็อกซ์ฝ่ายย่อยในตรายาง"
                            : "🔒 ปิดใช้งาน (โหมด อบต.ดอยงาม): ตรายางเรียบหรู กระชับ ไม่มีรายการฝ่ายย่อย"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          updateCurrentDept({
                            showSubDivisions: !currentDept.showSubDivisions,
                          })
                        }
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1 ${
                          currentDept.showSubDivisions
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                        }`}
                      >
                        {currentDept.showSubDivisions ? "เปิดฝ่ายย่อยอยู่" : "ปิดฝ่ายย่อย (อบต.ปกติ)"}
                      </button>
                    </div>

                    {/* Show subdivision editor only if toggle is ON */}
                    {currentDept.showSubDivisions && (
                      <div className="space-y-1.5 animate-in fade-in">
                        <label className="font-bold text-slate-700 block text-[11px]">
                          รายการฝ่ายย่อยภายในกอง (คั่นด้วยเครื่องหมายจุลภาค ,) :
                        </label>
                        <textarea
                          rows={2}
                          value={currentDept.subDivisions.join(", ")}
                          onChange={(e) =>
                            updateCurrentDept({
                              subDivisions: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                          placeholder="เช่น งานธุรการ, งานการเงินและบัญชี, งานพัสดุ, งานก่อสร้าง"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 2. CENTRAL INWARD STAMP SETTINGS */}
          {activeStampType === "central" && (
            <Card className="rounded-3xl border-slate-200 shadow-xs bg-white">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  ตั้งค่าตรายางรับสารบรรณกลาง (Central Inward Stamp)
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  ตรายางมาตรฐานที่ประทับลงบนเอกสารเข้าสารบรรณกลาง อบต.ดอยงาม
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">ข้อความหัวตรายาง (ชื่อองค์กร) * :</label>
                  <input
                    type="text"
                    value={settings.centralStamp.orgName}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        centralStamp: { ...settings.centralStamp, orgName: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-navy-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">สีหมึกตรายาง :</label>
                    <div className="flex items-center gap-2">
                      {[
                        { color: "#003399", name: "น้ำเงินสารบรรณ" },
                        { color: "#1e3a8a", name: "น้ำเงินเข้ม" },
                        { color: "#b91c1c", name: "แดงชาด" },
                        { color: "#6b21a8", name: "ม่วงตรายาง" },
                      ].map((item) => (
                        <button
                          key={item.color}
                          type="button"
                          onClick={() =>
                            setSettings({
                              ...settings,
                              centralStamp: {
                                ...settings.centralStamp,
                                borderColor: item.color,
                                textColor: item.color,
                              },
                            })
                          }
                          style={{ backgroundColor: item.color }}
                          className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                            settings.centralStamp.borderColor === item.color
                              ? "border-amber-400 scale-110 shadow-xs ring-2 ring-blue-300"
                              : "border-white"
                          }`}
                          title={item.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">รูปแบบกรอบตรายาง :</label>
                    <select
                      value={settings.centralStamp.borderStyle}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          centralStamp: {
                            ...settings.centralStamp,
                            borderStyle: e.target.value as any,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white"
                    >
                      <option value="double">ขอบคู่มาตรฐาน (Double Line)</option>
                      <option value="solid">ขอบเดี่ยวหนา (Solid)</option>
                      <option value="rounded">ขอบมน (Rounded)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      องศาการประทับตรา ({settings.centralStamp.rotation}°) :
                    </label>
                    <input
                      type="range"
                      min="-4"
                      max="4"
                      step="0.5"
                      value={settings.centralStamp.rotation}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          centralStamp: {
                            ...settings.centralStamp,
                            rotation: parseFloat(e.target.value),
                          },
                        })
                      }
                      className="w-full accent-blue-700 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>-4° (เอียงซ้าย)</span>
                      <span>0° (ตรง)</span>
                      <span>+4° (เอียงขวา)</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.centralStamp.showTime}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            centralStamp: {
                              ...settings.centralStamp,
                              showTime: e.target.checked,
                            },
                          })
                        }
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-semibold text-slate-700">แสดงบรรทัด &quot;เวลา.......&quot;</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.centralStamp.showReceiver}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            centralStamp: {
                              ...settings.centralStamp,
                              showReceiver: e.target.checked,
                            },
                          })
                        }
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-semibold text-slate-700">แสดงบรรทัด &quot;ผู้รับ.......&quot;</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 3. ROUTING / FORWARD STAMP SETTINGS */}
          {activeStampType === "routing" && (
            <Card className="rounded-3xl border-slate-200 shadow-xs bg-white">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  ตั้งค่าตราส่งต่อสารบรรณกลาง (Routing / Forward Stamp)
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  ตรายางกล่องเช็คบ็อกซ์สำหรับสารบรรณกลางส่งต่อหนังสือไปยังกองที่เกี่ยวข้อง
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">หัวข้อตรายาง :</label>
                    <input
                      type="text"
                      value={settings.routingStamp.title}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          routingStamp: { ...settings.routingStamp, title: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">ชื่อย่อเจ้าหน้าที่ส่งต่อ :</label>
                    <input
                      type="text"
                      value={settings.routingStamp.officerName}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          routingStamp: { ...settings.routingStamp, officerName: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-serif italic text-blue-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    รายชื่อกองงานที่แสดงในตรายาง (คั่นด้วยจุลภาค ,) :
                  </label>
                  <textarea
                    rows={2}
                    value={settings.routingStamp.deptList.join(", ")}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        routingStamp: {
                          ...settings.routingStamp,
                          deptList: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* 4. SPEED STAMP SETTINGS */}
          {activeStampType === "speed" && (
            <Card className="rounded-3xl border-slate-200 shadow-xs bg-white">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  ตั้งค่าตรายางด่วน & ชั้นความลับ (Speed & Secret Stamps)
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  ตรายางปั๊มความเร่งด่วน เช่น ด่วนที่สุด ด่วนมาก ลับ
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">ข้อความตรายาง :</label>
                    <select
                      value={settings.speedStamp.text}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          speedStamp: { ...settings.speedStamp, text: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white"
                    >
                      <option value="ด่วนที่สุด">ด่วนที่สุด</option>
                      <option value="ด่วนมาก">ด่วนมาก</option>
                      <option value="ด่วน">ด่วน</option>
                      <option value="ลับที่สุด">ลับที่สุด</option>
                      <option value="ลับมาก">ลับมาก</option>
                      <option value="ลับ">ลับ</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">ความหนาของกรอบ :</label>
                    <select
                      value={settings.speedStamp.borderWidth}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          speedStamp: { ...settings.speedStamp, borderWidth: parseInt(e.target.value, 10) },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white"
                    >
                      <option value={1}>1px (บาง)</option>
                      <option value={2}>2px (มาตรฐานราชการ)</option>
                      <option value={3}>3px (หนาพิเศษ)</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 5. UPLOAD CUSTOM REAL RUBBER STAMP IMAGE */}
          {activeStampType === "upload" && (
            <Card className="rounded-3xl border-slate-200 shadow-xs bg-white">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-purple-700" />
                  อัปโหลดภาพตรายางหมึกจริง (Authentic Scanned Stamp PNG)
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  กรณีมีไฟล์ภาพตรายางจริงที่สแกนเป็นไฟล์โปร่งใส PNG สามารถอัปโหลดเพื่อใช้แทนตรายางดิจิทัลได้
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4 text-xs">
                <div className="border-2 border-dashed border-slate-300 hover:border-purple-500 rounded-2xl p-6 text-center space-y-3 bg-slate-50/50 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">คลิกเพื่อเลือกไฟล์ภาพตรายาง (PNG/SVG)</p>
                    <p className="text-[11px] text-slate-400">แนะนำ: ภาพโปร่งใส (Transparent Background) ความละเอียด 300 DPI</p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/svg+xml,image/jpeg"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs rounded-xl h-9 px-4 gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>เลือกไฟล์ภาพตรายาง</span>
                  </Button>
                </div>

                {settings.customStampImage && (
                  <div className="p-3 bg-slate-100 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={settings.customStampImage}
                        alt="Custom Stamp"
                        className="w-16 h-10 object-contain border border-slate-300 rounded bg-white p-1"
                      />
                      <div>
                        <span className="font-bold text-slate-800 block">ภาพตรายางที่อัปโหลดแล้ว</span>
                        <span className="text-[10px] text-emerald-600 font-semibold">พร้อมใช้งานในระบบ</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          setSettings({
                            ...settings,
                            customStampImage: undefined,
                            useCustomImage: false,
                          })
                        }
                        className="rounded-xl h-8 px-2.5 text-xs font-bold gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>ลบภาพ</span>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* =================================================================== */}
        {/* RIGHT COLUMN: LIVE REAL-TIME PAPER CANVAS PREVIEW (50%) */}
        {/* =================================================================== */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 text-white p-4 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-300" />
              <div>
                <span className="text-xs font-bold block">พรีวิวการประทับตราบนแผ่นกระดาษจริง (Live Paper Preview)</span>
                <span className="text-[10px] text-slate-400">
                  แสดงตรายางของ: <strong className="text-white">{currentDept.deptDisplayName}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                onClick={handleTriggerStampAnimation}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl h-8 px-3 gap-1.5 cursor-pointer active:scale-95 transition-transform"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>ทดสอบประทับตรา</span>
              </Button>
            </div>
          </div>

          {/* Quick Department Switcher for Preview */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-2.5 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 shrink-0 px-1">พรีวิวกอง:</span>
            {settings.deptStamps.map((d, idx) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDeptIndex(idx)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedDeptIndex === idx
                    ? "bg-red-600 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {d.deptDisplayName.replace(" ศาสนาและวัฒนธรรม", "").replace("และสิ่งแวดล้อม", "")}
              </button>
            ))}
          </div>

          {/* Paper Canvas */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-xl font-serif text-slate-900 min-h-[500px] relative overflow-hidden select-none">
            {/* Stamp Animation Overlay Effect */}
            {isStampAnimating && (
              <div className="absolute inset-0 bg-blue-500/10 pointer-events-none animate-ping z-30" />
            )}

            {/* Official Document Header with Real-time Configured Stamps */}
            <div className="grid grid-cols-12 gap-2 items-start border-b border-slate-200 pb-4">
              {/* Top-Left: Routing Stamp + Speed Stamp + DocNo */}
              <div className="col-span-4 flex flex-col items-start space-y-2">
                {/* 1. ตราส่งกอง (สารบรรณ) */}
                <div
                  style={{
                    borderColor: settings.routingStamp.borderColor,
                    color: settings.routingStamp.textColor,
                    transform: `rotate(${settings.routingStamp.rotation}deg)`,
                  }}
                  className="border-2 bg-white/95 p-2 rounded text-[9px] leading-tight select-none shadow-2xs w-full max-w-[170px] transition-all"
                >
                  <div
                    style={{ borderColor: settings.routingStamp.borderColor }}
                    className="text-[9px] border-b pb-0.5 mb-1 font-black flex items-center justify-between"
                  >
                    <span>{settings.routingStamp.title}</span>
                    <span className="text-[8px] font-sans italic">{settings.routingStamp.officerName}</span>
                  </div>
                  <div className="space-y-0.5">
                    {settings.routingStamp.deptList.slice(0, 5).map((dept, idx) => (
                      <div key={dept} className="flex items-center gap-1">
                        <div
                          style={{ borderColor: settings.routingStamp.borderColor }}
                          className="w-2.5 h-2.5 border flex items-center justify-center text-[8px] font-bold"
                        >
                          {dept === currentDept.deptKey ? "✓" : ""}
                        </div>
                        <span className="font-semibold text-[8.5px] truncate">{dept}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. ตรายางด่วน */}
                <div
                  style={{
                    borderColor: settings.speedStamp.color,
                    color: settings.speedStamp.color,
                    borderWidth: `${settings.speedStamp.borderWidth}px`,
                  }}
                  className="inline-block px-2 py-0.5 font-black text-[11px] tracking-widest rounded-xs rotate-[-2deg] bg-rose-50/30 select-none shadow-2xs transition-all"
                >
                  {settings.speedStamp.text}
                </div>

                <div className="text-xs font-serif font-bold text-slate-900 pt-0.5">
                  ที่ <span className="font-mono text-blue-950 font-black">มท ๐๘๐๘.๒/ว ๔๕๕๓</span>
                </div>
              </div>

              {/* Center: Garuda & Date */}
              <div className="col-span-4 flex flex-col items-center justify-start text-center pt-1">
                <ThaiGaruda className="w-16 h-16 text-slate-950 mb-1" />
                <div className="text-[11px] font-serif font-bold text-slate-800">
                  ๒๔ มิถุนายน ๒๕๖๙
                </div>
              </div>

              {/* Top-Right: Central Inward Stamp + Dept Inward Stamp */}
              <div className="col-span-4 flex flex-col items-end space-y-2">
                {/* 3. ตรายางรับกลาง อบต.ดอยงาม */}
                <div
                  style={{
                    borderColor: settings.centralStamp.borderColor,
                    color: settings.centralStamp.textColor,
                    borderStyle: settings.centralStamp.borderStyle === "double" ? "double" : "solid",
                    borderWidth: settings.centralStamp.borderStyle === "double" ? "3px" : "2px",
                    transform: `rotate(${settings.centralStamp.rotation}deg)`,
                  }}
                  className={`bg-white/95 p-2 text-[9px] font-bold leading-tight shadow-xs select-none w-full max-w-[190px] transition-all ${
                    settings.centralStamp.borderStyle === "rounded" ? "rounded-xl" : "rounded-xs"
                  }`}
                >
                  <div
                    style={{ borderColor: settings.centralStamp.borderColor }}
                    className="text-center border-b pb-0.5 mb-1 font-black text-[10px]"
                  >
                    {settings.centralStamp.orgName}
                  </div>
                  <div>เลขรับ.......<span className="font-mono text-xs font-black">๒๗๘๕/๒๕๖๙</span>.......</div>
                  <div>วันที่.......<span className="font-medium">๒๘ ส.ค. ๒๕๖๙</span>.......</div>
                  {settings.centralStamp.showTime && (
                    <div>เวลา.......<span className="font-medium">๑๔.๓๐ น.</span>.......</div>
                  )}
                  {settings.centralStamp.showReceiver && (
                    <div className="text-[8px] text-slate-500 font-normal pt-0.5">{settings.centralStamp.receiverText}</div>
                  )}
                </div>

                {/* 4. ตรายางรับประจำกอง (ขอบแดง/หมึกตามที่ตั้งค่าของแต่ละกอง) */}
                <div
                  style={{
                    borderColor: currentDept.borderColor,
                    color: currentDept.textColor,
                    transform: `rotate(${currentDept.rotation}deg)`,
                  }}
                  className="border-2 bg-rose-50/20 p-2 rounded text-[8.5px] font-bold leading-tight shadow-xs select-none w-full max-w-[190px] transition-all"
                >
                  <div
                    style={{ borderColor: currentDept.borderColor }}
                    className="text-center border-b pb-0.5 mb-1 font-black text-[9.5px]"
                  >
                    {currentDept.stampTitle}
                  </div>

                  {/* If showSubDivisions is true (Large Municipality mode), show checkboxes */}
                  {currentDept.showSubDivisions && (
                    <div className="space-y-0.5 mb-1 animate-in fade-in">
                      {currentDept.subDivisions.slice(0, 4).map((sec, idx) => (
                        <div key={sec} className="flex items-center gap-1">
                          <span className="text-[8px]">{idx === 1 ? "✓" : "□"}</span>
                          <span className="truncate">{sec}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div
                    style={{ borderColor: currentDept.borderColor }}
                    className={`${currentDept.showSubDivisions ? "border-t pt-0.5" : "pt-0.5"} text-[8px] space-y-0.5`}
                  >
                    <div>เลขรับกอง: <strong className="font-mono">{currentDept.prefixFormat.replace("xxx", "๐๔๒")}</strong></div>
                    <div>วันที่ ๓๑ ส.ค. ๒๕๖๙ เวลา ๑๔.๓๐ น.</div>
                    {!currentDept.showSubDivisions && (
                      <div className="text-[7.5px] text-slate-500">ผู้รับ: นางสาวสมพร กองเงิน</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Document Body Sample */}
            <div className="mt-4 space-y-2 text-[11px] leading-relaxed text-slate-700">
              <div>
                <strong>เรื่อง : </strong>
                <span>วิธีปฏิบัติการจัดทำงบประมาณรายจ่ายประจำปี พ.ศ. ๒๕๗๐ ขององค์กรปกครองส่วนท้องถิ่น</span>
              </div>
              <div>
                <strong>เรียน : </strong>
                <span>นายกองค์การบริหารส่วนตำบลดอยงาม</span>
              </div>
              <p className="text-justify indent-6 pt-1 text-slate-600">
                ด้วยกระทรวงมหาดไทยได้กำหนดแนวทางและหลักเกณฑ์การจัดทำงบประมาณรายจ่ายประจำปีงบประมาณ พ.ศ. ๒๕๗๐
                เพื่อให้อบต.ดอยงามถือปฏิบัติตามระเบียบกฎหมายอย่างถูกต้องและมีประสิทธิภาพ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
