import { DocumentData } from "@/components/documents/document-viewer-workspace";

export interface StoredTimelineItem {
  action: string;
  time: string;
  actor: string;
  note: string;
}

export interface StoredDocument extends Omit<DocumentData, "docType"> {
  docType: any;
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

export function getAllDocuments(): StoredDocument[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DOCS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to load documents:", err);
    return [];
  }
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
    const docs = getAllDocuments();
    const id = doc.id || `doc-${Date.now()}`;
    const now = new Date().toISOString();
    const newDoc: StoredDocument = {
      id,
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

    const existingIndex = docs.findIndex((d) => d.id === id);
    let updatedList: StoredDocument[];
    if (existingIndex >= 0) {
      updatedList = [...docs];
      updatedList[existingIndex] = { ...docs[existingIndex], ...newDoc, updatedAt: now };
    } else {
      updatedList = [newDoc, ...docs];
    }

    localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(updatedList));
    window.dispatchEvent(new CustomEvent("smartsarabun_documents_updated"));
    return newDoc;
  } catch (err) {
    console.error("Failed to save document:", err);
    return doc as StoredDocument;
  }
}

export function updateDocument(id: string, updates: Partial<StoredDocument>): StoredDocument | null {
  if (typeof window === "undefined" || !id) return null;
  try {
    const docs = getAllDocuments();
    const idx = docs.findIndex((d) => d.id === id);
    if (idx < 0) return null;

    const updated: StoredDocument = {
      ...docs[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    docs[idx] = updated;
    localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(docs));
    window.dispatchEvent(new CustomEvent("smartsarabun_documents_updated"));
    return updated;
  } catch (err) {
    console.error("Failed to update document:", err);
    return null;
  }
}

export function deleteDocument(id: string): boolean {
  if (typeof window === "undefined" || !id) return false;
  try {
    const docs = getAllDocuments();
    const filtered = docs.filter((d) => d.id !== id);
    localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent("smartsarabun_documents_updated"));
    return true;
  } catch (err) {
    console.error("Failed to delete document:", err);
    return false;
  }
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
