"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  FileText,
  Inbox,
  Send,
  Hash,
  ClipboardList,
  BarChart3,
  Settings,
  Building2,
  Users,
  Shield,
  ArrowRight,
  Sparkles,
  Clock,
  Command,
  X,
  Server,
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent toggle
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const quickActions = [
    {
      title: "ลงรับหนังสือภายนอก (+ รับหนังสือ)",
      category: "การดำเนินการด่วน",
      icon: Inbox,
      href: "/receive",
      hint: "ออกเลขรับกลางทันที",
    },
    {
      title: "ร่างและส่งหนังสือออก (+ หนังสือส่ง)",
      category: "การดำเนินการด่วน",
      icon: Send,
      href: "/send",
      hint: "สร้างหนังสือภายนอก/ภายใน",
    },
    {
      title: "จองเลขหนังสือด่วน (+ จองเลข)",
      category: "การดำเนินการด่วน",
      icon: Hash,
      href: "/numbers",
      hint: "จองเลขหนังสือภายใน ๓ วินาที",
    },
    {
      title: "งานที่ต้องทำของฉัน (My Work)",
      category: "การดำเนินการด่วน",
      icon: ClipboardList,
      href: "/tasks",
      hint: "คิวงานและรายการรออนุมัติ",
    },
    {
      title: "มท 0808.2/ว 4553 (วิธีปฏิบัติการจัดทำงบประมาณ 2570)",
      category: "เอกสารล่าสุด",
      icon: FileText,
      href: "/receive",
      hint: "กระทรวงมหาดไทย | กองคลัง",
    },
    {
      title: "ชร 0023.1/ว 4589 (โครงการตรวจสอบและรับมืออุทกภัย)",
      category: "เอกสารล่าสุด",
      icon: FileText,
      href: "/receive",
      hint: "ที่ว่าการอำเภอพาน | กองช่าง",
    },
    {
      title: "ภาพรวมแดชบอร์ด",
      category: "หน้าจอระบบ",
      icon: Command,
      href: "/",
      hint: "หน้าหลัก",
    },
    {
      title: "สมุดทะเบียนและรายงานผล",
      category: "หน้าจอระบบ",
      icon: BarChart3,
      href: "/reports",
      hint: "สมุดทะเบียนรับ/ส่ง A4",
    },
    {
      title: "ตั้งค่าระบบและสายการเกษียน",
      category: "การจัดการ",
      icon: Settings,
      href: "/settings",
      hint: "Workflow, 2FA, e-Seal",
    },
  ];

  const filteredItems = quickActions.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase()) ||
    item.hint.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150 select-none">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/90 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[80vh]">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200/80 flex items-center gap-3 bg-white/80 shrink-0">
          <Search className="w-5 h-5 text-[#0052FF]" />
          <input
            type="text"
            autoFocus
            placeholder="ค้นหาเอกสาร คำสั่ง เลขรับ หรือเมนูระบบ (พิมพ์ค้นหาหรือใช้ปุ่มลูกศร)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm font-bold text-slate-900 focus:outline-none placeholder:text-slate-400"
          />
          <div className="flex items-center gap-1.5 font-mono text-[10px] bg-slate-100 px-2 py-1 rounded-lg text-slate-500 font-bold border border-slate-200">
            <span>ESC</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto flex-1 space-y-1">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(item.href)}
                  className={`w-full p-3 rounded-2xl text-left flex items-center justify-between transition-all cursor-pointer group ${
                    idx === selectedIndex
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 shadow-xs"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white text-[#0052FF] flex items-center justify-center border border-slate-200 shadow-2xs shrink-0 group-hover:bg-[#0052FF] group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {item.hint}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold border border-slate-200">
                      {item.category}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#0052FF] transition-colors" />
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-300" />
              <p className="font-bold text-sm text-slate-600">ไม่พบข้อมูลที่ค้นหา</p>
              <p className="text-xs">ลองค้นหาด้วยเลขที่หนังสือ เรื่อง หรือชื่อส่วนราชการ</p>
            </div>
          )}
        </div>

        {/* Footer Shortcut Guide */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400 font-mono shrink-0">
          <div className="flex items-center gap-3">
            <span>↑↓ เพื่อเลือก</span>
            <span>↵ เพื่อเปิด</span>
          </div>
          <span>SMART SARABAN Spotlight UX</span>
        </div>
      </div>
    </div>
  );
}
