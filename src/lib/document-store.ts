import { DocumentData } from "@/components/documents/document-viewer-workspace";
import { savePdfToIndexedDB } from "@/lib/pdf-storage";
import { cloudDocumentService } from "@/lib/supabase/document-service";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getActiveTenantId, getTenantById, defaultTenantConfig } from "@/config/tenant-config";

export interface StoredTimelineItem {
  action: string;
  time: string;
  actor: string;
  note: string;
}

export interface StoredDocument extends Omit<DocumentData, "docType"> {
  docType: any;
  tenantId?: string;
  direction?: "incoming" | "outgoing";
  status?: string;
  senderDept?: string;
  senderName?: string;
  createdAt?: string;
  updatedAt?: string;
  pdfBase64?: string;
  pdfName?: string;
  timeline?: StoredTimelineItem[];
  dueDate?: string;
  dispatchChannel?: string;
  trackingNo?: string;
  [key: string]: any;
}

const DOCS_STORAGE_KEY = "smartsarabun_all_documents";

export function getRawAllDocuments(): StoredDocument[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DOCS_STORAGE_KEY);
    if (!raw) return [];
    const all = JSON.parse(raw);
    return Array.isArray(all) ? all : [];
  } catch (err) {
    console.error("Failed to load raw documents:", err);
    return [];
  }
}

export function saveRawAllDocuments(docs: StoredDocument[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(docs));
  } catch (quotaErr) {
    console.warn("LocalStorage quota warning: stripping heavy base64 to save metadata", quotaErr);
    const lightList = docs.map((d) => ({
      ...d,
      pdfBase64: undefined,
    }));
    localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(lightList));
  }
}

export function getAllDocuments(filterByActiveTenant: boolean = true): StoredDocument[] {
  const all = getRawAllDocuments();
  if (!filterByActiveTenant) return all;
  const activeTenantId = getActiveTenantId();
  return all.filter((d) => (d.tenantId || defaultTenantConfig.id) === activeTenantId);
}

// Seamless Cloud Synchronizer (Option B)
export async function syncCloudDocuments(): Promise<StoredDocument[]> {
  if (typeof window === "undefined" || !isSupabaseConfigured()) {
    return getAllDocuments();
  }

  try {
    const cloudDocs = await cloudDocumentService.getAll();
    if (cloudDocs && cloudDocs.length > 0) {
      localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(cloudDocs));
      window.dispatchEvent(new CustomEvent("smartsarabun_documents_updated"));
      return cloudDocs;
    }
  } catch (err) {
    console.warn("Cloud sync deferred:", err);
  }

  return getAllDocuments();
}

export function getIncomingDocuments(): StoredDocument[] {
  return getAllDocuments().filter((d) => d.direction === "incoming" || (!d.direction && !!d.regNo));
}

export function getOutgoingDocuments(): StoredDocument[] {
  return getAllDocuments().filter((d) => d.direction === "outgoing");
}

export function getDocumentById(id: string): StoredDocument | null {
  const docs = getAllDocuments();
  return docs.find((d) => d.id === id) || null;
}

export function saveDocument(doc: Partial<StoredDocument>): StoredDocument {
  if (typeof window === "undefined") return doc as StoredDocument;
  try {
    const docs = getRawAllDocuments();
    const id = doc.id || `doc-${Date.now()}`;
    const now = new Date().toISOString();
    const activeTenantId = getActiveTenantId();
    const newDoc: StoredDocument = {
      id,
      tenantId: doc.tenantId || activeTenantId,
      docNo: doc.docNo || "เลขที่รอดำเนินการ",
      regNo: doc.regNo,
      regDate: doc.regDate,
      regTime: doc.regTime,
      docDate: doc.docDate || new Date().toLocaleDateString("th-TH"),
      from: doc.from || (doc as any).fromOrg || "",
      to: doc.to || (doc as any).toOrg || "",
      title: doc.title || "",
      docType: doc.docType || "หนังสือภายนอก",
      speed: doc.speed || "ปกติ",
      secret: doc.secret || "ปกติ",
      targetDept: doc.targetDept,
      targetSection: (doc as any).targetSection,
      senderDept: doc.senderDept,
      senderName: doc.senderName,
      direction: doc.direction || (doc.regNo ? "incoming" : "outgoing"),
      status: doc.status || "registered",
      contentParagraphs: doc.contentParagraphs || ((doc as any).content ? [(doc as any).content] : []),
      endorsements: doc.endorsements || [],
      timeline: doc.timeline || [
        {
          action: doc.direction === "outgoing" ? "สร้างและออกเลขหนังสือส่ง" : "ลงรับหนังสือเข้า",
          time: new Date().toLocaleDateString("th-TH") + " " + new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) + " น.",
          actor: doc.senderName || "งานสารบรรณ",
          note: "นำเข้าสู่ระบบเรียบร้อย",
        },
      ],
      pdfUrl: doc.pdfUrl,
      pdfBase64: doc.pdfBase64,
      pdfName: doc.pdfName,
      deptRegNo: doc.deptRegNo,
      deptRegDate: doc.deptRegDate,
      deptRegTime: doc.deptRegTime,
      dueDate: doc.dueDate,
      dispatchChannel: doc.dispatchChannel,
      trackingNo: doc.trackingNo,
      createdAt: doc.createdAt || now,
      updatedAt: now,
    };

    // Save large PDF binary to IndexedDB in background
    if (newDoc.pdfBase64) {
      savePdfToIndexedDB(id, newDoc.pdfBase64, newDoc.pdfName || "document.pdf").catch(() => {});
    }

    const existingIndex = docs.findIndex((d) => d.id === id);
    let updatedList: StoredDocument[];
    if (existingIndex >= 0) {
      updatedList = [...docs];
      updatedList[existingIndex] = { ...docs[existingIndex], ...newDoc, updatedAt: now };
    } else {
      updatedList = [newDoc, ...docs];
    }

    saveRawAllDocuments(updatedList);
    window.dispatchEvent(new CustomEvent("smartsarabun_documents_updated"));

    // Sync with Supabase Cloud in background
    if (isSupabaseConfigured()) {
      cloudDocumentService.upsert(newDoc).catch(() => {});
    }

    return newDoc;
  } catch (err) {
    console.error("Failed to save document:", err);
    return doc as StoredDocument;
  }
}

export function updateDocument(id: string, updates: Partial<StoredDocument>): StoredDocument | null {
  if (typeof window === "undefined" || !id) return null;
  try {
    const docs = getRawAllDocuments();
    const idx = docs.findIndex((d) => d.id === id);
    if (idx < 0) return null;

    if (updates.pdfBase64) {
      savePdfToIndexedDB(id, updates.pdfBase64, updates.pdfName || "document.pdf").catch(() => {});
    }

    const updated: StoredDocument = {
      ...docs[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    docs[idx] = updated;

    saveRawAllDocuments(docs);
    window.dispatchEvent(new CustomEvent("smartsarabun_documents_updated"));

    // Sync with Supabase Cloud in background
    if (isSupabaseConfigured()) {
      cloudDocumentService.upsert(updated).catch(() => {});
    }

    return updated;
  } catch (err) {
    console.error("Failed to update document:", err);
    return null;
  }
}

export function deleteDocument(id: string): boolean {
  if (typeof window === "undefined" || !id) return false;
  try {
    const docs = getRawAllDocuments();
    const filtered = docs.filter((d) => d.id !== id);
    saveRawAllDocuments(filtered);
    window.dispatchEvent(new CustomEvent("smartsarabun_documents_updated"));

    // Sync deletion with Supabase Cloud in background
    if (isSupabaseConfigured()) {
      cloudDocumentService.delete(id).catch(() => {});
    }

    return true;
  } catch (err) {
    console.error("Failed to delete document:", err);
    return false;
  }
}

// Cross-Tenant Inter-Agency Document Dispatcher
export function dispatchCrossTenantDocument(
  sourceDoc: StoredDocument,
  targetTenantId: string,
  dispatchNote?: string
): StoredDocument | null {
  if (typeof window === "undefined") return null;
  const targetTenant = getTenantById(targetTenantId);
  const senderTenant = getTenantById(sourceDoc.tenantId || getActiveTenantId()) || defaultTenantConfig;
  if (!targetTenant) return null;

  const now = new Date();
  const regTime = now.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) + " น.";
  const regDate = now.toLocaleDateString("th-TH");
  
  // Calculate next incoming registry number for target tenant
  const targetDocs = getRawAllDocuments().filter((d) => (d.tenantId || defaultTenantConfig.id) === targetTenantId);
  const nextRegNo = `${targetDocs.length + 101}/${now.getFullYear() + 543}`;

  const incomingDoc: StoredDocument = {
    ...sourceDoc,
    id: `doc-in-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    tenantId: targetTenantId,
    direction: "incoming",
    status: "registered",
    from: senderTenant.name,
    to: targetTenant.name,
    regNo: nextRegNo,
    regDate: regDate,
    regTime: regTime,
    timeline: [
      {
        action: "รับหนังสืออิเล็กทรอนิกส์ข้าม อปท. (SaaS Inter-Agency Network)",
        time: `${regDate} ${regTime}`,
        actor: `เครือข่ายสารบรรณกลางดิจิทัล (${senderTenant.code} ➔ ${targetTenant.code})`,
        note: dispatchNote || `รับส่งตรงผ่านคลาวด์สารบรรณภาครัฐ จาก ${senderTenant.name} เลขที่หนังสือ ${sourceDoc.docNo}`,
      },
    ],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  const raw = getRawAllDocuments();
  saveRawAllDocuments([incomingDoc, ...raw]);
  window.dispatchEvent(new CustomEvent("smartsarabun_documents_updated"));
  return incomingDoc;
}

export function getDocumentStats() {
  const docs = getAllDocuments();
  const incoming = docs.filter((d) => d.direction === "incoming");
  const outgoing = docs.filter((d) => d.direction === "outgoing");
  const pending = docs.filter((d) => d.status !== "completed" && d.status !== "sent");
  const completed = docs.filter((d) => d.status === "completed" || d.status === "sent");

  return {
    totalDocs: docs.length,
    incomingToday: incoming.length,
    outgoingToday: outgoing.length,
    pendingCount: pending.length,
    completedCount: completed.length,
    overdueCount: 0,
    slaRate: docs.length > 0 ? "100%" : "100%",
  };
}
