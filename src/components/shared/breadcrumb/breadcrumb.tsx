"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { navigation } from "@/config/navigation";

export function AppBreadcrumb() {
  const pathname = usePathname();
  
  if (pathname === "/") return null;
  
  const pathSegments = pathname.split('/').filter(Boolean);
  
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
    
    // Find matching title in navigation
    let title = segment;
    navigation.forEach(nav => {
      if (nav.href === href) title = nav.title;
    });

    // Replace some known english paths with Thai
    if (title === 'users') title = 'จัดการผู้ใช้';
    if (title === 'roles') title = 'จัดการสิทธิ์';
    if (title === 'organization') title = 'โครงสร้างองค์กร';
    if (title === 'audit') title = 'ประวัติการใช้งาน';
    if (title === 'settings') title = 'ตั้งค่าระบบ';
    if (title === 'send') title = 'ส่งหนังสือ';
    if (title === 'cabinet') title = 'แฟ้มในตู้';
    if (title === 'tracking') title = 'ติดตามหนังสือ';
    if (title === 'reports') title = 'ผลการดำเนินงาน';
    if (title === 'approvals') title = 'รอลงนาม/อนุมัติ';
    
    return { title, href };
  });

  return (
    <nav className="flex items-center text-xs text-slate-500">
      <Link href="/" className="hover:text-navy-700 transition-colors flex items-center">
        <Home className="h-3.5 w-3.5" />
      </Link>
      
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center">
          <ChevronRight className="h-3.5 w-3.5 mx-1 text-slate-400" />
          {index === breadcrumbs.length - 1 ? (
            <span className="font-semibold text-slate-800">{crumb.title}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-navy-700 transition-colors">
              {crumb.title}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
