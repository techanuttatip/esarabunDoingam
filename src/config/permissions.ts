// Granular Permissions Catalog for Frontend (Phase 3 Authentication & Authorization)

export const PERMISSIONS = {
  // Documents
  DOCUMENTS_VIEW: 'documents.view',
  DOCUMENTS_CREATE: 'documents.create',
  DOCUMENTS_UPDATE: 'documents.update',
  DOCUMENTS_DELETE: 'documents.delete',

  // Numbering & Registration
  NUMBERS_VIEW: 'numbers.view',
  NUMBERS_RESERVE: 'numbers.reserve',
  NUMBERS_ISSUE: 'numbers.issue',
  NUMBERS_INSERT: 'numbers.insert',
  NUMBERS_CANCEL: 'numbers.cancel',
  NUMBERS_RELEASE: 'numbers.release',

  // File Attachments & Stamping
  FILES_UPLOAD: 'files.upload',
  FILES_VIEW: 'files.view',
  FILES_DOWNLOAD: 'files.download',
  PDF_STAMP: 'pdf.stamp',

  // Reports & Analytics
  REPORTS_VIEW: 'reports.view',
  REPORTS_EXPORT: 'reports.export',

  // User & Role Administration
  USERS_MANAGE: 'users.manage',
  ROLES_MANAGE: 'roles.manage',

  // Organization & Settings
  DEPARTMENTS_MANAGE: 'departments.manage',
  SECTIONS_MANAGE: 'sections.manage',
  SETTINGS_MANAGE: 'settings.manage',
  AUDIT_VIEW: 'audit.view',
} as const;

export type PermissionCode = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export type DataScope = 'OWN' | 'DEPT' | 'ORG' | 'ALL';

export const SYSTEM_ROLES = {
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',
  ORGANIZATION_ADMIN: 'ORGANIZATION_ADMIN',
  DOCUMENT_OFFICER: 'DOCUMENT_OFFICER',
  OFFICER: 'OFFICER',
  MANAGER: 'MANAGER',
  EXECUTIVE: 'EXECUTIVE',
  VIEWER: 'VIEWER',
} as const;

export type SystemRoleCode = typeof SYSTEM_ROLES[keyof typeof SYSTEM_ROLES];

// Human-readable Thai labels for UI
export const PERMISSION_LABELS: Record<PermissionCode, { name: string; category: string; description: string }> = {
  'documents.view': { name: 'เปิดดูเอกสาร', category: 'เอกสารราชการ', description: 'เปิดอ่านและค้นหาเอกสารราชการในระบบ' },
  'documents.create': { name: 'สร้าง/ร่างเอกสาร', category: 'เอกสารราชการ', description: 'สร้างบันทึกข้อความและร่างหนังสือราชการ' },
  'documents.update': { name: 'แก้ไขเอกสาร', category: 'เอกสารราชการ', description: 'แก้ไขรายละเอียดหนังสือราชการที่ยังไม่อนุมัติ' },
  'documents.delete': { name: 'ลบเอกสารร่าง', category: 'เอกสารราชการ', description: 'ลบหนังสือฉบับร่างที่ยังไม่ได้ออกเลข' },

  'numbers.view': { name: 'ดูสมุดทะเบียนเลข', category: 'เลขสารบรรณ', description: 'ดูประวัติการออกเลขและสมุดทะเบียนรับ-ส่ง' },
  'numbers.reserve': { name: 'จองเลขล่วงหน้า', category: 'เลขสารบรรณ', description: 'ขอจองช่วงเลขสารบรรณล่วงหน้าสำหรับโครงการ' },
  'numbers.issue': { name: 'ออกเลขสารบรรณ', category: 'เลขสารบรรณ', description: 'รันเลขรับและเลขส่งอย่างเป็นทางการ' },
  'numbers.insert': { name: 'แทรกเลขลูกย้อนหลัง', category: 'เลขสารบรรณ', description: 'แทรกเลขลูก (/1, /2) สำหรับหนังสือลงรับย้อนหลัง' },
  'numbers.cancel': { name: 'ขีดฆ่า/ยกเลิกเลข', category: 'เลขสารบรรณ', description: 'ยกเลิกเลขสารบรรณพร้อมบันทึกเหตุผล' },
  'numbers.release': { name: 'คืนเลขที่จอง', category: 'เลขสารบรรณ', description: 'ปลดล็อกเลขที่จองไว้กลับคืนสู่ระบบ' },

  'files.upload': { name: 'อัปโหลดไฟล์ PDF', category: 'ไฟล์แนบและตรายาง', description: 'แนบไฟล์เอกสารสแกนและไฟล์แนบประกอบ' },
  'files.view': { name: 'เปิดดูไฟล์แนบ', category: 'ไฟล์แนบและตรายาง', description: 'ดูตัวอย่างไฟล์ PDF และภาพถ่ายในระบบ' },
  'files.download': { name: 'ดาวน์โหลดไฟล์', category: 'ไฟล์แนบและตรายาง', description: 'ดาวน์โหลดไฟล์เอกสารต้นฉบับและฉบับประทับตรา' },
  'pdf.stamp': { name: 'ประทับตรายางรับหนังสือ', category: 'ไฟล์แนบและตรายาง', description: 'ประทับตรายางรับหนังสือราชการลงบนไฟล์ PDF' },

  'reports.view': { name: 'ดูรายงานผลการดำเนินงาน', category: 'รายงานและสถิติ', description: 'ดูสถิติรับ-ส่ง, ปริมาณงานรายกอง, และ SLA' },
  'reports.export': { name: 'ส่งออกรายงาน Excel', category: 'รายงานและสถิติ', description: 'ดาวน์โหลดสมุดทะเบียนและรายงานเป็นไฟล์ .xlsx/.csv' },

  'users.manage': { name: 'จัดการผู้ใช้งาน', category: 'การบริหารระบบ', description: 'เพิ่ม, แก้ไข, ระงับบัญชี, และรีเซ็ตรหัสผ่าน' },
  'roles.manage': { name: 'จัดการบทบาทและสิทธิ์', category: 'การบริหารระบบ', description: 'กำหนดบทบาทและติ๊กเลือกสิทธิ์ในแมทริกซ์' },

  'departments.manage': { name: 'จัดการสำนัก/กอง', category: 'โครงสร้างองค์กร', description: 'เพิ่ม, แก้ไขข้อมูลกอง และกำหนดรหัสพยัญชนะ' },
  'sections.manage': { name: 'จัดการฝ่าย/งาน', category: 'โครงสร้างองค์กร', description: 'เพิ่มและแก้ไขฝ่าย/งานภายใต้กอง' },
  'settings.manage': { name: 'ตั้งค่าระบบองค์กร', category: 'โครงสร้างองค์กร', description: 'กำหนดค่าระบบ, อายุการเก็บรักษา, และการประทับตรา' },
  'audit.view': { name: 'ตรวจสอบ Audit Log', category: 'ความปลอดภัย', description: 'ดูประวัติการเข้าถึง, ประวัติการเปิดอ่าน, และ SHA-256' },
};
