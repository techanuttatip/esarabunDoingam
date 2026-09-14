"use client";

import { useEffect } from "react";
import { X, Keyboard, Sparkles } from "lucide-react";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcutGroups = [
    {
      group: "การนำทางและคำสั่งด่วน (Navigation & Actions)",
      items: [
        { keys: ["Ctrl", "K"], desc: "เปิดช่องค้นหาเอกสารด่วน (Command Palette)" },
        { keys: ["N"], desc: "ไปหน้า 'ลงรับหนังสือเข้า' ฉบับใหม่" },
        { keys: ["S"], desc: "ไปหน้า 'ออกเลขหนังสือส่ง'" },
        { keys: ["D"], desc: "สลับโหมดตาราง 'สบายตา' ↔ 'กะทัดรัด'" },
      ],
    },
    {
      group: "การควบคุมหน้าต่างและระบบ (Modal & System)",
      items: [
        { keys: ["Esc"], desc: "ปิดหน้าต่าง Modal / ยกเลิกการดูเอกสาร" },
        { keys: ["?"], desc: "เปิด/ปิด แผงคู่มือคีย์ลัดนี้" },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden animate-in zoom-in-95 select-none">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm">คีย์ลัดการทำงานสารบรรณ (Shortcuts)</h3>
              <p className="text-[11px] text-slate-300">
                เพิ่มความเร็วในการปฏิบัติราชการสำหรับเจ้าหน้าที่
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {shortcutGroups.map((grp, i) => (
            <div key={i} className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {grp.group}
              </h4>
              <div className="space-y-1.5">
                {grp.items.map((item, j) => (
                  <div
                    key={j}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 flex items-center justify-between transition-colors"
                  >
                    <span className="text-xs font-semibold text-slate-800">
                      {item.desc}
                    </span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((k, ki) => (
                        <kbd key={ki} className="kbd-badge">
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>มาตรฐาน Accessible GovTech 2026</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 cursor-pointer transition-colors"
          >
            ปิดหน้าต่าง (Esc)
          </button>
        </div>
      </div>
    </div>
  );
}
