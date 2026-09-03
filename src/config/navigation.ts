import {
  LayoutDashboard,
  Inbox,
  Send,
  ClipboardList,
  Search,
  FolderOpen,
  BarChart3,
  Users,
  Settings,
  PenTool,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: any;
  badge?: string;
  badgeVariant?: "default" | "blue" | "amber" | "emerald";
  roles?: string[];
  permissions?: string[];
  section: "core" | "archive" | "admin";
}

export const navigationConfig: {
  core: NavItem[];
  archive: NavItem[];
  admin: NavItem[];
} = {
  // ๑. งานหลักประจำวัน (Daily Core Workflow)
  core: [
    {
      title: "หน้าแรก (แดชบอร์ด)",
      href: "/",
      icon: LayoutDashboard,
      section: "core",
    },
    {
      title: "หนังสือรับ (งานเข้า)",
      href: "/receive",
      icon: Inbox,
      section: "core",
    },
    {
      title: "หนังสือส่ง (ออกเลข)",
      href: "/send",
      icon: Send,
      section: "core",
    },
    {
      title: "รอเกษียน / ลงนาม",
      href: "/approvals",
      icon: ClipboardList,
      badge: "รอเซ็น",
      badgeVariant: "amber",
      section: "core",
    },
  ],

  // ๒. คลัง & เครื่องมือ (Archive & Search)
  archive: [
    {
      title: "สืบค้นหนังสือ",
      href: "/search",
      icon: Search,
      section: "archive",
    },
    {
      title: "ตู้จัดเก็บเอกสาร",
      href: "/cabinet",
      icon: FolderOpen,
      section: "archive",
    },
    {
      title: "รายงาน & สมุดทะเบียน",
      href: "/reports",
      icon: BarChart3,
      section: "archive",
    },
    {
      title: "ลายเซ็นต์ & ข้อมูลส่วนตัว",
      href: "/profile",
      icon: PenTool,
      badge: "e-Sign",
      badgeVariant: "emerald",
      section: "archive",
    },
  ],

  // ๓. จัดการระบบ (Admin Only)
  admin: [
    {
      title: "จัดการผู้ใช้งาน",
      href: "/users",
      icon: Users,
      roles: ["SUPER_ADMIN", "ADMIN", "ORGANIZATION_ADMIN"],
      section: "admin",
    },
    {
      title: "ตั้งค่าระบบ",
      href: "/settings",
      icon: Settings,
      roles: ["SUPER_ADMIN", "ADMIN"],
      section: "admin",
    },
  ],
};

export const navigation: NavItem[] = [
  ...navigationConfig.core,
  ...navigationConfig.archive,
  ...navigationConfig.admin,
];
