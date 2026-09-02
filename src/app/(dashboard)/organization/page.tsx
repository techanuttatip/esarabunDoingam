"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building,
  Building2,
  Plus,
  Edit3,
  Users,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  FolderTree,
  ChevronRight,
  Shield,
  Layers,
  Sparkles,
  GitBranch,
  X,
  Power,
  Trash2,
  RotateCcw,
  Check,
  AlertTriangle,
} from "lucide-react";

export interface SectionItem {
  id: string;
  name: string;
  code: string;
  leaderName: string;
  staffCount: number;
}

export interface DepartmentItem {
  id: string;
  code: string;
  name: string;
  headName: string;
  headPosition: string;
  staffCount: number;
  phone: string;
  email: string;
  docPrefix: string;
  description: string;
  isActive: boolean; // สถานะ เปิด/ปิด กองงาน
  sections: SectionItem[];
}

const initialDepartments: DepartmentItem[] = [];

const ORG_STORAGE_KEY = "smartsarabun_custom_departments";

export default function OrganizationPage() {
  const [departments, setDepartments] = useState<DepartmentItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(ORG_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (err) {
        console.error("Failed to load departments:", err);
      }
    }
    return initialDepartments;
  });

  // Save departments to localStorage whenever changed
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(ORG_STORAGE_KEY, JSON.stringify(departments));
      } catch (err) {
        console.error("Failed to save departments:", err);
      }
    }
  }, [departments]);
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [showEditDeptModal, setShowEditDeptModal] = useState(false);
  const [editingDept, setEditingDept] = useState<DepartmentItem | null>(null);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [selectedDeptForSection, setSelectedDeptForSection] = useState<string>("dept-1");
  const [isSavedToast, setIsSavedToast] = useState(false);

  // New Department Form State
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptCode, setNewDeptCode] = useState("");
  const [newDeptPrefix, setNewDeptPrefix] = useState("");
  const [newDeptHead, setNewDeptHead] = useState("");
  const [newDeptHeadPos, setNewDeptHeadPos] = useState("");
  const [newDeptPhone, setNewDeptPhone] = useState("");
  const [newDeptEmail, setNewDeptEmail] = useState("");

  // New Section Form State
  const [newSectionName, setNewSectionName] = useState("");
  const [newSectionCode, setNewSectionCode] = useState("");
  const [newSectionLeader, setNewSectionLeader] = useState("");

  // Load from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("smartsarabun_custom_departments");
      if (saved) {
        try {
          setDepartments(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, []);

  const saveToStorage = (updated: DepartmentItem[]) => {
    setDepartments(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("smartsarabun_custom_departments", JSON.stringify(updated));
      setIsSavedToast(true);
      setTimeout(() => setIsSavedToast(false), 3000);
    }
  };

  // 1. เพิ่มกองงานใหม่
  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim() || !newDeptCode.trim()) return;

    const newDept: DepartmentItem = {
      id: `dept-${Date.now()}`,
      code: newDeptCode,
      name: newDeptName,
      headName: newDeptHead || "รักษาการหัวหน้าส่วน",
      headPosition: newDeptHeadPos || "ผู้อำนวยการกอง",
      staffCount: 1,
      phone: newDeptPhone || "053-958100",
      email: newDeptEmail || "sarabun@doigam.go.th",
      docPrefix: newDeptPrefix || `${newDeptCode}/ว`,
      description: "ส่วนราชการภายใน องค์การบริหารส่วนตำบลดอยงาม",
      isActive: true,
      sections: [],
    };

    saveToStorage([...departments, newDept]);
    setShowAddDeptModal(false);
    setNewDeptName("");
    setNewDeptCode("");
    setNewDeptPrefix("");
    setNewDeptHead("");
    setNewDeptHeadPos("");
    setNewDeptPhone("");
    setNewDeptEmail("");
  };

  // 2. สลับสถานะ เปิด/ปิด กองงาน (Toggle Active / Disable)
  const handleToggleDepartmentStatus = (deptId: string) => {
    const updated = departments.map((d) => {
      if (d.id === deptId) {
        return { ...d, isActive: !d.isActive };
      }
      return d;
    });
    saveToStorage(updated);
  };

  // 3. ลบกองงาน (Delete Department)
  const handleDeleteDepartment = (deptId: string, deptName: string) => {
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบส่วนราชการ "${deptName}" ออกจากระบบ?`)) {
      const updated = departments.filter((d) => d.id !== deptId);
      saveToStorage(updated);
    }
  };

  // 4. แก้ไขข้อมูลกองงาน
  const handleOpenEditDept = (dept: DepartmentItem) => {
    setEditingDept(dept);
    setShowEditDeptModal(true);
  };

  const handleSaveEditDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept) return;

    const updated = departments.map((d) => (d.id === editingDept.id ? editingDept : d));
    saveToStorage(updated);
    setShowEditDeptModal(false);
    setEditingDept(null);
  };

  // 5. คืนค่าเริ่มต้นกองงาน
  const handleResetDepartments = () => {
    if (confirm("ต้องการคืนค่าโครงสร้างสำนัก/กอง เป็นค่าเริ่มต้นของ อบต.ดอยงาม หรือไม่?")) {
      saveToStorage(initialDepartments);
    }
  };

  // 6. เพิ่มฝ่าย/งานย่อย
  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionName.trim()) return;

    const newSec: SectionItem = {
      id: `sec-${Date.now()}`,
      name: newSectionName,
      code: newSectionCode || `SEC-${Date.now().toString().slice(-3)}`,
      leaderName: newSectionLeader || "หัวหน้าฝ่าย",
      staffCount: 2,
    };

    const updated = departments.map((d) => {
      if (d.id === selectedDeptForSection) {
        return { ...d, sections: [...d.sections, newSec], staffCount: d.staffCount + 2 };
      }
      return d;
    });

    saveToStorage(updated);
    setShowAddSectionModal(false);
    setNewSectionName("");
    setNewSectionCode("");
    setNewSectionLeader("");
  };

  const activeDeptCount = departments.filter((d) => d.isActive).length;
  const disabledDeptCount = departments.length - activeDeptCount;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="โครงสร้างองค์กร สำนัก/กอง และฝ่าย/งาน (Organization Structure)"
          description="จัดการ เพิ่ม/แก้ไข/ปิดการใช้งาน สำนัก/กอง และฝ่ายงานภายใน องค์การบริหารส่วนตำบลดอยงาม"
        />

        <div className="flex items-center gap-2">
          {isSavedToast && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              บันทึกโครงสร้างเรียบร้อย!
            </span>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleResetDepartments}
            className="text-xs font-bold rounded-xl h-10 px-3.5 border-slate-300 gap-1.5 hover:bg-slate-100 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
            คืนค่าเริ่มต้น
          </Button>

          <Button
            onClick={() => setShowAddDeptModal(true)}
            className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs sm:text-sm rounded-xl h-10 px-4 gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            + เพิ่มสำนัก/กองใหม่
          </Button>
        </div>
      </div>

      {/* Organization Info Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-blue-950 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl font-black shrink-0">
            🏛️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black">องค์การบริหารส่วนตำบลดอยงาม</h2>
              <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                DOIGAM-SAO
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-blue-300" />
              ตำบลดอยงาม อำเภอพาน จังหวัดเชียงราย 57120 | โทร: 053-958100
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/10 min-w-[100px]">
            <span className="text-xl font-black block text-emerald-300">{activeDeptCount}</span>
            <span className="text-[10px] text-slate-300 font-medium">กองงานที่เปิดใช้</span>
          </div>
          {disabledDeptCount > 0 && (
            <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/10 min-w-[100px]">
              <span className="text-xl font-black block text-amber-300">{disabledDeptCount}</span>
              <span className="text-[10px] text-slate-300 font-medium">ปิดใช้งานชั่วคราว</span>
            </div>
          )}
          <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/10 min-w-[100px]">
            <span className="text-xl font-black block">
              {departments.filter((d) => d.isActive).reduce((acc, d) => acc + d.sections.length, 0)}
            </span>
            <span className="text-[10px] text-slate-300 font-medium">ฝ่าย / งาน</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 text-center border border-white/10 min-w-[100px]">
            <span className="text-xl font-black block">
              {departments.filter((d) => d.isActive).reduce((acc, d) => acc + d.staffCount, 0)}
            </span>
            <span className="text-[10px] text-slate-300 font-medium">บุคลากรทั้งหมด</span>
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      {departments.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-300 bg-white/80 backdrop-blur-xl rounded-3xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">ยังไม่มีกอง/สำนักในโครงสร้างองค์กร</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
            เริ่มต้นออกแบบโครงสร้างของหน่วยงานท่าน โดยการกดปุ่มด้านล่างเพื่อเพิ่มกองงานแรก เช่น สำนักปลัด, กองคลัง, กองช่าง ฯลฯ
          </p>
          <Button
            onClick={() => setShowAddDeptModal(true)}
            className="bg-gradient-to-r from-[#0052FF] to-[#0284c7] hover:from-blue-700 hover:to-sky-700 text-white font-bold rounded-xl h-11 px-6 shadow-md shadow-blue-500/25 gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ เพิ่มกอง/สำนักแรกของหน่วยงาน</span>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {departments.map((dept) => (
          <Card
            key={dept.id}
            className={`shadow-xs border overflow-hidden rounded-2xl flex flex-col justify-between transition-all ${
              dept.isActive
                ? "border-slate-200 bg-white"
                : "border-slate-300 bg-slate-100/70 opacity-75 grayscale-[30%]"
            }`}
          >
            <div>
              <CardHeader className={`p-5 border-b flex flex-row items-center justify-between ${
                dept.isActive ? "bg-slate-100/90 border-slate-200" : "bg-slate-200/80 border-slate-300"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    dept.isActive ? "bg-blue-100 text-blue-900" : "bg-slate-300 text-slate-600"
                  }`}>
                    <Building2 className={`w-5 h-5 ${dept.isActive ? "text-blue-700" : "text-slate-600"}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-sm sm:text-base font-extrabold text-slate-900">
                        {dept.name}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-xs text-blue-800 font-mono font-bold mt-0.5">
                      รหัสหนังสือ: {dept.docPrefix}
                    </CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Status Badge */}
                  {dept.isActive ? (
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      เปิดใช้งาน
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-slate-200 text-slate-600 border border-slate-300 px-2 py-0.5 rounded-full">
                      ปิดใช้งานชั่วคราว
                    </span>
                  )}

                  {/* Edit Button */}
                  <button
                    onClick={() => handleOpenEditDept(dept)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                    title="แก้ไขข้อมูลกองงาน"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Toggle Disable/Enable Button */}
                  <button
                    onClick={() => handleToggleDepartmentStatus(dept.id)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      dept.isActive
                        ? "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                        : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                    }`}
                    title={dept.isActive ? "คลิกเพื่อปิดการใช้งานกองงานนี้" : "คลิกเพื่อเปิดใช้งานกองงานนี้"}
                  >
                    <Power className="w-4 h-4" />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteDepartment(dept.id, dept.name)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="ลบกองงานนี้"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 block font-medium">หัวหน้าส่วนราชการ :</span>
                    <span className="font-extrabold text-slate-900 text-xs sm:text-sm">{dept.headName}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    {dept.headPosition}
                  </span>
                </div>

                {/* Sections List */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <GitBranch className="w-3.5 h-3.5 text-blue-700" />
                      ฝ่าย / งาน ภายใต้สังกัด ({dept.sections.length} งาน) :
                    </span>
                    {dept.isActive && (
                      <button
                        onClick={() => {
                          setSelectedDeptForSection(dept.id);
                          setShowAddSectionModal(true);
                        }}
                        className="text-[11px] text-blue-700 font-bold hover:underline cursor-pointer"
                      >
                        + เพิ่มฝ่าย/งาน
                      </button>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    {dept.sections.map((sec) => (
                      <div
                        key={sec.id}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${dept.isActive ? "bg-blue-600" : "bg-slate-400"}`} />
                          <span className="font-bold text-slate-900">{sec.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-500 font-medium">({sec.leaderName})</span>
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                            {sec.staffCount} คน
                          </span>
                        </div>
                      </div>
                    ))}
                    {dept.sections.length === 0 && (
                      <div className="text-center py-3 text-[11px] text-slate-400 border border-dashed border-slate-200 rounded-xl">
                        ยังไม่มีการเพิ่มฝ่าย/งานย่อย
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                {dept.phone}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {dept.email}
              </span>
            </div>
          </Card>
        ))}
      </div>
      )}

      {/* 1. Modal: เพิ่มสำนัก/กองใหม่ (Add Department) */}
      {showAddDeptModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="bg-navy-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Building className="w-5 h-5 text-amber-300" />
                <div>
                  <h3 className="font-extrabold text-base">เพิ่มสำนัก/กองใหม่ (Add Department)</h3>
                  <p className="text-xs text-slate-300">สร้างส่วนราชการใหม่ใน อบต.ดอยงาม</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddDeptModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDepartment} className="p-6 space-y-4">
              <div>
                <label className="font-bold text-slate-700 text-xs block mb-1">ชื่อสำนัก/กอง * :</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น กองยุทธศาสตร์และงบประมาณ หรือ กองสวัสดิการสังคม"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 text-xs block mb-1">รหัสพยัญชนะ (Code) * :</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น ชร 52007"
                    value={newDeptCode}
                    onChange={(e) => setNewDeptCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 text-xs block mb-1">รหัสหนังสือส่ง (Prefix) :</label>
                  <input
                    type="text"
                    placeholder="เช่น ชร 52007/ว"
                    value={newDeptPrefix}
                    onChange={(e) => setNewDeptPrefix(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 text-xs block mb-1">ชื่อหัวหน้าส่วนราชการ :</label>
                  <input
                    type="text"
                    placeholder="เช่น นายวิจัย พัฒนาชาติ"
                    value={newDeptHead}
                    onChange={(e) => setNewDeptHead(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 text-xs block mb-1">ตำแหน่ง :</label>
                  <input
                    type="text"
                    placeholder="เช่น ผู้อำนวยการกองสวัสดิการสังคม"
                    value={newDeptHeadPos}
                    onChange={(e) => setNewDeptHeadPos(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 text-xs block mb-1">เบอร์โทรศัพท์ภายใน :</label>
                  <input
                    type="text"
                    placeholder="เช่น 053-958100 ต่อ 24"
                    value={newDeptPhone}
                    onChange={(e) => setNewDeptPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 text-xs block mb-1">อีเมลทางการ :</label>
                  <input
                    type="email"
                    placeholder="เช่น welfare@doigam.go.th"
                    value={newDeptEmail}
                    onChange={(e) => setNewDeptEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddDeptModal(false)}
                  className="text-xs font-bold rounded-xl h-10 px-4 border-slate-300"
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl h-10 px-5 shadow-xs cursor-pointer"
                >
                  บันทึกสำนัก/กอง
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: แก้ไขสำนัก/กอง (Edit Department) */}
      {showEditDeptModal && editingDept && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="bg-navy-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Edit3 className="w-5 h-5 text-amber-300" />
                <div>
                  <h3 className="font-extrabold text-base">แก้ไขข้อมูลสำนัก/กอง (Edit Department)</h3>
                  <p className="text-xs text-slate-300">{editingDept.name}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowEditDeptModal(false);
                  setEditingDept(null);
                }}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditDept} className="p-6 space-y-4">
              <div>
                <label className="font-bold text-slate-700 text-xs block mb-1">ชื่อสำนัก/กอง * :</label>
                <input
                  type="text"
                  required
                  value={editingDept.name}
                  onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 text-xs block mb-1">รหัสพยัญชนะ (Code) * :</label>
                  <input
                    type="text"
                    required
                    value={editingDept.code}
                    onChange={(e) => setEditingDept({ ...editingDept, code: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 text-xs block mb-1">รหัสหนังสือส่ง (Prefix) :</label>
                  <input
                    type="text"
                    value={editingDept.docPrefix}
                    onChange={(e) => setEditingDept({ ...editingDept, docPrefix: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 text-xs block mb-1">ชื่อหัวหน้าส่วนราชการ :</label>
                  <input
                    type="text"
                    value={editingDept.headName}
                    onChange={(e) => setEditingDept({ ...editingDept, headName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 text-xs block mb-1">ตำแหน่ง :</label>
                  <input
                    type="text"
                    value={editingDept.headPosition}
                    onChange={(e) => setEditingDept({ ...editingDept, headPosition: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 text-xs block mb-1">เบอร์โทรศัพท์ภายใน :</label>
                  <input
                    type="text"
                    value={editingDept.phone}
                    onChange={(e) => setEditingDept({ ...editingDept, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 text-xs block mb-1">อีเมลทางการ :</label>
                  <input
                    type="email"
                    value={editingDept.email}
                    onChange={(e) => setEditingDept({ ...editingDept, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditDeptModal(false);
                    setEditingDept(null);
                  }}
                  className="text-xs font-bold rounded-xl h-10 px-4 border-slate-300"
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl h-10 px-5 shadow-xs cursor-pointer"
                >
                  บันทึกการแก้ไข
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal: เพิ่มฝ่าย/งานใหม่ (Add Section) */}
      {showAddSectionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="bg-navy-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <GitBranch className="w-5 h-5 text-amber-300" />
                <h3 className="font-extrabold text-base">เพิ่มฝ่าย/งานใหม่ (Add Section)</h3>
              </div>
              <button
                onClick={() => setShowAddSectionModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSection} className="p-6 space-y-4">
              <div>
                <label className="font-bold text-slate-700 text-xs block mb-1">สังกัดสำนัก/กอง :</label>
                <select
                  value={selectedDeptForSection}
                  onChange={(e) => setSelectedDeptForSection(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold bg-white"
                >
                  {departments.filter((d) => d.isActive).map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 text-xs block mb-1">ชื่อฝ่าย / งาน * :</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น งานวิศวกรรมจราจร"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 text-xs block mb-1">หัวหน้าฝ่าย / ผู้รับผิดชอบ :</label>
                <input
                  type="text"
                  placeholder="เช่น นายช่าง ทางดี"
                  value={newSectionLeader}
                  onChange={(e) => setNewSectionLeader(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddSectionModal(false)}
                  className="text-xs font-bold rounded-xl h-10 px-4 border-slate-300"
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl h-10 px-5 shadow-xs cursor-pointer"
                >
                  บันทึกฝ่าย/งาน
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
