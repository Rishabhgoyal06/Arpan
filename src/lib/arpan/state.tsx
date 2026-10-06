import { createContext, useContext, useState, type ReactNode } from 'react';
import { type Entry } from './data';
import { useAuth } from './auth';
import {
  useUnifiedEntries,
  useParticipants,
  useToggleSankalp,
  useBookmarks,
  useToggleBookmark,
  useReflections,
  useSaveReflection,
  useCreateOffer,
  useCreateNeed,
  useCreateSeva,
  useNotifications,
  useMarkAllNotificationsRead,
} from './queries';
import * as api from './api';

export type Message = {
  text: string;
  sender: string;
  time: string;
  reply?: string;
  senderId?: string;
};

type State = {
  entries: Entry[];
  addEntry: (entry: Entry) => Promise<void>;
  joined: string[];
  toggleJoin: (id: string, role?: string, isAnonymous?: boolean) => void;
  saved: string[];
  toggleSave: (id: string) => void;
  reflections: Record<string, string>;
  saveReflection: (id: string, text: string, isReleased?: boolean) => void;
  messages: Record<string, Message[]>;
  sendMessage: (id: string, message: Message) => void;
  privacy: Record<string, boolean>;
  setPrivacy: (value: Record<string, boolean>) => void;
  name: string;
  setName: (name: string) => void;
  read: string[];
  markRead: () => void;
};

const Context = createContext<State | null>(null);

export function ArpanProvider({ children }: { children: ReactNode }) {
  const { user, profile, updateProfile } = useAuth();
  const userId = user?.id;

  // Real data backed strictly by TanStack Query
  const { data: unifiedEntries = [] } = useUnifiedEntries();
  const { data: participants = [] } = useParticipants(userId);
  const { data: bookmarks = [] } = useBookmarks(userId);
  const { data: dbReflections = {} } = useReflections(userId);
  const { data: dbNotifications = [] } = useNotifications(userId);

  // Mutations
  const toggleSankalpMutation = useToggleSankalp(userId);
  const toggleBookmarkMutation = useToggleBookmark(userId);
  const saveReflectionMutation = useSaveReflection(userId);
  const createOfferMutation = useCreateOffer();
  const createNeedMutation = useCreateNeed();
  const createSevaMutation = useCreateSeva();
  const markAllReadMutation = useMarkAllNotificationsRead(userId);

  // Active chat state
  const [messagesState, setMessagesState] = useState<Record<string, Message[]>>({});

  // Add entry based on normalized kind
  const addEntry = async (entry: Entry) => {
    if (entry.kind === 'offers') {
      await createOfferMutation.mutateAsync({
        creator_id: userId ?? null,
        offer_type: (entry.category || 'Skill') as any,
        title: entry.title,
        story: entry.context,
        help_details: entry.help,
        availability: 'Weekends',
        date: entry.date,
        time: entry.time,
        duration: entry.duration,
        location: entry.location,
        is_remote: entry.location === 'Online',
        privacy: (entry.privacy || 'Community') as any,
        status: 'active',
        verified: false,
      });
    } else if (entry.kind === 'needs') {
      await createNeedMutation.mutateAsync({
        creator_id: userId ?? null,
        support_type: (entry.category || 'Education') as any,
        title: entry.title,
        story: entry.context,
        help_details: entry.help,
        availability: 'Flexible',
        date: entry.date,
        time: entry.time,
        duration: entry.duration,
        location: entry.location,
        is_remote: entry.location === 'Online',
        privacy: (entry.privacy || 'Community-visible') as any,
        consent_given: true,
        status: 'submitted',
        verified: false,
      });
    } else if (entry.kind === 'seva') {
      await createSevaMutation.mutateAsync({
        organizer_id: userId ?? null,
        kind: entry.category,
        title: entry.title,
        context: entry.context,
        date: entry.date,
        time: entry.time,
        duration: entry.duration,
        location: entry.location,
        is_remote: entry.location === 'Online',
        spaces: entry.spaces,
        recurring: entry.recurring,
        roles_description: 'Welcome, hands-on support, set-up and care',
        safety_guidelines: 'Bring a water bottle. Guidance will be available.',
        accessibility_notes: 'Step-free access and seating available.',
        image_url: entry.image ?? null,
        status: 'active',
        verified: false,
      });
    }
  };

  const toggleJoin = (id: string, role = 'Hands-on support', isAnonymous = false) => {
    toggleSankalpMutation.mutate({ sevaId: id, role, isAnonymous });
  };

  const toggleSave = (id: string) => {
    toggleBookmarkMutation.mutate({ targetId: id });
  };

  const saveReflection = (id: string, text: string, isReleased = false) => {
    saveReflectionMutation.mutate({ sevaId: id, content: text, isReleased });
  };

  const sendMessage = (id: string, message: Message) => {
    setMessagesState((prev) => ({
      ...prev,
      [id]: [...(prev[id] ?? []), message],
    }));
    // Persist message to backend
    api.sendMessage(id, {
      text: message.text,
      sender: message.sender,
      reply: message.reply,
      senderId: userId,
    }).catch((err) => console.warn('Message sync warning:', err));
  };

  const privacyMap: Record<string, boolean> = {
    'Show my name': profile?.privacy_settings?.show_name ?? true,
    'Show my profile photo': profile?.privacy_settings?.show_profile_photo ?? true,
    'Show my skills': profile?.privacy_settings?.show_skills ?? true,
    'Show my offers': profile?.privacy_settings?.show_offers ?? true,
    'Show my needs': profile?.privacy_settings?.show_needs ?? false,
    'Participate privately': profile?.privacy_settings?.participate_privately ?? false,
  };

  const setPrivacy = (newValues: Record<string, boolean>) => {
    updateProfile({
      privacy_settings: {
        show_name: newValues['Show my name'] ?? true,
        show_profile_photo: newValues['Show my profile photo'] ?? true,
        show_skills: newValues['Show my skills'] ?? true,
        show_offers: newValues['Show my offers'] ?? true,
        show_needs: newValues['Show my needs'] ?? false,
        participate_privately: newValues['Participate privately'] ?? false,
      },
    });
  };

  const setName = (name: string) => {
    updateProfile({
      display_name: name,
      avatar_letter: name.charAt(0).toUpperCase(),
    });
  };

  const readNotificationIds = dbNotifications.filter((n) => n.is_read).map((n) => n.id);

  const markRead = () => {
    markAllReadMutation.mutate();
  };

  const currentDisplayName = profile?.display_name || (user?.email ? user.email.split('@')[0] : 'Community Member');

  return (
    <Context.Provider
      value={{
        entries: unifiedEntries,
        addEntry,
        joined: participants,
        toggleJoin,
        saved: bookmarks,
        toggleSave,
        reflections: dbReflections,
        saveReflection,
        messages: messagesState,
        sendMessage,
        privacy: privacyMap,
        setPrivacy,
        name: currentDisplayName,
        setName,
        read: readNotificationIds,
        markRead,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useArpan() {
  const context = useContext(Context);
  if (!context) throw new Error('ARPAN context is unavailable');
  return context;
}
