import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from './api';
import type { Kind } from './data';
import type { Offer, Need, Seva } from '@/lib/supabase/types';

// Query Keys
export const queryKeys = {
  entries: ['entries'] as const,
  offers: ['offers'] as const,
  needs: ['needs'] as const,
  sevas: ['sevas'] as const,
  institutions: ['institutions'] as const,
  participants: (userId?: string) => ['participants', userId] as const,
  bookmarks: (userId?: string) => ['bookmarks', userId] as const,
  reflections: (userId?: string) => ['reflections', userId] as const,
  messages: (chatId: string) => ['messages', chatId] as const,
  notifications: ['notifications'] as const,
  auditLogs: ['auditLogs'] as const,
};

// 1. Unified Entries Query (used across discovery and home)
export function useUnifiedEntries() {
  return useQuery({
    queryKey: queryKeys.entries,
    queryFn: () => api.fetchAllUnifiedEntries(),
  });
}

// 2. Offers Queries & Mutations
export function useOffers() {
  return useQuery({
    queryKey: queryKeys.offers,
    queryFn: () => api.fetchOffers(),
  });
}

export function useCreateOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (offer: Omit<Offer, 'id' | 'created_at' | 'updated_at'>) => api.createOffer(offer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.offers });
      queryClient.invalidateQueries({ queryKey: queryKeys.entries });
    },
  });
}

export function useUpdateOfferStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'paused' | 'closed' }) =>
      api.updateOfferStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.offers });
      queryClient.invalidateQueries({ queryKey: queryKeys.entries });
    },
  });
}

export function useDeleteOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.offers });
      queryClient.invalidateQueries({ queryKey: queryKeys.entries });
    },
  });
}

// 3. Needs Queries & Mutations
export function useNeeds() {
  return useQuery({
    queryKey: queryKeys.needs,
    queryFn: () => api.fetchNeeds(),
  });
}

export function useCreateNeed() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (need: Omit<Need, 'id' | 'created_at' | 'updated_at'>) => api.createNeed(need),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.needs });
      queryClient.invalidateQueries({ queryKey: queryKeys.entries });
    },
  });
}

export function useUpdateNeedStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Need['status'] }) =>
      api.updateNeedStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.needs });
      queryClient.invalidateQueries({ queryKey: queryKeys.entries });
    },
  });
}

// 4. Sevas Queries & Mutations
export function useSevas() {
  return useQuery({
    queryKey: queryKeys.sevas,
    queryFn: () => api.fetchSevas(),
  });
}

export function useCreateSeva() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (seva: Omit<Seva, 'id' | 'created_at' | 'updated_at'>) => api.createSeva(seva),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sevas });
      queryClient.invalidateQueries({ queryKey: queryKeys.entries });
    },
  });
}

// 5. Sankalp Participation (Join / Leave)
export function useParticipants(userId?: string) {
  return useQuery({
    queryKey: queryKeys.participants(userId),
    queryFn: () => api.fetchParticipants(userId),
  });
}

export function useToggleSankalp(userId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sevaId, role, isAnonymous }: { sevaId: string; role?: string; isAnonymous?: boolean }) =>
      api.toggleSankalp(sevaId, role, isAnonymous, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.participants(userId) });
    },
  });
}

// 6. Bookmarks Queries & Mutations
export function useBookmarks(userId?: string) {
  return useQuery({
    queryKey: queryKeys.bookmarks(userId),
    queryFn: () => api.fetchBookmarks(userId),
  });
}

export function useToggleBookmark(userId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ targetId, targetType }: { targetId: string; targetType?: 'seva' | 'needs' | 'offers' | 'institutions' }) =>
      api.toggleBookmark(targetId, targetType, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookmarks(userId) });
    },
  });
}

// 7. Reflections (Strictly Private - Offer & Release)
export function useReflections(userId?: string) {
  return useQuery({
    queryKey: queryKeys.reflections(userId),
    queryFn: () => api.fetchReflections(userId),
  });
}

export function useSaveReflection(userId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sevaId, content, isReleased }: { sevaId: string; content: string; isReleased?: boolean }) =>
      api.saveReflection(sevaId, content, isReleased, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reflections(userId) });
    },
  });
}

// 8. Conversations & Chat Messages
export function useConversations() {
  return useQuery({
    queryKey: ['conversations'] as const,
    queryFn: () => api.fetchConversations(),
  });
}

export function useChatMessages(conversationId: string) {
  return useQuery({
    queryKey: queryKeys.messages(conversationId),
    queryFn: () => api.fetchMessages(conversationId),
    enabled: Boolean(conversationId),
  });
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (message: { text: string; sender: string; reply?: string; senderId?: string }) =>
      api.sendMessage(conversationId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages(conversationId) });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

// 9. Notifications
export function useNotifications(userId?: string) {
  return useQuery({
    queryKey: ['notifications', userId] as const,
    queryFn: () => api.fetchNotifications(userId),
    enabled: Boolean(userId),
  });
}

export function useMarkNotificationRead(userId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    },
  });
}

export function useMarkAllNotificationsRead(userId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.markAllNotificationsRead(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    },
  });
}

// 10. Reports
export function useReports() {
  return useQuery({
    queryKey: ['reports'] as const,
    queryFn: () => api.fetchReports(),
  });
}

// 11. Admin Users
export function useUsersForAdmin() {
  return useQuery({
    queryKey: ['admin-users'] as const,
    queryFn: () => api.fetchUsersForAdmin(),
  });
}

// 12. Audit Logs
export function useAuditLogs() {
  return useQuery({
    queryKey: queryKeys.auditLogs,
    queryFn: () => api.fetchAuditLogs(),
  });
}

export function useRecordAuditAction(userId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ action, notes }: { action: string; notes?: string }) =>
      api.recordAuditAction(action, notes, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auditLogs });
    },
  });
}

export function useVerifyEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, kind }: { id: string; kind: string }) => api.verifyEntry(id, kind),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.entries });
      queryClient.invalidateQueries({ queryKey: queryKeys.offers });
      queryClient.invalidateQueries({ queryKey: queryKeys.needs });
      queryClient.invalidateQueries({ queryKey: queryKeys.sevas });
      queryClient.invalidateQueries({ queryKey: queryKeys.institutions });
    },
  });
}
