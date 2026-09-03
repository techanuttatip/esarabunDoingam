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
    window.addEventListener("tenant_config_updated", update);
    return () => window.removeEventListener("tenant_config_updated", update);
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
      <div className="space-y-1">
        <div className="px-3.5 py-1 text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider">
          {title}
        </div>
        <div className="space-y-1">
          {filtered.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);

            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-[#0052FF] via-[#0284c7] to-[#2563eb] text-white shadow-md shadow-blue-500/25 font-black scale-[1.01]"
                    : "text-slate-600 hover:text-slate-950 hover:bg-white/80 hover:shadow-2xs"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4.5 h-4.5 shrink-0 transition-colors ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-[#0052FF]"
                    }`}
                  />
                  <span className="truncate">{item.title}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 shadow-2xs ${
                      isActive
                        ? "bg-white/25 text-white"
                        : item.badgeVariant === "amber"
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : item.badgeVariant === "emerald"
                        ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                        : "bg-blue-100 text-blue-900 border border-blue-300"
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
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white/85 backdrop-blur-3xl border-r border-white/90 shadow-[4px_0_24px_rgba(0,0,0,0.03)] flex flex-col justify-between transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top Branding */}
        <div>
          <div className="p-4 sm:p-5 border-b border-slate-200/70 flex items-center gap-3 bg-white/40">
            <div className="p-1 rounded-2xl bg-white border border-slate-200 shadow-xs ring-2 ring-blue-500/15 shrink-0">
              <DoiNgamLogoEmblem className="w-10 h-10" size={40} />
            </div>
            <div className="min-w-0">
              <span className="font-display font-black text-sm text-slate-900 tracking-tight block truncate">
                SMART SARABUN
              </span>
              <p className="text-[11px] text-[#0052FF] font-bold truncate">
                อบต.ดอยงาม (เชียงราย)
              </p>
            </div>
          </div>

          {/* Navigation Items (3 Groups) */}
          <div className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-170px)] select-none">
            {renderNavSection("งานประจำวัน", navigationConfig.core)}
            {renderNavSection("คลัง & รายงาน", navigationConfig.archive)}
            {renderNavSection("จัดการระบบ", navigationConfig.admin)}
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-slate-200/70 bg-slate-50/70 backdrop-blur-md">
          <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs">
            <a
              href="/profile"
              title="จัดการข้อมูลส่วนตัวและลายเซ็นดิจิทัล"
              className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0052FF] to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
                {session?.user?.name ? session.user.name.charAt(0) : "ผ"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {session?.user?.name || "ผู้ดูแลระบบสูงสุด"}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {session?.user?.position || "ผู้ดูแลระบบสารบรรณ"}
                </p>
              </div>
            </a>

            <button
              type="button"
              onClick={handleLogout}
              title="ออกจากระบบ (Logout)"
              className="w-8 h-8 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
