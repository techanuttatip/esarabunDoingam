"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  FilePlus,
  Send,
  Printer,
  Download,
  Sparkles,
  CheckCircle2,
  Bookmark,
  Eye,
  PenTool,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Building,
  Check,
  Layers,
  Bot,
  Copy,
  Sliders,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  ClipboardList,
  FileSpreadsheet,
  Receipt,
  FileCode,
  LayoutTemplate,
} from "lucide-react";
import { ThaiGaruda } from "@/components/shared/thai-garuda";
import { AntiLeakWatermark } from "@/features/security/components/anti-leak-watermark";
import { DocVerificationSeal } from "@/components/shared/doc-verification-seal";
import { thaiBahtText } from "@/lib/formatters/thai-baht-text";
import { OFFICIAL_TEMPLATES } from "@/features/templates/data/official-templates";

export type DocTemplateType = "INTERNAL" | "EXTERNAL" | "ORDER" | "ANNOUNCEMENT" | "STAMP" | "RECEIPT";

const TEMPLATE_LIST: Array<{ id: DocTemplateType; label: string; desc: string }> = [
  { id: "INTERNAL", label: "๑. บันทึกข้อความ (ภายใน)", desc: "ครุฑมุมซ้ายบน ใช้ส่งภายใน อบต." },
  { id: "EXTERNAL", label: "๒. หนังสือภายนอก", desc: "ครุฑกึ่งกลาง ใช้ส่งถึงหน่วยงานอื่น" },
  { id: "ORDER", label: "๓. คำสั่ง อบต.ดอยงาม", desc: "แต่งตั้ง / มอบหมายงาน" },
  { id: "ANNOUNCEMENT", label: "๔. ประกาศ อบต.ดอยงาม", desc: "เผยแพร่ต่อสาธารณะ" },
  { id: "STAMP", label: "๕. หนังสือประทับตรา", desc: "ใช้ตราประทับแทนการลงชื่อ" },
  { id: "RECEIPT", label: "๖. ใบเสร็จรับเงิน / ใบสำคัญ", desc: "ออกใบเสร็จรับเงิน ตารางหมวดเงินราชการ" },
];

export default function DocumentGeneratorPage() {
  // Template Type
  const [templateType, setTemplateType] = useState<DocTemplateType>("RECEIPT");

  // General Document Form Fields
  const [docNoPrefix, setDocNoPrefix] = useState("ชร ๕๒๐๐๑/ว ");
  const [docNoRunning, setDocNoRunning] = useState("๐๑๔๕");
  const [deptName, setDeptName] = useState("สำนักปลัด องค์การบริหารส่วนตำบลดอยงาม");
  const [deptPhone, setDeptPhone] = useState("โทร. ๐-๕๓๗๒-๙๙๙๙");
  const [docDate, setDocDate] = useState("๒๘ สิงหาคม ๒๕๖๙");
  const [speed, setSpeed] = useState<"ปกติ" | "ด่วน" | "ด่วนมาก" | "ด่วนที่สุด">("ปกติ");
  const [secret, setSecret] = useState<"ปกติ" | "ลับ" | "ลับมาก" | "ลับที่สุด">("ปกติ");
  const [title, setTitle] = useState("ขออนุมัติดำเนินโครงการฝึกอบรมเชิงปฏิบัติการการใช้ระบบสารบรรณอิเล็กทรอนิกส์");
  const [recipient, setRecipient] = useState("นายกองค์การบริหารส่วนตำบลดอยงาม");
  const [reference, setReference] = useState("แผนปฏิบัติราชการประจำปีงบประมาณ พ.ศ. ๒๕๖๙");
  const [attachments, setAttachments] = useState("กำหนดการฝึกอบรม จำนวน ๑ ฉบับ");

  // Multi-paragraph body for letters
  const [p1, setP1] = useState(
    "ด้วย สำนักปลัด องค์การบริหารส่วนตำบลดอยงาม มีความประสงค์จะดำเนินโครงการฝึกอบรมเชิงปฏิบัติการการใช้ระบบสารบรรณอิเล็กทรอนิกส์ (SmartSarabun) ให้แก่ข้าราชการ พนักงานจ้าง และเจ้าหน้าที่ผู้ปฏิบัติงานด้านสารบรรณของทุกกองงาน เพื่อยกระดับการปฏิบัติราชการสู่ระบบดิจิทัลอย่างเต็มรูปแบบ"
  );
  const [p2, setP2] = useState(
    "ในการนี้ เพื่อให้การจัดโครงการฝึกอบรมดังกล่าวเป็นไปด้วยความเรียบร้อย มีประสิทธิภาพ และบรรลุตามวัตถุประสงค์ จึงขออนุมัติดำเนินการจัดฝึกอบรมในวันศุกร์ที่ ๔ กันยายน ๒๕๖๙ ณ ห้องประชุมสภาองค์การบริหารส่วนตำบลดอยงาม โดยเบิกจ่ายงบประมาณจากหมวดค่าใช้สอย ประจำปีงบประมาณ พ.ศ. ๒๕๖๙"
  );
  const [p3, setP3] = useState(
    "จึงเรียนมาเพื่อโปรดพิจารณา หากเห็นชอบโปรดอนุมัติให้ดำเนินการต่อไป"
  );

  // Signer
  const [signerName, setSignerName] = useState("นางสุกัญญามาศ เทพวงค์");
  const [signerPosition, setSignerPosition] = useState("หัวหน้าสำนักปลัด");
  const [includeSignature, setIncludeSignature] = useState(true);

  // =========================================================================
  // RECEIPT TEMPLATE FORM FIELDS (ใบเสร็จรับเงิน / ใบสำคัญรับเงิน)
  // =========================================================================
  const [receiptPreset, setReceiptPreset] = useState<string>("rent");
  const [receiptNo, setReceiptNo] = useState("ร.001/2569");
  const [receiptDate, setReceiptDate] = useState("30 ตุลาคม 2568");
  const [receiptOrg, setReceiptOrg] = useState("องค์การบริหารส่วนตำบลดอยงาม");
  const [receiptAddress, setReceiptAddress] = useState("123 หมู่ 4 ตำบลดอยงาม อำเภอพาน จังหวัดเชียงราย 57120");
  const [payerName, setPayerName] = useState("นายประสิทธิ์ รักษ์ดี");
  const [receiptItem, setReceiptItem] = useState("ค่าเช่าพื้นที่ร้านค้าสหกรณ์โรงเรียน เดือนตุลาคม");
  const [receiptAmount, setReceiptAmount] = useState("3000.00");
  const [receiptCategory, setReceiptCategory] = useState("ค่าเช่าสถานที่/ทรัพย์สิน");
  const [collectorName, setCollectorName] = useState("นายสมศักดิ์ สุขใจ");
  const [financeOfficerName, setFinanceOfficerName] = useState("นางสาวสมพร กองเงิน");
  const [directorName, setDirectorName] = useState("นายสำอางค์ ธรรมโก");

  // UI States
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(90);
  const [showSavedModal, setShowSavedModal] = useState(false);

  const printAreaRef = useRef<HTMLDivElement>(null);

  // Auto load template from Templates Hub if redirected
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedTpl = localStorage.getItem("smartsarabun_selected_template");
        if (storedTpl) {
          const tpl = JSON.parse(storedTpl);
          localStorage.removeItem("smartsarabun_selected_template");
          loadTemplateData(tpl);
          return;
        }

        // Check URL search params
        const params = new URLSearchParams(window.location.search);
        const tplId = params.get("template");
        if (tplId) {
          const found = OFFICIAL_TEMPLATES.find((t) => t.id === tplId);
          if (found) {
            loadTemplateData(found);
          }
        }
      } catch (e) {
        console.error("Failed to load template", e);
      }
    }
  }, []);

  const loadTemplateData = (tpl: any) => {
    if (!tpl || !tpl.fields) return;
    setTemplateType(tpl.docType);
    if (tpl.docType === "RECEIPT") {
      if (tpl.fields.receiptNo) setReceiptNo(tpl.fields.receiptNo);
      if (tpl.fields.receiptDate) setReceiptDate(tpl.fields.receiptDate);
      if (tpl.fields.payerName) setPayerName(tpl.fields.payerName);
      if (tpl.fields.receiptItem) setReceiptItem(tpl.fields.receiptItem);
      if (tpl.fields.receiptAmount) setReceiptAmount(tpl.fields.receiptAmount);
      if (tpl.fields.receiptCategory) setReceiptCategory(tpl.fields.receiptCategory);
      if (tpl.fields.collectorName) setCollectorName(tpl.fields.collectorName);
      if (tpl.fields.financeOfficerName) setFinanceOfficerName(tpl.fields.financeOfficerName);
      if (tpl.fields.directorName) setDirectorName(tpl.fields.directorName);
    } else {
      if (tpl.fields.title) setTitle(tpl.fields.title);
      if (tpl.fields.docNoPrefix) setDocNoPrefix(tpl.fields.docNoPrefix);
      if (tpl.fields.docNoRunning) setDocNoRunning(tpl.fields.docNoRunning);
      if (tpl.fields.deptName) setDeptName(tpl.fields.deptName);
      if (tpl.fields.deptPhone) setDeptPhone(tpl.fields.deptPhone);
      if (tpl.fields.docDate) setDocDate(tpl.fields.docDate);
      if (tpl.fields.recipient) setRecipient(tpl.fields.recipient);
      if (tpl.fields.reference) setReference(tpl.fields.reference);
      if (tpl.fields.attachments) setAttachments(tpl.fields.attachments);
      if (tpl.fields.p1) setP1(tpl.fields.p1);
      if (tpl.fields.p2) setP2(tpl.fields.p2);
      if (tpl.fields.p3) setP3(tpl.fields.p3);
      if (tpl.fields.signerName) setSignerName(tpl.fields.signerName);
      if (tpl.fields.signerPosition) setSignerPosition(tpl.fields.signerPosition);
    }
  };

  // Cycle to previous / next template (Carousel Navigation)
  const currentTplIndex = TEMPLATE_LIST.findIndex((t) => t.id === templateType);
  const handlePrevTemplate = () => {
    const prevIdx = (currentTplIndex - 1 + TEMPLATE_LIST.length) % TEMPLATE_LIST.length;
    setTemplateType(TEMPLATE_LIST[prevIdx].id);
  };
  const handleNextTemplate = () => {
    const nextIdx = (currentTplIndex + 1) % TEMPLATE_LIST.length;
    setTemplateType(TEMPLATE_LIST[nextIdx].id);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportWord = () => {
    const element = document.getElementById("official-paper-print-area");
    if (!element) return;

    const filename = templateType === "RECEIPT"
      ? `ใบเสร็จรับเงิน_${receiptNo.replace(/\//g, "-")}.doc`
      : `ร่างหนังสือราชการ_${docNoRunning}.doc`;

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${filename}</title>
        <style>
          @page { size: A4 portrait; margin: 2.5cm 2cm 2cm 3cm; }
          body { font-family: 'TH Sarabun PSK', 'TH Sarabun New', 'Sarabun', sans-serif; font-size: 16pt; line-height: 1.25; }
          table { border-collapse: collapse; width: 100%; }
          td, th { border: 1px solid #333; padding: 6px 10px; font-size: 14pt; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .indent { text-indent: 2.5cm; }
        </style>
      </head>
      <body>
        ${element.innerHTML}
      </body>
      </html>
    `;

    const blob = new Blob(["\ufeff" + htmlContent], {
      type: "application/msword;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveDraft = () => {
    const draftId = `draft-${Date.now()}`;
    const fullDocNo = templateType === "RECEIPT" ? receiptNo : `${docNoPrefix}${docNoRunning}`;
    const draftTitle = templateType === "RECEIPT" ? `[ใบเสร็จ] ${receiptItem} (${payerName})` : title;
    
    const draftItem = {
      id: draftId,
      docNo: fullDocNo,
      title: draftTitle,
      templateType,
      docDate: templateType === "RECEIPT" ? receiptDate : docDate,
      deptName,
      recipient: templateType === "RECEIPT" ? payerName : recipient,
      speed,
      secret,
      contentParagraphs: [p1, p2, p3],
      signerName: templateType === "RECEIPT" ? directorName : signerName,
      signerPosition: templateType === "RECEIPT" ? "นายก อบต.ดอยงาม" : signerPosition,
      createdAt: new Date().toISOString(),
      status: "draft",
    };

    if (typeof window !== "undefined") {
      try {
        const existing = JSON.parse(localStorage.getItem("smartsarabun_user_drafts") || "[]");
        const filtered = existing.filter((d: any) => d.id !== draftId && d.docNo !== fullDocNo);
        localStorage.setItem("smartsarabun_user_drafts", JSON.stringify([draftItem, ...filtered]));
      } catch (err) {
        console.error("Failed to save draft to localStorage", err);
      }
    }

    setShowSavedModal(true);
  };

  // Change receipt preset
  const handleReceiptPresetChange = (presetKey: string) => {
    setReceiptPreset(presetKey);
    if (presetKey === "rent") {
      setReceiptNo("ร.001/2568");
      setReceiptDate("30 ตุลาคม 2568");
      setPayerName("นายประสิทธิ์ รักษ์ดี");
      setReceiptItem("ค่าเช่าพื้นที่ร้านค้าสหกรณ์โรงเรียน เดือนตุลาคม");
      setReceiptAmount("3000.00");
      setReceiptCategory("ค่าเช่าสถานที่/ทรัพย์สิน");
    } else if (presetKey === "building_permit") {
      setReceiptNo("ร.042/2569");
      setReceiptDate("31 สิงหาคม 2569");
      setPayerName("นายวิโรจน์ เจริญกิจ (หจก. พานก่อสร้าง)");
      setReceiptItem("ค่าธรรมเนียมใบอนุญาตก่อสร้าง ดัดแปลง หรือรื้อถอนอาคาร (แบบ อ.1)");
      setReceiptAmount("1500.00");
      setReceiptCategory("ค่าธรรมเนียมและใบอนุญาต (กองช่าง)");
    } else if (presetKey === "land_tax") {
      setReceiptNo("ร.118/2569");
      setReceiptDate("31 สิงหาคม 2569");
      setPayerName("นางคำเอ้ย วงศ์คำ");
      setReceiptItem("ภาษีที่ดินและสิ่งปลูกสร้าง ประจำปีภาษี 2569 (โฉนดที่ดิน 14258)");
      setReceiptAmount("4850.00");
      setReceiptCategory("ภาษีจัดเก็บเอง (กองคลัง)");
    } else if (presetKey === "waste_fee") {
      setReceiptNo("ร.205/2569");
      setReceiptDate("28 สิงหาคม 2569");
      setPayerName("นายมานิตย์ สุวรรณ");
      setReceiptItem("ค่าธรรมเนียมการเก็บและขนสิ่งปฏิกูลหรือมูลฝอย ประจำปี 2569");
      setReceiptAmount("600.00");
      setReceiptCategory("ค่าบริการสาธารณสุขและสิ่งแวดล้อม");
    }
  };

  const handleApplyAiPreset = (presetType: string) => {
    setIsAiLoading(true);
    setTimeout(() => {
      if (presetType === "training") {
        setTitle("ขออนุมัติดำเนินโครงการฝึกอบรมพัฒนาศักยภาพบุคลากร ประจำปีงบประมาณ พ.ศ. ๒๕๖๙");
        setP1("ด้วย สำนักปลัด ได้เล็งเห็นความสำคัญของการพัฒนาทักษะทางดิจิทัลของบุคลากรในสังกัด เพื่อรองรับการให้บริการประชาชนอย่างรวดเร็วและโปร่งใส");
        setP2("จึงขออนุมัติดำเนินโครงการฝึกอบรมและเบิกจ่ายค่าใช้จ่ายตามระเบียบกระทรวงมหาดไทย");
        setP3("จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติ");
      } else if (presetType === "survey") {
        setTitle("รายงานผลการสำรวจความพึงพอใจของประชาชนต่อการให้บริการ ประจำไตรมาสที่ ๔");
        setP1("ตามที่ สำนักปลัด ได้ดำเนินการสำรวจความพึงพอใจของประชาชนผู้มารับบริการ ณ องค์การบริหารส่วนตำบลดอยงาม นั้น");
        setP2("บัดนี้ ได้ประมวลผลการสำรวจเรียบร้อยแล้ว ปรากฏว่ามีผลคะแนนความพึงพอใจเฉลี่ยร้อยละ ๙๔.๕๐ ซึ่งอยู่ในเกณฑ์ดีเยี่ยม");
        setP3("จึงเรียนมาเพื่อโปรดทราบและพิจารณาเผยแพร่บนเว็บไซต์ของหน่วยงานต่อไป");
      } else if (presetType === "order_committee") {
        setTemplateType("ORDER");
        setTitle("แต่งตั้งคณะกรรมการจัดทำร่างข้อบัญญัติงบประมาณรายจ่ายประจำปี พ.ศ. ๒๕๗๐");
        setP1("เพื่อให้การจัดทำร่างข้อบัญญัติงบประมาณรายจ่ายประจำปี พ.ศ. ๒๕๗๐ ขององค์การบริหารส่วนตำบลดอยงาม เป็นไปด้วยความถูกต้อง เรียบร้อย และสอดคล้องกับระเบียบกฎหมาย");
        setP2("อาศัยอำนาจตามความในมาตรา ๕๙ แห่งพระราชบัญญัติสภาตำบลและองค์การบริหารส่วนตำบล พ.ศ. ๒๕๓๗ และที่แก้ไขเพิ่มเติม จึงแต่งตั้งคณะกรรมการดังต่อไปนี้...");
        setP3("ทั้งนี้ ให้คณะกรรมการที่ได้รับการแต่งตั้ง ปฏิบัติหน้าที่ด้วยความรอบคอบและรายงานผลให้ทราบต่อไป");
      }
      setIsAiLoading(false);
    }, 400);
  };

  // Calculated Thai Baht Text
  const calculatedBahtText = thaiBahtText(receiptAmount);

  return (
    <div className="space-y-6 pb-16">
      {/* ======================================================================= */}
      {/* 1. TOP HEADER & QUICK ACTION BAR (Matches User Screenshot Layout) */}
      {/* ======================================================================= */}
      <div className="no-print bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-navy-950 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <FileText className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <span>{templateType === "RECEIPT" ? "ออกใบเสร็จรับเงิน / ใบสำคัญรับเงิน" : "ห้องปฏิบัติการร่างหนังสือราชการ"}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  อบต.ดอยงาม
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                พรีวิวแม่แบบเอกสารแบบสด (Live Canvas) พร้อมแปลงตัวเลขอักษรไทยและส่งออก Word/PDF
              </p>
            </div>
          </div>

          {/* Action Buttons styled like the user screenshot */}
          <div className="flex items-center gap-2">
            <Link href="/templates">
              <Button
                variant="outline"
                className="bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm rounded-xl h-10 px-3.5 gap-2 border-slate-300 shadow-2xs cursor-pointer"
              >
                <LayoutTemplate className="w-4 h-4 text-blue-600" />
                <span>คลังแม่แบบ ({OFFICIAL_TEMPLATES.length})</span>
              </Button>
            </Link>

            <Button
              onClick={handlePrint}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl h-10 px-4 gap-2 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-200" />
              <span>พิมพ์</span>
            </Button>

            <Button
              onClick={handleExportWord}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl h-10 px-4 gap-2 shadow-xs cursor-pointer"
            >
              <FileCode className="w-4 h-4 text-blue-200" />
              <span>ส่งออก Word</span>
            </Button>

            <Button
              onClick={handleSaveDraft}
              className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs sm:text-sm rounded-xl h-10 px-4 gap-2 shadow-xs cursor-pointer"
            >
              <Bookmark className="w-4 h-4 text-amber-300" />
              <span>บันทึกร่าง</span>
            </Button>
          </div>
        </div>

        {/* Top Fast Preset Selector (Directly as in screenshot) */}
        {templateType === "RECEIPT" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-3 border-t border-slate-100 items-center text-xs">
            <div className="md:col-span-8 space-y-1">
              <label className="font-bold text-slate-700 block">เลือกรายการรับเงิน / แม่แบบตัวอย่าง :</label>
              <select
                value={receiptPreset}
                onChange={(e) => handleReceiptPresetChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold bg-white text-xs text-navy-950 focus:ring-2 focus:ring-navy-600 focus:outline-none"
              >
                <option value="rent">30 ตุลาคม 2568 | ค่าเช่าพื้นที่ร้านค้าสหกรณ์โรงเรียน เดือนตุลาคม | 3,000.00 บาท</option>
                <option value="building_permit">31 สิงหาคม 2569 | ค่าธรรมเนียมใบอนุญาตก่อสร้างอาคาร (แบบ อ.1) | 1,500.00 บาท</option>
                <option value="land_tax">31 สิงหาคม 2569 | ภาษีที่ดินและสิ่งปลูกสร้าง ประจำปี 2569 | 4,850.00 บาท</option>
                <option value="waste_fee">28 สิงหาคม 2569 | ค่าธรรมเนียมการเก็บขยะและสิ่งปฏิกูล ประจำปี 2569 | 600.00 บาท</option>
              </select>
            </div>

            <div className="md:col-span-4 space-y-1">
              <label className="font-bold text-slate-700 block">เลขที่ใบเสร็จ :</label>
              <input
                type="text"
                value={receiptNo}
                onChange={(e) => setReceiptNo(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold bg-slate-50 text-xs text-navy-950"
              />
            </div>
          </div>
        )}
      </div>

      {/* ======================================================================= */}
      {/* 2. TEMPLATE SELECTOR TABS RIBBON */}
      {/* ======================================================================= */}
      <div className="no-print grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {TEMPLATE_LIST.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            onClick={() => setTemplateType(tpl.id)}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              templateType === tpl.id
                ? "bg-navy-900 text-white border-navy-900 shadow-md ring-2 ring-blue-500/30"
                : "bg-white text-slate-800 border-slate-200 hover:bg-blue-50/50 hover:border-blue-200"
            }`}
          >
            <div className="font-extrabold text-xs flex items-center justify-between">
              <span>{tpl.label}</span>
              {templateType === tpl.id && <Check className="w-3.5 h-3.5 text-amber-300" />}
            </div>
            <div className={`text-[10px] mt-1 line-clamp-1 ${templateType === tpl.id ? "text-slate-300" : "text-slate-500"}`}>
              {tpl.desc}
            </div>
          </button>
        ))}
      </div>

      {/* ======================================================================= */}
      {/* 3. MAIN WORKSPACE: Left Editor (38%) | Right Live Paper Canvas (62%) */}
      {/* ======================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT 38%: Form Controls */}
        <div className="no-print lg:col-span-5 space-y-4">
          {templateType === "RECEIPT" ? (
            /* Receipt Form Controls */
            <Card className="rounded-2xl border-slate-200 shadow-xs">
              <CardHeader className="p-4 border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  ข้อมูลใบเสร็จรับเงิน
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">วันที่รับเงิน :</label>
                  <input
                    type="text"
                    value={receiptDate}
                    onChange={(e) => setReceiptDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">ได้รับเงินจาก (ชื่อผู้ชำระ) :</label>
                  <input
                    type="text"
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">รายการชำระเงิน :</label>
                  <textarea
                    rows={2}
                    value={receiptItem}
                    onChange={(e) => setReceiptItem(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">จำนวนเงิน (ตัวเลข บาท) :</label>
                    <input
                      type="number"
                      step="0.01"
                      value={receiptAmount}
                      onChange={(e) => setReceiptAmount(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">หมวดเงิน :</label>
                    <input
                      type="text"
                      value={receiptCategory}
                      onChange={(e) => setReceiptCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                  <span className="text-[10px] text-emerald-700 font-bold block">จำนวนเงิน (ตัวอักษรภาษาไทย คำนวณอัตโนมัติ) :</span>
                  <p className="font-bold text-emerald-950 text-xs">{calculatedBahtText}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <h4 className="font-bold text-slate-800 text-xs">ผู้ลงนามในใบเสร็จ :</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 block">ผู้รับเงิน :</label>
                      <input
                        type="text"
                        value={collectorName}
                        onChange={(e) => setCollectorName(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block">เจ้าหน้าที่การเงิน :</label>
                      <input
                        type="text"
                        value={financeOfficerName}
                        onChange={(e) => setFinanceOfficerName(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block">ผู้อำนวยการ / นายก อบต. :</label>
                      <input
                        type="text"
                        value={directorName}
                        onChange={(e) => setDirectorName(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* General Official Letter Form Controls */
            <Card className="rounded-2xl border-slate-200 shadow-xs">
              <CardHeader className="p-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-blue-700" />
                    พารามิเตอร์หนังสือราชการ
                  </CardTitle>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Bot className="w-3.5 h-3.5 text-purple-600" />
                    <span>AI Assistant</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-4 text-xs">
                {/* AI Preset Chips */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-600" />
                    ชุดข้อความสำเร็จรูป (AI Quick Presets) :
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleApplyAiPreset("training")}
                      className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-bold border border-purple-200 hover:bg-purple-100 transition-colors"
                    >
                      + โครงการฝึกอบรม
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyAiPreset("survey")}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold border border-blue-200 hover:bg-blue-100 transition-colors"
                    >
                      + ผลสำรวจความพึงพอใจ
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyAiPreset("order_committee")}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-bold border border-amber-200 hover:bg-amber-100 transition-colors"
                    >
                      + คำสั่งแต่งตั้งกรรมการ
                    </button>
                  </div>
                </div>

                {/* Doc No & Date */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">เลขที่หนังสือ :</label>
                    <div className="flex items-center">
                      <span className="bg-slate-100 border border-r-0 border-slate-300 px-2 py-2 rounded-l-xl text-slate-600 font-mono text-[11px]">
                        {docNoPrefix}
                      </span>
                      <input
                        type="text"
                        value={docNoRunning}
                        onChange={(e) => setDocNoRunning(e.target.value)}
                        className="w-full px-2 py-2 rounded-r-xl border border-slate-300 font-mono font-bold text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">ลงวันที่ :</label>
                    <input
                      type="text"
                      value={docDate}
                      onChange={(e) => setDocDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                {/* Dept & Phone */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">ส่วนราชการเจ้าของเรื่อง :</label>
                    <input
                      type="text"
                      value={deptName}
                      onChange={(e) => setDeptName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">เบอร์โทรศัพท์ :</label>
                    <input
                      type="text"
                      value={deptPhone}
                      onChange={(e) => setDeptPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                {/* Subject / Title */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">เรื่อง (ชื่อหนังสือ) :</label>
                  <textarea
                    rows={2}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-xs"
                  />
                </div>

                {/* Recipient */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">เรียน (ผู้รับ) :</label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                {/* Paragraphs 1, 2, 3 */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 block">เนื้อหาหนังสือ (ย่อหน้า ๑ เหตุผล / ความเป็นมา) :</label>
                  <textarea
                    rows={3}
                    value={p1}
                    onChange={(e) => setP1(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs leading-relaxed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-slate-700 block">เนื้อหาหนังสือ (ย่อหน้า ๒ วัตถุประสงค์ / การดำเนินการ) :</label>
                  <textarea
                    rows={3}
                    value={p2}
                    onChange={(e) => setP2(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs leading-relaxed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-slate-700 block">เนื้อหาหนังสือ (ย่อหน้า ๓ สรุป / คำลงท้าย) :</label>
                  <textarea
                    rows={2}
                    value={p3}
                    onChange={(e) => setP3(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs leading-relaxed"
                  />
                </div>

                {/* Signer Block */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">ชื่อผู้ลงนาม :</label>
                    <input
                      type="text"
                      value={signerName}
                      onChange={(e) => setSignerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">ตำแหน่งผู้ลงนาม :</label>
                    <input
                      type="text"
                      value={signerPosition}
                      onChange={(e) => setSignerPosition(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* RIGHT 62%: LIVE OFFICIAL PAPER CANVAS WITH CAROUSEL ARROWS */}
        <div className="lg:col-span-7 flex flex-col items-center relative">
          {/* Floating Carousel Navigation Arrow: PREVIOUS (<) */}
          <button
            type="button"
            onClick={handlePrevTemplate}
            className="no-print hidden sm:flex absolute -left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-xl border border-slate-200 items-center justify-center hover:scale-110 transition-all cursor-pointer"
            title="สลับไปแม่แบบก่อนหน้า"
          >
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>

          {/* Floating Carousel Navigation Arrow: NEXT (>) */}
          <button
            type="button"
            onClick={handleNextTemplate}
            className="no-print hidden sm:flex absolute -right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-xl border border-slate-200 items-center justify-center hover:scale-110 transition-all cursor-pointer"
            title="สลับไปแม่แบบถัดไป"
          >
            <ChevronRight className="w-6 h-6 text-slate-700" />
          </button>

          {/* White Paper A4 Sheet Preview */}
          <div
            id="official-paper-print-area"
            ref={printAreaRef}
            className="w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-2xl rounded-sm p-8 sm:p-14 border border-slate-200 relative select-text font-serif leading-normal"
            style={{
              fontFamily: "'Sarabun', 'TH Sarabun New', sans-serif",
            }}
          >
            {/* Anti-Leak Watermark Background */}
            <AntiLeakWatermark userDept="อบต.ดอยงาม" />

            {/* ----------------------------------------------------------------- */}
            {/* TEMPLATE 6: ใบเสร็จรับเงิน (OFFICIAL RECEIPT TABLE CANVAS) */}
            {/* ----------------------------------------------------------------- */}
            {templateType === "RECEIPT" && (
              <div className="space-y-6">
                {/* Garuda Center */}
                <div className="flex flex-col items-center justify-center pb-1">
                  <ThaiGaruda className="w-20 h-20 text-slate-950 mb-2" />
                  <h1 className="text-2xl font-black text-slate-950 tracking-wide font-serif">
                    ใบเสร็จรับเงิน
                  </h1>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">{receiptOrg}</p>
                  <p className="text-xs text-slate-600">{receiptAddress}</p>
                </div>

                {/* Meta Grid Table */}
                <div className="border border-slate-400 rounded-xs overflow-hidden text-xs">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-slate-300">
                        <td className="w-1/2 p-2.5 border-r border-slate-300 font-bold bg-slate-50/50">
                          เลขที่ : <span className="font-mono font-black text-blue-950">{receiptNo}</span>
                        </td>
                        <td className="w-1/2 p-2.5 font-bold bg-slate-50/50">
                          วันที่ : <span className="font-normal">{receiptDate}</span>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-300">
                        <td colSpan={2} className="p-2.5">
                          <strong>ได้รับเงินจาก : </strong>
                          <span className="font-bold text-slate-900">{payerName}</span>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-300">
                        <td colSpan={2} className="p-2.5">
                          <strong>รายการ : </strong>
                          <span>{receiptItem}</span>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-300">
                        <td className="p-2.5 border-r border-slate-300">
                          <strong>จำนวนเงิน (ตัวเลข) : </strong>
                          <span className="font-mono font-bold text-slate-950">
                            {parseFloat(receiptAmount || "0").toLocaleString("th-TH", { minimumFractionDigits: 2 })} บาท
                          </span>
                        </td>
                        <td className="p-2.5">
                          <strong>จำนวนเงิน (อักษร) : </strong>
                          <span className="font-bold text-slate-900">{calculatedBahtText}</span>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2} className="p-2.5">
                          <strong>หมวดเงิน : </strong>
                          <span>{receiptCategory}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Three-Column Official Signatures Block */}
                <div className="mt-14 pt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="space-y-1">
                    <p className="text-slate-400 font-mono">...........................................</p>
                    <p className="font-bold text-slate-800">({collectorName})</p>
                    <p className="text-[11px] text-slate-600">ผู้รับเงิน</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-slate-400 font-mono">...........................................</p>
                    <p className="font-bold text-slate-800">({financeOfficerName})</p>
                    <p className="text-[11px] text-slate-600">เจ้าหน้าที่การเงิน</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-slate-400 font-mono">...........................................</p>
                    <p className="font-bold text-slate-800">({directorName})</p>
                    <p className="text-[11px] text-slate-600">นายก อบต.ดอยงาม</p>
                  </div>
                </div>

                {/* Footnote */}
                <p className="text-center text-[10px] text-slate-400 pt-6">
                  เอกสารนี้ออกโดยระบบสารบรรณและบัญชีการเงินอิเล็กทรอนิกส์ อบต.ดอยงาม
                </p>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* TEMPLATE 1: บันทึกข้อความ (INTERNAL MEMO) */}
            {/* ----------------------------------------------------------------- */}
            {templateType === "INTERNAL" && (
              <div className="space-y-4">
                <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3">
                  <div className="shrink-0 pt-0.5">
                    <ThaiGaruda className="w-14 h-14 text-slate-950" />
                  </div>
                  <div className="flex-1 text-center pr-14">
                    <h1 className="text-2xl font-black tracking-widest text-slate-950 font-serif">
                      บันทึกข้อความ
                    </h1>
                  </div>
                </div>

                <div className="space-y-2 text-xs border-b border-slate-300 pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong>ส่วนราชการ : </strong>
                      <span>{deptName} {deptPhone}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <strong>ที่ : </strong>
                      <span className="font-mono font-bold text-blue-950">{docNoPrefix}{docNoRunning}</span>
                    </div>
                    <div>
                      <strong>วันที่ : </strong>
                      <span>{docDate}</span>
                    </div>
                  </div>
                  <div>
                    <strong>เรื่อง : </strong>
                    <span className="font-bold text-slate-950">{title}</span>
                  </div>
                </div>

                <div className="text-xs pt-1">
                  <strong>เรียน : </strong>
                  <span>{recipient}</span>
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-justify indent-8 pt-2">
                  <p>{p1}</p>
                  <p>{p2}</p>
                  <p>{p3}</p>
                </div>

                <div className="mt-12 text-right pr-6 space-y-1 text-xs">
                  {includeSignature ? (
                    <div className="h-10 flex items-center justify-end pr-6">
                      <span className="font-sans italic text-blue-900 font-bold text-sm tracking-wider">
                        {signerName.split(" ")[0]}
                      </span>
                    </div>
                  ) : (
                    <div className="h-8" />
                  )}
                  <p className="font-bold">({signerName})</p>
                  <p className="text-slate-700">{signerPosition}</p>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* TEMPLATE 2: หนังสือภายนอก (EXTERNAL OFFICIAL LETTER) */}
            {/* ----------------------------------------------------------------- */}
            {templateType === "EXTERNAL" && (
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center pb-2">
                  <ThaiGaruda className="w-24 h-24 text-slate-950 mb-2" />
                </div>

                <div className="grid grid-cols-12 gap-2 text-xs items-start">
                  <div className="col-span-6">
                    <strong>ที่ : </strong>
                    <span className="font-mono font-bold text-blue-950">{docNoPrefix}{docNoRunning}</span>
                  </div>
                  <div className="col-span-6 text-right leading-tight">
                    <p className="font-bold">{deptName}</p>
                    <p className="text-[11px] text-slate-700">อำเภอพาน จังหวัดเชียงราย ๕๗๑๒๐</p>
                  </div>
                </div>

                <div className="text-center text-xs font-bold py-1">{docDate}</div>

                <div className="space-y-1.5 text-xs">
                  <div>
                    <strong>เรื่อง : </strong>
                    <span className="font-bold text-slate-950">{title}</span>
                  </div>
                  <div>
                    <strong>เรียน : </strong>
                    <span>{recipient}</span>
                  </div>
                  <div>
                    <strong>อ้างถึง : </strong>
                    <span>{reference}</span>
                  </div>
                  <div>
                    <strong>สิ่งที่ส่งมาด้วย : </strong>
                    <span>{attachments}</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-justify indent-8 pt-3">
                  <p>{p1}</p>
                  <p>{p2}</p>
                  <p>{p3}</p>
                </div>

                <div className="mt-10 text-right pr-12 space-y-1 text-xs">
                  <p className="font-bold mb-6">ขอแสดงความนับถือ</p>
                  <p className="font-bold">({signerName})</p>
                  <p className="text-slate-700">{signerPosition}</p>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* TEMPLATE 3: คำสั่ง (OFFICIAL ORDER) */}
            {/* ----------------------------------------------------------------- */}
            {templateType === "ORDER" && (
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center pb-2">
                  <ThaiGaruda className="w-24 h-24 text-slate-950 mb-2" />
                  <h1 className="text-xl font-black text-slate-950 font-serif">
                    คำสั่งองค์การบริหารส่วนตำบลดอยงาม
                  </h1>
                  <p className="text-xs font-bold text-slate-700">
                    ที่ {docNoRunning} / ๒๕๖๙
                  </p>
                  <p className="text-xs font-bold text-slate-900 mt-1">
                    เรื่อง {title}
                  </p>
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-justify indent-8 pt-3">
                  <p>{p1}</p>
                  <p>{p2}</p>
                  <p>{p3}</p>
                </div>

                <div className="mt-12 text-center space-y-1 text-xs">
                  <p>สั่ง ณ วันที่ {docDate}</p>
                  <div className="h-8" />
                  <p className="font-bold">(นายสำอางค์ ธรรมโก)</p>
                  <p className="text-slate-700">นายกองค์การบริหารส่วนตำบลดอยงาม</p>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* TEMPLATE 4: ประกาศ (ANNOUNCEMENT) */}
            {/* ----------------------------------------------------------------- */}
            {templateType === "ANNOUNCEMENT" && (
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center pb-2">
                  <ThaiGaruda className="w-24 h-24 text-slate-950 mb-2" />
                  <h1 className="text-xl font-black text-slate-950 font-serif">
                    ประกาศองค์การบริหารส่วนตำบลดอยงาม
                  </h1>
                  <p className="text-xs font-bold text-slate-900 mt-1">
                    เรื่อง {title}
                  </p>
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-justify indent-8 pt-3">
                  <p>{p1}</p>
                  <p>{p2}</p>
                  <p>{p3}</p>
                </div>

                <div className="mt-12 text-center space-y-1 text-xs">
                  <p>ประกาศ ณ วันที่ {docDate}</p>
                  <div className="h-8" />
                  <p className="font-bold">(นายสำอางค์ ธรรมโก)</p>
                  <p className="text-slate-700">นายกองค์การบริหารส่วนตำบลดอยงาม</p>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* TEMPLATE 5: หนังสือประทับตรา (STAMPED LETTER) */}
            {/* ----------------------------------------------------------------- */}
            {templateType === "STAMP" && (
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center pb-2">
                  <ThaiGaruda className="w-20 h-20 text-slate-950 mb-2" />
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <div><strong>ที่ : </strong><span className="font-mono">{docNoPrefix}{docNoRunning}</span></div>
                    <div><strong>ถึง : </strong><span>{recipient}</span></div>
                  </div>
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-justify indent-8 pt-4">
                  <p>{p1}</p>
                  <p>{p2}</p>
                  <p>{p3}</p>
                </div>

                <div className="mt-12 flex justify-between items-end text-xs">
                  <div className="border-2 border-red-800 text-red-900 p-3 rounded-lg text-[11px] font-bold text-center w-36">
                    <p>ตราประจำ</p>
                    <p>อบต.ดอยงาม</p>
                  </div>
                  <div className="text-right">
                    <p>{deptName}</p>
                    <p>{docDate}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Document Digital Seal Footer */}
            <div className="mt-16 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-400 font-mono">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>SmartSarabun B.E. 2569 — Electronic Document Standard Compliant</span>
              </div>
              <DocVerificationSeal
                docId={templateType === "RECEIPT" ? `receipt-${receiptNo.replace(/\D/g, "") || "001"}` : `out-${docNoRunning || "0145"}`}
                docNo={templateType === "RECEIPT" ? receiptNo : `${docNoPrefix}${docNoRunning}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Saved Draft Confirmation Modal */}
      {showSavedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-300">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">บันทึกฉบับร่างสำเร็จเรียบร้อย!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  เอกสารฉบับนี้ถูกส่งไปยังรายการ &quot;งานของฉัน&quot; (My Tasks) และสามารถกลับมาแก้ไขต่อได้ตลอดเวลา
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowSavedModal(false)}
                  className="text-xs font-bold rounded-xl"
                >
                  เขียนร่างต่อ
                </Button>

                <Link href="/tasks">
                  <Button className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl gap-2">
                    <ClipboardList className="w-4 h-4 text-amber-300" />
                    ไปยังหน้างานของฉัน
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
