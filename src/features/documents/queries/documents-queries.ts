import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  documentsApi,
  CreateDocumentPayload,
  CreateEndorsementPayload,
} from '../services/documents-api';

export const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...documentKeys.lists(), filters] as const,
  details: () => [...documentKeys.all, 'detail'] as const,
  detail: (id: string) => [...documentKeys.details(), id] as const,
  endorsements: (docId: string) => [...documentKeys.detail(docId), 'endorsements'] as const,
};

export function useDocuments(filters?: Record<string, any>) {
  return useQuery({
    queryKey: documentKeys.list(filters || {}),
    queryFn: () => documentsApi.getDocuments(filters),
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useDocument(id: string) {
  return useQuery({
    queryKey: documentKeys.detail(id),
    queryFn: () => documentsApi.getDocumentById(id),
    enabled: !!id,
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDocumentPayload) => documentsApi.createDocument(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
}

export function useAssignStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, staffName, staffId }: { id: string; staffName: string; staffId?: string }) =>
      documentsApi.assignStaff(id, staffName, staffId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: documentKeys.detail(variables.id) });
    },
  });
}

export function useAddEndorsement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ docId, payload }: { docId: string; payload: CreateEndorsementPayload }) =>
      documentsApi.addEndorsement(docId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: documentKeys.detail(variables.docId) });
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
}
