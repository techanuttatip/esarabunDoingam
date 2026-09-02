export interface TenantSaaSConfig {
  id: string;
  name: string;
  code: string;
  docPrefix: string;
  slogan: string;
  logoUrl?: string;
  officeImageUrl?: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  
  // License & 30-Day Trial Engine
  licenseTier: "TRIAL_30_DAYS" | "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
  licenseStatus: "TRIAL" | "ACTIVE" | "SUSPENDED" | "EXPIRED";
  trialStartDate: string; // ISO String
  trialExpiresAt: string; // ISO String
  contractNo?: string;
  
  // Resource Quotas
  maxUsers: number;
  maxStorageMb: number;
  
  // Feature Matrix Toggles
  enabledModules: {
    incoming: boolean;
    outgoing: boolean;
    endorsement: boolean;
    signature: boolean;
    aiAssistant: boolean;
    autoNumbering: boolean;
    watermark: boolean;
    auditLog: boolean;
    cabinet: boolean;
    templates: boolean;
  };
}

// 30-day calculation from today (ends in 30 days)
const defaultTrialStart = new Date();
const defaultTrialEnd = new Date(defaultTrialStart.getTime() + 30 * 24 * 60 * 60 * 1000);

export const defaultTenantConfig: TenantSaaSConfig = {
  id: "e4a2d8a0-4a8a-4c22-9f33-000000000001",
  name: "องค์การบริหารส่วนตำบลดอยงาม",
  code: "DOIGAM-SAO",
  docPrefix: "ชร ๕๒๐๐๑",
  slogan: "บริการด้วยใจ โปร่งใส เป็นธรรม มุ่งมั่นพัฒนาตำบลดอยงาม",
  contactEmail: "saraban@doigam.go.th",
  contactPhone: "053-123456",
  address: "ตำบลดอยงาม อำเภอพาน จังหวัดเชียงราย ๕๗๑๒๐",
  
  licenseTier: "TRIAL_30_DAYS",
  licenseStatus: "TRIAL",
  trialStartDate: defaultTrialStart.toISOString(),
  trialExpiresAt: defaultTrialEnd.toISOString(),
  contractNo: "DG-SaaS-2569/001",
  
  maxUsers: 50,
  maxStorageMb: 20480, // 20 GB
  
  enabledModules: {
    incoming: true,
    outgoing: true,
    endorsement: true,
    signature: true,
    aiAssistant: true,
    autoNumbering: true,
    watermark: true,
    auditLog: true,
    cabinet: true,
    templates: true,
  },
};

const STORAGE_KEY = "smartsarabun_tenant_saas_config";

export function getTenantSaaSConfig(): TenantSaaSConfig {
  if (typeof window === "undefined") {
    return defaultTenantConfig;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultTenantConfig;
    return JSON.parse(raw);
  } catch {
    return defaultTenantConfig;
  }
}

export function saveTenantSaaSConfig(config: TenantSaaSConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event("tenant_config_updated"));
  } catch (err) {
    console.error("Failed to save tenant config:", err);
  }
}

export function calculateDaysRemaining(expiresAt: string): number {
  try {
    const diff = new Date(expiresAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  } catch {
    return 0;
  }
}
