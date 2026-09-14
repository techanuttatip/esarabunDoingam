"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { navigationConfig, NavItem } from "@/config/navigation";
import { useSession, signOut } from "@/components/providers/session-provider";
import { DoiNgamLogoEmblem } from "@/components/shared/doigam-logo-emblem";
import { getTenantSaaSConfig, TenantSaaSConfig } from "@/config/tenant-config";

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [tenantConfig, setTenantConfig] = useState<TenantSaaSConfig>(getTenantSaaSConfig());

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  useEffect(() => {
    const update = () => setTenantConfig(getTenantSaaSConfig());
    update();
    window.addEventListener("tenant_config_updated", update);
    window.addEventListener("tenant_switched", update);
    return () => {
      window.removeEventListener("tenant_config_updated", update);
      window.removeEventListener("tenant_switched", update);
    };
  }, []);

  const userRoles = session?.user?.roles || [];

  const filterNavItems = (items: NavItem[]) => {
    return items.filter((item) => {
      // Role check
      if (item.roles && item.roles.length > 0) {
        if (!item.roles.some((r) => userRoles.includes(r))) return false;
      }

      // SaaS Module Check
      const modules = tenantConfig.enabledModules;
      if (item.href === "/receive" && !modules.incoming) return false;
      if (item.href === "/send" && !modules.outgoing) return false;
      if (item.href === "/approvals" && !modules.endorsement) return false;
      if (item.href === "/cabinet" && !modules.cabinet) return false;
      if (item.href === "/templates" && !modules.templates) return false;
      if (item.href === "/numbers" && !modules.autoNumbering) return false;
      if (item.href === "/audit" && !modules.auditLog) return false;

      return true;
    });
  };

  const renderNavSection = (title: string, items: NavItem[]) => {
    const filtered = filterNavItems(items);
    if (filtered.length === 0) return null;

    return (
      <div className="space-y-0.5">
        <div className="px-3 py-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {title}
        </div>
        <div className="space-y-0.5">
          {filtered.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);

            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#0052FF] text-white shadow-sm shadow-blue-500/20 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-slate-700"
                    }`}
                  />
                  <span className="truncate">{item.title}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                      isActive
                        ? "bg-white/20 text-white"
                        : item.badgeVariant === "amber"
                        ? "bg-amber-50 text-amber-800 border border-amber-200"
                        : item.badgeVariant === "emerald"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-blue-50 text-blue-800 border border-blue-200"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      </div>
    );
  };



  return (
    <>
      {/* Mobile Hamburger Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed bottom-5 right-5 z-50 w-12 h-12 rounded-2xl bg-[#0052FF] text-white shadow-2xl flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
        aria-label="เปิดเมนู"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 shadow-xs flex flex-col justify-between transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top Branding */}
        <div>
          <div className="p-3.5 border-b border-slate-200/80 flex items-center gap-3">
            <div className="p-1 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs shrink-0">
              <DoiNgamLogoEmblem className="w-8 h-8" size={32} />
            </div>
            <div className="min-w-0">
              <span className="font-sans font-black text-xs text-slate-900 tracking-tight block truncate">
                SMART SARABUN
              </span>
              <p className="text-[10px] text-blue-600 font-bold truncate">
                {tenantConfig.name}
              </p>
            </div>
          </div>

          {/* Navigation Items (3 Groups) */}
          <div className="p-2.5 space-y-2.5 overflow-y-auto max-h-[calc(100vh-140px)] select-none">
            {renderNavSection("งานประจำวัน", navigationConfig.core)}
            {renderNavSection("คลัง & รายงาน", navigationConfig.archive)}
            {renderNavSection("จัดการระบบ", navigationConfig.admin)}
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="p-2.5 border-t border-slate-200/80 bg-slate-50/50">
          <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <a
              href="/profile"
              title="จัดการข้อมูลส่วนตัวและลายเซ็นดิจิทัล"
              className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {session?.user?.name ? session.user.name.charAt(0) : "ผ"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {session?.user?.name || "ผู้ดูแลระบบ"}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {session?.user?.position || "สารบรรณกลาง"}
                </p>
              </div>
            </a>

            <button
              type="button"
              onClick={handleLogout}
              title="ออกจากระบบ (Logout)"
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
