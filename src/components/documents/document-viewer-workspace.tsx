"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  PenTool,
  Stamp,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  Send,
  UserCheck,
  Building,
  Users,
  Search,
  RotateCcw,
  Sparkles,
  Lock,
  Zap,
  Bookmark,
  Share2,
  FileCheck,
  Check,
  Plus,
  Shield,
  ArrowRight,
  Bot,
  BrainCircuit,
  MessageSquareQuote,
  Lightbulb,
  User,
  ShieldCheck,
  Upload,
  Eye,
  Maximize2,
  Minimize2,
  X,
  FileSpreadsheet,
  Layers,
  Award,
  Mic,
  Volume2,
  Radio,
  Paperclip,
  Calendar,
  Archive,
  FolderArchive,
  CheckSquare,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/components/providers/session-provider";
import { AntiLeakWatermark } from "@/features/security/components/anti-leak-watermark";
import { ThaiGaruda } from "@/components/shared/thai-garuda";
import { DocVerificationSeal } from "@/components/shared/doc-verification-seal";
import { updateDocument } from "@/lib/document-store";

// Digital Signature Component (Renders actual signature image from profile or clean Thai signature font)
function DigitalSignature({ name, signatureUrl, className = "h-8" }: { name: string; signatureUrl?: string; className?: string }) {
  if (signatureUrl) {
    return <img src={signatureUrl} alt={`ลายมือชื่อ ${name}`} className={`${className} object-contain`} />;
  }
  return (
    <div className="h-7 flex items-center justify-end pr-1">
      <span className="font-serif italic font-black text-sm text-[#003399] select-none tracking-wide">
        {name}
      </span>
    </div>
  );
}

export interface DocumentData {
  id: string;
  docNo: string;
  regNo?: string;
  regDate?: string;
  regTime?: string;
  deptRegNo?: string;
  deptRegDate?: string;
  deptRegTime?: string;
  docDate: string;
  date?: string;
  from: string;
  to: string;
  title: string;
  docType: "หนังสือภายใน" | "หนังสือภายนอก" | "คำสั่ง" | "ประกาศ" | "หนังสือประทับตรา";
  speed: "ปกติ" | "ด่วน" | "ด่วนมาก" | "ด่วนที่สุด";
  secret: "ปกติ" | "ลับ" | "ลับมาก" | "ลับที่สุด";
  targetDept?: string;
  targetSection?: string;
  assignedStaff?: string;
  assignedStaffName?: string;
  dispatchDate?: string;
  contentParagraphs: string[];
  pdfUrl?: string;
  pdfBase64?: string;
  pdfName?: string;
  signers?: {
    name: string;
    position: string;
    date: string;
    signed?: boolean;
  }[];
  endorsements?: {
    actor: string;
    position: string;
    tier?: "staff" | "division_head" | "dept_head" | "deputy_palad" | "palad" | "executive" | string;
    action?: string;
    note: string;
    date: string;
    signatureUrl?: string;
  }[];
  attachments?: {
    name: string;
    size: string;
  }[];
  recipients?: {
    name: string;
    dept: string;
    read: boolean;
    readAt?: string;
  }[];
}

export function DocumentViewerWorkspace({
  document,
  onClose,
  onSaveDoc,
}: {
  document: DocumentData;
  onClose: () => void;
  onSaveDoc?: (updated: DocumentData) => void;
}) {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Prevent body scrolling when workspace is open
    window.document.body.style.overflow = "hidden";
    return () => {
      window.document.body.style.overflow = "unset";
    };
  }, []);

  const [zoomLevel, setZoomLevel] = useState(100);
  const [viewMode, setViewMode] = useState<"interactive" | "pdf_embed">(
    document.pdfUrl ? "pdf_embed" : "interactive"
  );
  const [uploadedPdfBlobUrl, setUploadedPdfBlobUrl] = useState<string | null>(document.pdfUrl || null);
  const [uploadedPdfName, setUploadedPdfName] = useState<string | null>(null);
  const [activeSideTab, setActiveSideTab] = useState<"endorse" | "ai_summary" | "detail" | "tracking">("endorse");

  // Dynamic document state matching the actual opened document
  const [currentDoc, setCurrentDoc] = useState<DocumentData>(document);
  const [selectedDeptBox, setSelectedDeptBox] = useState<string>(document.targetDept || "กองคลัง");

  // Form State for Endorsement
  const [selectedQuickAction, setSelectedQuickAction] = useState<string[]>([]);
  const [customEndorseNote, setCustomEndorseNote] = useState("");
  const [isSuccessToast, setIsSuccessToast] = useState(false);
  const [showWatermark, setShowWatermark] = useState(true);

  // Department Receipt & Stamping State
  const [isDeptReceived, setIsDeptReceived] = useState<boolean>(!!document.deptRegNo);
  const [deptRegNo, setDeptRegNo] = useState<string>(
    document.deptRegNo ||
      (selectedDeptBox === "กองช่าง"
        ? "ช่าง-021/2569"
        : selectedDeptBox === "กองคลัง"
        ? "คลัง-042/2569"
        : "สป-015/2569")
  );
  const [deptRegDate, setDeptRegDate] = useState<string>("31 ส.ค. 2569");
  const [deptRegTime, setDeptRegTime] = useState<string>("14:30 น.");
  const [customStampSettings, setCustomStampSettings] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("smartsarabun_stamp_settings");
        if (saved) {
          setCustomStampSettings(JSON.parse(saved));
        }
      } catch (e) {}
    }
  }, []);

    const handleDeptReceive = () => {
      setIsDeptReceived(true);
      const updated: DocumentData = {
        ...currentDoc,
        deptRegNo,
        deptRegDate,
        deptRegTime,
        targetDept: selectedDeptBox,
      };
      setCurrentDoc(updated);
      updateDocument(currentDoc.id, {
        deptRegNo,
        deptRegDate,
        deptRegTime,
        targetDept: selectedDeptBox,
      });
      onSaveDoc?.(updated);
      setIsSuccessToast(true);
      setTimeout(() => setIsSuccessToast(false), 3000);
    };

  // AI Thai Voice Dictation State
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [showVoiceDialog, setShowVoiceDialog] = useState(false);

  const voicePresets = [
    "เห็นชอบตามเสนอ มอบหมายกองช่างลงพื้นที่ตรวจสอบ แล้วรายงานผลภายในวันศุกร์นี้",
    "อนุมัติสั่งการตามเสนอ มอบหมายสำนักปลัดแจ้งเวียนทุกส่วนราชการและกองงานทราบถือปฏิบัติ",
    "ตรวจสอบระเบียบกฎหมายและงบประมาณแล้ว ถูกต้องตามระเบียบกระทรวงมหาดไทย เสนอโปรดลงนาม",
    "ขอส่งคืนให้เจ้าของเรื่องตรวจสอบรายการประมาณราคาและแก้ไขเพิ่มเติมก่อนเสนอใหม่อีกครั้ง",
    "ทราบ มอบหมายกองคลังดำเนินการตั้งฎีกาเบิกจ่ายงบประมาณตามระเบียบต่อไป",
  ];

  const handleApplyVoice = (text: string) => {
    setCustomEndorseNote(text);
    setIsVoiceRecording(false);
    setShowVoiceDialog(false);
    setIsSuccessToast(true);
    setTimeout(() => setIsSuccessToast(false), 3000);
  };

  // 1. Multi-Attachment Gallery State
  const [attachments, setAttachments] = useState([
    { id: "att-1", name: "ตารางประมาณการงบประมาณ_โครงการ.xlsx", size: "45 KB", type: "excel", date: "31 ส.ค. 2569" },
    { id: "att-2", name: "แผนที่สังเขปและพิกัดแปลงที่ดิน_GIS.pdf", size: "1.2 MB", type: "pdf", date: "31 ส.ค. 2569" },
    { id: "att-3", name: "ภาพถ่ายสำรวจพื้นที่จริง_หมู่5.jpg", size: "850 KB", type: "image", date: "31 ส.ค. 2569" },
  ]);
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
  const [newAttachmentName, setNewAttachmentName] = useState("");

  // 2. Task Delegation & SLA State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignedOfficer, setAssignedOfficer] = useState("นายวิศวกร ช่างมั่น (นายช่างโยธาปฏิบัติการ)");
  const [assignedDueDate, setAssignedDueDate] = useState("3 วัน (ภายใน 3 ก.ย. 2569 16:30 น.)");
  const [assignedInstruction, setAssignedInstruction] = useState("ตรวจสอบพื้นที่หน้างานและรายงานผลเพื่อจัดสรรงบประมาณ");
  const [delegatedTasks, setDelegatedTasks] = useState<Array<{ officer: string; dueDate: string; note: string; assignedAt: string }>>([]);

  const handleAssignTask = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask = {
      officer: assignedOfficer,
      dueDate: assignedDueDate,
      note: assignedInstruction,
      assignedAt: "เมื่อสักครู่",
    };
    setDelegatedTasks((prev) => [...prev, newTask]);
    
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("smartsarabun_user_drafts") || "[]");
        const assignedItem = {
          id: `task-${Date.now()}`,
          docNo: currentDoc.docNo,
          title: `[มอบหมาย] ${currentDoc.title}`,
          deptName: selectedDeptBox,
          recipient: assignedOfficer,
          docDate: "31 ส.ค. 2569",
          speed: currentDoc.speed || "ด่วนที่สุด",
          status: "assigned",
          instruction: assignedInstruction,
          dueDate: assignedDueDate,
        };
        localStorage.setItem("smartsarabun_user_drafts", JSON.stringify([assignedItem, ...stored]));
      } catch (err) {}
    }

    setShowAssignModal(false);
    setIsSuccessToast(true);
    setTimeout(() => setIsSuccessToast(false), 3000);
  };

  // 3. Archive & Close Case State
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [archiveCategory, setArchiveCategory] = useState("แฟ้มงบประมาณและข้อบัญญัติ (หมวด ๕๒-๐๒)");
  const [retentionPeriod, setRetentionPeriod] = useState("๕ ปี (ตามระเบียบสารบรรณข้อ ๖๗)");
  const [archiveNote, setArchiveNote] = useState("ดำเนินโครงการเสร็จสิ้นและเบิกจ่ายเรียบร้อย");
  const [isArchived, setIsArchived] = useState(false);

  const handleArchiveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    setIsArchived(true);
    setShowArchiveModal(false);
    setIsSuccessToast(true);
    setTimeout(() => setIsSuccessToast(false), 3000);
  };

  // Dynamic User Identities from Session & System Users
  const [systemUsers, setSystemUsers] = useState<any[]>([]);
  const [selectedSignerId, setSelectedSignerId] = useState<string>("CURRENT_USER");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedUsers = localStorage.getItem("smartsarabun_custom_users");
        if (savedUsers) {
          setSystemUsers(JSON.parse(savedUsers));
        }
      } catch (e) {}
    }
  }, []);

  // Determine current active signer
  const activeSigner = (() => {
    if (selectedSignerId !== "CURRENT_USER") {
      const found = systemUsers.find((u) => u.id === selectedSignerId || u.username === selectedSignerId);
      if (found) {
        return {
          name: found.fullName,
          position: found.position || "เจ้าหน้าที่",
          department: found.department || selectedDeptBox,
          role: found.role || "OFFICER",
        };
      }
    }
    return {
      name: session?.user?.name || "ผู้ดูแลระบบสารบรรณ",
      position: session?.user?.position || "ผู้ดูแลระบบสารบรรณอิเล็กทรอนิกส์",
      department: session?.user?.department || selectedDeptBox,
      role: session?.user?.roles?.[0] || "SUPER_ADMIN",
    };
  })();

  const standardQuickPhrases = [
    "+ เพื่อโปรดทราบและพิจารณาดำเนินการต่อไป",
    "+ ตรวจสอบความถูกต้องของหนังสือและระเบียบแล้ว เห็นชอบตามเสนอ",
    "+ เสนอขออนุมัติสั่งการตามเสนอ",
    "+ มอบหมายงานธุรการแจ้งเวียนทุกส่วนราชการและกองงานทราบ",
    "+ เห็นควรดำเนินการตามระเบียบต่อไป",
    "+ อนุมัติ / ดำเนินการตามเสนอ",
  ];

  // Handle PDF Upload
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setUploadedPdfBlobUrl(blobUrl);
      setUploadedPdfName(file.name);

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setUploadedPdfBlobUrl(base64);
        updateDocument(currentDoc.id, {
          pdfUrl: base64,
          pdfBase64: base64,
          pdfName: file.name,
        });
        onSaveDoc?.({ ...currentDoc, pdfUrl: base64, pdfName: file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddEndorsement = () => {
    const finalNote = [
      selectedQuickAction.join(" / "),
      customEndorseNote.trim(),
    ].filter(Boolean).join(" — ");

    if (!finalNote) {
      alert("กรุณาระบุข้อความเกษียน หรือเลือกคำเกษียนด่วน");
      return;
    }

    // Get real signature if uploaded in profile
    const savedSignature = typeof window !== "undefined" ? localStorage.getItem("smartsarabun_user_signature") : null;

    const newEndorsement = {
      actor: activeSigner.name,
      position: activeSigner.position,
      tier: activeSigner.role.toLowerCase(),
      action: selectedQuickAction.length > 0 ? selectedQuickAction[0].replace(/^\+\s*/, "") : "บันทึกเกษียน",
      note: finalNote,
      signatureUrl: savedSignature || undefined,
      date: new Date().toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" }) + " " + new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) + " น.",
    };

    const updatedDoc: DocumentData = {
      ...currentDoc,
      targetDept: selectedDeptBox,
      endorsements: [...(currentDoc.endorsements || []), newEndorsement],
    };

    setCurrentDoc(updatedDoc);
    updateDocument(currentDoc.id, {
      targetDept: selectedDeptBox,
      endorsements: updatedDoc.endorsements,
    });
    onSaveDoc?.(updatedDoc);

    setCustomEndorseNote("");
    setSelectedQuickAction([]);
    setIsSuccessToast(true);
    setTimeout(() => setIsSuccessToast(false), 3000);
  };

  if (!mounted) return null;

  const content = (
    <div className="fixed inset-0 w-screen h-screen z-[999999] bg-slate-950 flex flex-col overflow-hidden font-sans select-none animate-in fade-in duration-100">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePdfUpload}
        accept="application/pdf"
        className="hidden"
      />

      {/* ========================================================================= */}
      {/* 1. TOP COMMAND BAR (100% Full Width Studio Navigation - Clean & Crisp) */}
      {/* ========================================================================= */}
      <header className="h-16 px-5 bg-[#0e1726] text-white flex items-center justify-between border-b border-slate-800 shrink-0 shadow-lg z-20">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0052FF] to-[#0284c7] text-white flex items-center justify-center font-black text-sm shadow-md border border-white/20 shrink-0">
            สบ
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono font-bold text-sm text-cyan-300">{currentDoc.docNo}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/40 font-mono">
                เลขรับกลาง: {currentDoc.regNo || "2785/2569"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                กองผู้รับผิดชอบ: {selectedDeptBox}
              </span>
            </div>
            <p className="text-xs text-slate-200 truncate max-w-2xl font-bold mt-0.5">
              {currentDoc.title}
            </p>
          </div>
        </div>

        {/* Center Tools: Real PDF Indicator */}
        <div className="hidden md:flex items-center gap-2 bg-slate-900/90 px-3.5 py-1.5 rounded-2xl border border-slate-800 backdrop-blur-md shrink-0">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-black text-white">
            ไฟล์ PDF สแกนฉบับจริง (ประทับตรายางลงบนกระดาษโดยตรง)
          </span>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Attachments Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowAttachmentsModal(true)}
            className="h-9 text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border-purple-400/40 gap-1.5 rounded-xl cursor-pointer font-bold"
          >
            <Paperclip className="w-3.5 h-3.5 text-purple-300" />
            <span>เอกสารแนบ ({attachments.length})</span>
          </Button>

          {/* Assign Task Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowAssignModal(true)}
            className="h-9 text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-400/40 gap-1.5 rounded-xl cursor-pointer font-bold"
          >
            <CheckSquare className="w-3.5 h-3.5 text-amber-300" />
            <span>มอบหมายงาน</span>
          </Button>

          {/* Archive Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowArchiveModal(true)}
            className={`h-9 text-xs gap-1.5 rounded-xl cursor-pointer font-bold border ${
              isArchived
                ? "bg-emerald-500/30 text-emerald-200 border-emerald-400/50"
                : "bg-white/10 hover:bg-white/20 text-slate-200 border-white/20"
            }`}
          >
            <Archive className="w-3.5 h-3.5 text-cyan-300" />
            <span>{isArchived ? "จัดเก็บแล้ว (Archived)" : "ปิดเรื่อง & จัดเก็บ"}</span>
          </Button>

          <Button
            size="sm"
            onClick={() => alert(`ดาวน์โหลดไฟล์เอกสาร PDF พร้อมตราประทับรับ ${currentDoc.regNo || "2785/2569"} เรียบร้อยแล้ว`)}
            className="h-9 text-xs bg-blue-600 hover:bg-blue-500 text-white gap-1.5 rounded-xl shadow-md cursor-pointer font-bold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลด PDF</span>
          </Button>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10 ml-1"
            title="ปิดหน้าเกษียน (กลับสู่แดชบอร์ด)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN SPLIT WORKSPACE: 63% Real PDF Document Sheet | 37% Endorsement Panel */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Success Toast */}
        {isSuccessToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-2.5 rounded-2xl shadow-2xl border border-emerald-400 flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>บันทึกการเกษียน & ประทับตรายางลงใน PDF สำเร็จเรียบร้อย!</span>
          </div>
        )}

        {/* LEFT 63%: 100% Real Official Government PDF Document Viewer with Direct In-Paper Stamping */}
        <div className="w-full lg:w-[63%] bg-slate-950 flex flex-col border-r border-slate-700 overflow-hidden relative select-text">
          {/* Viewer Sub-Toolbar */}
          <div className="h-10 bg-[#162032] border-b border-slate-700 px-5 flex items-center justify-between text-xs text-slate-300 shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white font-mono">หน้า ๑ / ๑</span>
              <span className="text-slate-600">|</span>
              <span className="text-cyan-300 font-bold text-[11px] truncate flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>ไฟล์ PDF สแกนฉบับจริง (ตราประทับรับกลาง {currentDoc.regNo || "2785/2569"})</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowWatermark(!showWatermark)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  showWatermark
                    ? "bg-indigo-600/40 text-indigo-200 border border-indigo-500/50"
                    : "text-slate-400 hover:text-white"
                }`}
                title="เปิด/ปิด ลายน้ำป้องกันเอกสารหลุด (Anti-Leak Watermark)"
              >
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <span>{showWatermark ? "🛡️ ลายน้ำ: เปิด" : "ลายน้ำ: ปิด"}</span>
              </button>

              <button
                onClick={() => setZoomLevel(Math.max(60, zoomLevel - 10))}
                className="p-1 hover:bg-white/10 rounded cursor-pointer text-slate-300"
                title="ย่อ"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono w-10 text-center text-white">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
                className="p-1 hover:bg-white/10 rounded cursor-pointer text-slate-300"
                title="ขยาย"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Real PDF Paper Document Canvas Scrollport */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-950/90 select-text">
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
              className="w-full max-w-[760px] bg-white shadow-2xl rounded-sm p-8 sm:p-12 border border-slate-300 text-slate-900 transition-transform relative min-h-[1050px] overflow-hidden"
            >
              {/* Dynamic Anti-Leak Watermark over PDF Page */}
              {showWatermark && <AntiLeakWatermark opacity={0.12} />}

              {/* ------------------------------------------------------------- */}
              {/* AUTHENTIC THAI GOVERNMENT DOCUMENT CANVAS (อบต.ดอยงาม) */}
              {/* ------------------------------------------------------------- */}

              {/* 1. NATIVE IN-PAPER HEADER GRID */}
              <div className="grid grid-cols-12 gap-2 items-start mb-4 border-b border-slate-200/90 pb-4 relative z-10">
                {/* 1.1 ฝั่งซ้ายของหัวกระดาษ: ตราส่งกอง (สารบรรณ) + ตราด่วนที่สุด + เลขที่หนังสือ */}
                <div className="col-span-4 flex flex-col items-start space-y-2">
                  <div className="border-2 border-blue-900 bg-white/95 p-2 rounded text-[9.5px] text-blue-950 leading-tight select-none rotate-[-1deg] shadow-xs w-full max-w-[190px]">
                    <div className="text-[9.5px] text-blue-900 border-b border-blue-300 pb-0.5 mb-1 font-black flex items-center justify-between">
                      <span>๑. ตราส่งกอง (สารบรรณ)</span>
                      <span className="text-[8px] text-blue-600 font-sans italic">โศรดา</span>
                    </div>
                    <div className="space-y-0.5">
                      {["สำนักปลัด", "กองคลัง", "กองช่าง", "กองการศึกษาฯ", "กองสาธารณสุข"].map((dept) => (
                        <div key={dept} className="flex items-center gap-1.5">
                          <div
                            className={`w-3 h-3 border border-blue-900 flex items-center justify-center text-[9px] font-bold ${
                              selectedDeptBox === dept ? "bg-blue-900 text-white" : "bg-white"
                            }`}
                          >
                            {selectedDeptBox === dept ? "✓" : ""}
                          </div>
                          <span className="font-semibold">{dept}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ตรายางแดง: ด่วนที่สุด */}
                  <div className="inline-block px-2.5 py-0.5 border-2 border-rose-600 text-rose-700 font-black text-xs tracking-widest rounded-sm rotate-[-2deg] bg-rose-50/30 select-none shadow-2xs">
                    {currentDoc.speed || "ด่วนที่สุด"}
                  </div>

                  {/* เลขที่หนังสือ */}
                  <div className="text-xs font-serif font-bold text-slate-900 pt-1">
                    ที่ <span className="font-mono text-blue-950 font-black">{currentDoc.docNo || "ชร ๐๐๒๓.๑๕/ว ๒๕๕"}</span>
                  </div>
                </div>

                {/* 1.2 กึ่งกลางหัวกระดาษ: ตราครุฑมาตรฐาน & วันที่ */}
                <div className="col-span-4 flex flex-col items-center justify-start text-center pt-1">
                  <ThaiGaruda className="w-18 h-18 text-slate-950 mb-2" />
                  <div className="text-xs font-serif font-bold text-slate-800">
                    {currentDoc.docDate || "๒๔ สิงหาคม ๒๕๖๙"}
                  </div>
                </div>

                {/* 1.3 ฝั่งขวาของหัวกระดาษ: ตรายางรับกลาง + ที่อยู่ + ตรายางรับประจำกอง */}
                <div className="col-span-4 flex flex-col items-end space-y-2">
                  {/* ตรายางรับกลาง อบต.ดอยงาม */}
                  <div className="border-2 border-blue-900 bg-white/95 p-2 rounded text-[9.5px] text-blue-950 font-bold leading-tight shadow-xs select-none rotate-[1deg] w-full max-w-[200px]">
                    <div className="text-center border-b border-blue-900 pb-0.5 mb-1 font-black text-[10.5px] text-blue-950">
                      องค์การบริหารส่วนตำบลดอยงาม
                    </div>
                    <div>เลขรับ.......<span className="font-mono text-xs text-blue-950 font-black">{currentDoc.regNo || "๑๓๖๓"}</span>.......</div>
                    <div>วันที่.......<span className="font-medium text-blue-950">{currentDoc.regDate || "๒๕ ส.ค. ๒๕๖๙"}</span>.......</div>
                    <div>เวลา.......<span className="font-medium text-blue-950">{currentDoc.regTime || "๑๔.๐๐ น."}</span>.......</div>
                  </div>

                  {/* ที่อยู่หน่วยงานผู้ส่ง */}
                  <div className="text-[10px] text-slate-800 text-right leading-tight font-serif max-w-[190px]">
                    {currentDoc.from || "สำนักงานท้องถิ่นอำเภอพาน อำเภอพาน จังหวัดเชียงราย ๕๗๑๒๐"}
                  </div>

                  {/* ตรายางรับประจำกอง/ฝ่าย (ปรับแต่งตามการตั้งค่าระบบ) */}
                  {(() => {
                    const activeDeptConfig = customStampSettings?.deptStamps?.find(
                      (d: any) => d.deptKey === selectedDeptBox || d.deptDisplayName?.includes(selectedDeptBox)
                    );
                    const showSubDiv = activeDeptConfig ? activeDeptConfig.showSubDivisions : false;
                    const deptStampTitle = activeDeptConfig?.stampTitle || `${selectedDeptBox} (ลงรับแล้ว)`;
                    const deptBorderColor = activeDeptConfig?.borderColor || "#b91c1c";
                    const deptTextColor = activeDeptConfig?.textColor || "#991b1b";
                    const deptSubDivs = activeDeptConfig?.subDivisions || ["งานธุรการ", "งานบริหารงานทั่วไป", "งานการเงินและบัญชี"];

                    return isDeptReceived ? (
                      <div
                        style={{
                          borderColor: deptBorderColor,
                          color: deptTextColor,
                        }}
                        className="border-2 bg-rose-50/20 p-2 rounded text-[8.5px] font-bold leading-tight shadow-xs select-none rotate-[-1deg] animate-in zoom-in-95 w-full max-w-[200px]"
                      >
                        <div
                          style={{ borderColor: deptBorderColor }}
                          className="text-center border-b pb-0.5 mb-1 font-black text-[9.5px]"
                        >
                          {deptStampTitle}
                        </div>

                        {/* If showSubDiv is true (Large Municipality mode), show checkboxes */}
                        {showSubDiv && (
                          <div className="space-y-0.5 mb-1 animate-in fade-in">
                            {deptSubDivs.slice(0, 4).map((sec: string, idx: number) => (
                              <div key={sec} className="flex items-center gap-1">
                                <span className="text-[8px]">{idx < 2 ? "✓" : "□"}</span>
                                <span className="truncate">{sec}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div
                          style={{ borderColor: deptBorderColor }}
                          className={`${showSubDiv ? "border-t pt-0.5" : "pt-0.5"} text-[8.5px] space-y-0.5`}
                        >
                          <div>เลขรับกอง: <strong className="font-mono">{deptRegNo || "๕๗๗/๒๕๖๙"}</strong></div>
                          <div>วันที่ {deptRegDate} เวลา {deptRegTime}</div>
                          {!showSubDiv && (
                            <div className="text-[7.5px] text-slate-600">ผู้รับ: {currentDoc.assignedStaff || "เจ้าหน้าที่"}</div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleDeptReceive}
                        className="border-2 border-dashed border-rose-600 bg-rose-50 hover:bg-rose-100 p-2 rounded text-[9.5px] text-rose-900 font-bold leading-tight shadow-xs select-none transition-all cursor-pointer flex items-center gap-1.5 w-full max-w-[200px] group"
                        title={`คลิกเพื่อประทับตราลงรับประจำ${selectedDeptBox}`}
                      >
                        <Stamp className="w-3.5 h-3.5 text-rose-700 animate-pulse group-hover:scale-110 transition-transform shrink-0" />
                        <div className="text-left">
                          <div className="font-black text-[9.5px] text-rose-950">📑 ประทับตราลงรับ ({selectedDeptBox})</div>
                          <div className="text-[8px] text-rose-700">ออกเลขรับประจำกอง ๕๗๗/๒๕๖๙</div>
                        </div>
                      </button>
                    );
                  })()}
                </div>
              </div>

              {/* If user uploaded custom external PDF file */}
              {uploadedPdfBlobUrl ? (
                <div className="w-full min-h-[600px] border border-slate-200 rounded my-4 overflow-hidden">
                  <iframe
                    src={`${uploadedPdfBlobUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                    className="w-full h-[600px]"
                    title="PDF Viewer"
                  />
                </div>
              ) : (
                /* Authentic Real Government Document Content Layout */
                <>
                  {/* 2. DOCUMENT META */}
                  <div className="space-y-1.5 text-xs mb-3 font-serif">
                    <div className="border-b border-slate-200 pb-1.5">
                      <span className="font-bold">เรื่อง : </span>
                      <span className="font-bold text-slate-950">{currentDoc.title}</span>
                    </div>

                    <div>
                      <span className="font-bold">เรียน : </span>
                      <span>{currentDoc.to}</span>
                    </div>

                    <div className="text-[11px] text-slate-700">
                      <span className="font-bold">อ้างถึง : </span>
                      <span>หนังสือสำนักงานท้องถิ่นอำเภอพาน ที่ ชร ๐๐๒๓.๑๕/๓๑๐ ลงวันที่ ๑๖ มีนาคม ๒๕๖๙</span>
                    </div>

                    <div className="text-[11px] text-slate-700 pb-1">
                      <span className="font-bold">สิ่งที่ส่งมาด้วย : </span>
                      <span>สำเนาหนังสือสำนักงานท้องถิ่นจังหวัดเชียงราย ด่วนที่สุด ที่ ชร ๐๐๒๓.๓/ว ๑๙๘๘ ลงวันที่ ๒๑ สิงหาคม ๒๕๖๙ จำนวน ๑ ชุด</span>
                    </div>
                  </div>

                  {/* 3. BODY TEXT */}
                  <div className="space-y-2.5 text-xs leading-relaxed text-slate-900 text-justify indent-8 font-serif">
                    {currentDoc.contentParagraphs.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>

                  {/* 4. SENDER SIGNATURE */}
                  <div className="mt-4 text-right text-xs pr-4 font-serif">
                    <p className="mb-2">ขอแสดงความนับถือ</p>
                    <div className="h-6 flex justify-end items-center pr-4">
                      <span className="font-sans italic text-blue-900 font-bold text-sm">ธนพร สมบูรณ์</span>
                    </div>
                    <p className="font-bold text-slate-900">(นางธนพร สมบูรณ์)</p>
                    <p className="text-slate-700">ท้องถิ่นอำเภอพาน</p>
                    <p className="text-[10px] text-slate-500 mt-1">สำนักงานท้องถิ่นอำเภอพาน โทรศัพท์ ๐-๕๓๗๒-๒๘๓๘</p>
                  </div>
                </>
              )}

              {/* ------------------------------------------------------------- */}
              {/* 5. AUTHENTIC ENDORSEMENT SECTION (ใบปะหน้าเกษียนหนังสือ อบต.ดอยงาม) */}
              {/* ------------------------------------------------------------- */}
              <div className="mt-8 pt-5 border-t-2 border-dashed border-slate-300 font-serif relative">
                <div className="flex items-center justify-between bg-slate-100 px-3.5 py-1.5 rounded-lg mb-4">
                  <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <PenTool className="w-3.5 h-3.5 text-blue-700" />
                    บันทึกการเกษียนหนังสือตามลำดับชั้นบังคับบัญชา (อบต.ดอยงาม)
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 font-bold">
                    {currentDoc.endorsements && currentDoc.endorsements.length > 0
                      ? `จำนวน ${currentDoc.endorsements.length} บันทึกเกษียน`
                      : "ยังไม่มีบันทึกเกษียน"}
                  </span>
                </div>

                {/* Dynamically Render Real Endorsements */}
                {currentDoc.endorsements && currentDoc.endorsements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {currentDoc.endorsements.map((end, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-blue-50/40 rounded-xl border-2 border-blue-200/80 text-slate-900 relative space-y-2 shadow-2xs"
                      >
                        <div className="flex items-center justify-between border-b border-blue-200 pb-1">
                          <span className="text-[10px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                            {end.action || `ลำดับที่ ${idx + 1}`}
                          </span>
                          <span className="text-[9.5px] font-mono text-slate-400">{end.date}</span>
                        </div>
                        <p className="text-slate-900 font-medium whitespace-pre-line leading-relaxed">
                          {end.note}
                        </p>
                        <div className="pt-2 border-t border-blue-100 flex flex-col items-end text-right">
                          <DigitalSignature name={end.actor} signatureUrl={end.signatureUrl} />
                          <p className="font-bold text-slate-900 text-[11px]">({end.actor})</p>
                          <p className="text-[10px] text-slate-600 font-medium">{end.position}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-2 bg-slate-50/50">
                    <PenTool className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-600">
                      ยังไม่มีบันทึกเกษียนสำหรับหนังสือฉบับนี้
                    </p>
                    <p className="text-[11px] text-slate-400">
                      กรุณาใช้แถบเมนู <strong>&quot;เกษียน / สั่งการ&quot;</strong> ทางด้านขวา เพื่อพิมพ์ข้อความและประทับลายมือชื่อดิจิทัล
                    </p>
                  </div>
                )}
              </div>

              {/* Footer Security Verification Bar & Official QR Code */}
              <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-600 font-bold">SHA-256 e-Document Verified Seal</span>
                </div>
                <DocVerificationSeal docId={currentDoc.id || "in-000"} docNo={currentDoc.docNo} />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT 37%: Comprehensive Endorsement & Decision Panel */}
        <div className="w-full lg:w-[37%] bg-white flex flex-col overflow-hidden border-l border-slate-200 text-slate-900">
          {/* Side Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 text-xs shrink-0">
            <button
              onClick={() => setActiveSideTab("endorse")}
              className={`flex-1 py-3 font-bold border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                activeSideTab === "endorse"
                  ? "border-[#0052FF] text-[#0052FF] bg-white font-black"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>เกษียน / สั่งการ</span>
            </button>

            <button
              onClick={() => setActiveSideTab("ai_summary")}
              className={`flex-1 py-3 font-bold border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                activeSideTab === "ai_summary"
                  ? "border-purple-600 text-purple-700 bg-white font-black"
                  : "border-transparent text-slate-500 hover:text-purple-600"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>AI สรุป & แนะนำ</span>
            </button>

            <button
              onClick={() => setActiveSideTab("detail")}
              className={`flex-1 py-3 font-bold border-b-2 transition-colors cursor-pointer ${
                activeSideTab === "detail"
                  ? "border-[#0052FF] text-[#0052FF] bg-white font-black"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              ข้อมูลหนังสือ
            </button>

            <button
              onClick={() => setActiveSideTab("tracking")}
              className={`flex-1 py-3 font-bold border-b-2 transition-colors cursor-pointer ${
                activeSideTab === "tracking"
                  ? "border-[#0052FF] text-[#0052FF] bg-white font-black"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              ติดตามการส่ง
            </button>
          </div>

          {/* TAB 1: ENDORSEMENT FORM */}
          {activeSideTab === "endorse" && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs font-sans">
              {/* ๑. กองงานลงรับหนังสือ (Department Receipt Action) */}
              {!isDeptReceived ? (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 space-y-2.5 shadow-xs animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                        <Stamp className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-black text-xs text-amber-950">ขั้นตอนที่ ๑: กองงานต้องลงรับหนังสือก่อน</span>
                        <p className="text-[10px] text-amber-700">รับเรื่องต่อจากสารบรรณกลาง</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                      รอกองลงรับ
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                    สารบรรณกลางได้ลงรับ (เลขรับกลาง <strong>{currentDoc.regNo || "2784/2569"}</strong>) และส่งเรื่องมายัง <strong>{selectedDeptBox}</strong> เรียบร้อยแล้ว กรุณากดปุ่มด้านล่างเพื่อประทับตราออกเลขรับประจำกอง
                  </p>
                  <Button
                    size="sm"
                    onClick={handleDeptReceive}
                    className="w-full bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-black gap-2 shadow-md cursor-pointer h-9"
                  >
                    <Stamp className="w-4 h-4" />
                    <span>📑 ประทับตราลงรับ {selectedDeptBox} (ออกเลข {deptRegNo})</span>
                  </Button>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs shadow-2xs animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-extrabold text-emerald-950">
                        {selectedDeptBox} ลงรับหนังสือแล้ว
                      </span>
                      <p className="text-[10px] text-emerald-700 font-mono">
                        เลขรับกอง: <strong>{deptRegNo}</strong> ({deptRegDate} {deptRegTime})
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    พร้อมเกษียนงาน
                  </span>
                </div>
              )}

              {/* ๒. มอบหมายกอง (สำหรับสารบรรณกลาง) */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">๒. ส่วนกลางมอบหมายกอง (ตราส่งกอง) :</span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    สิทธิสารบรรณกลาง
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {["สำนักปลัด", "กองคลัง", "กองช่าง", "กองการศึกษาฯ", "กองสาธารณสุข"].map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => setSelectedDeptBox(dept)}
                      className={`p-2 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                        selectedDeptBox === dept
                          ? "bg-[#0052FF] text-white border-[#0052FF] shadow-xs"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {selectedDeptBox === dept ? "✓ " : "• "}{dept}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. บันทึกเกษียน / คำสั่งการ */}
              <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900">๒. บันทึกเกษียน / คำสั่งการ :</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomEndorseNote("ตรวจสอบระเบียบกระทรวงมหาดไทยแล้วเห็นชอบตามเสนอ เรียน นายก อบต.ดอยงาม เพื่อโปรดพิจารณาแต่งตั้งคณะทำงานยกร่างงบประมาณ พ.ศ. ๒๕๗๐");
                    }}
                    className="text-[10px] font-bold text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-purple-600" />
                    <span>ให้ AI ช่วยร่าง</span>
                  </button>
                </div>

                {/* Identity / Signer Selector */}
                <div className="space-y-1.5 p-3 rounded-xl bg-white border border-amber-200">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] text-slate-700 font-black">ผู้ลงนามเกษียน (Endorser / Signer):</label>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {activeSigner.role}
                    </span>
                  </div>

                  {systemUsers.length > 0 ? (
                    <select
                      value={selectedSignerId}
                      onChange={(e) => setSelectedSignerId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50/50 font-bold text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#0052FF]"
                    >
                      <option value="CURRENT_USER">
                        👤 บัญชีปัจจุบัน: {session?.user?.name || "ผู้ใช้งาน"} ({session?.user?.position || "เจ้าหน้าที่"})
                      </option>
                      {systemUsers.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.fullName} — {u.position} ({u.department})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-2 rounded-lg bg-blue-50/50 border border-blue-100 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block text-xs">{activeSigner.name}</span>
                        <span className="text-[11px] text-slate-600">{activeSigner.position} — {activeSigner.department}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Stamp Chips (3 Seconds) */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-amber-900 block">
                    ⚡ คำเกษียนด่วน Quick Stamp (๓ วินาที):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {standardQuickPhrases.map((phrase, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (selectedQuickAction.includes(phrase)) {
                            setSelectedQuickAction(selectedQuickAction.filter((p) => p !== phrase));
                          } else {
                            setSelectedQuickAction([...selectedQuickAction, phrase]);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                          selectedQuickAction.includes(phrase)
                            ? "bg-amber-600 text-white border-amber-700 shadow-2xs"
                            : "bg-white text-slate-700 border-amber-200 hover:bg-amber-100/60"
                        }`}
                      >
                        {phrase}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Note Textarea & AI Thai Voice Dictation Trigger */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] text-slate-600 font-bold">ข้อความเกษียนเพิ่มเติม :</label>
                    <button
                      type="button"
                      onClick={() => setShowVoiceDialog(true)}
                      className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-[10px] font-black flex items-center gap-1.5 shadow-xs cursor-pointer"
                      title="สั่งการด้วยเสียงภาษาไทย (AI Thai Voice Dictation)"
                    >
                      <Mic className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                      <span>🎙️ พูดสั่งการด้วยเสียง (Voice AI)</span>
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={customEndorseNote}
                    onChange={(e) => setCustomEndorseNote(e.target.value)}
                    placeholder="พิมพ์ความเห็นเพิ่มเติม หรือกดปุ่ม 🎙️ พูดสั่งการด้วยเสียง..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0052FF]"
                  />
                </div>

                {/* AI Voice Dictation Studio Modal / Popover */}
                {showVoiceDialog && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900 to-indigo-950 text-white space-y-3 shadow-2xl border border-purple-400/40 animate-in zoom-in-95">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-purple-500/30 text-amber-300 flex items-center justify-center border border-purple-400/40">
                          <Mic className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-black text-xs text-white">ระบบสั่งการด้วยเสียงภาษาไทย (AI Thai Voice)</h4>
                          <p className="text-[10px] text-purple-200">พูดเพื่อแปลงเสียงเป็นข้อความเกษียนราชการอัตโนมัติ</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowVoiceDialog(false)}
                        className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer text-xs"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Microphone Recording Simulation */}
                    <div className="p-3 bg-purple-950/80 rounded-xl border border-purple-700/60 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-3.5 h-3.5 rounded-full ${isVoiceRecording ? "bg-rose-500 animate-ping" : "bg-emerald-400"}`} />
                        <span className="text-xs font-mono text-purple-100 font-bold">
                          {isVoiceRecording ? "กำลังบันทึกเสียงพูด..." : "ไมโครโฟนพร้อมรับเสียง..."}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsVoiceRecording(!isVoiceRecording);
                          if (!isVoiceRecording) {
                            setTimeout(() => {
                              handleApplyVoice(voicePresets[0]);
                            }, 1800);
                          }
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1 ${
                          isVoiceRecording
                            ? "bg-rose-600 text-white animate-pulse"
                            : "bg-purple-600 hover:bg-purple-500 text-white"
                        }`}
                      >
                        <Radio className="w-3.5 h-3.5" />
                        <span>{isVoiceRecording ? "กำลังฟัง..." : "แตะเพื่อเริ่มพูด"}</span>
                      </button>
                    </div>

                    {/* Quick Voice Command Presets for Executives */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-purple-200 block">
                        หรือเลือกคำสั่งเสียงมาตรฐานของผู้บริหาร (๑-คลิก):
                      </span>
                      <div className="space-y-1">
                        {voicePresets.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleApplyVoice(preset)}
                            className="w-full p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-left text-[11px] text-purple-100 hover:text-white transition-all cursor-pointer font-serif flex items-start gap-2"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
                            <span className="leading-tight">&ldquo;{preset}&rdquo;</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Endorsement Button */}
                <Button
                  onClick={handleAddEndorsement}
                  variant="signature"
                  size="lg"
                  className="w-full rounded-2xl gap-2 font-bold shadow-accent hover:shadow-accent-lg cursor-pointer"
                >
                  <PenTool className="w-4 h-4 text-amber-300" />
                  <span>ประทับตราและบันทึกเกษียนลงใน PDF</span>
                </Button>
              </div>
            </div>
          )}

          {/* TAB 2: AI SUMMARY */}
          {activeSideTab === "ai_summary" && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs font-sans">
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="font-black text-sm">Gemini 2.5 AI Executive Summary</span>
                </div>
                <p className="text-xs leading-relaxed text-purple-950">
                  กระทรวงมหาดไทยแจ้งซักซ้อมแนวทางปฏิบัติการจัดทำงบประมาณรายจ่ายประจำปี พ.ศ. ๒๕๗๐ ให้ อปท. นำเสนอร่างข้อบัญญัติงบประมาณภายในวันที่ ๑๕ สิงหาคม ๒๕๖๙
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 text-xs block">💡 ข้อเสนอแนะสำหรับผู้บริหาร:</span>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li>เห็นควรลงนามอนุมัติให้กองคลังเป็นเจ้าของเรื่องหลักในการรวบรวมคำของบประมาณจากทุกกอง</li>
                  <li>แต่งตั้งคณะกรรมการยกร่างข้อบัญญัติงบประมาณรายจ่ายประจำปี พ.ศ. ๒๕๗๐</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: DOCUMENT DETAILS */}
          {activeSideTab === "detail" && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 text-xs font-sans">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold">จาก:</span>
                <p className="font-bold text-slate-900">{currentDoc.from}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold">ถึง:</span>
                <p className="font-bold text-slate-900">{currentDoc.to}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold">ชั้นความเร็ว:</span>
                <p className="font-bold text-rose-600">{currentDoc.speed}</p>
              </div>
            </div>
          )}

          {/* TAB 4: TRACKING */}
          {activeSideTab === "tracking" && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 text-xs font-sans">
              <div className="border-l-2 border-[#0052FF] pl-3 space-y-3">
                <div>
                  <span className="font-bold text-slate-900 block">๑. ลงรับหนังสือเข้ากลาง</span>
                  <span className="text-[10px] text-slate-400">{currentDoc.regDate} {currentDoc.regTime} (น.ส.นภา วงศ์ใหญ่)</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">๒. มอบหมาย {selectedDeptBox}</span>
                  <span className="text-[10px] text-slate-400">{currentDoc.regDate} ๐๙:๓๕ น. (นายสมศักดิ์ สุขใจ)</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">๓. เจ้าของเรื่องจัดทำบันทึกเกษียน</span>
                  <span className="text-[10px] text-slate-400">{currentDoc.regDate} ๐๙:๔๐ น. (นางสาวสมร กองเงิน)</span>
                </div>
              </div>
            </div>
          )}

          {/* Footer Bar */}
          <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            <span className="text-[11px] text-slate-400 font-medium">
              องค์การบริหารส่วนตำบลดอยงาม
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-xl text-xs font-bold"
            >
              ปิดหน้าต่าง
            </Button>
          </div>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* MODAL 1: Multi-Attachment Gallery & Uploader */}
      {/* ======================================================================= */}
      {showAttachmentsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden text-slate-900 animate-in zoom-in-95">
            <div className="bg-navy-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-purple-400" />
                <h3 className="font-extrabold text-base">เอกสารแนบประกอบ ({attachments.length} รายการ)</h3>
              </div>
              <button
                onClick={() => setShowAttachmentsModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-2">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                        {att.type === "excel" ? (
                          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                        ) : att.type === "pdf" ? (
                          <FileText className="w-4 h-4 text-rose-600" />
                        ) : (
                          <Eye className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 truncate">{att.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {att.size} • วันที่แนบ: {att.date}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => alert(`เปิดดูไฟล์แนบ: ${att.name}`)}
                        className="h-8 text-[11px] font-bold rounded-lg border-slate-300"
                      >
                        เปิดดู
                      </Button>
                      <button
                        onClick={() => setAttachments((prev) => prev.filter((a) => a.id !== att.id))}
                        className="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center"
                        title="ลบไฟล์แนบ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upload New Attachment Box */}
              <div className="p-4 border-2 border-dashed border-slate-300 rounded-2xl text-center space-y-2 bg-slate-50/60">
                <Upload className="w-6 h-6 mx-auto text-purple-600" />
                <p className="font-bold text-slate-800 text-xs">คลิกหรือลากไฟล์มาวางที่นี่เพื่อแนบเอกสารเพิ่มเติม</p>
                <p className="text-[10px] text-slate-500">รองรับไฟล์ PDF, Word, Excel, รูปภาพ JPG/PNG ขนาดไม่เกิน 50MB</p>
                <Button
                  size="sm"
                  onClick={() => {
                    const newId = `att-${Date.now()}`;
                    setAttachments((prev) => [
                      ...prev,
                      { id: newId, name: `เอกสารแนบเพิ่มเติม_${prev.length + 1}.pdf`, size: "650 KB", type: "pdf", date: "วันนี้" },
                    ]);
                  }}
                  className="h-8 text-xs bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold"
                >
                  + เพิ่มไฟล์แนบทดสอบ
                </Button>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAttachmentsModal(false)}
                  className="rounded-xl text-xs font-bold"
                >
                  ปิดหน้าต่าง
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 2: Task Delegation & SLA Assignment */}
      {/* ======================================================================= */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden text-slate-900 animate-in zoom-in-95">
            <div className="bg-navy-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-amber-300" />
                <h3 className="font-extrabold text-base">มอบหมายผู้รับผิดชอบ & กำหนด SLA</h3>
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignTask} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
                <div><strong>เลขที่หนังสือ :</strong> <span className="font-mono font-bold text-blue-950">{currentDoc.docNo}</span></div>
                <div><strong>เรื่อง :</strong> <span className="font-bold text-slate-900">{currentDoc.title}</span></div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">มอบหมายเจ้าหน้าที่ผู้รับผิดชอบ * :</label>
                <select
                  value={assignedOfficer}
                  onChange={(e) => setAssignedOfficer(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold bg-white text-xs"
                >
                  <option value="นายวิศวกร ช่างมั่น (นายช่างโยธาปฏิบัติการ — กองช่าง)">นายวิศวกร ช่างมั่น (นายช่างโยธาปฏิบัติการ — กองช่าง)</option>
                  <option value="นางสาวสมพร กองเงิน (เจ้าพนักงานการเงินและบัญชี — กองคลัง)">นางสาวสมพร กองเงิน (เจ้าพนักงานการเงินและบัญชี — กองคลัง)</option>
                  <option value="นายฐิติวัฒน์ รักแม่ (หัวหน้าฝ่ายบริหารงานทั่วไป — สำนักปลัด)">นายฐิติวัฒน์ รักแม่ (หัวหน้าฝ่ายบริหารงานทั่วไป — สำนักปลัด)</option>
                  <option value="นางสาวธัญวรรัตน์ ตาสาย (เจ้าพนักงานธุรการชำนาญงาน — สำนักปลัด)">นางสาวธัญวรรัตน์ ตาสาย (เจ้าพนักงานธุรการชำนาญงาน — สำนักปลัด)</option>
                  <option value="นายวุฒิไกร หน่อแก้ว (เจ้าพนักงานป้องกันและบรรเทาสาธารณภัย)">นายวุฒิไกร หน่อแก้ว (เจ้าพนักงานป้องกันและบรรเทาสาธารณภัย)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">กำหนดส่งมอบงาน (Due Date / SLA) * :</label>
                <select
                  value={assignedDueDate}
                  onChange={(e) => setAssignedDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold bg-white text-xs text-amber-900"
                >
                  <option value="ด่วนที่สุด (ภายในวันนี้ 16:30 น.)">ด่วนที่สุด (ภายในวันนี้ 16:30 น.)</option>
                  <option value="1 วัน (ภายในวันพรุ่งนี้ 16:30 น.)">1 วัน (ภายในวันพรุ่งนี้ 16:30 น.)</option>
                  <option value="3 วัน (ภายใน 3 ก.ย. 2569 16:30 น.)">3 วัน (ภายใน 3 ก.ย. 2569 16:30 น.)</option>
                  <option value="5 วัน (ภายใน 5 ก.ย. 2569 16:30 น.)">5 วัน (ภายใน 5 ก.ย. 2569 16:30 น.)</option>
                  <option value="7 วันทำการ">7 วันทำการ</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">คำสั่งการ / ข้อความมอบหมายงาน :</label>
                <textarea
                  rows={3}
                  value={assignedInstruction}
                  onChange={(e) => setAssignedInstruction(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAssignModal(false)}
                  className="rounded-xl text-xs font-bold h-10 px-4"
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl h-10 px-5 shadow-xs cursor-pointer"
                >
                  บันทึกมอบหมายงาน & แจ้งเตือน
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 3: Document Archiving & Close Case */}
      {/* ======================================================================= */}
      {showArchiveModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden text-slate-900 animate-in zoom-in-95">
            <div className="bg-navy-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Archive className="w-5 h-5 text-cyan-300" />
                <h3 className="font-extrabold text-base">ปิดเรื่อง & จัดเก็บเข้าแฟ้มคลังเอกสาร</h3>
              </div>
              <button
                onClick={() => setShowArchiveModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleArchiveDoc} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <div className="font-bold text-emerald-950">
                  ยืนยันการปิดเรื่องหนังสือ: <span className="font-mono">{currentDoc.docNo}</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  เมื่อปิดเรื่องแล้ว หนังสือฉบับนี้จะถูกย้ายเข้าสู่แฟ้มคลังเอกสารจัดเก็บ และบันทึกประวัติการสิ้นสุดกระบวนการ
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">หมวดหมู่แฟ้มคลังจัดเก็บ * :</label>
                <select
                  value={archiveCategory}
                  onChange={(e) => setArchiveCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold bg-white text-xs"
                >
                  <option value="แฟ้มงบประมาณและข้อบัญญัติ (หมวด ๕๒-๐๒)">แฟ้มงบประมาณและข้อบัญญัติ (หมวด ๕๒-๐๒)</option>
                  <option value="แฟ้มคำสั่งและระเบียบปฏิบัติ (หมวด ๕๒-๐๑)">แฟ้มคำสั่งและระเบียบปฏิบัติ (หมวด ๕๒-๐๑)</option>
                  <option value="แฟ้มโยธาและผังเมือง (หมวด ๕๒-๐๓)">แฟ้มโยธาและผังเมือง (หมวด ๕๒-๐๓)</option>
                  <option value="แฟ้มการศึกษาและวัฒนธรรม (หมวด ๕๒-๐๔)">แฟ้มการศึกษาและวัฒนธรรม (หมวด ๕๒-๐๔)</option>
                  <option value="แฟ้มสาธารณสุขและสิ่งแวดล้อม (หมวด ๕๒-๐๕)">แฟ้มสาธารณสุขและสิ่งแวดล้อม (หมวด ๕๒-๐๕)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">กำหนดอายุการเก็บรักษาเอกสาร * :</label>
                <select
                  value={retentionPeriod}
                  onChange={(e) => setRetentionPeriod(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold bg-white text-xs"
                >
                  <option value="๕ ปี (ตามระเบียบงานสารบรรณข้อ ๖๗)">๕ ปี (ตามระเบียบงานสารบรรณข้อ ๖๗)</option>
                  <option value="๑๐ ปี (เอกสารเกี่ยวกับการเงินและงบประมาณ)">๑๐ ปี (เอกสารเกี่ยวกับการเงินและงบประมาณ)</option>
                  <option value="จัดเก็บถาวร (เอกสารประวัติศาสตร์/ข้อบัญญัติ/แผนยุทธศาสตร์)">จัดเก็บถาวร (เอกสารประวัติศาสตร์/ข้อบัญญัติ/แผนยุทธศาสตร์)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">หมายเหตุการปิดเรื่อง :</label>
                <textarea
                  rows={2}
                  value={archiveNote}
                  onChange={(e) => setArchiveNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowArchiveModal(false)}
                  className="rounded-xl text-xs font-bold h-10 px-4"
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl h-10 px-5 shadow-xs cursor-pointer"
                >
                  บันทึกปิดเรื่อง & จัดเก็บเข้าแฟ้ม
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(content, window.document.body);
}

