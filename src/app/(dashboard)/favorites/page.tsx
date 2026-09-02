"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, FileText, Eye, Download, Search, Trash2 } from "lucide-react";
import { DocumentViewerWorkspace, DocumentData } from "@/components/documents/document-viewer-workspace";

const mockFavorites: DocumentData[] = [
  {
    id: "FAV-001",
    docNo: "ชร 52001/ว 0142",
    regNo: "0142/2569",
    regDate: "28 ส.ค. 2569",
    regTime: "09:30 น.",
    docDate: "26 ส.ค. 2569",
    from: "ที่ว่าการอำเภอพาน",
    to: "นายกองค์การบริหารส่วนตำบลดอยงาม",
    title: "โครงการตรวจสอบและเตรียมความพร้อมรับมืออุทกภัยและดินโคลนถล่ม ประจำปี 2569",
    docType: "หนังสือภายนอก",
    speed: "ด่วนที่สุด",
    secret: "ปกติ",
    contentParagraphs: [
      "ด้วยกองอำนวยการป้องกันและบรรเทาสาธารณภัยจังหวัดเชียงราย ได้แจ้งเตือนสถานการณ์สภาพอากาศแปรปรวน อาจเกิดฝนตกหนักถึงหนักมากในพื้นที่อำเภอพาน",
      "จึงขอให้อบต.ดอยงาม สั่งการเจ้าหน้าที่ผู้รับผิดชอบสำรวจตรวจสอบสิ่งกีดขวางทางน้ำ และเตรียมความพร้อมเครื่องจักรกล",
    ],
    endorsements: [],
  },
  {
    id: "FAV-002",
    docNo: "ชร 52002/109",
    regNo: "0010/2569",
    docDate: "20 ส.ค. 2569",
    from: "กองคลัง อบต.ดอยงาม",
    to: "นายกองค์การบริหารส่วนตำบลดอยงาม",
    title: "รายงานสถานะการเงินและการใช้จ่ายงบประมาณรายไตรมาสที่ 3 ประจำปีงบประมาณ 2569",
    docType: "หนังสือภายใน",
    speed: "ด่วน",
    secret: "ปกติ",
    contentParagraphs: [
      "กองคลังได้จัดทำรายงานสถานะการเงินและการใช้จ่ายงบประมาณ ประจำไตรมาสที่ 3 เสร็จเรียบร้อยแล้ว จึงเรียนมาเพื่อโปรดทราบ",
    ],
  },
];

export default function FavoritesPage() {
  const [favoritesList, setFavoritesList] = useState<DocumentData[]>(mockFavorites);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<DocumentData | null>(null);

  const handleRemoveFavorite = (id: string) => {
    setFavoritesList(favoritesList.filter((doc) => doc.id !== id));
  };

  const filtered = favoritesList.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.docNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="รายการที่ชื่นชอบ (Starred Documents)"
        description="รวบรวมหนังสือราชการและเอกสารสำคัญที่คุณติดดาวไว้ เพื่อการเข้าถึงอย่างรวดเร็ว"
      />

      <Card className="shadow-sm border-slate-200 overflow-hidden">
        <CardHeader className="bg-slate-50/80 px-5 py-3.5 border-b border-slate-200 flex flex-row items-center justify-between">
          <div className="relative w-72">
            <input
              type="text"
              placeholder="ค้นหาในรายการที่ชื่นชอบ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-navy-600"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
          <span className="text-xs text-slate-500 font-medium">
            ทั้งหมด {filtered.length} รายการ
          </span>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3 w-10 text-center">⭐</th>
                  <th className="p-3 whitespace-nowrap">เลขที่หนังสือ</th>
                  <th className="p-3 whitespace-nowrap">ลงวันที่</th>
                  <th className="p-3 min-w-[280px]">เรื่อง</th>
                  <th className="p-3 whitespace-nowrap">จากหน่วยงาน</th>
                  <th className="p-3 whitespace-nowrap">ประเภท</th>
                  <th className="p-3 text-center whitespace-nowrap">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length > 0 ? (
                  filtered.map((doc, idx) => (
                    <tr
                      key={doc.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                      }`}
                    >
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleRemoveFavorite(doc.id)}
                          className="text-amber-500 hover:text-slate-300 transition-colors cursor-pointer"
                          title="ยกเลิกรายการโปรด"
                        >
                          <Star className="w-4 h-4 fill-amber-400" />
                        </button>
                      </td>
                      <td className="p-3 font-bold text-navy-900 whitespace-nowrap">
                        {doc.docNo}
                      </td>
                      <td className="p-3 text-slate-600 whitespace-nowrap">
                        {doc.docDate}
                      </td>
                      <td className="p-3 font-semibold text-slate-900">
                        {doc.title}
                      </td>
                      <td className="p-3 text-slate-600 whitespace-nowrap">
                        {doc.from}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          {doc.docType}
                        </span>
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <Button
                            size="sm"
                            onClick={() => setSelectedDoc(doc)}
                            className="h-7 text-xs bg-navy-800 hover:bg-navy-900 text-white font-semibold gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            เปิดดูเอกสาร
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-400 font-medium">
                      ไม่มีรายการที่ชื่นชอบ
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedDoc && (
        <DocumentViewerWorkspace
          document={selectedDoc}
          onClose={() => setSelectedDoc(null)}
        />
      )}
    </div>
  );
}
