import {
  LayoutDashboard,
  Inbox,
  Send,
  FilePlus,
  Hash,
  ClipboardList,
  FileText,
  Search,
  BarChart3,
  Users,
  Shield,
  Building2,
  Settings,
  Server,
  PenTool,
  LayoutTemplate,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: any;
  badge?: string;
  badgeVariant?: "default" | "blue" | "amber" | "emerald";
  roles?: string[];
  permissions?: string[];
  section: "workplace" | "my_work" | "admin";
}

export const navigationConfig: {
  workplace: NavItem[];
  my_work: NavItem[];
  admin: NavItem[];
} = {
  // ๑. งานสารบรรณ (Core Correspondence)
  workplace: [
    {
      title: "ภาพรวม",
      href: "/",
      icon: LayoutDashboard,
      section: "workplace",
    },
    {
      title: "หนังสือรับ",
      href: "/receive",
      icon: Inbox,
      section: "workplace",
    },
    {
      title: "หนังสือส่ง",
      href: "/send",
      icon: Send,
      section: "workplace",
    },
    {
      title: "สร้างร่างหนังสือ",
      href: "/create",
      icon: FilePlus,
      section: "workplace",
    },
    {
      title: "แม่แบบเอกสาร",
      href: "/templates",
      icon: LayoutTemplate,
      section: "workplace",
    },
    {
      title: "ทะเบียนเลข",
      href: "/numbers",
      icon: Hash,
      section: "workplace",
    },
  ],

  // ๒. งานของฉัน (My Workspace & Tools)
  my_work: [
    {
      title: "งานของฉัน",
      href: "/tasks",
      icon: ClipboardList,
      section: "my_work",
    },
    {
      title: "เอกสาร",
      href: "/documents",
      icon: FileText,
      section: "my_work",
    },
    {
      title: "ค้นหา",
      href: "/search",
      icon: Search,
      section: "my_work",
    },
    {
      title: "รายงาน",
      href: "/reports",
      icon: BarChart3,
      section: "my_work",
    },
    {
      title: "โปรไฟล์ & ลายเซ็น",
      href: "/profile",
      icon: PenTool,
      badge: "e-Sign",
      badgeVariant: "emerald",
      section: "my_work",
    },
  ],

  // ๓. ผู้ดูแลระบบ (Administration & Platform)
  admin: [
    {
      title: "ผู้ใช้งาน",
      href: "/users",
      icon: Users,
      roles: ["SUPER_ADMIN", "ADMIN", "ORGANIZATION_ADMIN", "MANAGER"],
      section: "admin",
    },
    {
      title: "บทบาทและสิทธิ์",
      href: "/roles",
      icon: Shield,
      roles: ["SUPER_ADMIN", "ADMIN"],
      section: "admin",
    },
    {
      title: "โครงสร้างหน่วยงาน",
      href: "/organization",
      icon: Building2,
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
    {
      title: "แพลตฟอร์ม SaaS",
      href: "/platform-admin",
      icon: Server,
      badge: "SaaS Admin",
      badgeVariant: "amber",
      roles: ["SUPER_ADMIN", "PLATFORM_ADMIN"],
      section: "admin",
    },
  ],
};

export const navigation: NavItem[] = [
  ...navigationConfig.workplace,
  ...navigationConfig.my_work,
  ...navigationConfig.admin,
];
