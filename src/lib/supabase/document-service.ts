import { getSupabaseClient, isSupabaseConfigured } from "./client";
import { StoredDocument } from "@/lib/document-store";

export interface CloudDocumentRecord {
  id: string;
  doc_no: string;
  reg_no?: string | null;
  reg_date?: string | null;
  reg_time?: string | null;
  doc_date: string;
  from_org: string;
  to_org: string;
  title: string;
  content?: string | null;
  doc_type: string;
  speed: string;
  secret: string;
  direction: string;
  target_dept?: string | null;
  sender_dept?: string | null;
  sender_name?: string | null;
  status: string;
  book_register?: string | null;
  attachment_count: number;
  pdf_url?: string | null;
  pdf_name?: string | null;
  created_at: string;
  updated_at: string;
  endorsements?: any[];
  timeline?: any[];
}

// Convert StoredDocument from frontend model to DB schema
export function toCloudRecord(doc: StoredDocument): Partial<CloudDocumentRecord> {
  return {
    id: doc.id,
    doc_no: doc.docNo || "เลขที่รอดำเนินการ",
    reg_no: doc.regNo || null,
    reg_date: doc.regDate || null,
    reg_time: doc.regTime || null,
    doc_date: doc.docDate || new Date().toISOString(),
    from_org: doc.from || "",
    to_org: doc.to || "",
    title: doc.title || "",
    content: doc.contentParagraphs ? doc.contentParagraphs.join("\n\n") : null,
    doc_type: doc.docType || "หนังสือภายนอก",
    speed: doc.speed || "ปกติ",
    secret: doc.secret || "ปกติ",
    direction: doc.direction || (doc.regNo ? "incoming" : "outgoing"),
    target_dept: doc.targetDept || null,
    sender_dept: doc.senderDept || null,
    sender_name: doc.senderName || null,
    status: doc.status || "registered",
    book_register: doc.bookRegister || null,
    attachment_count: doc.attachmentCount || 0,
    pdf_url: doc.pdfUrl || null,
    pdf_name: doc.pdfName || null,
    timeline: doc.timeline || [],
    endorsements: doc.endorsements || [],
    created_at: doc.createdAt || new Date().toISOString(),
    updated_at: doc.updatedAt || new Date().toISOString(),
  };
}

// Convert DB schema back to StoredDocument
export function toStoredDocument(record: any): StoredDocument {
  return {
    id: record.id,
    docNo: record.doc_no,
    regNo: record.reg_no,
    regDate: record.reg_date,
    regTime: record.reg_time,
    docDate: record.doc_date,
    from: record.from_org,
    to: record.to_org,
    title: record.title,
    contentParagraphs: record.content ? record.content.split("\n\n") : [],
    docType: record.doc_type,
    speed: record.speed,
    secret: record.secret,
    direction: record.direction,
    targetDept: record.target_dept,
    senderDept: record.sender_dept,
    senderName: record.sender_name,
    status: record.status,
    bookRegister: record.book_register,
    attachmentCount: record.attachment_count,
    pdfUrl: record.pdf_url,
    pdfName: record.pdf_name,
    timeline: record.timeline || [],
    endorsements: record.endorsements || [],
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

export const cloudDocumentService = {
  // 1. Fetch all documents from Supabase Cloud
  async getAll(): Promise<StoredDocument[] | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Supabase fetch error:", error.message);
        return null;
      }

      return (data || []).map(toStoredDocument);
    } catch (err) {
      console.warn("Failed to connect to Supabase Cloud:", err);
      return null;
    }
  },

  // 2. Save/Upsert document to Supabase Cloud
  async upsert(doc: StoredDocument): Promise<StoredDocument | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    try {
      const payload = toCloudRecord(doc);
      const { data, error } = await supabase
        .from("documents")
        .upsert(payload, { onConflict: "id" })
        .select()
        .single();

      if (error) {
        console.warn("Supabase upsert error:", error.message);
        return null;
      }

      return data ? toStoredDocument(data) : doc;
    } catch (err) {
      console.warn("Failed to save to Supabase Cloud:", err);
      return null;
    }
  },

  // 3. Delete document from Supabase Cloud
  async delete(id: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    try {
      const { error } = await supabase.from("documents").delete().eq("id", id);
      return !error;
    } catch {
      return false;
    }
  },

  // 4. Upload PDF file to Supabase Storage
  async uploadPdf(docId: string, file: File): Promise<string | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    try {
      const fileName = `${docId}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const filePath = `documents/${new Date().getFullYear()}/${fileName}`;

      const { error } = await supabase.storage
        .from("sarabun-documents")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        console.warn("Supabase Storage upload error:", error.message);
        return null;
      }

      const { data } = supabase.storage.from("sarabun-documents").getPublicUrl(filePath);
      return data?.publicUrl || null;
    } catch (err) {
      console.warn("Failed to upload PDF to Supabase Storage:", err);
      return null;
    }
  },
};
