"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LayoutTemplate,
  Search,
  Plus,
  Eye,
  FileText,
  Download,
  Sparkles,
  CheckCircle2,
  Building,
  Printer,
  FileCode,
  Check,
  ChevronRight,
  Receipt,
  FileSpreadsheet,
  X,
  Star,
  ExternalLink,
} from "lucide-react";
import { OFFICIAL_TEMPLATES, OfficialTemplate } from "@/features/templates/data/official-templates";
import { ThaiGaruda } from "@/components/shared/thai-garuda";
import { thaiBahtText } from "@/lib/formatters/thai-baht-text";
import { DocVerificationSeal } from "@/components/shared/doc-verification-seal";

export default function TemplatesHubPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [previewTemplate, setPreviewTemplate] = useState<OfficialTemplate | null>(null);

  const filteredTemplates = OFFICIAL_TEMPLATES.filter((tpl) => {
    if (selectedCategory !== "ALL" && tpl.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        tpl.title.toLowerCase().includes(q) ||
        tpl.code.toLowerCase().includes(q) ||
        tpl.description.toLowerCase().includes(q) ||
        tpl.deptOwner.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleUseTemplate = (tpl: OfficialTemplate) => {
    // Store in localStorage as active draft or navigate with template query
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("smartsarabun_selected_template", JSON.stringify(tpl));
      } catch (e) {}
    }
    router.push(`/create?template=${tpl.id}`);
  };

  const handleExportWord = (tpl: OfficialTemplate) => {
    const element = document.getElementById("template-preview-print-area");
    if (!element) return;

    const filename = `แม่แบบ_${tpl.code}_${tpl.title.slice(0, 30)}.doc`;
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

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="คลังแม่แบบหนังสือราชการ (Official Document Templates Hub)"
          description="ศูนย์รวมแม่แบบเอกสารสำเร็จรูปมาตรฐานสำหรับ อบต.ดอยงาม: ใบเสร็จรับเงิน, จัดซื้อจัดจ้าง, บันทึกข้อความ, คำสั่ง และประกาศ"
        />

        <div className="flex items-center gap-2">
          <Link href="/create">
            <Button className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs sm:text-sm rounded-xl h-10 px-4 gap-2 shadow-xs cursor-pointer">
              <Plus className="w-4 h-4 text-amber-300" />
              สร้างร่างหนังสือใหม่
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: "แม่แบบทั้งหมด" },
            { id: "FINANCE", label: "💰 การเงินและพัสดุ" },
            { id: "ADMIN", label: "🏛️ บริหารทั่วไป/สำนักปลัด" },
            { id: "ORDER_ANNOUNCE", label: "📜 คำสั่งและประกาศ" },
            { id: "ENGINEERING", label: "🏗️ กองช่างและโยธา" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? "bg-navy-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาแม่แบบ, รหัส, หรือชื่อกอง..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-navy-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((tpl) => (
          <Card
            key={tpl.id}
            className="rounded-3xl border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group bg-white"
          >
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-black bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-lg border border-blue-200">
                  {tpl.code}
                </span>

                <div className="flex items-center gap-1.5">
                  {tpl.popular && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      นิยมใช้
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                    {tpl.categoryName}
                  </span>
                </div>
              </div>

              <CardTitle className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug line-clamp-2">
                {tpl.title}
              </CardTitle>

              <CardDescription className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                {tpl.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-0 space-y-4">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">หน่วยงานเจ้าของเรื่อง:</span>
                  <span className="font-bold text-slate-800">{tpl.deptOwner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ประเภทหนังสือ:</span>
                  <span className="font-semibold text-navy-900">
                    {tpl.docType === "RECEIPT"
                      ? "ใบเสร็จรับเงิน"
                      : tpl.docType === "INTERNAL"
                      ? "บันทึกข้อความ (ภายใน)"
                      : tpl.docType === "EXTERNAL"
                      ? "หนังสือภายนอก"
                      : tpl.docType === "ORDER"
                      ? "คำสั่ง"
                      : "ประกาศ"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewTemplate(tpl)}
                  className="flex-1 text-xs font-bold rounded-xl h-9 border-slate-300 gap-1.5 hover:bg-slate-100 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  <span>ดูตัวอย่าง</span>
                </Button>

                <Button
                  size="sm"
                  onClick={() => handleUseTemplate(tpl)}
                  className="flex-1 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold rounded-xl h-9 gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>นำไปใช้ร่าง</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ======================================================================= */}
      {/* FULL-SCREEN LIVE TEMPLATE PREVIEW MODAL */}
      {/* ======================================================================= */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-100 rounded-3xl shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900 animate-in zoom-in-95">
            {/* Modal Top Bar */}
            <div className="bg-navy-950 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold">
                  <LayoutTemplate className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">{previewTemplate.title}</h3>
                  <p className="text-[11px] text-slate-400">
                    รหัสแม่แบบ: {previewTemplate.code} • {previewTemplate.deptOwner}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => window.print()}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl h-9 px-3 gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>พิมพ์</span>
                </Button>

                <Button
                  size="sm"
                  onClick={() => handleExportWord(previewTemplate)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl h-9 px-3 gap-1.5"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>ส่งออก Word</span>
                </Button>

                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-rose-600 text-white flex items-center justify-center ml-2 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Live Scrollable A4 Document Sheet */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center">
              <div
                id="template-preview-print-area"
                className="w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-xl rounded-xs p-8 sm:p-14 border border-slate-200 select-text font-serif leading-normal"
                style={{
                  fontFamily: "'Sarabun', 'TH Sarabun New', sans-serif",
                }}
              >
                {/* ----------------------------------------------------------- */}
                {/* 1. RECEIPT TEMPLATE PREVIEW */}
                {/* ----------------------------------------------------------- */}
                {previewTemplate.docType === "RECEIPT" && (
                  <div className="space-y-6 text-xs">
                    <div className="flex flex-col items-center justify-center pb-1 text-center">
                      <ThaiGaruda className="w-20 h-20 text-slate-950 mb-2" />
                      <h1 className="text-2xl font-black text-slate-950 font-serif">
                        ใบเสร็จรับเงิน
                      </h1>
                      <p className="font-bold text-slate-800 text-sm mt-0.5">องค์การบริหารส่วนตำบลดอยงาม</p>
                      <p className="text-xs text-slate-600">123 หมู่ 4 ตำบลดอยงาม อำเภอพาน จังหวัดเชียงราย 57120</p>
                    </div>

                    <div className="border border-slate-400 rounded-xs overflow-hidden text-xs">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr className="border-b border-slate-300">
                            <td className="w-1/2 p-2.5 border-r border-slate-300 font-bold bg-slate-50/50">
                              เลขที่ : <span className="font-mono font-black text-blue-950">{previewTemplate.fields.receiptNo || "ร.001/2568"}</span>
                            </td>
                            <td className="w-1/2 p-2.5 font-bold bg-slate-50/50">
                              วันที่ : <span className="font-normal">{previewTemplate.fields.receiptDate || "30 ตุลาคม 2568"}</span>
                            </td>
                          </tr>
                          <tr className="border-b border-slate-300">
                            <td colSpan={2} className="p-2.5">
                              <strong>ได้รับเงินจาก : </strong>
                              <span className="font-bold text-slate-900">{previewTemplate.fields.payerName || "นายประสิทธิ์ รักษ์ดี"}</span>
                            </td>
                          </tr>
                          <tr className="border-b border-slate-300">
                            <td colSpan={2} className="p-2.5">
                              <strong>รายการ : </strong>
                              <span>{previewTemplate.fields.receiptItem}</span>
                            </td>
                          </tr>
                          <tr className="border-b border-slate-300">
                            <td className="p-2.5 border-r border-slate-300">
                              <strong>จำนวนเงิน (ตัวเลข) : </strong>
                              <span className="font-mono font-bold text-slate-950">
                                {parseFloat(previewTemplate.fields.receiptAmount || "3000").toLocaleString("th-TH", { minimumFractionDigits: 2 })} บาท
                              </span>
                            </td>
                            <td className="p-2.5">
                              <strong>จำนวนเงิน (อักษร) : </strong>
                              <span className="font-bold text-slate-900">
                                {thaiBahtText(previewTemplate.fields.receiptAmount || "3000")}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={2} className="p-2.5">
                              <strong>หมวดเงิน : </strong>
                              <span>{previewTemplate.fields.receiptCategory || "ค่าเช่าสถานที่/ทรัพย์สิน"}</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-14 pt-4 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="space-y-1">
                        <p className="text-slate-400 font-mono">...........................................</p>
                        <p className="font-bold text-slate-800">({previewTemplate.fields.collectorName || "นายสมศักดิ์ สุขใจ"})</p>
                        <p className="text-[11px] text-slate-600">ผู้รับเงิน</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-slate-400 font-mono">...........................................</p>
                        <p className="font-bold text-slate-800">({previewTemplate.fields.financeOfficerName || "นางสาวสมพร กองเงิน"})</p>
                        <p className="text-[11px] text-slate-600">เจ้าหน้าที่การเงิน</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-slate-400 font-mono">...........................................</p>
                        <p className="font-bold text-slate-800">({previewTemplate.fields.directorName || "นายสำอางค์ ธรรมโก"})</p>
                        <p className="text-[11px] text-slate-600">นายก อบต.ดอยงาม</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ----------------------------------------------------------- */}
                {/* 2. INTERNAL MEMO PREVIEW */}
                {/* ----------------------------------------------------------- */}
                {previewTemplate.docType === "INTERNAL" && (
                  <div className="space-y-4 text-xs">
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

                    <div className="space-y-2 border-b border-slate-300 pb-3">
                      <div>
                        <strong>ส่วนราชการ : </strong>
                        <span>{previewTemplate.fields.deptName} {previewTemplate.fields.deptPhone}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <strong>ที่ : </strong>
                          <span className="font-mono font-bold text-blue-950">
                            {previewTemplate.fields.docNoPrefix}{previewTemplate.fields.docNoRunning}
                          </span>
                        </div>
                        <div>
                          <strong>วันที่ : </strong>
                          <span>{previewTemplate.fields.docDate}</span>
                        </div>
                      </div>
                      <div>
                        <strong>เรื่อง : </strong>
                        <span className="font-bold text-slate-950">{previewTemplate.fields.title}</span>
                      </div>
                    </div>

                    <div className="pt-1">
                      <strong>เรียน : </strong>
                      <span>{previewTemplate.fields.recipient}</span>
                    </div>

                    {previewTemplate.fields.reference && (
                      <div>
                        <strong>อ้างถึง : </strong>
                        <span>{previewTemplate.fields.reference}</span>
                      </div>
                    )}

                    {previewTemplate.fields.attachments && (
                      <div>
                        <strong>สิ่งที่ส่งมาด้วย : </strong>
                        <span>{previewTemplate.fields.attachments}</span>
                      </div>
                    )}

                    <div className="space-y-3 leading-relaxed text-justify indent-8 pt-2">
                      <p>{previewTemplate.fields.p1}</p>
                      <p>{previewTemplate.fields.p2}</p>
                      <p>{previewTemplate.fields.p3}</p>
                    </div>

                    <div className="mt-12 text-right pr-6 space-y-1">
                      <p className="font-bold">({previewTemplate.fields.signerName})</p>
                      <p className="text-slate-700">{previewTemplate.fields.signerPosition}</p>
                    </div>
                  </div>
                )}

                {/* ----------------------------------------------------------- */}
                {/* 3. EXTERNAL LETTER PREVIEW */}
                {/* ----------------------------------------------------------- */}
                {previewTemplate.docType === "EXTERNAL" && (
                  <div className="space-y-4 text-xs">
                    <div className="flex flex-col items-center justify-center pb-2">
                      <ThaiGaruda className="w-24 h-24 text-slate-950 mb-2" />
                    </div>

                    <div className="grid grid-cols-12 gap-2 items-start">
                      <div className="col-span-6">
                        <strong>ที่ : </strong>
                        <span className="font-mono font-bold text-blue-950">
                          {previewTemplate.fields.docNoPrefix}{previewTemplate.fields.docNoRunning}
                        </span>
                      </div>
                      <div className="col-span-6 text-right leading-tight">
                        <p className="font-bold">{previewTemplate.fields.deptName}</p>
                        <p className="text-[11px] text-slate-700">อำเภอพาน จังหวัดเชียงราย ๕๗๑๒๐</p>
                      </div>
                    </div>

                    <div className="text-center font-bold py-1">{previewTemplate.fields.docDate}</div>

                    <div className="space-y-1.5">
                      <div>
                        <strong>เรื่อง : </strong>
                        <span className="font-bold text-slate-950">{previewTemplate.fields.title}</span>
                      </div>
                      <div>
                        <strong>เรียน : </strong>
                        <span>{previewTemplate.fields.recipient}</span>
                      </div>
                    </div>

                    <div className="space-y-3 leading-relaxed text-justify indent-8 pt-3">
                      <p>{previewTemplate.fields.p1}</p>
                      <p>{previewTemplate.fields.p2}</p>
                      <p>{previewTemplate.fields.p3}</p>
                    </div>

                    <div className="mt-10 text-right pr-12 space-y-1">
                      <p className="font-bold mb-6">ขอแสดงความนับถือ</p>
                      <p className="font-bold">({previewTemplate.fields.signerName})</p>
                      <p className="text-slate-700">{previewTemplate.fields.signerPosition}</p>
                    </div>
                  </div>
                )}

                {/* ----------------------------------------------------------- */}
                {/* 4. ORDER PREVIEW */}
                {/* ----------------------------------------------------------- */}
                {previewTemplate.docType === "ORDER" && (
                  <div className="space-y-4 text-xs">
                    <div className="flex flex-col items-center justify-center pb-2">
                      <ThaiGaruda className="w-24 h-24 text-slate-950 mb-2" />
                      <h1 className="text-xl font-black text-slate-950 font-serif">
                        คำสั่งองค์การบริหารส่วนตำบลดอยงาม
                      </h1>
                      <p className="font-bold text-slate-700">
                        ที่ {previewTemplate.fields.docNoRunning}
                      </p>
                      <p className="font-bold text-slate-900 mt-1">
                        เรื่อง {previewTemplate.fields.title}
                      </p>
                    </div>

                    <div className="space-y-3 leading-relaxed text-justify indent-8 pt-3">
                      <p>{previewTemplate.fields.p1}</p>
                      <p>{previewTemplate.fields.p2}</p>
                      <p>{previewTemplate.fields.p3}</p>
                    </div>

                    <div className="mt-12 text-center space-y-1">
                      <p>สั่ง ณ วันที่ {previewTemplate.fields.docDate}</p>
                      <div className="h-8" />
                      <p className="font-bold">({previewTemplate.fields.signerName})</p>
                      <p className="text-slate-700">{previewTemplate.fields.signerPosition}</p>
                    </div>
                  </div>
                )}

                {/* ----------------------------------------------------------- */}
                {/* 5. ANNOUNCEMENT PREVIEW */}
                {/* ----------------------------------------------------------- */}
                {previewTemplate.docType === "ANNOUNCEMENT" && (
                  <div className="space-y-4 text-xs">
                    <div className="flex flex-col items-center justify-center pb-2">
                      <ThaiGaruda className="w-24 h-24 text-slate-950 mb-2" />
                      <h1 className="text-xl font-black text-slate-950 font-serif">
                        ประกาศองค์การบริหารส่วนตำบลดอยงาม
                      </h1>
                      <p className="font-bold text-slate-900 mt-1">
                        เรื่อง {previewTemplate.fields.title}
                      </p>
                    </div>

                    <div className="space-y-3 leading-relaxed text-justify indent-8 pt-3">
                      <p>{previewTemplate.fields.p1}</p>
                      <p>{previewTemplate.fields.p2}</p>
                      <p>{previewTemplate.fields.p3}</p>
                    </div>

                    <div className="mt-12 text-center space-y-1">
                      <p>ประกาศ ณ วันที่ {previewTemplate.fields.docDate}</p>
                      <div className="h-8" />
                      <p className="font-bold">({previewTemplate.fields.signerName})</p>
                      <p className="text-slate-700">{previewTemplate.fields.signerPosition}</p>
                    </div>
                  </div>
                )}

                {/* Footer Security Stamp */}
                <div className="mt-16 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>SmartSarabun Standard Template • อบต.ดอยงาม</span>
                  </div>
                  <DocVerificationSeal
                    docId={`tpl-${previewTemplate.code}`}
                    docNo={previewTemplate.fields.docNoRunning || "001"}
                  />
                </div>
              </div>
            </div>

            {/* Modal Bottom Footer Actions */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500 font-medium">
                คลิกปุ่ม &quot;นำไปใช้ร่าง&quot; เพื่อเปิดหน้าสร้างเอกสารและแก้ไขข้อความ
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPreviewTemplate(null)}
                  className="rounded-xl text-xs font-bold h-10 px-4"
                >
                  ปิดหน้าต่าง
                </Button>

                <Button
                  onClick={() => handleUseTemplate(previewTemplate)}
                  className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl h-10 px-5 gap-2 shadow-xs cursor-pointer"
                >
                  <span>นำไปใช้ร่างใน Studio</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
