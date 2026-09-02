"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  SlidersHorizontal,
  FileText,
  Calendar,
  Building,
  RotateCcw,
  Sparkles,
  Eye,
  Download,
  CheckCircle2,
  Bookmark,
  Plus,
  Trash2,
  Layers,
  FileSpreadsheet,
  Zap,
  ArrowUpDown,
  History,
  Lock,
  PenTool,
  CornerDownRight,
  Filter,
} from "lucide-react";
import { DocumentViewerWorkspace, DocumentData } from "@/components/documents/document-viewer-workspace";

interface SearchResultItem {
  id: string;
  docNo: string;
  regNo: string;
  title: string;
  fromOrg: string;
  toOrg: string;
  dept: string;
  section: string;
  staffName: string;
  date: string;
  type: "หนังสือเข้า" | "หนังสือส่ง" | "คำสั่ง" | "ประกาศ";
  speed: "ปกติ" | "ด่วน" | "ด่วนมาก" | "ด่วนที่สุด";
  secret: "ปกติ" | "ลับ" | "ลับมาก" | "ลับที่สุด";
  status: "อนุมัติแล้ว" | "รอเกษียน" | "เสร็จสิ้น" | "กำลังดำเนินการ" | "ส่งแล้ว";
  snippet?: string;
  semanticScore?: number;
}

const mockSearchData: SearchResultItem[] = [
  {
    id: "s-01",
    docNo: "มท 0808.2/ว 4553",
    regNo: "2784/2569",
    title: "วิธีปฏิบัติในการจัดทำงบประมาณรายจ่ายประจำปี พ.ศ. 2570 ขององค์กรปกครองส่วนท้องถิ่น",
    fromOrg: "กระทรวงมหาดไทย ถนนอัษฎางค์ กรุงเทพฯ 10200",
    toOrg: "นายกองค์การบริหารส่วนตำบลดอยงาม",
    dept: "กองคลัง",
    section: "งานการเงินและบัญชี",
    staffName: "นางสาวสมร กองเงิน",
    date: "31 ส.ค. 2569",
    type: "หนังสือเข้า",
    speed: "ด่วนที่สุด",
    secret: "ปกติ",
    status: "รอเกษียน",
    snippet: "...กำหนดให้องค์กรปกครองส่วนท้องถิ่นจัดทำร่างงบประมาณรายจ่ายประจำปี พ.ศ. 2570 ให้แล้วเสร็จเพื่อนำเสนอสภาท้องถิ่นภายในวันที่ 15 สิงหาคม...",
    semanticScore: 98,
  },
  {
    id: "s-02",
    docNo: "ชร 0023.1/ว 4589",
    regNo: "2785/2569",
    title: "โครงการตรวจสอบและเตรียมความพร้อมรับมืออุทกภัยและดินโคลนถล่ม ประจำปี 2569",
    fromOrg: "ที่ว่าการอำเภอพาน จังหวัดเชียงราย",
    toOrg: "นายกองค์การบริหารส่วนตำบลดอยงาม",
    dept: "กองช่าง",
    section: "งานป้องกันและบรรเทาสาธารณภัย",
    staffName: "นายวิศวกร ช่างมั่น",
    date: "31 ส.ค. 2569",
    type: "หนังสือเข้า",
    speed: "ด่วนที่สุด",
    secret: "ปกติ",
    status: "รอเกษียน",
    snippet: "...สำรวจจุดเสี่ยงน้ำท่วมขังและดินสไลด์ในพื้นที่หมู่ 1 ถึงหมู่ 10 และจัดเตรียมเครื่องสูบน้ำและกระสอบทราย...",
    semanticScore: 95,
  },
  {
    id: "s-03",
    docNo: "มท 0808.2/ว 5232",
    regNo: "2783/2569",
    title: "แนวทางการจัดสรรงบประมาณเงินอุดหนุนเฉพาะกิจและการจัดทำข้อบัญญัติงบประมาณรายจ่าย ประจำปี 2569",
    fromOrg: "กรมส่งเสริมการปกครองท้องถิ่น",
    toOrg: "นายกองค์การบริหารส่วนตำบลดอยงาม",
    dept: "กองคลัง",
    section: "งานการเงินและบัญชี",
    staffName: "นางวรรณา นามเงิน",
    date: "28 ส.ค. 2569",
    type: "หนังสือเข้า",
    speed: "ด่วนที่สุด",
    secret: "ปกติ",
    status: "กำลังดำเนินการ",
    snippet: "...การจัดสรรเงินอุดหนุนเฉพาะกิจสำหรับโครงการพัฒนาโครงสร้างพื้นฐานและการศึกษาท้องถิ่น...",
    semanticScore: 91,
  },
  {
    id: "s-04",
    docNo: "คำสั่ง อบต.ดอยงาม ที่ 142/2569",
    regNo: "คำสั่ง 142/2569",
    title: "แต่งตั้งคณะกรรมการตรวจรับพัสดุโครงการก่อสร้างถนน คสล. บ้านดอยงาม หมู่ที่ 5",
    fromOrg: "สำนักปลัด อบต.ดอยงาม",
    toOrg: "พนักงานส่วนตำบลและลูกจ้าง อบต.ดอยงาม",
    dept: "สำนักปลัด",
    section: "งานพัสดุและทรัพย์สิน",
    staffName: "นายสมศักดิ์ สุขใจ",
    date: "27 ส.ค. 2569",
    type: "คำสั่ง",
    speed: "ปกติ",
    secret: "ปกติ",
    status: "เสร็จสิ้น",
    snippet: "...แต่งตั้งให้นายช่างโยธาและหัวหน้าฝ่ายก่อสร้างเป็นกรรมการตรวจรับพัสดุโครงการก่อสร้างถนน คสล. ผิวจราจรกว้าง 4 เมตร...",
    semanticScore: 88,
  },
  {
    id: "s-05",
    docNo: "ชร 52002/ว 0289",
    regNo: "ส่ง 289/2569",
    title: "รายงานงบทดลองและรายงานรับ-จ่ายเงิน ประจำเดือน กรกฎาคม 2569",
    fromOrg: "อบต.ดอยงาม (กองคลัง)",
    toOrg: "สำนักงานส่งเสริมการปกครองท้องถิ่นอำเภอพาน",
    dept: "กองคลัง",
    section: "งานการเงินและบัญชี",
    staffName: "นางวรรณา นามเงิน",
    date: "28 ส.ค. 2569",
    type: "หนังสือส่ง",
    speed: "ปกติ",
    secret: "ปกติ",
    status: "ส่งแล้ว",
    snippet: "...จัดส่งรายงานงบทดลองประจำเดือนกรกฎาคม 2569 เพื่อตรวจสอบความถูกต้องตามระบบบัญชีคอมพิวเตอร์ของ อปท. (e-LAAS)...",
    semanticScore: 84,
  },
];

export default function SearchPage() {
  const [searchMode, setSearchMode] = useState<"semantic" | "filter">("semantic");
  const [query, setQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedSpeed, setSelectedSpeed] = useState("ALL");
  const [selectedStudioDoc, setSelectedStudioDoc] = useState<DocumentData | null>(null);

  const quickPrompts = [
    "งบประมาณปี 2570 กระทรวงมหาดไทย",
    "แผนรับมืออุทกภัยดินถล่ม อำเภอพาน",
    "เงินอุดหนุนเฉพาะกิจและข้อบัญญัติ",
    "ตรวจรับพัสดุถนน คสล. หมู่ 5",
    "รายงานงบทดลองระบบ e-LAAS",
  ];

  const filteredResults = mockSearchData.filter((item) => {
    if (selectedDept !== "ALL" && item.dept !== selectedDept) return false;
    if (selectedSpeed !== "ALL" && item.speed !== selectedSpeed) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.docNo.toLowerCase().includes(q) ||
        item.fromOrg.toLowerCase().includes(q) ||
        item.dept.toLowerCase().includes(q) ||
        (item.snippet && item.snippet.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="สืบค้นเอกสารอัจฉริยะ (AI Semantic & Full-Text Search)"
          description="ค้นหาหนังสือราชการ คำสั่ง ประกาศ และข้อสั่งการทะลุเนื้อหาภายในไฟล์ PDF ด้วย AI Search Engine"
        />

        {/* Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold shrink-0">
          <button
            onClick={() => setSearchMode("semantic")}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              searchMode === "semantic"
                ? "bg-purple-600 text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>🧠 ค้นหาด้วยภาษาธรรมชาติ (AI Semantic)</span>
          </button>

          <button
            onClick={() => setSearchMode("filter")}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              searchMode === "filter"
                ? "bg-blue-600 text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>🔍 ค้นหาตามเงื่อนไข (Advanced Filter)</span>
          </button>
        </div>
      </div>

      {/* Main Search Bar & Quick Prompts */}
      <div className="glass-card rounded-3xl p-6 bg-white/85 backdrop-blur-2xl border border-white/90 shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#0052FF]" />
          <input
            type="text"
            placeholder={
              searchMode === "semantic"
                ? "พิมพ์ค้นหาด้วยภาษาธรรมชาติ เช่น 'หาหนังสือกระทรวงมหาดไทยเรื่องจัดทำงบประมาณ 2570' หรือ 'ซ่อมแซมถนน'..."
                : "ค้นหาด้วยเลขที่หนังสือ, เลขรับ, ชื่อเรื่อง, หรือหน่วยงานผู้ส่ง..."
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-300 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0052FF] shadow-2xs"
          />
        </div>

        {/* Quick Prompts */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 font-bold text-[11px] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-600" /> คำค้นหายอดนิยม:
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(prompt)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 text-[11px] font-bold border border-slate-200 transition-colors cursor-pointer"
            >
              &ldquo;{prompt}&rdquo;
            </button>
          ))}
        </div>

        {/* Department & Speed Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">กองผู้รับผิดชอบ:</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800"
            >
              <option value="ALL">ทุกกองงาน</option>
              <option value="กองคลัง">กองคลัง</option>
              <option value="กองช่าง">กองช่าง</option>
              <option value="สำนักปลัด">สำนักปลัด</option>
              <option value="กองการศึกษาฯ">กองการศึกษาฯ</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">ชั้นความเร็ว:</label>
            <select
              value={selectedSpeed}
              onChange={(e) => setSelectedSpeed(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800"
            >
              <option value="ALL">ทุกชั้นความเร็ว</option>
              <option value="ด่วนที่สุด">ด่วนที่สุด</option>
              <option value="ด่วนมาก">ด่วนมาก</option>
              <option value="ด่วน">ด่วน</option>
              <option value="ปกติ">ปกติ</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setSelectedDept("ALL");
                setSelectedSpeed("ALL");
              }}
              className="w-full h-9 rounded-xl text-xs font-bold text-slate-600 gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ล้างตัวกรองทั้งหมด</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Results Header & Counter */}
      <div className="flex items-center justify-between px-2 text-xs">
        <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          ผลการค้นหา: <strong>{filteredResults.length} ฉบับ</strong>
        </span>
        <span className="text-slate-400 font-mono text-[11px]">
          Index: <strong>1.8 ms</strong> (Tenant Isolated Search)
        </span>
      </div>

      {/* Search Results List with PDF Snippets */}
      <div className="space-y-3">
        {filteredResults.length > 0 ? (
          filteredResults.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-3xl p-5 bg-white/90 border border-white/90 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
            >
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                    {item.docNo}
                  </span>
                  <span className="font-mono text-xs text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-lg">
                    เลขรับ: {item.regNo}
                  </span>
                  {item.semanticScore && (
                    <span className="text-[10px] font-mono font-black text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-600" />
                      ตรงกับบริบท {item.semanticScore}%
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg">
                    {item.dept}
                  </span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                  {item.title}
                </h3>

                {/* PDF Content Snippet */}
                {item.snippet && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 font-serif text-xs text-slate-700 leading-relaxed italic">
                    <span className="font-sans font-bold text-slate-400 not-italic text-[10px] mr-1">[เนื้อหาใน PDF]:</span>
                    &ldquo;{item.snippet}&rdquo;
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>จาก: {item.fromOrg.split(" ")[0]}</span>
                  <span>•</span>
                  <span>วันที่: {item.date}</span>
                  <span>•</span>
                  <span className="font-mono text-slate-700 font-medium">สถานะ: {item.status}</span>
                </div>
              </div>

              {/* 1-Click Launch into Full-Screen Immersion Workspace */}
              <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                <Button
                  size="sm"
                  variant="signature"
                  onClick={() => {
                    setSelectedStudioDoc({
                      id: item.id,
                      docNo: item.docNo,
                      regNo: item.regNo,
                      regDate: item.date,
                      regTime: "09:30 น.",
                      docDate: item.date,
                      from: item.fromOrg,
                      to: item.toOrg,
                      title: item.title,
                      docType: "หนังสือภายนอก",
                      speed: item.speed as any,
                      secret: "ปกติ",
                      targetDept: item.dept,
                      contentParagraphs: [
                        item.snippet || "ด้วยหนังสือสั่งการดังกล่าว มีแนวทางและระเบียบปฏิบัติที่เกี่ยวข้องกับการบริหารราชการขององค์กรปกครองส่วนท้องถิ่น",
                        "จึงเรียนเสนอเพื่อโปรดพิจารณาและสั่งการดำเนินการตามระเบียบต่อไป",
                      ],
                      endorsements: [],
                    });
                  }}
                  className="h-10 px-4 rounded-xl text-xs font-bold gap-1.5 shadow-accent cursor-pointer"
                >
                  <PenTool className="w-4 h-4" />
                  <span>เปิดดู & ตรวจเกษียน</span>
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card rounded-3xl p-16 text-center text-slate-400 bg-white/80 border border-white/90 space-y-3">
            <Search className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="font-extrabold text-base text-slate-800">
              ไม่พบหนังสือราชการที่ตรงกับคำค้นหา
            </h3>
            <p className="text-xs text-slate-500">
              ลองเปลี่ยนคำค้นหา หรือใช้คำสำคัญสั้น ๆ เช่น &ldquo;งบประมาณ&rdquo;, &ldquo;อุทกภัย&rdquo;, &ldquo;ถนน&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* Full Screen Immersion Studio Workspace Modal */}
      {selectedStudioDoc && (
        <DocumentViewerWorkspace
          document={selectedStudioDoc}
          onClose={() => setSelectedStudioDoc(null)}
        />
      )}
    </div>
  );
}
