import { describe, it, expect, beforeEach, vi } from 'vitest';

// In-memory mock store for Supabase client in unit tests
const mockStore: Record<string, any[]> = {
  profiles: [],
  offers: [],
  needs: [],
  sevas: [],
  seva_participants: [],
  institutions: [],
  conversations: [],
  messages: [],
  reflections: [],
  bookmarks: [],
  notifications: [],
  reports: [],
  audit_logs: [],
  institution_wishlists: [],
  institution_support: [],
};

function createQueryBuilder(tableName: string) {
  let filters: Array<(row: any) => boolean> = [];
  let isSingle = false;
  let isDelete = false;
  let pendingUpdates: any = null;

  const builder: any = {
    select: vi.fn(() => builder),
    eq: vi.fn((col: string, val: any) => {
      filters.push((row: any) => row[col] === val);
      return builder;
    }),
    order: vi.fn(() => builder),
    single: vi.fn(() => {
      isSingle = true;
      return builder;
    }),
    maybeSingle: vi.fn(() => {
      isSingle = true;
      return builder;
    }),
    insert: vi.fn((data: any) => {
      const records = Array.isArray(data) ? data : [data];
      const inserted = records.map((r) => ({
        id: r.id || crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...r,
      }));
      mockStore[tableName] = [...(mockStore[tableName] || []), ...inserted];
      builder._lastResult = isSingle ? inserted[0] : inserted;
      return builder;
    }),
    update: vi.fn((updates: any) => {
      pendingUpdates = updates;
      return builder;
    }),
    delete: vi.fn(() => {
      isDelete = true;
      return builder;
    }),
    then: (resolve: any, reject?: any) => {
      if (isDelete) {
        mockStore[tableName] = (mockStore[tableName] || []).filter(
          (row) => !filters.every((f) => f(row))
        );
        return Promise.resolve({ data: null, error: null }).then(resolve, reject);
      }
      if (pendingUpdates) {
        mockStore[tableName] = (mockStore[tableName] || []).map((row) =>
          filters.every((f) => f(row))
            ? { ...row, ...pendingUpdates, updated_at: new Date().toISOString() }
            : row
        );
        return Promise.resolve({ data: null, error: null }).then(resolve, reject);
      }
      let filtered = (mockStore[tableName] || []).filter((row) =>
        filters.every((f) => f(row))
      );
      const result = isSingle ? (filtered[0] || builder._lastResult || null) : filtered;
      return Promise.resolve({ data: result, error: null }).then(resolve, reject);
    },
  };

  return builder;
}

vi.mock('@/lib/supabase/client', () => {
  return {
    isLiveSupabaseConfigured: true,
    supabase: {
      from: vi.fn((tableName: string) => createQueryBuilder(tableName)),
    },
  };
});

// Import API after mocking Supabase
import * as api from '@/lib/arpan/api';

describe('ARPAN Full-Stack Operations & Core Principles', () => {
  beforeEach(() => {
    Object.keys(mockStore).forEach((k) => {
      mockStore[k] = [];
    });
  });

  describe('Authentication & Profiles', () => {
    it('persists profile settings and privacy switchboard', async () => {
      const profile = {
        id: crypto.randomUUID(),
        display_name: 'Kavya',
        avatar_letter: 'K',
        bio: 'Volunteering in community kitchens and teaching basic maths.',
        location: 'Pune',
        skills: 'Cooking, teaching, listening',
        languages: 'Marathi, Hindi, English',
        availability: 'Sunday mornings',
        privacy_settings: {
          show_name: false,
          show_profile_photo: false,
          show_skills: true,
          show_offers: true,
          show_needs: false,
          participate_privately: true,
        },
        is_admin: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockStore.profiles.push(profile);
      const userProfile = await api.fetchProfile(profile.id);

      expect(userProfile?.display_name).toBe('Kavya');
      expect(userProfile?.privacy_settings?.participate_privately).toBe(true);
      expect(userProfile?.privacy_settings?.show_name).toBe(false);
    });
  });

  describe('Anonymity Guarantees (Core ARPAN Ethos)', () => {
    it('supports anonymous offers without leaking creator identity', async () => {
      const anonOffer = await api.createOffer({
        creator_id: null,
        offer_type: 'Resources',
        title: 'Books ready for a new home',
        story: 'Sharing a collection of children books.',
        help_details: 'Pick up at Sahaj Community Centre.',
        availability: 'Flexible',
        date: '2026-10-15',
        time: '10:00 AM',
        duration: '1 hour',
        location: 'Bengaluru',
        is_remote: false,
        privacy: 'Anonymous',
        status: 'active',
        verified: true,
      });

      expect(anonOffer?.privacy).toBe('Anonymous');
      expect(anonOffer?.creator_id).toBeNull();
    });

    it('supports anonymous asks without public identifier leakage', async () => {
      const anonNeed = await api.createNeed({
        creator_id: null,
        support_type: 'Mobility',
        title: 'Companion for clinic visit',
        story: 'Looking for a patient neighbour to accompany me to a doctor visit.',
        help_details: 'Hospital navigation.',
        availability: 'Friday afternoon',
        date: '2026-10-16',
        time: '3:00 PM',
        duration: '2 hours',
        location: 'Pune',
        is_remote: false,
        privacy: 'Anonymous',
        consent_given: true,
        status: 'submitted',
        verified: false,
      });

      expect(anonNeed?.privacy).toBe('Anonymous');
      expect(anonNeed?.creator_id).toBeNull();
    });
  });

  describe('Community Chat & Messaging', () => {
    it('persists chat messages and preserves replies', async () => {
      const chatId = crypto.randomUUID();
      await api.sendMessage(chatId, {
        sender: 'Participant',
        text: 'Welcome to the circle.',
        time: '9:00 AM',
      });

      await api.sendMessage(chatId, {
        sender: 'Neighbour',
        text: 'Glad to be here. What should we bring?',
        time: '9:05 AM',
        reply: 'Welcome to the circle.',
      });

      const messages = await api.fetchMessages(chatId);
      expect(messages.length).toBe(2);
      expect(messages[1]?.reply).toBe('Welcome to the circle.');
    });
  });

  describe('Offers Pillar (Give what you have)', () => {
    it('creates, reads, updates status, and deletes an offer', async () => {
      const created = await api.createOffer({
        creator_id: crypto.randomUUID(),
        offer_type: 'Skill',
        title: 'Mentoring in Web Development',
        story: 'Happy to help newcomers build confidence with HTML and JavaScript.',
        help_details: 'One hour sessions on weekends.',
        availability: 'Sunday mornings',
        date: '2026-10-18',
        time: '11:00 AM',
        duration: '1 hour',
        location: 'Bengaluru',
        is_remote: false,
        privacy: 'Public',
        status: 'active',
        verified: false,
      });

      expect(created?.id).toBeDefined();
      expect(created?.title).toBe('Mentoring in Web Development');

      // Read back
      const allOffers = await api.fetchOffers();
      expect(allOffers.some((o) => o.id === created?.id)).toBe(true);

      // Update status (pause)
      await api.updateOfferStatus(created!.id, 'paused');
      const updatedList = await api.fetchOffers();
      const pausedOffer = updatedList.find((o) => o.id === created?.id);
      expect(pausedOffer?.status).toBe('paused');

      // Delete
      await api.deleteOffer(created!.id);
      const afterDelete = await api.fetchOffers();
      expect(afterDelete.some((o) => o.id === created?.id)).toBe(false);
    });
  });

  describe('Needs Pillar (Ask with dignity)', () => {
    it('creates a need respecting dignity and privacy choices', async () => {
      const need = await api.createNeed({
        creator_id: crypto.randomUUID(),
        support_type: 'Education',
        title: 'Mathematics practice support',
        story: 'Preparing for board exams and need guidance with trigonometry.',
        help_details: 'Weekly review of textbook problems.',
        availability: 'Weekdays after 6 PM',
        date: '2026-10-20',
        time: '6:00 PM',
        duration: '1 hour',
        location: 'Online',
        is_remote: true,
        privacy: 'Anonymous',
        consent_given: true,
        status: 'submitted',
        verified: false,
      });

      expect(need?.id).toBeDefined();
      expect(need?.privacy).toBe('Anonymous');
      expect(need?.status).toBe('submitted');

      // Verify in list
      const needs = await api.fetchNeeds();
      expect(needs.some((n) => n.id === need?.id)).toBe(true);

      // Update verification status
      await api.updateNeedStatus(need!.id, 'verified');
      const verifiedList = await api.fetchNeeds();
      expect(verifiedList.find((n) => n.id === need?.id)?.status).toBe('verified');
    });
  });

  describe('Seva & Sankalp Pillar (Show up with others)', () => {
    it('creates a seva and registers / withdraws Sankalp', async () => {
      const userId = crypto.randomUUID();
      const seva = await api.createSeva({
        organizer_id: userId,
        kind: 'Environment',
        title: 'Lakeside Tree Plantation',
        context: 'Gathering to plant native trees around the neighbourhood lake.',
        date: '2026-10-24',
        time: '7:30 AM',
        duration: '2 hours',
        location: 'Bengaluru',
        is_remote: false,
        spaces: 15,
        recurring: false,
        roles_description: 'Digging pits, planting saplings, watering',
        safety_guidelines: 'Bring gardening gloves and water.',
        accessibility_notes: 'Gentle flat walking path.',
        image_url: null,
        status: 'active',
        verified: true,
      });

      expect(seva?.id).toBeDefined();

      // Join with Sankalp
      const joined = await api.toggleSankalp(seva!.id, 'Hands-on support', false, userId);
      expect(joined.includes(seva!.id)).toBe(true);

      // Verify participant record
      const participants = await api.fetchParticipants(userId);
      expect(participants.includes(seva!.id)).toBe(true);

      // Leave Seva
      const afterLeave = await api.toggleSankalp(seva!.id, 'Hands-on support', false, userId);
      expect(afterLeave.includes(seva!.id)).toBe(false);
    });
  });

  describe('Reflections & "Offer & Release" (Non-negotiable Privacy)', () => {
    it('saves private reflections accessible only to owner', async () => {
      const userA = crypto.randomUUID();
      const userB = crypto.randomUUID();
      const sevaId = crypto.randomUUID();

      await api.saveReflection(sevaId, 'Noticed how quiet presence helped more than words.', true, userA);

      // User A reads their own reflection
      const reflectionsA = await api.fetchReflections(userA);
      expect(reflectionsA[sevaId]).toBe('Noticed how quiet presence helped more than words.');

      // Another user cannot access User A’s reflections
      const reflectionsB = await api.fetchReflections(userB);
      expect(reflectionsB[sevaId]).toBeUndefined();
    });
  });

  describe('Bookmarks', () => {
    it('saves and unsaves items for the authenticated user', async () => {
      const userId = crypto.randomUUID();
      const targetId = crypto.randomUUID();

      // Save
      const saved1 = await api.toggleBookmark(targetId, 'seva', userId);
      expect(saved1.includes(targetId)).toBe(true);

      // Unsave
      const saved2 = await api.toggleBookmark(targetId, 'seva', userId);
      expect(saved2.includes(targetId)).toBe(false);
    });
  });

  describe('Safety Reports & Moderation Audit', () => {
    it('submits safety reports and records audit log entries', async () => {
      const targetId = crypto.randomUUID();
      await api.submitReport({
        target_type: 'seva',
        target_id: targetId,
        reason: 'Privacy concern',
        details: 'Photo included without prior consent',
      });

      await api.recordAuditAction(`Reviewed record ${targetId}`, 'Confirmed image was removed');
      const audit = await api.fetchAuditLogs();
      expect(audit.length).toBeGreaterThan(0);
      expect(audit[0]?.action).toContain(`Reviewed record ${targetId}`);
    });
  });

  describe('Unified Entry Adapter', () => {
    it('maps all four pillars into unified presentation model without crashing', async () => {
      // Seed one item per pillar into mock store
      mockStore.sevas.push({
        id: crypto.randomUUID(),
        title: 'Community Garden Morning',
        context: 'Urban gardening',
        kind: 'Environment',
        location: 'Bengaluru',
        date: '2026-10-25',
        time: '9:00 AM',
        duration: '2 hours',
        spaces: 10,
        recurring: false,
        verified: true,
      });
      mockStore.offers.push({
        id: crypto.randomUUID(),
        title: 'Math Tutoring',
        story: 'Teaching highschool math',
        offer_type: 'Skill',
        location: 'Online',
        privacy: 'Public',
        status: 'active',
        verified: false,
      });
      mockStore.needs.push({
        id: crypto.randomUUID(),
        title: 'Wheelchair assistance',
        story: 'Clinic visit support',
        support_type: 'Mobility',
        location: 'Pune',
        privacy: 'Community',
        status: 'active',
        verified: true,
      });
      mockStore.institutions.push({
        id: crypto.randomUUID(),
        name: 'Sahaj Care Foundation',
        story: 'Community healthcare and shelter',
        category: 'Elder Care',
        location: 'Bengaluru',
        verified: true,
      });

      const allEntries = await api.fetchAllUnifiedEntries();
      expect(allEntries.length).toBe(4);

      const kinds = new Set(allEntries.map((e) => e.kind));
      expect(kinds.has('seva')).toBe(true);
      expect(kinds.has('needs')).toBe(true);
      expect(kinds.has('offers')).toBe(true);
      expect(kinds.has('institutions')).toBe(true);
    });
  });
});
