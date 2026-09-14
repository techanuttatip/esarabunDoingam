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
  contactEmail: "saraban.doigam@gmail.com",
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

export const initialSeedTenants: TenantSaaSConfig[] = [
  defaultTenantConfig,
  {
    id: "e4a2d8a0-4a8a-4c22-9f33-000000000002",
    name: "เทศบาลตำบลเวียงป่าเป้า",
    code: "WIANGPAPAO-TES",
    docPrefix: "ชร ๕๔๐๐๑",
    slogan: "เมืองน่าอยู่ ควบคู่คุณธรรม นำการพัฒนาสู่ความยั่งยืน",
    contactEmail: "saraban.wiangpapao@gmail.com",
    contactPhone: "053-781234",
    address: "ตำบลเวียง อำเภอเวียงป่าเป้า จังหวัดเชียงราย ๕๗๑๗๐",
    licenseTier: "PROFESSIONAL",
    licenseStatus: "ACTIVE",
    trialStartDate: new Date("2026-01-01").toISOString(),
    trialExpiresAt: new Date("2026-12-31").toISOString(),
    contractNo: "WPP-GovSaaS-2569/08",
    maxUsers: 80,
    maxStorageMb: 51200, // 50 GB
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
  },
  {
    id: "e4a2d8a0-4a8a-4c22-9f33-000000000003",
    name: "องค์การบริหารส่วนตำบลแม่กรณ์",
    code: "MAEKORN-SAO",
    docPrefix: "ชร ๕๖๐๐๑",
    slogan: "ธรรมชาติงดงาม น้ำตกใส ประชาชนร่วมใจ พัฒนาแม่กรณ์",
    contactEmail: "saraban.maekorn@gmail.com",
    contactPhone: "053-718899",
    address: "ตำบลแม่กรณ์ อำเภอเมือง จังหวัดเชียงราย ๕๗๐๐๐",
    licenseTier: "TRIAL_30_DAYS",
    licenseStatus: "TRIAL",
    trialStartDate: defaultTrialStart.toISOString(),
    trialExpiresAt: defaultTrialEnd.toISOString(),
    contractNo: "MK-Trial-2569/012",
    maxUsers: 40,
    maxStorageMb: 20480,
    enabledModules: {
      incoming: true,
      outgoing: true,
      endorsement: true,
      signature: true,
      aiAssistant: false,
      autoNumbering: true,
      watermark: false,
      auditLog: true,
      cabinet: true,
      templates: true,
    },
  },
];

const TENANTS_LIST_STORAGE_KEY = "smartsarabun_all_tenants_directory";
const ACTIVE_TENANT_ID_KEY = "smartsarabun_active_tenant_id";
const LEGACY_STORAGE_KEY = "smartsarabun_tenant_saas_config";

export function getAllTenants(): TenantSaaSConfig[] {
  if (typeof window === "undefined") return initialSeedTenants;
  try {
    const raw = localStorage.getItem(TENANTS_LIST_STORAGE_KEY);
    if (!raw) {
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        try {
          const parsedLegacy = JSON.parse(legacyRaw);
          const merged = [parsedLegacy, ...initialSeedTenants.slice(1)];
          localStorage.setItem(TENANTS_LIST_STORAGE_KEY, JSON.stringify(merged));
          return merged;
        } catch {}
      }
      localStorage.setItem(TENANTS_LIST_STORAGE_KEY, JSON.stringify(initialSeedTenants));
      return initialSeedTenants;
    }
    const list = JSON.parse(raw);
    return Array.isArray(list) && list.length > 0 ? list : initialSeedTenants;
  } catch (err) {
    console.error("Failed to load tenants list:", err);
    return initialSeedTenants;
  }
}

export function saveAllTenants(tenants: TenantSaaSConfig[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TENANTS_LIST_STORAGE_KEY, JSON.stringify(tenants));
    window.dispatchEvent(new Event("tenant_directory_updated"));
  } catch (err) {
    console.error("Failed to save tenants directory:", err);
  }
}

export function getActiveTenantId(): string {
  if (typeof window === "undefined") return defaultTenantConfig.id;
  try {
    return localStorage.getItem(ACTIVE_TENANT_ID_KEY) || defaultTenantConfig.id;
  } catch {
    return defaultTenantConfig.id;
  }
}

export function setActiveTenant(tenantId: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACTIVE_TENANT_ID_KEY, tenantId);
    const tenant = getTenantById(tenantId);
    if (tenant) {
      localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(tenant));
    }
    window.dispatchEvent(new Event("tenant_config_updated"));
    window.dispatchEvent(new Event("tenant_switched"));
  } catch (err) {
    console.error("Failed to set active tenant:", err);
  }
}

export function getTenantById(id: string): TenantSaaSConfig | null {
  const all = getAllTenants();
  return all.find((t) => t.id === id) || null;
}

export function getTenantSaaSConfig(): TenantSaaSConfig {
  if (typeof window === "undefined") return defaultTenantConfig;
  const activeId = getActiveTenantId();
  const tenant = getTenantById(activeId);
  if (tenant) return tenant;

  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}

  return defaultTenantConfig;
}

export function saveTenantSaaSConfig(config: TenantSaaSConfig): void {
  if (typeof window === "undefined") return;
  try {
    const all = getAllTenants();
    const idx = all.findIndex((t) => t.id === config.id);
    let updatedList: TenantSaaSConfig[];
    if (idx >= 0) {
      updatedList = [...all];
      updatedList[idx] = config;
    } else {
      updatedList = [...all, config];
    }
    saveAllTenants(updatedList);

    if (config.id === getActiveTenantId()) {
      localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(config));
      window.dispatchEvent(new Event("tenant_config_updated"));
    }
  } catch (err) {
    console.error("Failed to save tenant config:", err);
  }
}

export function provisionNewTenant(input: {
  name: string;
  code: string;
  docPrefix: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  slogan?: string;
  licenseTier?: TenantSaaSConfig["licenseTier"];
  maxUsers?: number;
  maxStorageMb?: number;
}): TenantSaaSConfig {
  const newId = `tenant-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date();
  const trialEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const newTenant: TenantSaaSConfig = {
    id: newId,
    name: input.name,
    code: input.code.toUpperCase().trim(),
    docPrefix: input.docPrefix,
    slogan: input.slogan || `บริการด้วยใจ เพื่อประชาชนตำบล${input.name.replace(/(องค์การบริหารส่วนตำบล|เทศบาลตำบล)/, "").trim()}`,
    contactEmail: input.contactEmail,
    contactPhone: input.contactPhone || "053-000000",
    address: input.address || `อำเภอเมือง จังหวัดเชียงราย`,
    licenseTier: input.licenseTier || "TRIAL_30_DAYS",
    licenseStatus: input.licenseTier === "PROFESSIONAL" || input.licenseTier === "ENTERPRISE" ? "ACTIVE" : "TRIAL",
    trialStartDate: now.toISOString(),
    trialExpiresAt: trialEnd.toISOString(),
    contractNo: `SaaS-${input.code}-${new Date().getFullYear() + 543}/001`,
    maxUsers: input.maxUsers || 50,
    maxStorageMb: input.maxStorageMb || 20480,
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

  const all = getAllTenants();
  saveAllTenants([...all, newTenant]);
  return newTenant;
}

export function deleteTenant(tenantId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const all = getAllTenants();
    const filtered = all.filter((t) => t.id !== tenantId);
    saveAllTenants(filtered);
    if (getActiveTenantId() === tenantId && filtered.length > 0) {
      setActiveTenant(filtered[0].id);
    }
    return true;
  } catch (err) {
    console.error("Failed to delete tenant:", err);
    return false;
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

export function exportTenantSovereignData(tenantId: string, docs: any[] = []): void {
  if (typeof window === "undefined") return;
  const tenant = getTenantById(tenantId) || getTenantSaaSConfig();
  const exportPayload = {
    metadata: {
      exportedAt: new Date().toISOString(),
      exportStandard: "TH-E-GOV-SARABUN-ARCHIVE-V1",
      system: "SmartSarabun Cloud Platform (SaaS)",
      tenant: {
        id: tenant.id,
        name: tenant.name,
        code: tenant.code,
        docPrefix: tenant.docPrefix,
        contactEmail: tenant.contactEmail,
        contractNo: tenant.contractNo,
      },
    },
    totalDocuments: docs.length,
    documents: docs,
  };

  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Sovereign_Archive_${tenant.code}_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
