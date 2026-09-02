"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import {
  Folder,
  FolderOpen,
  Search,
  SlidersHorizontal,
  FileText,
  Eye,
  Download,
  Calendar,
  Building,
  ChevronRight,
  FolderPlus,
  PlusCircle,
  CheckCircle2,
  Filter,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentViewerWorkspace, DocumentData } from "@/components/documents/document-viewer-workspace";

interface CabinetFolder {
  id: string;
  name: string;
  department: string;
  year: string;
  count: number;
}

const initialFoldersList: CabinetFolder[] = [
  { id: "f-1", name: "งานสารบรรณกลาง 2569", department: "สำนักปลัด", year: "2569", count: 42 },
  { id: "f-2", name: "งานสารบรรณกลาง 2568", department: "สำนักปลัด", year: "2568", count: 128 },
  { id: "f-3", name: "งานบริหารทั่วไป 2569", department: "สำนักปลัด", year: "2569", count: 18 },
  { id: "f-4", name: "งานกองคลัง 2569", department: "กองคลัง", year: "2569", count: 35 },
  { id: "f-5", name: "งานกองคลัง 2568", department: "กองคลัง", year: "2568", count: 94 },
  { id: "f-6", name: "งานพัสดุและทรัพย์สิน 2569", department: "กองคลัง", year: "2569", count: 26 },
  { id: "f-7", name: "หนังสือรับกองช่าง 2569", department: "กองช่าง", year: "2569", count: 31 },
  { id: "f-8", name: "หนังสือรับกองช่าง 2568", department: "กองช่าง", year: "2568", count: 87 },
  { id: "f-9", name: "งานกองการศึกษา 2569", department: "กองการศึกษา", year: "2569", count: 15 },
  { id: "f-10", name: "งานกองการศึกษา 2568", department: "กองการศึกษา", year: "2568", count: 52 },
  { id: "f-11", name: "งานสาธารณสุข 2569", department: "กองสาธารณสุข", year: "2569", count: 20 },
  { id: "f-12", name: "ข้อบัญญัติ / หนังสือรับหน่วยตรวจสอบภายใน 2569", department: "หน่วยตรวจสอบภายใน", year: "2569", count: 8 },
];

const mockDocuments: (DocumentData & { archivedDate: string; folderId: string; status: string })[] = [
  {
    id: "doc-1",
    archivedDate: "28/08/2569",
    regNo: "0012/2569",
    docNo: "ชร 52001/ว 0142",
    docDate: "26/08/2569",
    title: "ขออนุมัติจัดซื้อวัสดุอุปกรณ์สำนักงานเพื่อใช้ในการปฏิบัติงาน ประจำปีงบประมาณ 2569",
    from: "สำนักปลัด",
    to: "ปลัดองค์การบริหารส่วนตำบลดอยงาม",
    targetDept: "สำนักปลัด",
    folderId: "f-1",
    status: "จัดเก็บเสร็จสมบูรณ์",
    docType: "หนังสือภายใน",
    speed: "ปกติ",
    secret: "ปกติ",
    contentParagraphs: [
      "ขออนุมัติจัดซื้อวัสดุอุปกรณ์สำนักงานเพื่อใช้ในการปฏิบัติงานประจำปีงบประมาณ 2569",
    ],
    endorsements: [],
  },
  {
    id: "doc-2",
    archivedDate: "25/08/2569",
    regNo: "0011/2569",
    docNo: "ชร 52001/358",
    docDate: "24/08/2569",
    title: "รายงานการประชุมสภาองค์การบริหารส่วนตำบลดอยงาม สมัยสามัญ สมัยที่ 2 ประจำปี 2569",
    from: "สำนักปลัด",
    to: "นายกองค์การบริหารส่วนตำบลดอยงาม",
    targetDept: "สำนักปลัด",
    folderId: "f-1",
    status: "จัดเก็บเสร็จสมบูรณ์",
    docType: "หนังสือภายใน",
    speed: "ปกติ",
    secret: "ปกติ",
    contentParagraphs: [
      "รายงานการประชุมสภาองค์การบริหารส่วนตำบลดอยงาม สมัยสามัญ สมัยที่ 2 ประจำปี 2569",
    ],
    endorsements: [],
  },
  {
    id: "doc-3",
    archivedDate: "22/08/2569",
    regNo: "0010/2569",
    docNo: "ชร 52002/109",
    docDate: "20/08/2569",
    title: "รายงานสถานะการเงินและการใช้จ่ายงบประมาณรายไตรมาสที่ 3 ประจำปีงบประมาณ 2569",
    from: "กองคลัง อบต.ดอยงาม",
    to: "นายกองค์การบริหารส่วนตำบลดอยงาม",
    targetDept: "กองคลัง",
    folderId: "f-4",
    status: "จัดเก็บเสร็จสมบูรณ์",
    docType: "หนังสือภายใน",
    speed: "ด่วน",
    secret: "ปกติ",
    contentParagraphs: [
      "รายงานสถานะการเงินและการใช้จ่ายงบประมาณรายไตรมาสที่ 3",
    ],
    endorsements: [],
  },
  {
    id: "doc-4",
    archivedDate: "19/08/2569",
    regNo: "0009/2569",
    docNo: "ชร 52003/241",
    docDate: "18/08/2569",
    title: "โครงการปรับปรุงและซ่อมแซมถนนลาดยางสายบ้านดอยงาม หมู่ที่ 4 ตำบลดอยงาม",
    from: "กองช่าง",
    to: "ปลัดองค์การบริหารส่วนตำบลดอยงาม",
    targetDept: "กองช่าง",
    folderId: "f-7",
    status: "จัดเก็บเสร็จสมบูรณ์",
    docType: "หนังสือภายใน",
    speed: "ด่วนที่สุด",
    secret: "ปกติ",
    contentParagraphs: [
      "โครงการปรับปรุงและซ่อมแซมถนนลาดยางสายบ้านดอยงาม หมู่ที่ 4",
    ],
    endorsements: [],
  },
];

export default function CabinetPage() {
  const [folders, setFolders] = useState<CabinetFolder[]>(initialFoldersList);
  const [selectedFolderId, setSelectedFolderId] = useState<string>("f-1");
  const [folderSearch, setFolderSearch] = useState("");
  const [docSearch, setDocSearch] = useState("");
  const [selectedDocForViewer, setSelectedDocForViewer] = useState<DocumentData | null>(null);

  // New Folder Modal
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderDept, setNewFolderDept] = useState("กองช่าง");
  const [newFolderYear, setNewFolderYear] = useState("2569");
  const [folderSuccessMsg, setFolderSuccessMsg] = useState<string | null>(null);

  // Advanced Filter Modal
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const filteredFolders = folders.filter((f) =>
    f.name.toLowerCase().includes(folderSearch.toLowerCase()) ||
    f.department.toLowerCase().includes(folderSearch.toLowerCase())
  );

  const selectedFolder = folders.find((f) => f.id === selectedFolderId) || folders[0];

  const currentDocs = mockDocuments.filter((d) => {
    if (d.folderId !== selectedFolderId && selectedFolderId !== "all") {
      // allow filtering
    }
    const matchesSearch =
      d.title.toLowerCase().includes(docSearch.toLowerCase()) ||
      d.docNo.toLowerCase().includes(docSearch.toLowerCase()) ||
      (d.regNo && d.regNo.toLowerCase().includes(docSearch.toLowerCase()));
    return matchesSearch;
  });

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const newFolder: CabinetFolder = {
      id: `f-${Date.now()}`,
      name: newFolderName,
      department: newFolderDept,
      year: newFolderYear,
      count: 0,
    };

    setFolders([newFolder, ...folders]);
    setSelectedFolderId(newFolder.id);
    setNewFolderName("");
    setShowNewFolderModal(false);
    setFolderSuccessMsg(`สร้างแฟ้ม "${newFolder.name}" เรียบร้อยแล้ว`);
    setTimeout(() => setFolderSuccessMsg(null), 3000);
  };

  const handleDownloadPdf = (doc: DocumentData) => {
    const dummyContent = `%PDF-1.4\n% Archival Document: ${doc.docNo}\nTitle: ${doc.title}`;
    const blob = new Blob([dummyContent], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.docNo.replace(/[\/\s]/g, "_")}_เอกสารจัดเก็บ.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-4 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <PageHeader
          title="แฟ้มในตู้ (Archival Cabinet)"
          description="ระบบจัดเก็บและค้นคืนเอกสารสารบรรณแยกตามส่วนราชการ กอง สำนัก และปีงบประมาณ"
        />
        <Button
          onClick={() => setShowNewFolderModal(true)}
          className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs sm:text-sm rounded-xl h-10 px-4 gap-1.5 shadow-xs cursor-pointer"
        >
          <FolderPlus className="w-4 h-4" />
          + สร้างแฟ้มใหม่
        </Button>
      </div>

      {folderSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{folderSuccessMsg}</span>
        </div>
      )}

      {/* Main 2-Column Split */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[640px]">
        {/* LEFT COLUMN: Department Folder Tree */}
        <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
          {/* Folder Search Box */}
          <div className="p-3 border-b border-slate-200 bg-white">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาแฟ้มตู้..."
                value={folderSearch}
                onChange={(e) => setFolderSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-600"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Folder List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredFolders.map((folder) => {
              const isSelected = folder.id === selectedFolderId;
              return (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolderId(folder.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-all text-left border cursor-pointer ${
                    isSelected
                      ? "bg-navy-900 border-navy-950 text-white font-bold shadow-xs"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    {isSelected ? (
                      <FolderOpen className="w-4 h-4 text-amber-300 shrink-0" />
                    ) : (
                      <Folder className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <div className="truncate">
                      <p className="truncate font-semibold">{folder.name}</p>
                      <p className={`text-[10px] font-normal ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                        {folder.department} • ปี {folder.year}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${isSelected ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-700"}`}>
                    {folder.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Folder Footer Info */}
          <div className="p-3 border-t border-slate-200 bg-slate-100/60 text-[11px] text-slate-500 flex items-center justify-between">
            <span>ทั้งหมด {folders.length} แฟ้มตู้</span>
            <span className="text-navy-900 font-bold">อบต.ดอยงาม</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Document Table in Selected Folder */}
        <div className="flex-1 flex flex-col bg-white overflow-x-auto">
          {/* Top Search Toolbar */}
          <div className="p-3.5 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-xl">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="ค้นหาชื่อเรื่อง, เลขที่หนังสือ, เลขรับ..."
                  value={docSearch}
                  onChange={(e) => setDocSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-navy-600"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
              <Button
                size="sm"
                onClick={() => setShowAdvancedSearch(true)}
                className="bg-navy-900 hover:bg-navy-800 text-white px-3.5 text-xs font-bold h-9 rounded-xl gap-1 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                ค้นหาขั้นสูง
              </Button>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 bg-white px-3.5 py-2 rounded-xl border border-slate-200">
              <FolderOpen className="w-4 h-4 text-blue-700" />
              <span>{selectedFolder.name}</span>
            </div>
          </div>

          {/* Table Area */}
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/80 text-slate-800 font-bold border-b border-slate-200">
                  <th className="p-3 whitespace-nowrap">วันที่จัดเก็บ</th>
                  <th className="p-3 whitespace-nowrap">เลขรับ</th>
                  <th className="p-3 whitespace-nowrap">เลขที่หนังสือ</th>
                  <th className="p-3 whitespace-nowrap">ลงวันที่</th>
                  <th className="p-3 min-w-[260px]">ชื่อหนังสือ</th>
                  <th className="p-3 whitespace-nowrap">เรียน</th>
                  <th className="p-3 text-center whitespace-nowrap">เปิดดู / โหลด</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentDocs.length > 0 ? (
                  currentDocs.map((doc, idx) => (
                    <tr
                      key={doc.id}
                      className={`hover:bg-blue-50/50 transition-colors ${
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                      }`}
                    >
                      <td className="p-3 text-slate-600 whitespace-nowrap">
                        {doc.archivedDate}
                      </td>
                      <td className="p-3 font-bold text-navy-900 whitespace-nowrap">
                        {doc.regNo}
                      </td>
                      <td className="p-3 text-slate-800 font-semibold whitespace-nowrap">
                        {doc.docNo}
                      </td>
                      <td className="p-3 text-slate-600 whitespace-nowrap">
                        {doc.docDate}
                      </td>
                      <td className="p-3 font-semibold text-slate-900">
                        {doc.title}
                      </td>
                      <td className="p-3 text-slate-600 whitespace-nowrap">
                        {doc.to}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            size="sm"
                            onClick={() => setSelectedDocForViewer(doc)}
                            className="h-7 px-2.5 bg-navy-900 hover:bg-navy-800 text-white font-bold text-[11px] rounded-lg gap-1 cursor-pointer"
                            title="ดูรายละเอียดเอกสาร"
                          >
                            <Eye className="w-3 h-3" />
                            เปิดดู
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadPdf(doc)}
                            className="h-7 px-2 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border-emerald-300 font-bold text-[11px] rounded-lg gap-1 cursor-pointer"
                            title="ดาวน์โหลดไฟล์แนบ"
                          >
                            <Download className="w-3 h-3 text-emerald-700" />
                            PDF
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-20 text-center text-slate-400 font-medium">
                      ไม่พบเอกสารในแฟ้มนี้
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: สร้างแฟ้มตู้เอกสารใหม่                              */}
      {/* ========================================================= */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-blue-700" />
                <h2 className="text-base font-extrabold text-slate-900">สร้างแฟ้มตู้เอกสารใหม่</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowNewFolderModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  ชื่อแฟ้มตู้เอกสาร : <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น หนังสือรับกองช่าง 2569 (สัญญาจ้าง)"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-navy-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">ส่วนราชการ / กอง :</label>
                <select
                  value={newFolderDept}
                  onChange={(e) => setNewFolderDept(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                >
                  <option value="สำนักปลัด">สำนักปลัด</option>
                  <option value="กองคลัง">กองคลัง</option>
                  <option value="กองช่าง">กองช่าง</option>
                  <option value="กองการศึกษา">กองการศึกษา</option>
                  <option value="กองสาธารณสุข">กองสาธารณสุข</option>
                  <option value="หน่วยตรวจสอบภายใน">หน่วยตรวจสอบภายใน</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">ปีงบประมาณ :</label>
                <select
                  value={newFolderYear}
                  onChange={(e) => setNewFolderYear(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                >
                  <option value="2569">2569</option>
                  <option value="2568">2568</option>
                  <option value="2567">2567</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewFolderModal(false)}
                  className="text-xs rounded-xl"
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl px-5 h-9"
                >
                  ยืนยันสร้างแฟ้ม
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ค้นหาขั้นสูง                                        */}
      {/* ========================================================= */}
      {showAdvancedSearch && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-blue-700" />
                <h2 className="text-base font-extrabold text-slate-900">ค้นหาเอกสารขั้นสูง (Advanced Search)</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAdvancedSearch(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">คำสำคัญในชื่อเรื่อง หรือเนื้อหา :</label>
                <input
                  type="text"
                  placeholder="เช่น อุทกภัย, จัดซื้อจัดจ้าง, โครงการ..."
                  value={docSearch}
                  onChange={(e) => setDocSearch(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">ตั้งแต่วันที่ :</label>
                  <input type="date" className="w-full px-3 py-2 rounded-xl border border-slate-300" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">ถึงวันที่ :</label>
                  <input type="date" className="w-full px-3 py-2 rounded-xl border border-slate-300" />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">ชั้นความเร็ว :</label>
                <select className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white">
                  <option value="">ทั้งหมด</option>
                  <option value="ด่วนที่สุด">ด่วนที่สุด</option>
                  <option value="ด่วน">ด่วน</option>
                  <option value="ปกติ">ปกติ</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAdvancedSearch(false)}
                  className="text-xs rounded-xl"
                >
                  ปิด
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowAdvancedSearch(false)}
                  className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl px-5 h-9"
                >
                  ค้นหาทันที
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Workspace Integration */}
      {selectedDocForViewer && (
        <DocumentViewerWorkspace
          document={selectedDocForViewer}
          onClose={() => setSelectedDocForViewer(null)}
        />
      )}
    </div>
  );
}
