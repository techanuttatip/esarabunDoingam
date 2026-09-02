"use client";

import { useEffect, useState } from "react";
import { Lock, Phone, Mail, Building2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getTenantSaaSConfig,
  calculateDaysRemaining,
  TenantSaaSConfig,
} from "@/config/tenant-config";

export function SaaSLockScreen() {
  const [config, setConfig] = useState<TenantSaaSConfig>(getTenantSaaSConfig());
  const [daysRemaining, setDaysRemaining] = useState<number>(30);

  useEffect(() => {
    const update = () => {
      const cfg = getTenantSaaSConfig();
      setConfig(cfg);
      setDaysRemaining(calculateDaysRemaining(cfg.trialExpiresAt));
    };

    update();
    window.addEventListener("tenant_config_updated", update);
    return () => window.removeEventListener("tenant_config_updated", update);
  }, []);

  const isLocked =
    config.licenseStatus === "SUSPENDED" ||
    config.licenseStatus === "EXPIRED" ||
    (config.licenseStatus === "TRIAL" && daysRemaining <= 0);

  if (!isLocked) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-300">
      <Card className="w-full max-w-xl border-slate-700 bg-slate-900/95 text-slate-100 shadow-2xl shadow-rose-950/40 rounded-3xl overflow-hidden border">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-xl" />
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">ระบบระงับการใช้งานชั่วคราว (Subscription Expired)</h2>
          <p className="text-sm text-rose-100 mt-1">
            ครบกำหนดระยะเวลาทดลองใช้งาน ๓๐ วัน หรือสัญญาจ้างบริการสิ้นสุด
          </p>
        </div>

        <CardContent className="p-6 sm:p-8 space-y-6 text-slate-300">
          {/* Tenant Details Box */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>หน่วยงานผู้รับบริการ:</span>
              <span className="font-mono text-amber-400">{config.code}</span>
            </div>
            <div className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>{config.name}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700">
              <span>เลขที่สัญญาจ้าง / โควต้า:</span>
              <span className="text-slate-300">{config.contractNo || "DG-SaaS-2569/001"}</span>
            </div>
          </div>

          {/* Explanation text */}
          <div className="space-y-2 text-sm leading-relaxed text-slate-300">
            <p>
              เพื่อความปลอดภัยของข้อมูลทางราชการ ฐานข้อมูลและเอกสารทั้งหมดของหน่วยงานยังคงถูกจัดเก็บไว้อย่างปลอดภัย 100% ในเครื่องแม่ข่าย
            </p>
            <p className="text-xs text-slate-400">
              กรุณาติดต่อเจ้าหน้าที่ผู้ดูแลระบบหรือฝ่ายบริการลูกค้าเพื่อดำเนินการต่อสัญญาการใช้งาน
            </p>
          </div>

          {/* Contact Developer Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <a
              href={`mailto:${config.contactEmail || "techanut0@gmail.com"}?subject=แจ้งต่ออายุสัญญาการใช้งานระบบสารบรรณ - ${config.name}`}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/70 border border-slate-700 hover:border-blue-500 hover:bg-slate-800 transition-colors"
            >
              <Mail className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <p className="text-slate-400 text-[10px]">ส่งอีเมลติดต่อเจ้าหน้าที่</p>
                <p className="font-medium text-slate-200 truncate">{config.contactEmail || "techanut0@gmail.com"}</p>
              </div>
            </a>

            <a
              href={`tel:${config.contactPhone || "053-123456"}`}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/70 border border-slate-700 hover:border-emerald-500 hover:bg-slate-800 transition-colors"
            >
              <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-slate-400 text-[10px]">โทรศัพท์ติดต่อเจ้าหน้าที่</p>
                <p className="font-medium text-slate-200">{config.contactPhone || "053-123456"}</p>
              </div>
            </a>
          </div>

          <div className="pt-2 text-center text-xs text-slate-500">
            <span>องค์การบริหารส่วนตำบลดอยงาม • ระบบสารบรรณอิเล็กทรอนิกส์</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
