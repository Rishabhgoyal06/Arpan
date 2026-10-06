import { supabase, isLiveSupabaseConfigured } from '@/lib/supabase/client';
import type {
  Offer,
  Need,
  Seva,
  SevaParticipant,
  Institution,
  InstitutionWishlist,
  InstitutionSupport,
  Conversation,
  Message as DbMessage,
  Reflection,
  Bookmark,
  Notification,
  Report,
  VerificationRecord,
  AuditLog,
} from '@/lib/supabase/types';
import type { Entry, Kind } from './data';

// =========================================================================
// OFFERS API (CREATE, READ, UPDATE, DELETE, STATUS)
// =========================================================================

export async function fetchOffers(): Promise<Offer[]> {
  if (!isLiveSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as Offer[];
}

export async function createOffer(offer: Omit<Offer, 'id' | 'created_at' | 'updated_at'>): Promise<Offer | null> {
  if (!isLiveSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('offers')
    .insert(offer)
    .select()
    .single();
  if (error || !data) throw error || new Error('Failed to create offer');
  return data as Offer;
}

export async function updateOfferStatus(id: string, status: 'active' | 'paused' | 'closed'): Promise<void> {
  if (!isLiveSupabaseConfigured) return;
  const { error } = await supabase
    .from('offers')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteOffer(id: string): Promise<void> {
  if (!isLiveSupabaseConfigured) return;
  const { error } = await supabase.from('offers').delete().eq('id', id);
  if (error) throw error;
}

// =========================================================================
// NEEDS API (CREATE, READ, UPDATE, STATUS, VERIFICATION)
// =========================================================================

export async function fetchNeeds(): Promise<Need[]> {
  if (!isLiveSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('needs')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as Need[];
}

export async function createNeed(need: Omit<Need, 'id' | 'created_at' | 'updated_at'>): Promise<Need | null> {
  if (!isLiveSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('needs')
    .insert(need)
    .select()
    .single();
  if (error || !data) throw error || new Error('Failed to create need');
  return data as Need;
}

export async function updateNeedStatus(id: string, status: Need['status']): Promise<void> {
  if (!isLiveSupabaseConfigured) return;
  const { error } = await supabase
    .from('needs')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

// =========================================================================
// SEVAS & SANKALP PARTICIPATION API
// =========================================================================

export async function fetchSevas(): Promise<Seva[]> {
  if (!isLiveSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('sevas')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as Seva[];
}

export async function createSeva(seva: Omit<Seva, 'id' | 'created_at' | 'updated_at'>): Promise<Seva | null> {
  if (!isLiveSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('sevas')
    .insert(seva)
    .select()
    .single();
  if (error || !data) throw error || new Error('Failed to create seva');
  return data as Seva;
}

export async function fetchParticipants(userId?: string): Promise<string[]> {
  if (!isLiveSupabaseConfigured || !userId) return [];
  const { data, error } = await supabase
    .from('seva_participants')
    .select('seva_id')
    .eq('user_id', userId);
  if (error || !data) return [];
  return data.map((p) => p.seva_id);
}

export async function fetchSevaParticipantCount(sevaId: string): Promise<number> {
  if (!isLiveSupabaseConfigured) return 0;
  const { count, error } = await supabase
    .from('seva_participants')
    .select('id', { count: 'exact', head: true })
    .eq('seva_id', sevaId);
  if (error || count === null) return 0;
  return count;
}

export async function toggleSankalp(
  sevaId: string,
  role = 'Hands-on support',
  isAnonymous = false,
  userId?: string
): Promise<string[]> {
  if (!isLiveSupabaseConfigured || !userId) return [];

  // Check if user already joined
  const { data: existing } = await supabase
    .from('seva_participants')
    .select('id')
    .eq('seva_id', sevaId)
    .eq('user_id', userId)
    .maybeSingle();

  if (existing) {
    // Leave Seva
    await supabase
      .from('seva_participants')
      .delete()
      .eq('seva_id', sevaId)
      .eq('user_id', userId);
  } else {
    // Join Seva (Take Sankalp)
    await supabase.from('seva_participants').insert({
      seva_id: sevaId,
      user_id: userId,
      role_selected: role,
      is_anonymous: isAnonymous,
    });
  }

  return fetchParticipants(userId);
}

// =========================================================================
// INSTITUTIONS & COMMUNITY SUPPORT API
// =========================================================================

export async function fetchInstitutions(): Promise<Institution[]> {
  if (!isLiveSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('institutions')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as Institution[];
}

export async function fetchInstitutionWishlist(institutionId: string): Promise<InstitutionWishlist[]> {
  if (!isLiveSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('institution_wishlists')
    .select('*')
    .eq('institution_id', institutionId)
    .order('created_at', { ascending: true });
  if (error || !data) return [];
  return data as InstitutionWishlist[];
}

export async function submitInstitutionSupport(support: {
  institution_id: string;
  support_type: string;
  details?: string;
  demo_amount?: number;
  is_anonymous?: boolean;
  user_id?: string;
}): Promise<void> {
  if (!isLiveSupabaseConfigured) return;
  const { error } = await supabase.from('institution_support').insert(support);
  if (error) throw error;
}

// =========================================================================
// REFLECTIONS API (STRICTLY PRIVATE - OFFER & RELEASE)
// =========================================================================

export async function fetchReflections(userId?: string): Promise<Record<string, string>> {
  if (!isLiveSupabaseConfigured || !userId) return {};
  const { data, error } = await supabase
    .from('reflections')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) return {};
  const map: Record<string, string> = {};
  for (const r of data) {
    if (r.seva_id) {
      map[r.seva_id] = r.content;
    } else {
      map[r.id] = r.content;
    }
  }
  return map;
}

export async function saveReflection(
  sevaId: string,
  content: string,
  isReleased = false,
  userId?: string
): Promise<void> {
  if (!isLiveSupabaseConfigured || !userId) return;

  // Check if a reflection already exists for this seva/user
  const { data: existing } = await supabase
    .from('reflections')
    .select('id')
    .eq('user_id', userId)
    .eq('seva_id', sevaId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('reflections')
      .update({
        content,
        is_released: isReleased,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('reflections').insert({
      user_id: userId,
      seva_id: sevaId,
      content,
      is_released: isReleased,
    });
    if (error) throw error;
  }
}

// =========================================================================
// BOOKMARKS API
// =========================================================================

export async function fetchBookmarks(userId?: string): Promise<string[]> {
  if (!isLiveSupabaseConfigured || !userId) return [];
  const { data, error } = await supabase
    .from('bookmarks')
    .select('target_id')
    .eq('user_id', userId);
  if (error || !data) return [];
  return data.map((b) => b.target_id);
}

export async function toggleBookmark(
  targetId: string,
  targetType: Bookmark['target_type'] = 'seva',
  userId?: string
): Promise<string[]> {
  if (!isLiveSupabaseConfigured || !userId) return [];
  const current = await fetchBookmarks(userId);
  const exists = current.includes(targetId);

  if (exists) {
    await supabase
      .from('bookmarks')
      .delete()
      .eq('target_id', targetId)
      .eq('user_id', userId);
  } else {
    await supabase.from('bookmarks').insert({
      target_id: targetId,
      target_type: targetType,
      user_id: userId,
    });
  }

  return fetchBookmarks(userId);
}

// =========================================================================
// CHAT & MESSAGES API (REALTIME SAFE)
// =========================================================================

export type ChatMessage = {
  id?: string;
  text: string;
  sender: string;
  senderId?: string;
  time: string;
  reply?: string;
};

export type ConversationSummary = {
  id: string;
  title: string;
  subtitle?: string;
  initials: string;
  preview: string;
  context_type: string;
  context_id?: string;
};

export async function fetchConversations(): Promise<ConversationSummary[]> {
  if (!isLiveSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((c: any) => ({
    id: c.id,
    title: c.title,
    subtitle: `${c.context_type.charAt(0).toUpperCase() + c.context_type.slice(1)} circle`,
    initials: c.title.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase(),
    preview: 'Open circle to connect with community members.',
    context_type: c.context_type,
    context_id: c.context_id,
  }));
}

export async function fetchMessages(conversationId: string): Promise<ChatMessage[]> {
  if (!isLiveSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error || !data) return [];

  return data.map((m: any) => ({
    id: m.id,
    text: m.content,
    sender: m.sender_name || 'Community Member',
    senderId: m.sender_id,
    time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    reply: m.reply_to_content || undefined,
  }));
}

export async function sendMessage(
  conversationId: string,
  message: { text: string; sender: string; reply?: string; senderId?: string }
): Promise<void> {
  if (!isLiveSupabaseConfigured) return;
  const { error } = await supabase.from('messages').insert({
    conversation_id: conversationId,
    sender_name: message.sender,
    sender_id: message.senderId || null,
    content: message.text,
    reply_to_content: message.reply || null,
  });
  if (error) throw error;
}

// =========================================================================
// NOTIFICATIONS API
// =========================================================================

export async function fetchNotifications(userId?: string): Promise<Notification[]> {
  if (!isLiveSupabaseConfigured || !userId) return [];
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data as Notification[];
}

export async function markNotificationRead(id: string): Promise<void> {
  if (!isLiveSupabaseConfigured) return;
  await supabase.from('notifications').update({ is_read: true }).eq('id', id);
}

export async function markAllNotificationsRead(userId?: string): Promise<void> {
  if (!isLiveSupabaseConfigured || !userId) return;
  await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId);
}

// =========================================================================
// REPORTS & MODERATION (SAFETY & AUDIT)
// =========================================================================

export async function fetchReports(): Promise<Report[]> {
  if (!isLiveSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as Report[];
}

export async function submitReport(report: {
  target_type: Report['target_type'];
  target_id?: string;
  reason: string;
  details?: string;
  reporter_id?: string;
}): Promise<void> {
  if (!isLiveSupabaseConfigured) return;
  const { error } = await supabase.from('reports').insert({
    ...report,
    status: 'pending',
  });
  if (error) throw error;
}

export async function updateReportStatus(reportId: string, status: 'reviewed' | 'resolved'): Promise<void> {
  if (!isLiveSupabaseConfigured) return;
  const { error } = await supabase.from('reports').update({ status }).eq('id', reportId);
  if (error) throw error;
}

export async function recordAuditAction(action: string, notes?: string, userId?: string): Promise<void> {
  if (!isLiveSupabaseConfigured) return;
  await supabase.from('audit_logs').insert({
    action,
    user_id: userId || null,
    metadata: { notes: notes ?? '' },
  });
}

export async function fetchAuditLogs(): Promise<AuditLog[]> {
  if (!isLiveSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as AuditLog[];
}

export async function fetchUsersForAdmin(): Promise<any[]> {
  if (!isLiveSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, location, is_admin, created_at')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data;
}

export async function fetchProfile(userId: string): Promise<any> {
  if (!isLiveSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error || !data) return null;
  return data;
}

// =========================================================================
// UNIFIED ENTRY MAPPER (ADAPTER FOR REAL DATABASE ROWS)
// =========================================================================

export async function fetchAllUnifiedEntries(): Promise<Entry[]> {
  const [offers, needs, sevas, institutions] = await Promise.all([
    fetchOffers(),
    fetchNeeds(),
    fetchSevas(),
    fetchInstitutions(),
  ]);

  const offerEntries: Entry[] = offers.map((o) => ({
    id: o.id,
    kind: 'offers',
    title: o.title,
    context: o.story,
    category: o.offer_type,
    location: o.location,
    date: o.date || 'Flexible',
    time: o.time || 'Flexible',
    duration: o.duration || 'Flexible',
    organizer: o.privacy === 'Anonymous' ? 'Anonymous Seva Partner' : 'Community Member',
    spaces: 1,
    recurring: false,
    verified: o.verified,
    privacy: o.privacy,
    help: o.help_details || 'Offering time and care with humility.',
  }));

  const needEntries: Entry[] = needs.map((n) => ({
    id: n.id,
    kind: 'needs',
    title: n.title,
    context: n.story,
    category: n.support_type,
    location: n.location,
    date: n.date || 'Flexible',
    time: n.time || 'Flexible',
    duration: n.duration || 'Flexible',
    organizer: n.privacy === 'Anonymous' ? 'Anonymous Seva Partner' : 'Community Member',
    spaces: 1,
    recurring: false,
    verified: n.verified,
    privacy: n.privacy,
    help: n.help_details || 'Seeking support with dignity and care.',
  }));

  const sevaEntries: Entry[] = sevas.map((s) => ({
    id: s.id,
    kind: 'seva',
    title: s.title,
    context: s.context,
    category: s.kind,
    location: s.location,
    image: s.image_url ?? undefined,
    date: s.date,
    time: s.time,
    duration: s.duration,
    organizer: 'Community Seva Host',
    spaces: s.spaces,
    recurring: s.recurring,
    verified: s.verified,
    privacy: 'Public',
    help: s.roles_description || 'Hands-on participation and support.',
  }));

  const institutionEntries: Entry[] = institutions.map((i) => ({
    id: i.id,
    kind: 'institutions',
    title: i.title,
    context: i.context,
    category: i.category,
    location: i.location,
    image: i.image_url ?? undefined,
    date: 'Ongoing',
    time: 'Community hours',
    duration: 'Ongoing',
    organizer: i.title,
    spaces: 10,
    recurring: true,
    verified: i.verified,
    privacy: 'Public',
    help: 'Stand alongside with time, skills, or resources.',
  }));

  return [...offerEntries, ...needEntries, ...sevaEntries, ...institutionEntries];
}
