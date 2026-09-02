export interface DepartmentOption {
  id: string;
  name: string;
  code?: string;
  docPrefix?: string;
  isActive?: boolean;
}

const ORG_STORAGE_KEY = "smartsarabun_custom_departments";

export function getActiveDepartments(): DepartmentOption[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORG_STORAGE_KEY);
    if (!raw) return [];
    const depts = JSON.parse(raw);
    if (!Array.isArray(depts)) return [];
    return depts.filter((d: any) => d.isActive !== false);
  } catch (err) {
    console.error("Failed to load active departments:", err);
    return [];
  }
}
