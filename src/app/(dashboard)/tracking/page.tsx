"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, CheckCircle2, Clock, ArrowRight, User, Calendar, FileText, Filter, BellRing, Eye, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentViewerWorkspace, DocumentData } from "@/components/documents/document-viewer-workspace";
import { getAllDocuments, StoredDocument } from "@/lib/document-store";

interface TrackingStep {
  name: string;
  actor: string;
  time: string;
  done: boolean;
  current?: boolean;
}

interface TrackingDoc extends DocumentData {
  sender: string;
  date: string;
  currentStep: string;
  status: "in_progress" | "completed";
  steps: TrackingStep[];
}

export default function TrackingPage() {
  const [allDocs, setAllDocs] = useState<StoredDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocId, setSelectedDocId] = useState<string>("");
  const [remindMsg, setRemindMsg] = useState<string | null>(null);
  const [selectedDocForViewer, setSelectedDocForViewer] = useState<DocumentData | null>(null);

  useEffect(() => {
    const loadDocs = () => {
      const stored = getAllDocuments();
      setAllDocs(stored);
      if (stored.length > 0 && !selectedDocId) {
        setSelectedDocId(stored[0].id);
      }
    };
    loadDocs();

    window.addEventListener("smartsarabun_documents_updated", loadDocs);
    return () => {
      window.removeEventListener("smartsarabun_documents_updated", loadDocs);
    };
  }, []);

  const trackingList: TrackingDoc[] = allDocs.map((doc) => {
    const steps: TrackingStep[] = [];
    if (doc.timeline && doc.timeline.length > 0) {
      doc.timeline.forEach((item) => {
        steps.push({
          name: item.action,
          actor: item.actor,
          time: item.time,
          done: true,
        });
      });
    } else {
      steps.push({
        name: doc.direction === "outgoing" ? "สร้างและออกเลขส่ง" : "ลงรับหนังสือเข้า",
        actor: doc.senderName || "งานสารบรรณ",
        time: doc.docDate,
        done: true,
      });
    }

    if (doc.endorsements && doc.endorsements.length > 0) {
      doc.endorsements.forEach((end) => {
        steps.push({
          name: `เกษียน: ${end.action || "บันทึกเกษียน"}`,
          actor: `${end.actor} (${end.position})`,
          time: end.date,
          done: true,
        });
      });
    }

    const isCompleted = doc.status === "completed" || doc.status === "sent";
    if (!isCompleted) {
      steps.push({
        name: `พิจารณาและลงนาม (${doc.targetDept || "สำนักปลัด"})`,
        actor: "รอการลงนาม/เกษียนสั่งการ",
        time: "รอดำเนินการ",
        done: false,
        current: true,
      });
    }

    return {
      ...doc,
      sender: doc.from || doc.senderName || "งานสารบรรณ",
      date: doc.docDate,
      currentStep: isCompleted
        ? "เสร็จสมบูรณ์ / จัดเก็บเข้าแฟ้มตู้"
        : steps.find((s) => s.current)?.name || "กำลังดำเนินการ",
      status: isCompleted ? "completed" : "in_progress",
      steps,
    };
  });

  const filteredList = trackingList.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.docNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.sender && doc.sender.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedDoc = (filteredList.find((d) => d.id === selectedDocId) || (filteredList.length > 0 ? filteredList[0] : null)) as TrackingDoc | null;

  const handleSendReminder = (actor: string) => {
    setRemindMsg(`ส่งข้อความแจ้งเตือนด่วนไปยัง "${actor}" ทางระบบเรียบร้อยแล้ว`);
    setTimeout(() => setRemindMsg(null), 3500);
  };

  return (
    <div className="space-y-5 pb-12">
      <PageHeader
        title="ติดตามหนังสือ (Document Tracking)"
        description="ตรวจสอบสถานะ เส้นทางการส่งต่อ และการพิจารณาลงนามในหนังสือราชการแบบ Real-time"
      />

      {remindMsg && (
        <div className="p-3.5 bg-blue-50 text-blue-950 border border-blue-300 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <BellRing className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{remindMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 5 Cols: Tracking List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="ค้นหาตามเลขที่ หรือชื่อเรื่อง..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-navy-700 shadow-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          <div className="space-y-2">
            {filteredList.length > 0 ? (
              filteredList.map((doc) => {
                const isSelected = doc.id === selectedDocId;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-navy-900 text-white border-navy-950 shadow-md"
                        : "bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:shadow-xs"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${
                          isSelected
                            ? "bg-blue-500/30 text-blue-200"
                            : "bg-slate-100 text-navy-800"
                        }`}
                      >
                        {doc.docNo}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                          doc.status === "completed"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {doc.status === "completed" ? "เสร็จสิ้น" : "กำลังดำเนินการ"}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold leading-snug line-clamp-2 mb-2">
                      {doc.title}
                    </h3>

                    <div
                      className={`flex items-center justify-between text-[11px] ${
                        isSelected ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      <span>{doc.sender}</span>
                      <span>{doc.date}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 space-y-2">
                <Clock className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-700">ยังไม่มีหนังสือที่อยู่ระหว่างติดตาม</p>
                <p className="text-[11px] text-slate-400">เมื่อมีการส่งหนังสือต่อ รายการติดตามจะปรากฏที่นี่</p>
              </div>
            )}
          </div>
        </div>

        {/* Right 7 Cols: Detailed Timeline Workflow */}
        <div className="lg:col-span-7">
          {selectedDoc ? (
            <Card className="shadow-xs border-slate-200 overflow-hidden rounded-2xl">
              <CardHeader className="bg-slate-50/90 border-b border-slate-200 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                      {selectedDoc.docNo}
                    </span>
                    <CardTitle className="text-sm font-extrabold text-slate-900 mt-2">
                      {selectedDoc.title}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => setSelectedDocForViewer(selectedDoc)}
                      className="bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold rounded-xl gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      เปิดดูฉบับเต็ม
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-4">
                <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 flex items-center justify-between text-xs text-navy-950 font-semibold">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-700 shrink-0" />
                    <span>สถานะปัจจุบัน: <strong>{selectedDoc.currentStep}</strong></span>
                  </div>
                  {selectedDoc.status === "in_progress" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSendReminder("ปลัด อบต.ดอยงาม")}
                      className="text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border-amber-300 rounded-lg h-7 gap-1"
                    >
                      <BellRing className="w-3 h-3 text-amber-600" />
                      เตือนผู้รับ
                    </Button>
                  )}
                </div>

                {/* Step Timeline */}
                <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {selectedDoc.steps.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-3">
                      <div
                        className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ring-4 ring-white ${
                          step.done
                            ? "bg-emerald-500"
                            : step.current
                            ? "bg-amber-500 animate-pulse"
                            : "bg-slate-300"
                        }`}
                      >
                        {step.done ? "✓" : idx + 1}
                      </div>

                      <div className="flex-1 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-800">{step.name}</p>
                          <span className="text-[10px] font-semibold text-slate-400">
                            {step.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{step.actor}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-xs border-slate-200 rounded-2xl p-12 text-center text-slate-400 bg-white space-y-2">
              <FileText className="w-10 h-10 mx-auto text-slate-300" />
              <h4 className="font-bold text-slate-700 text-sm">ยังไม่ได้เลือกหนังสือ</h4>
              <p className="text-xs text-slate-400">เลือกหนังสือจากรายการด้านซ้ายเพื่อดูเส้นทางการเกษียนและสถานะการพิจารณา</p>
            </Card>
          )}
        </div>
      </div>

      {/* Full-Screen Workspace Viewer */}
      {selectedDocForViewer && (
        <DocumentViewerWorkspace
          document={selectedDocForViewer}
          onClose={() => setSelectedDocForViewer(null)}
          onSaveDoc={() => setAllDocs(getAllDocuments())}
        />
      )}
    </div>
  );
}
