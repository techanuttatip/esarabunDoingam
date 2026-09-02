import { apiClient } from '@/lib/api-client/client';

export interface DocumentDto {
  id: string;
  docNo: string;
  regNo?: string | null;
  regDate?: string | null;
  regTime?: string | null;
  docDate: string;
  fromOrg: string;
  toOrg: string;
  title: string;
  content?: string | null;
  docType: string;
  speed: string;
  secret: string;
  direction: 'incoming' | 'outgoing';
  targetDept?: string | null;
  targetDeptId?: string | null;
  assignedStaffId?: string | null;
  assignedStaffName?: string | null;
  status: string;
  bookRegister?: string | null;
  attachmentCount: number;
  endorsements?: EndorsementDto[];
  createdAt: string;
  updatedAt: string;
}

export interface EndorsementDto {
  id: string;
  documentId: string;
  actorUserId?: string | null;
  actorName: string;
  actorPosition: string;
  tier: string;
  action?: string | null;
  note: string;
  signatureUrl?: string | null;
  endorsedAt: string;
  orderIndex: number;
}

export interface CreateDocumentPayload {
  docNo: string;
  regNo?: string;
  regDate?: string;
  regTime?: string;
  docDate: string;
  fromOrg: string;
  toOrg: string;
  title: string;
  content?: string;
  docType: string;
  speed?: string;
  secret?: string;
  direction: 'incoming' | 'outgoing';
  targetDept?: string;
  assignedStaffName?: string;
  bookRegister?: string;
}

export interface CreateEndorsementPayload {
  note: string;
  tier: string;
  action?: string;
  signatureUrl?: string;
}

export const documentsApi = {
  getDocuments: async (params?: Record<string, any>): Promise<{ items: DocumentDto[]; total: number }> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== 'all' && val !== 'ALL' && val !== '') {
          query.append(key, String(val));
        }
      });
    }
    const endpoint = `/v1/documents${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await apiClient.get<any>(endpoint);
    return res.data || res;
  },

  getDocumentById: async (id: string): Promise<DocumentDto> => {
    const res = await apiClient.get<any>(`/v1/documents/${id}`);
    return res.data || res;
  },

  createDocument: async (payload: CreateDocumentPayload): Promise<DocumentDto> => {
    const res = await apiClient.post<any>('/v1/documents', payload);
    return res.data || res;
  },

  updateDocument: async (id: string, payload: Partial<CreateDocumentPayload>): Promise<DocumentDto> => {
    const res = await apiClient.patch<any>(`/v1/documents/${id}`, payload);
    return res.data || res;
  },

  assignStaff: async (id: string, assignedStaffName: string, assignedStaffId?: string): Promise<DocumentDto> => {
    const res = await apiClient.patch<any>(`/v1/documents/${id}/assign`, {
      assignedStaffName,
      assignedStaffId,
    });
    return res.data || res;
  },

  addEndorsement: async (documentId: string, payload: CreateEndorsementPayload): Promise<EndorsementDto> => {
    const res = await apiClient.post<any>(`/v1/documents/${documentId}/endorsements`, payload);
    return res.data || res;
  },

  getEndorsements: async (documentId: string): Promise<EndorsementDto[]> => {
    const res = await apiClient.get<any>(`/v1/documents/${documentId}/endorsements`);
    return res.data || res;
  },

  getNextNumber: async (bookRegister: string, prefix?: string): Promise<{ number: number; formattedNumber: string; fullDocNo: string }> => {
    const res = await apiClient.post<any>('/v1/numbering/next', { bookRegister, prefix });
    return res.data || res;
  },
};
