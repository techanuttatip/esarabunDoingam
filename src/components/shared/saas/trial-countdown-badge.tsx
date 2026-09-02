"use client";

import { useEffect, useState } from "react";
import { Lock, Clock, CheckCircle2 } from "lucide-react";
import {
  getTenantSaaSConfig,
  calculateDaysRemaining,
  TenantSaaSConfig,
} from "@/config/tenant-config";

export function TrialCountdownBadge() {
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

  if (config.licenseStatus === "ACTIVE") {
    return (
      <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-medium shadow-sm shadow-emerald-500/10">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>สัญญาใช้งานทางการ (Active)</span>
      </div>
    );
  }

  if (config.licenseStatus === "SUSPENDED" || config.licenseStatus === "EXPIRED" || daysRemaining <= 0) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-pulse shadow-sm shadow-rose-500/10">
        <Lock className="w-3.5 h-3.5 text-rose-600" />
        <span>หมดอายุการทดลองใช้งาน (กรุณาติดต่อเจ้าหน้าที่)</span>
      </div>
    );
  }

  const isUrgent = daysRemaining <= 7;
  const isWarning = daysRemaining <= 14;

  const badgeColor = isUrgent
    ? "bg-rose-50 border-rose-200/90 text-rose-700 ring-1 ring-rose-500/20"
    : isWarning
    ? "bg-amber-50 border-amber-200/90 text-amber-700 ring-1 ring-amber-500/20"
    : "bg-blue-50 border-blue-200/90 text-blue-700 ring-1 ring-blue-500/20";

  return (
    <div
      className={`hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium shadow-sm ${badgeColor}`}
    >
      <Clock className="w-3.5 h-3.5 shrink-0" />
      <span>
        ทดลองใช้ 30 วัน: <strong className="font-semibold">{daysRemaining} วัน</strong>
      </span>
    </div>
  );
}
