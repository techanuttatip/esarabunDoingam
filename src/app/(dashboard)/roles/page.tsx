"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  ShieldPlus,
  ShieldCheck,
  Users,
  Check,
  CheckCircle2,
  Lock,
  Eye,
  Sliders,
  Sparkles,
  Layers,
  FileText,
  Hash,
  FileSpreadsheet,
  Settings,
  Building,
  Key,
  X,
} from "lucide-react";
import { PERMISSION_LABELS, PERMISSIONS, PermissionCode } from "@/config/permissions";

interface RoleItem {
  id: string;
  code: string;
  name: string;
  engName: string;
  description: string;
  userCount: number;
  isSystem: boolean;
  color: string;
  scope: "ALL" | "ORG" | "DEPT" | "OWN";
  permissions: string[];
}

const standardRoles: RoleItem[] = [
  {
    id: "role-sys-admin",
    code: "SYSTEM_ADMIN",
    name: "ผู้ดูแลระบบสูงสุด (System Admin)",
    engName: "Platform System Administrator",
    description: "มีสิทธิ์สูงสุดในการควบคุมทั้งแพลตฟอร์ม จัดการองค์กรผู้เช่า และตรวจสอบความมั่นคงปลอดภัย",
    userCount: 1,
    isSystem: true,
    color: "bg-red-600",
    scope: "ALL",
    permissions: Object.values(PERMISSIONS),
  },
  {
    id: "role-org-admin",
    code: "ORGANIZATION_ADMIN",
    name: "ผู้ดูแลระบบระดับองค์กร (Org Admin)",
    engName: "Organization Administrator",
    description: "บริหารจัดการผู้ใช้งานใน อบต. กำหนดสิทธิ์ โครงสร้างสำนัก/กอง และการตั้งค่าระบบองค์กร",
    userCount: 2,
    isSystem: true,
    color: "bg-indigo-600",
    scope: "ORG",
    permissions: [
      "documents.view", "documents.create", "documents.update", "documents.delete",
      "numbers.view", "numbers.reserve", "numbers.issue", "numbers.insert", "numbers.cancel", "numbers.release",
      "files.upload", "files.view", "files.download", "pdf.stamp",
      "reports.view", "reports.export",
      "users.manage", "roles.manage", "departments.manage", "sections.manage", "settings.manage", "audit.view"
    ],
  },
  {
    id: "role-executive",
    code: "EXECUTIVE",
    name: "ผู้บริหาร / นายก อบต. (Executive)",
    engName: "Mayor & Executive Board",
    description: "ลงนามอนุมัติคำสั่ง ประกาศ เกษียนสั่งการระดับสูงสุด และดูรายงานผลการดำเนินงาน",
    userCount: 3,
    isSystem: true,
    color: "bg-purple-600",
    scope: "ORG",
    permissions: [
      "documents.view", "documents.create", "documents.update",
      "numbers.view",
      "files.view", "files.download",
      "reports.view", "reports.export", "audit.view"
    ],
  },
  {
    id: "role-manager",
    code: "MANAGER",
    name: "ผู้อำนวยการกอง / หัวหน้าสำนัก (Manager)",
    engName: "Division Director / Secretary",
    description: "กำกับดูแลงานสารบรรณภายในกอง มอบหมายงานเจ้าหน้าที่ เกษียนเสนอผู้บังคับบัญชา",
    userCount: 6,
    isSystem: true,
    color: "bg-blue-600",
    scope: "DEPT",
    permissions: [
      "documents.view", "documents.create", "documents.update",
      "numbers.view",
      "files.view", "files.download",
      "reports.view", "reports.export", "departments.manage"
    ],
  },
  {
    id: "role-doc-officer",
    code: "DOCUMENT_OFFICER",
    name: "เจ้าหน้าที่งานสารบรรณ (Document Officer)",
    engName: "Sarabun & Registrar Officer",
    description: "ลงรับหนังสือเข้าภายนอก ออกเลขส่ง ประทับตรายาง จัดการสมุดจองเลข และแทรกเลขลูก",
    userCount: 4,
    isSystem: true,
    color: "bg-amber-600",
    scope: "ORG",
    permissions: [
      "documents.view", "documents.create", "documents.update",
      "numbers.view", "numbers.reserve", "numbers.issue", "numbers.insert", "numbers.cancel", "numbers.release",
      "files.upload", "files.view", "files.download", "pdf.stamp",
      "reports.view", "reports.export"
    ],
  },
  {
    id: "role-officer",
    code: "OFFICER",
    name: "เจ้าหน้าที่ผู้ปฏิบัติงาน (Officer)",
    engName: "General Staff & Civil Servant",
    description: "สร้างและร่างบันทึกข้อความภายใน เสนอเรื่องตามสายงาน และติดตามงานที่ได้รับมอบหมาย",
    userCount: 15,
    isSystem: true,
    color: "bg-emerald-600",
    scope: "OWN",
    permissions: [
      "documents.view", "documents.create",
      "files.upload", "files.view", "files.download"
    ],
  },
  {
    id: "role-viewer",
    code: "VIEWER",
    name: "ผู้ตรวจสอบ / ผู้รับชม (Viewer)",
    engName: "Read-Only Auditor & Inspector",
    description: "สิทธิ์เปิดอ่านเอกสารและดาวน์โหลดรายงานเพื่อการตรวจสอบ (ห้ามแก้ไข/ลบ)",
    userCount: 2,
    isSystem: true,
    color: "bg-slate-600",
    scope: "ORG",
    permissions: [
      "documents.view",
      "files.view", "files.download"
    ],
  },
];

const permissionCategories = [
  { id: "all", name: "สิทธิ์ทั้งหมด (All)" },
  { id: "documents", name: "เอกสารราชการ" },
  { id: "numbers", name: "เลขสารบรรณ" },
  { id: "files", name: "ไฟล์แนบ & ตรายาง" },
  { id: "reports", name: "รายงาน & สถิติ" },
  { id: "admin", name: "การบริหาร & องค์กร" },
];

export default function RolesManagementPage() {
  const [roles, setRoles] = useState<RoleItem[]>(standardRoles);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("role-doc-officer");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isSaved, setIsSaved] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Role Form State
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleCode, setNewRoleCode] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [newRoleScope, setNewRoleScope] = useState<"ALL" | "ORG" | "DEPT" | "OWN">("DEPT");

  const selectedRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  const handleTogglePermission = (permKey: string) => {
    if (selectedRole.code === "SYSTEM_ADMIN") return; // Super admin always has all
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id === selectedRole.id) {
          const exists = r.permissions.includes(permKey);
          const updatedPerms = exists
            ? r.permissions.filter((p) => p !== permKey)
            : [...r.permissions, permKey];
          return { ...r, permissions: updatedPerms };
        }
        return r;
      })
    );
  };

  const handleSaveMatrix = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim() || !newRoleCode.trim()) return;

    const newRole: RoleItem = {
      id: `role-custom-${Date.now()}`,
      code: newRoleCode.toUpperCase().replace(/\s+/g, "_"),
      name: newRoleName,
      engName: "Custom Role",
      description: newRoleDesc || "บทบาทกำหนดเองสำหรับ อบต.ดอยงาม",
      userCount: 0,
      isSystem: false,
      color: "bg-teal-600",
      scope: newRoleScope,
      permissions: ["documents.view", "files.view"],
    };

    setRoles([...roles, newRole]);
    setSelectedRoleId(newRole.id);
    setShowCreateModal(false);
    setNewRoleName("");
    setNewRoleCode("");
    setNewRoleDesc("");
  };

  const filteredPermissions = Object.entries(PERMISSION_LABELS).filter(([code, meta]) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "documents") return code.startsWith("documents.");
    if (activeCategory === "numbers") return code.startsWith("numbers.");
    if (activeCategory === "files") return code.startsWith("files.") || code.startsWith("pdf.");
    if (activeCategory === "reports") return code.startsWith("reports.");
    if (activeCategory === "admin") return code.startsWith("users.") || code.startsWith("roles.") || code.startsWith("departments.") || code.startsWith("sections.") || code.startsWith("settings.") || code.startsWith("audit.");
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="การบริหารบทบาทและแมทริกซ์สิทธิ์ (RBAC & Granular Permissions)"
          description="กำหนดสิทธิ์การเข้าถึงแบบละเอียด (Granular Dot Notation) และขอบเขตข้อมูล (Data Scope) สำหรับบุคลากร"
        />

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs sm:text-sm rounded-xl h-10 px-4 gap-2 shadow-xs cursor-pointer"
          >
            <ShieldPlus className="w-4 h-4 text-amber-300" />
            + สร้างบทบาทใหม่
          </Button>
        </div>
      </div>

      {/* Save Success Alert */}
      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-xs">บันทึกแมทริกซ์สิทธิ์ของบทบาทสำเร็จเรียบร้อยแล้ว</p>
              <p className="text-[11px] text-emerald-700">การเปลี่ยนแปลงมีผลบังคับใช้กับการเรียกใช้งาน API และ UI ทันที</p>
            </div>
          </div>
          <span className="text-xs font-bold bg-emerald-200/60 px-3 py-1 rounded-full">RBAC Updated</span>
        </div>
      )}

      {/* Layout Grid: Left Sidebar Roles List + Right Permission Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Cols: Roles List */}
        <div className="lg:col-span-4 space-y-3">
          <Card className="shadow-xs border-slate-200 overflow-hidden rounded-2xl">
            <CardHeader className="bg-slate-100/90 p-4 border-b border-slate-200">
              <CardTitle className="text-sm font-extrabold text-slate-900 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Shield className="w-4.5 h-4.5 text-blue-700" />
                  บทบาทในระบบ ({roles.length})
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-2 space-y-1.5">
              {roles.map((role) => {
                const isSelected = role.id === selectedRoleId;
                return (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRoleId(role.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/80 border-blue-300 shadow-xs"
                        : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${role.color}`} />
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">{role.name}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {role.scope}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{role.description}</p>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                      <span>รหัส: <strong className="font-mono text-blue-900">{role.code}</strong></span>
                      <span className="font-bold text-slate-700">{role.permissions.length} สิทธิ์</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right 8 Cols: Granular Permission Matrix */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="shadow-xs border-slate-200 overflow-hidden rounded-2xl">
            <CardHeader className="bg-slate-100/90 p-5 border-b border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${selectedRole.color}`} />
                    <CardTitle className="text-base font-extrabold text-slate-900">
                      แมทริกซ์สิทธิ์ของ: {selectedRole.name}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs text-slate-500 mt-1">
                    ขอบเขตข้อมูล (Data Scope): <strong>{selectedRole.scope}</strong> | สิทธิ์ที่เปิดใช้งาน: <strong>{selectedRole.permissions.length} / {Object.keys(PERMISSION_LABELS).length}</strong>
                  </CardDescription>
                </div>

                <Button
                  onClick={handleSaveMatrix}
                  className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl h-9 px-4 gap-1.5 shadow-xs cursor-pointer"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  บันทึกสิทธิ์บทบาทนี้
                </Button>
              </div>
            </CardHeader>

            {/* Category Filter Chips */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto">
              {permissionCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeCategory === cat.id
                      ? "bg-navy-900 text-white shadow-xs"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <CardContent className="p-0">
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[650px] text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200">
                      <th className="p-3.5 w-[35%]">ชื่อสิทธิ์การใช้งาน</th>
                      <th className="p-3.5 w-[25%]">รหัสสิทธิ์ (Dot Notation)</th>
                      <th className="p-3.5 w-[25%]">หมวดหมู่</th>
                      <th className="p-3.5 text-center w-[15%]">สถานะสิทธิ์</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredPermissions.map(([code, meta]) => {
                      const isGranted = selectedRole.permissions.includes(code);
                      const isSuper = selectedRole.code === "SYSTEM_ADMIN";

                      return (
                        <tr
                          key={code}
                          onClick={() => handleTogglePermission(code)}
                          className={`hover:bg-blue-50/50 transition-colors cursor-pointer ${
                            isGranted ? "bg-white" : "bg-slate-50/40 opacity-75"
                          }`}
                        >
                          <td className="p-3.5">
                            <p className="font-bold text-slate-900 text-xs sm:text-sm">{meta.name}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{meta.description}</p>
                          </td>

                          <td className="p-3.5">
                            <code className="font-mono text-[11px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                              {code}
                            </code>
                          </td>

                          <td className="p-3.5">
                            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                              {meta.category}
                            </span>
                          </td>

                          <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                            <button
                              disabled={isSuper}
                              onClick={() => handleTogglePermission(code)}
                              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors mx-auto cursor-pointer ${
                                isGranted ? "bg-emerald-600 justify-end" : "bg-slate-300 justify-start"
                              } ${isSuper ? "opacity-60 cursor-not-allowed" : ""}`}
                            >
                              <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Role Dialog Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="bg-navy-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldPlus className="w-5 h-5 text-amber-300" />
                <h3 className="font-extrabold text-base">สร้างบทบาทใหม่ (Create Custom Role)</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="p-6 space-y-4">
              <div>
                <label className="font-bold text-slate-700 text-xs block mb-1">ชื่อบทบาท (ภาษาไทย) * :</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ผู้ตรวจสอบงบประมาณประจำกอง"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 text-xs block mb-1">รหัสบทบาท (Code) * :</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น BUDGET_AUDITOR"
                  value={newRoleCode}
                  onChange={(e) => setNewRoleCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono uppercase"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 text-xs block mb-1">ขอบเขตข้อมูลเริ่มต้น (Data Scope) :</label>
                <select
                  value={newRoleScope}
                  onChange={(e) => setNewRoleScope(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold bg-white"
                >
                  <option value="DEPT">DEPT (เฉพาะกองที่สังกัด)</option>
                  <option value="OWN">OWN (เฉพาะเรื่องของตนเอง)</option>
                  <option value="ORG">ORG (ทั่วทั้ง อบต.)</option>
                  <option value="ALL">ALL (ทั้งระบบ)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 text-xs block mb-1">คำอธิบายหน้าที่ :</label>
                <textarea
                  rows={3}
                  placeholder="ระบุขอบเขตหน้าที่ความรับผิดชอบของบทบาทนี้..."
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="text-xs font-bold rounded-xl h-10 px-4 border-slate-300"
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl h-10 px-5 shadow-xs cursor-pointer"
                >
                  สร้างบทบาท
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
