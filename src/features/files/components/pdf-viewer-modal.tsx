"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  History,
  Layers,
  Sparkles,
  Lock,
  Upload,
  Copy,
  Check,
  X,
  FileSpreadsheet,
  Image as ImageIcon,
} from "lucide-react";

export interface FileVersionItem {
  id: string;
  category: "original" | "versions" | "stamped";
  versionNumber: number;
  fileName: string;
  fileExtension: "pdf" | "docx" | "xlsx" | "jpg" | "png";
  fileSizeText: string;
  checksumSha256: string;
  isImmutable: boolean;
  uploadedByName: string;
  uploadedAt: string;
  pageCount?: number;
  previewUrl?: string;
}

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  docNo: string;
  versions?: FileVersionItem[];
}

const defaultMockVersions: FileVersionItem[] = [
  {
    id: "ver-01",
    category: "original",
    versionNumber: 1,
    fileName: "หนังสืออำเภอพาน_ตรวจความมั่นคงสะพาน_ต้นฉบับ.pdf",
    fileExtension: "pdf",
    fileSizeText: "1.85 MB",
    checksumSha256: "d6cc7abb4a3dd112e8b9101f2233445566778899aabbccddeeff001122334455",
    isImmutable: true,
    uploadedByName: "น.ส.นภา วงศ์ใหญ่ (สารบรรณกลาง)",
    uploadedAt: "28 ส.ค. 2569 14:30 น.",
    pageCount: 2,
  },
  {
    id: "ver-02",
    category: "versions",
    versionNumber: 2,
    fileName: "หนังสืออำเภอพาน_ตรวจความมั่นคงสะพาน_แนบแผนผัง.pdf",
    fileExtension: "pdf",
    fileSizeText: "2.40 MB",
    checksumSha256: "8e77a11234bcdee00112233445566778899aabbccddeeff00112233445566778",
    isImmutable: false,
    uploadedByName: "นายวิศวกร ช่างมั่น (กองช่าง)",
    uploadedAt: "28 ส.ค. 2569 15:10 น.",
    pageCount: 3,
  },
  {
    id: "ver-03",
    category: "stamped",
    versionNumber: 3,
    fileName: "หนังสืออำเภอพาน_ประทับตรายางรับ_2784_2569.pdf",
    fileExtension: "pdf",
    fileSizeText: "2.42 MB",
    checksumSha256: "f1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6",
    isImmutable: false,
    uploadedByName: "ระบบสารบรรณอัตโนมัติ (E-Stamp)",
    uploadedAt: "28 ส.ค. 2569 15:15 น.",
    pageCount: 3,
  },
];

export function PdfViewerModal({
  isOpen,
  onClose,
  documentTitle,
  docNo,
  versions = defaultMockVersions,
}: PdfViewerModalProps) {
  const [selectedVersion, setSelectedVersion] = useState<FileVersionItem>(versions[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [activeSideTab, setActiveSideTab] = useState<"preview" | "versions">("preview");
  const [copiedHash, setCopiedHash] = useState(false);

  if (!isOpen) return null;

  const totalPages = selectedVersion.pageCount || 2;

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-700 w-full max-w-6xl h-[92vh] overflow-hidden flex flex-col animate-in zoom-in-95">
        {/* Top Header Toolbar */}
        <div className="bg-navy-950 p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-blue-400 text-xs sm:text-sm">{docNo}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                  {selectedVersion.category.toUpperCase()} v{selectedVersion.versionNumber}
                </span>
                {selectedVersion.isImmutable && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> IMMUTABLE
                  </span>
                )}
              </div>
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-100 truncate max-w-md sm:max-w-xl mt-0.5">
                {documentTitle}
              </h3>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
              <button
                onClick={() => setActiveSideTab("preview")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeSideTab === "preview" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                หน้าเอกสาร
              </button>
              <button
                onClick={() => setActiveSideTab("versions")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeSideTab === "versions" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                ประวัติเวอร์ชัน ({versions.length})
              </button>
            </div>

            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl h-8 px-3 gap-1.5 cursor-pointer"
              onClick={() => alert(`เริ่มดาวน์โหลด: ${selectedVersion.fileName}`)}
            >
              <Download className="w-3.5 h-3.5" />
              ดาวน์โหลด PDF
            </Button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main PDF Canvas Preview */}
          <div className="flex-1 bg-slate-950 flex flex-col overflow-hidden">
            {/* PDF Viewport Controls Bar */}
            <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1 rounded-lg hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-bold font-mono">
                  หน้า {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1 rounded-lg hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Zoom & Rotate Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(50, z - 15))}
                  className="p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
                  title="ย่อขนาด"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="font-mono font-bold text-xs">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(200, z + 15))}
                  className="p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
                  title="ขยายขนาด"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                <div className="w-[1px] h-4 bg-slate-700 mx-1" />

                <button
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
                  title="หมุนหน้า 90 องศา"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Render Canvas */}
            <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-slate-950">
              <div
                style={{
                  transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                  transformOrigin: "center center",
                  transition: "transform 0.2s ease-out",
                }}
                className="w-[595px] h-[842px] bg-white text-slate-900 p-10 shadow-2xl rounded-lg border border-slate-300 relative flex flex-col justify-between"
              >
                {/* Official Kruth Watermark / Header */}
                <div>
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[11px] font-bold text-slate-500">{docNo}</span>
                    <div className="w-16 h-16 bg-amber-100 rounded-full border-2 border-amber-400 flex items-center justify-center text-amber-800 text-xs font-black mx-auto">
                      ตราครุฑ
                    </div>
                    <span className="font-mono text-[11px] font-bold text-slate-500">แผ่นที่ {currentPage}</span>
                  </div>

                  <div className="text-center mt-3">
                    <h2 className="text-lg font-black tracking-tight text-slate-900">บันทึกข้อความ</h2>
                    <p className="text-xs text-slate-600">องค์การบริหารส่วนตำบลดอยงาม อำเภอพาน จังหวัดเชียงราย</p>
                  </div>

                  <div className="mt-6 space-y-2 text-xs border-t border-b border-slate-200 py-3">
                    <div className="flex justify-between">
                      <span><strong>ส่วนราชการ:</strong> {selectedVersion.uploadedByName}</span>
                      <span><strong>วันที่:</strong> {selectedVersion.uploadedAt}</span>
                    </div>
                    <div>
                      <span><strong>เรื่อง:</strong> {documentTitle}</span>
                    </div>
                  </div>

                  <div className="mt-4 text-xs leading-relaxed text-slate-800 space-y-3">
                    <p>
                      ตามที่ได้รับมอบหมายให้ดำเนินการตรวจสอบความพร้อมโครงการตามข้อสั่งการ เพื่อให้การบริหารงานราชการของ
                      องค์การบริหารส่วนตำบลดอยงาม เป็นไปด้วยความเรียบร้อยตามระเบียบสารบรรณ พ.ศ. ๒๕๒๖ และที่แก้ไขเพิ่มเติม
                    </p>
                    <p>
                      จึงเรียนมาเพื่อโปรดทราบและพิจารณาดำเนินการต่อไป
                    </p>
                  </div>
                </div>

                {/* Stamped Box Simulation if category == stamped */}
                {selectedVersion.category === "stamped" && (
                  <div className="absolute top-6 right-6 border-2 border-dashed border-red-600 bg-red-50/90 text-red-800 p-2.5 rounded-lg text-center font-bold text-[10px] w-36 rotate-2 shadow-xs">
                    <p className="font-black">อบต.ดอยงาม</p>
                    <p>เลขรับ: 2784/2569</p>
                    <p>วันที่: 28 ส.ค. 2569</p>
                    <p>เวลา: 14:30 น.</p>
                  </div>
                )}

                {/* Footer Checksum Verification */}
                <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                  <span>SHA-256: {selectedVersion.checksumSha256.substring(0, 24)}...</span>
                  <span className="flex items-center gap-1 text-emerald-600 font-bold">
                    <ShieldCheck className="w-3 h-3" /> VERIFIED TAMPER-PROOF
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Document Version Timeline */}
          {activeSideTab === "versions" && (
            <div className="w-96 bg-slate-900 border-l border-slate-800 p-5 overflow-y-auto space-y-4 shrink-0 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-extrabold text-sm text-slate-200 flex items-center gap-2">
                  <History className="w-4 h-4 text-blue-400" />
                  ประวัติเวอร์ชันไฟล์ (Version Timeline)
                </span>
              </div>

              <div className="space-y-3">
                {versions.map((ver) => (
                  <Card
                    key={ver.id}
                    onClick={() => setSelectedVersion(ver)}
                    className={`cursor-pointer transition-all border rounded-2xl p-3.5 space-y-2 ${
                      selectedVersion.id === ver.id
                        ? "bg-blue-950/70 border-blue-500 shadow-xs"
                        : "bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">
                        {ver.category === "original"
                          ? "เอกสารต้นฉบับ (Original)"
                          : ver.category === "stamped"
                          ? "เอกสารประทับตรา (Stamped)"
                          : `เวอร์ชัน v${ver.versionNumber}`}
                      </span>
                      {ver.isImmutable ? (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          IMMUTABLE
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                          {ver.fileSizeText}
                        </span>
                      )}
                    </div>

                    <p className="font-mono text-[11px] text-slate-300 truncate">{ver.fileName}</p>

                    <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-[10px] space-y-1">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>SHA-256 Checksum:</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyHash(ver.checksumSha256);
                          }}
                          className="text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                        >
                          {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          คัดลอก
                        </button>
                      </div>
                      <p className="font-mono text-slate-400 truncate text-[9px]">{ver.checksumSha256}</p>
                    </div>

                    <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-700/50">
                      <span>{ver.uploadedByName}</span>
                      <span>{ver.uploadedAt}</span>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Upload New Version Button */}
              <Button
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl h-10 gap-2 border border-slate-700 cursor-pointer mt-4"
                onClick={() => alert("เปิดฟอร์มอัปโหลดเวอร์ชันใหม่ (Category: versions/)")}
              >
                <Upload className="w-4 h-4 text-blue-400" />
                + อัปโหลดไฟล์เวอร์ชันใหม่
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
