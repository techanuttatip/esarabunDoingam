"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  Users,
  Search,
  CheckCircle2,
  Building,
  Shield,
  Edit,
  Trash2,
  KeyRound,
  Lock,
  UserCheck,
  UserX,
  X,
  PlusCircle,
  FileSpreadsheet,
  Layers,
  Sparkles,
} from "lucide-react";
import { SYSTEM_ROLES, DataScope } from "@/config/permissions";

interface CivilServantUser {
  id: string;
  accountId: string;
  username: string;
  fullName: string;
  position: string;
  department: string;
  section: string;
  role: string;
  scope: DataScope;
  email: string;
  phone: string;
  status: "active" | "inactive";
  lastLogin: string;
}

const initialUsers: CivilServantUser[] = [
  {
    id: "usr-superadmin",
    accountId: "DG-008301",
    username: "techanut0@gmail.com",
    fullName: "ผู้ดูแลระบบสูงสุด (Super Admin)",
    position: "ผู้ดูแลระบบสารบรรณอิเล็กทรอนิกส์ & แพลตฟอร์ม SaaS",
    department: "สำนักปลัด (ผู้ดูแลระบบส่วนกลาง)",
    section: "งานเทคโนโลยีสารสนเทศและสารบรรณกลาง",
    role: "SUPER_ADMIN",
    scope: "ALL",
    email: "techanut0@gmail.com",
    phone: "053-XXXXXX",
    status: "active",
    lastLogin: "ออนไลน์ขณะนี้",
  },
];

const USERS_STORAGE_KEY = "smartsarabun_custom_users";

export default function UsersManagementPage() {
  const [users, setUsers] = useState<CivilServantUser[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(USERS_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    }
    return initialUsers;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedUserForReset, setSelectedUserForReset] = useState<CivilServantUser | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  // New User Form State
  const [formData, setFormData] = useState({
    username: "",
    titlePrefix: "นาย",
    firstName: "",
    lastName: "",
    position: "",
    department: "สำนักปลัด",
    section: "งานบริหารทั่วไปและสารบรรณกลาง",
    role: "OFFICER",
    scope: "OWN" as DataScope,
    initialPassword: "Doigam@2569",
    email: "",
    phone: "",
  });

  const filteredUsers = users.filter((user) => {
    if (selectedDept !== "ALL" && user.department !== selectedDept) return false;
    if (selectedRole !== "ALL" && user.role !== selectedRole) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        user.fullName.toLowerCase().includes(q) ||
        user.username.toLowerCase().includes(q) ||
        user.position.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleToggleStatus = (id: string) => {
    setUsers((prev) => {
      const updated = prev.map((u) => {
        if (u.id === id) {
          return { ...u, status: (u.status === "active" ? "inactive" : "active") as "active" | "inactive" };
        }
        return u;
      });
      if (typeof window !== "undefined") {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.firstName || !formData.lastName) return;

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const newUser: CivilServantUser = {
      id: `usr-${Date.now()}`,
      accountId: `DG-${randomSuffix}`,
      username: formData.username.toLowerCase().trim(),
      fullName: `${formData.titlePrefix} ${formData.firstName.trim()} ${formData.lastName.trim()}`,
      position: formData.position || "เจ้าหน้าที่",
      department: formData.department,
      section: formData.section || `งานสังกัด${formData.department}`,
      role: formData.role,
      scope: formData.scope,
      email: formData.email || `${formData.username}@doigam.go.th`,
      phone: formData.phone || "053-958100",
      status: "active",
      lastLogin: "ยังไม่เคยเข้าสู่ระบบ",
    };

    const updatedUsers = [newUser, ...users];
    setUsers(updatedUsers);
    if (typeof window !== "undefined") {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    }

    setShowAddModal(false);
    setFormData({
      username: "",
      titlePrefix: "นาย",
      firstName: "",
      lastName: "",
      position: "",
      department: "สำนักปลัด",
      section: "งานบริหารทั่วไปและสารบรรณกลาง",
      role: "OFFICER",
      scope: "OWN",
      initialPassword: "Doigam@2569",
      email: "",
      phone: "",
    });
  };

  const handleResetPassword = () => {
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      setShowResetModal(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="ทะเบียนผู้ใช้งานและบุคลากร (User Directory & RBAC Assignment)"
          description="จัดการบัญชีข้าราชการ พนักงานส่วนตำบล การมอบหมายบทบาท และขอบเขตอำนาจข้อมูล (Data Scope)"
        />

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs sm:text-sm rounded-xl h-10 px-4 gap-2 shadow-xs cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-amber-300" />
            + เพิ่มผู้ใช้งานใหม่
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อ-สกุล, ชื่อผู้ใช้, ตำแหน่ง หรืออีเมล..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-navy-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 bg-white"
          >
            <option value="ALL">ทุกสำนัก/กอง</option>
            <option value="สำนักปลัด">สำนักปลัด</option>
            <option value="กองคลัง">กองคลัง</option>
            <option value="กองช่าง">กองช่าง</option>
            <option value="กองการศึกษาฯ">กองการศึกษาฯ</option>
            <option value="กองสาธารณสุข">กองสาธารณสุข</option>
          </select>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 bg-white"
          >
            <option value="ALL">ทุกบทบาท (Roles)</option>
            <option value="EXECUTIVE">EXECUTIVE</option>
            <option value="MANAGER">MANAGER</option>
            <option value="DOCUMENT_OFFICER">DOCUMENT_OFFICER</option>
            <option value="OFFICER">OFFICER</option>
            <option value="VIEWER">VIEWER</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <Card className="shadow-xs border-slate-200 overflow-hidden rounded-2xl">
        <CardHeader className="bg-slate-100/90 px-6 py-4 border-b border-slate-200 flex flex-row items-center justify-between">
          <CardTitle className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-4.5 h-4.5 text-blue-700" />
            รายชื่อบุคลากร อบต.ดอยงาม ({filteredUsers.length} ท่าน)
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[950px] text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200">
                  <th className="p-3.5 w-[14%]">รหัสบัญชี (ID)</th>
                  <th className="p-3.5 w-[22%]">ชื่อ-นามสกุล / ชื่อผู้ใช้</th>
                  <th className="p-3.5 w-[18%]">ตำแหน่งราชการ</th>
                  <th className="p-3.5 w-[18%]">สำนัก/กอง & ฝ่าย/งาน</th>
                  <th className="p-3.5 w-[14%]">บทบาท & Data Scope</th>
                  <th className="p-3.5 w-[8%]">สถานะ</th>
                  <th className="p-3.5 text-center w-[10%]">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.map((user, idx) => (
                  <tr
                    key={user.id}
                    className={`hover:bg-blue-50/60 transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                    } ${user.status === "inactive" ? "opacity-60 bg-slate-100/50" : ""}`}
                  >
                    <td className="p-3.5">
                      <span className="font-mono text-[11px] font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs block w-fit">
                        {user.accountId || "DG-008301"}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <p className="font-extrabold text-slate-900 text-xs sm:text-sm">{user.fullName}</p>
                      <span className="font-mono text-[11px] text-blue-800 font-semibold block">
                        @{user.username}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className="font-semibold text-slate-800">{user.position}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{user.email}</span>
                    </td>

                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200 block w-fit">
                        {user.department}
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1 block">{user.section}</span>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-900">
                          {user.role}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-200">
                          Scope: {user.scope}
                        </span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      {user.status === "active" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          เปิดใช้งาน
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                          ระงับชั่วคราว
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedUserForReset(user);
                            setShowResetModal(true);
                          }}
                          className="h-8 w-8 p-0 rounded-lg border-slate-300 text-slate-700 hover:text-blue-700"
                          title="รีเซ็ตรหัสผ่าน"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleStatus(user.id)}
                          className={`h-8 px-2 text-[11px] font-bold rounded-lg ${
                            user.status === "active"
                              ? "border-red-200 text-red-700 hover:bg-red-50"
                              : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          }`}
                        >
                          {user.status === "active" ? "ระงับ" : "เปิด"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-navy-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-amber-300" />
                <h3 className="font-extrabold text-base">เพิ่มบุคลากรใหม่ (Create New User)</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-3">
                  <label className="font-bold text-slate-700 text-xs block mb-1">คำนำหน้า * :</label>
                  <select
                    value={formData.titlePrefix}
                    onChange={(e) => setFormData({ ...formData, titlePrefix: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                  >
                    <option value="นาย">นาย</option>
                    <option value="นาง">นาง</option>
                    <option value="น.ส.">น.ส.</option>
                    <option value="ว่าที่ ร.ต.">ว่าที่ ร.ต.</option>
                  </select>
                </div>
                <div className="col-span-4">
                  <label className="font-bold text-slate-700 text-xs block mb-1">ชื่อจริง * :</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น สมศักดิ์"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                  />
                </div>
                <div className="col-span-5">
                  <label className="font-bold text-slate-700 text-xs block mb-1">นามสกุล * :</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น สุขใจ"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 text-xs block mb-1">ชื่อผู้ใช้ (Username) * :</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น somsaak.s"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 text-xs block mb-1">ตำแหน่งราชการ * :</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น นายช่างโยธาปฏิบัติงาน"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 text-xs block mb-1">สำนัก/กอง :</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold bg-white"
                  >
                    <option value="สำนักปลัด">สำนักปลัด</option>
                    <option value="กองคลัง">กองคลัง</option>
                    <option value="กองช่าง">กองช่าง</option>
                    <option value="กองการศึกษาฯ">กองการศึกษา ศาสนาและวัฒนธรรม</option>
                    <option value="กองสาธารณสุข">กองสาธารณสุขและสิ่งแวดล้อม</option>
                    <option value="หน่วยตรวจสอบภายใน">หน่วยตรวจสอบภายใน</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 text-xs block mb-1">บทบาทระบบ (Role) :</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold bg-white"
                  >
                    <option value="OFFICER">OFFICER (เจ้าหน้าที่ปฏิบัติงาน)</option>
                    <option value="DOCUMENT_OFFICER">DOCUMENT_OFFICER (สารบรรณ)</option>
                    <option value="MANAGER">MANAGER (ผอ.กอง/ปลัด)</option>
                    <option value="EXECUTIVE">EXECUTIVE (ผู้บริหาร)</option>
                    <option value="ORGANIZATION_ADMIN">ORGANIZATION_ADMIN (แอดมิน อบต.)</option>
                    <option value="VIEWER">VIEWER (ผู้ตรวจสอบ)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 text-xs block mb-1">ขอบเขตข้อมูล (Data Scope) :</label>
                <select
                  value={formData.scope}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value as DataScope })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold bg-white"
                >
                  <option value="OWN">OWN (เข้าถึงเฉพาะเอกสารที่ตนเองสร้าง/ได้รับมอบหมาย)</option>
                  <option value="DEPT">DEPT (เข้าถึงเอกสารทั้งหมดภายในกอง)</option>
                  <option value="ORG">ORG (เข้าถึงเอกสารทั่วทั้ง อบต.)</option>
                  <option value="ALL">ALL (เข้าถึงทั้งระบบ)</option>
                </select>
              </div>

              {/* Default Password Notice */}
              <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-2xl text-xs text-blue-900 leading-relaxed space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-blue-950">
                  <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                  <span>รหัสผ่านเริ่มต้นของระบบ : </span>
                  <code className="font-mono bg-white px-2 py-0.5 rounded-md border border-blue-300 text-blue-950 font-black">
                    Doigam@2569
                  </code>
                </div>
                <p className="text-[11px] text-blue-800">
                  * ผู้ดูแลระบบ (Admin) ไม่ต้องตั้งรหัสผ่านเอง ระบบจะกำหนดรหัสเริ่มต้นให้อัตโนมัติ และจะบังคับให้ผู้ใช้งานเปลี่ยนรหัสผ่านใหม่ในการเข้าสู่ระบบครั้งแรก
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="text-xs font-bold rounded-xl h-10 px-4 border-slate-300"
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl h-10 px-5 shadow-xs cursor-pointer"
                >
                  บันทึกผู้ใช้งาน & ออกรหัสเริ่มต้น
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && selectedUserForReset && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="bg-navy-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-300" />
                <h3 className="font-extrabold text-base">รีเซ็ตรหัสผ่านผู้ใช้งาน</h3>
              </div>
              <button onClick={() => setShowResetModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                ท่านกำลังจะรีเซ็ตรหัสผ่านของ <strong>{selectedUserForReset.fullName}</strong> (@{selectedUserForReset.username})
              </p>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-center space-y-1">
                <span className="text-[11px] text-blue-800 font-bold block">รหัสผ่านชั่วคราว (Temporary Password) :</span>
                <span className="text-xl font-mono font-black text-navy-950 block select-all">
                  DoiNgam@2026!
                </span>
                <span className="text-[10px] text-slate-500 block">ผู้ใช้จะต้องเปลี่ยนรหัสผ่านทันทีเมื่อเข้าสู่ระบบครั้งแรก</span>
              </div>

              {resetSuccess && (
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  รีเซ็ตรหัสผ่านสำเร็จและส่งแจ้งเตือนแล้ว
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowResetModal(false)}
                  className="text-xs font-bold rounded-xl h-10 px-4 border-slate-300"
                >
                  ปิด
                </Button>
                <Button
                  onClick={handleResetPassword}
                  className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl h-10 px-5 shadow-xs cursor-pointer"
                >
                  ยืนยันรีเซ็ตรหัสผ่าน
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
