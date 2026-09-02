"use client";

import { useState, useRef } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PenTool,
  Upload,
  RotateCcw,
  Check,
  CheckCircle2,
  Trash2,
  Stamp,
  ShieldCheck,
  Download,
} from "lucide-react";
import { useSession } from "@/components/providers/session-provider";

export default function SignaturePage() {
  const { data: session } = useSession();
  const [signatureType, setSignatureType] = useState<"draw" | "upload">("draw");
  const [isSaved, setIsSaved] = useState(false);
  const [signerName, setSignerName] = useState(session?.user?.name || "นายสมศักดิ์ สุขใจ");
  const [signerPosition, setSignerPosition] = useState(session?.user?.position || "ปลัดองค์การบริหารส่วนตำบลดอยงาม");
  const [department, setDepartment] = useState("สำนักปลัด องค์การบริหารส่วนตำบลดอยงาม");
  const [hasSignatureDrawing, setHasSignatureDrawing] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <PageHeader
        title="จัดการลายมือชื่อดิจิทัลและตราประทับ (Digital Signature)"
        description="บันทึกภาพลายมือชื่อและตำแหน่งทางการ เพื่อใช้ในการลงนามและเกษียนหนังสือราชการอิเล็กทรอนิกส์"
      />

      {isSaved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold text-sm">บันทึกลายมือชื่อดิจิทัลเรียบร้อยแล้ว!</p>
            <p className="text-xs text-emerald-700">
              คุณสามารถใช้ลายมือชื่อนี้ประทับลงบนหนังสือราชการและคิวงานรอลงนามได้ทันที
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: วาดหรืออัปโหลดลายมือชื่อ */}
        <Card className="shadow-sm border-slate-200 overflow-hidden">
          <CardHeader className="bg-slate-50/80 px-5 py-3.5 border-b border-slate-200 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
              <PenTool className="w-4 h-4 text-blue-600" />
              ลายมือชื่อดิจิทัล (Digital Signature Canvas)
            </CardTitle>
            <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setSignatureType("draw")}
                className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  signatureType === "draw"
                    ? "bg-navy-800 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                วาดด้วยปากกา/เมาส์
              </button>
              <button
                type="button"
                onClick={() => setSignatureType("upload")}
                className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  signatureType === "upload"
                    ? "bg-navy-800 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                อัปโหลดรูปภาพ PNG
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            {signatureType === "draw" ? (
              <div>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl h-52 bg-white flex flex-col items-center justify-center relative overflow-hidden group shadow-inner">
                  {hasSignatureDrawing ? (
                    <div className="text-center select-none">
                      <div className="font-serif italic text-4xl text-blue-950 font-bold tracking-widest my-2">
                        สมศักดิ์ สุขใจ
                      </div>
                      <span className="text-[11px] text-slate-400">
                        (ลายเซ็นดิจิทัลที่บันทึกไว้ในระบบ)
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">ใช้เมาส์หรือปากกาวาดลายมือชื่อในกรอบนี้</p>
                  )}

                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setHasSignatureDrawing(!hasSignatureDrawing)}
                      className="h-7 text-xs bg-white/90 hover:bg-white text-slate-700 gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      ล้างลายเซ็น
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-slate-50 hover:border-navy-600 transition-colors">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">
                  คลิกเพื่อเลือกไฟล์รูปภาพลายเซ็น (PNG โปร่งใส)
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  แนะนำไฟล์ภาพ .PNG พื้นหลังโปร่งใส ความละเอียดอย่างน้อย 300x150 พิกเซล
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card 2: ข้อมูลชื่อและตำแหน่งทางการ */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50/80 px-5 py-3.5 border-b border-slate-200">
            <CardTitle className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
              <Stamp className="w-4 h-4 text-navy-800" />
              ข้อความระบุชื่อและตำแหน่งใต้ลายมือชื่อ
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  ชื่อ - นามสกุลเต็ม (พร้อมคำนำหน้านาม) :
                </label>
                <input
                  type="text"
                  required
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-navy-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  ตำแหน่งทางการ :
                </label>
                <input
                  type="text"
                  required
                  value={signerPosition}
                  onChange={(e) => setSignerPosition(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-navy-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                สังกัด / หน่วยงาน :
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-navy-600 focus:outline-none"
              />
            </div>

            {/* Live Stamp Preview */}
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                ตัวอย่างตราประทับลายมือชื่อที่จะปรากฏบนเอกสารราชการ :
              </p>
              <div className="p-6 bg-white border border-slate-300 rounded-xl max-w-sm mx-auto text-center shadow-xs space-y-1">
                <div className="font-serif italic text-2xl text-blue-900 font-bold tracking-widest my-1 border-b border-blue-200 pb-1">
                  {signerName.replace(/^(นาย|นาง|นางสาว|ดร\.)/, "")}
                </div>
                <p className="font-bold text-slate-900 text-xs">({signerName})</p>
                <p className="text-slate-600 text-[11px]">{signerPosition}</p>
                <p className="text-[10px] text-slate-400">{department}</p>
                <div className="text-[9px] text-emerald-700 font-bold mt-2 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  E-Signature Verified by SmartSarabun PKI
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="submit"
            className="px-8 bg-navy-800 hover:bg-navy-900 text-white font-semibold text-xs gap-1.5 shadow-md cursor-pointer"
          >
            <Check className="w-4 h-4" />
            บันทึกลายมือชื่อดิจิทัล
          </Button>
        </div>
      </form>
    </div>
  );
}
