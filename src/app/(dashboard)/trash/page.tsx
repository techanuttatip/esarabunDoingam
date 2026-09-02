"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, RotateCcw, AlertTriangle, Search, CheckCircle2 } from "lucide-react";

interface DeletedDoc {
  id: string;
  docNo: string;
  title: string;
  deletedBy: string;
  deletedDate: string;
  reason: string;
  dept: string;
}

const mockDeletedDocs: DeletedDoc[] = [
  {
    id: "DEL-001",
    docNo: "ชร 52001/ว 0120 (ยกเลิกเลข)",
    title: "ขอเชิญประชุมคณะกรรมการพัฒนาท้องถิ่น (พิมพ์ชื่อเรื่องซ้ำซ้อน)",
    deletedBy: "นางสาวนภา วงศ์ใหญ่ (สารบรรณกลาง)",
    deletedDate: "27 ส.ค. 2569 16:30 น.",
    reason: "ร่างซ้ำซ้อนกับฉบับก่อนหน้า จึงทำการยกเลิกเลขสารบรรณ",
    dept: "สำนักปลัด",
  },
  {
    id: "DEL-002",
    docNo: "ช่าง-ร่าง-005",
    title: "แบบประมาณราคาค่าก่อสร้างรางระบายน้ำ (ฉบับร่างทดสอบ)",
    deletedBy: "นายวิศวกร ช่างมั่น (นายช่างโยธา)",
    deletedDate: "25 ส.ค. 2569 11:00 น.",
    reason: "ร่างทดสอบการใช้งานระบบ",
    dept: "กองช่าง",
  },
];

export default function TrashPage() {
  const [trashList, setTrashList] = useState<DeletedDoc[]>(mockDeletedDocs);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  const handleRestore = (id: string, docNo: string) => {
    setTrashList(trashList.filter((d) => d.id !== id));
    setNotification(`กู้คืนเอกสาร "${docNo}" กลับสู่ระบบเรียบร้อยแล้ว`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handlePermanentDelete = (id: string) => {
    setTrashList(trashList.filter((d) => d.id !== id));
    setNotification("ลบเอกสารออกจากระบบถาวรเรียบร้อยแล้ว");
    setTimeout(() => setNotification(null), 3500);
  };

  const filtered = trashList.filter(
    (d) =>
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.docNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="ถังขยะและประวัติการยกเลิกหนังสือ (Recycle Bin)"
        description="ตรวจสอบรายการหนังสือที่ถูกลบหรือยกเลิกเลขสารบรรณ พร้อมฟังก์ชันกู้คืนเอกสารกลับสู่ระบบ"
      />

      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      <Card className="shadow-sm border-slate-200 overflow-hidden">
        <CardHeader className="bg-slate-50/80 px-5 py-3.5 border-b border-slate-200 flex flex-row items-center justify-between">
          <div className="relative w-72">
            <input
              type="text"
              placeholder="ค้นหาในถังขยะ..."
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
                  <th className="p-3 whitespace-nowrap">เลขที่หนังสือ</th>
                  <th className="p-3 min-w-[240px]">เรื่อง</th>
                  <th className="p-3 whitespace-nowrap">หน่วยงาน</th>
                  <th className="p-3 whitespace-nowrap">ผู้ขอยกเลิก/ลบ</th>
                  <th className="p-3 whitespace-nowrap">วันที่ลบ</th>
                  <th className="p-3 min-w-[200px]">เหตุผลการยกเลิก/ลบ</th>
                  <th className="p-3 text-center whitespace-nowrap">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length > 0 ? (
                  filtered.map((doc, idx) => (
                    <tr
                      key={doc.id}
                      className={`hover:bg-red-50/30 transition-colors ${
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                      }`}
                    >
                      <td className="p-3 font-bold text-red-700 whitespace-nowrap">
                        {doc.docNo}
                      </td>
                      <td className="p-3 font-medium text-slate-800">
                        {doc.title}
                      </td>
                      <td className="p-3 text-slate-600 whitespace-nowrap">
                        {doc.dept}
                      </td>
                      <td className="p-3 text-slate-700 font-semibold whitespace-nowrap">
                        {doc.deletedBy}
                      </td>
                      <td className="p-3 text-slate-500 whitespace-nowrap">
                        {doc.deletedDate}
                      </td>
                      <td className="p-3 text-slate-600 italic">
                        &ldquo;{doc.reason}&rdquo;
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <Button
                            size="sm"
                            onClick={() => handleRestore(doc.id, doc.docNo)}
                            className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            กู้คืน
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handlePermanentDelete(doc.id)}
                            className="h-7 text-xs font-semibold gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            ลบถาวร
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-400 font-medium">
                      ไม่มีรายการเอกสารในถังขยะ
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
