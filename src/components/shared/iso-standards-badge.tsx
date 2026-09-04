"use client";

import { useState } from "react";
import { ShieldCheck, CheckCircle2, Award, X, Sparkles, Server, Lock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function IsoStandardsBadge() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="pt-2 border-t border-slate-100 flex flex-col gap-2 text-[10px] text-slate-500">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-emerald-700 font-bold font-sans">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            ระบบความปลอดภัยภาครัฐ SSL/TLS 1.3
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="text-[10px] font-bold text-[#0052FF] hover:underline cursor-pointer flex items-center gap-0.5"
          >
            <span>ดูมาตรฐาน ISO ↗</span>
          </button>
        </div>

        {/* 3 Clickable ISO Badges */}
        <div className="grid grid-cols-3 gap-1.5 pt-0.5">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="px-1.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-all text-center group cursor-pointer"
            title="ISO/IEC 27001 (ISMS): ความปลอดภัยข้อมูลและไซเบอร์"
          >
            <span className="font-mono font-black text-slate-700 group-hover:text-[#0052FF] block text-[9px] leading-tight">
              ISO 27001
            </span>
            <span className="text-[8px] text-slate-400 block font-sans">ISMS ปลอดภัย</span>
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="px-1.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-all text-center group cursor-pointer"
            title="ISO 9001 (QMS): บริหารงานคุณภาพและมาตรฐานสารบรรณ"
          >
            <span className="font-mono font-black text-slate-700 group-hover:text-[#0052FF] block text-[9px] leading-tight">
              ISO 9001
            </span>
            <span className="text-[8px] text-slate-400 block font-sans">QMS คุณภาพ</span>
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="px-1.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-all text-center group cursor-pointer"
            title="ISO/IEC 20000 (ITSM): บริการไอทีเสถียรภาพสูง ไม่ล่มง่าย"
          >
            <span className="font-mono font-black text-slate-700 group-hover:text-[#0052FF] block text-[9px] leading-tight">
              ISO 20000
            </span>
            <span className="text-[8px] text-slate-400 block font-sans">ITSM เสถียรภาพ</span>
          </button>
        </div>
      </div>

      {/* Interactive ISO Standards Compliance Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6 bg-white shadow-2xl border border-slate-200 text-slate-900">
          <DialogHeader className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-black text-slate-900 font-sans">
                  มาตรฐานสากลที่ระบบรองรับ (ISO Compliance)
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 font-medium">
                  SmartSarabun พัฒนาตาม ๓ มาตรฐานสากลภาครัฐ พ.ศ. ๒๕๖๙
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3.5 pt-2 text-xs">
            {/* 1. ISO 27001 */}
            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-black text-blue-900 font-mono text-xs flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#0052FF]" />
                  ISO/IEC 27001 : ISMS
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-200 text-blue-800">
                  ความปลอดภัยข้อมูล
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed font-sans text-[11px]">
                <strong>ระบบการจัดการความปลอดภัยของข้อมูล :</strong> ช่วยปกป้องข้อมูลผู้ใช้งาน รหัสผ่าน และป้องกันการโจมตีทางไซเบอร์ พร้อมระบบระงับสิทธิ์ชั่วคราว (Brute-Force Lockout 15 นาที) และนโยบายทำลายเซสชันทันทีเมื่อปิดเบราว์เซอร์ (Session-Only)
              </p>
            </div>

            {/* 2. ISO 9001 */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-black text-emerald-900 font-mono text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ISO 9001 : QMS
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800">
                  บริหารคุณภาพ
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed font-sans text-[11px]">
                <strong>ระบบบริหารงานคุณภาพ :</strong> ควบคุมกระบวนการพัฒนาเว็บไซต์และการให้บริการให้ได้มาตรฐานสม่ำเสมอ ออกเลข ลงรับ และเกษียนหนังสือถูกต้องตามระเบียบสารบรรณ พ.ศ. ๒๕๖๙ อย่างเคร่งครัด
              </p>
            </div>

            {/* 3. ISO 20000 */}
            <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-black text-purple-900 font-mono text-xs flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-purple-600" />
                  ISO/IEC 20000 : ITSM
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-200 text-purple-800">
                  บริการไอที & SLA
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed font-sans text-[11px]">
                <strong>ระบบการจัดการบริการเทคโนโลยีสารสนเทศ :</strong> ดูแลเสถียรภาพและการให้บริการของเว็บไซต์ไม่ให้ล่มง่าย มีระบบคลังข้อมูลกลางถาวร Zero Data Loss และติดตามระยะเวลาให้บริการ (SLA) อย่างต่อเนื่อง
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all cursor-pointer"
            >
              เข้าใจแล้ว
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
