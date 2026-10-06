export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Profile = {
  id: string;
  display_name: string;
  avatar_letter: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string;
  skills: string;
  languages: string;
  availability: string;
  privacy_settings: {
    show_name?: boolean;
    show_profile_photo?: boolean;
    show_skills?: boolean;
    show_offers?: boolean;
    show_needs?: boolean;
    participate_privately?: boolean;
  };
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export type Offer = {
  id: string;
  creator_id: string | null;
  offer_type: 'Time' | 'Skill' | 'Knowledge' | 'Physical help' | 'Resources' | 'Financial support' | 'Other';
  title: string;
  story: string;
  help_details: string | null;
  availability: string | null;
  date: string | null;
  time: string | null;
  duration: string | null;
  location: string;
  is_remote: boolean;
  privacy: 'Public' | 'Community' | 'Anonymous';
  status: 'active' | 'paused' | 'closed';
  verified: boolean;
  created_at: string;
  updated_at: string;
};

export type Need = {
  id: string;
  creator_id: string | null;
  support_type: 'Education' | 'Healthcare' | 'Food' | 'Technology' | 'Mobility' | 'Resources' | 'Other';
  title: string;
  story: string;
  help_details: string | null;
  availability: string | null;
  date: string | null;
  time: string | null;
  duration: string | null;
  location: string;
  is_remote: boolean;
  privacy: 'Public' | 'Anonymous' | 'Community-visible' | 'Matched-only';
  consent_given: boolean;
  status: 'draft' | 'submitted' | 'under_verification' | 'needs_more_information' | 'verified' | 'being_helped' | 'paused' | 'closed' | 'rejected';
  verified: boolean;
  created_at: string;
  updated_at: string;
};

export type Seva = {
  id: string;
  organizer_id: string | null;
  kind: string;
  title: string;
  context: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  is_remote: boolean;
  spaces: number;
  recurring: boolean;
  roles_description: string | null;
  safety_guidelines: string | null;
  accessibility_notes: string | null;
  image_url: string | null;
  status: 'active' | 'completed' | 'cancelled';
  verified: boolean;
  created_at: string;
  updated_at: string;
};

export type SevaParticipant = {
  id: string;
  seva_id: string;
  user_id: string;
  role_selected: string;
  is_anonymous: boolean;
  created_at: string;
};

export type Institution = {
  id: string;
  title: string;
  context: string;
  category: string;
  location: string;
  image_url: string | null;
  verified: boolean;
  status: string;
  created_at: string;
  updated_at: string;
};

export type InstitutionWishlist = {
  id: string;
  institution_id: string;
  item_title: string;
  description: string | null;
  created_at: string;
};

export type InstitutionSupport = {
  id: string;
  institution_id: string;
  user_id: string | null;
  support_type: string;
  details: string | null;
  demo_amount: number | null;
  is_anonymous: boolean;
  created_at: string;
};

export type Conversation = {
  id: string;
  title: string;
  context_type: string;
  context_id: string | null;
  created_at: string;
};

export type ConversationMember = {
  id: string;
  conversation_id: string;
  user_id: string;
  is_muted: boolean;
  is_blocked: boolean;
  created_at: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string | null;
  sender_name: string;
  content: string;
  reply_to_content: string | null;
  is_system: boolean;
  created_at: string;
};

export type Reflection = {
  id: string;
  user_id: string;
  seva_id: string | null;
  content: string;
  is_released: boolean;
  created_at: string;
  updated_at: string;
};

export type Bookmark = {
  id: string;
  user_id: string;
  target_type: 'seva' | 'needs' | 'offers' | 'institutions';
  target_id: string;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  text: string;
  type: 'seva' | 'chat' | 'need' | 'offer' | 'reflection';
  target_url: string | null;
  is_read: boolean;
  created_at: string;
};

export type Report = {
  id: string;
  reporter_id: string | null;
  target_type: 'offer' | 'need' | 'seva' | 'institution' | 'message' | 'user';
  target_id: string | null;
  reason: string;
  details: string | null;
  status: 'pending' | 'reviewed' | 'resolved';
  created_at: string;
};

export type VerificationRecord = {
  id: string;
  target_type: 'need' | 'institution' | 'seva';
  target_id: string;
  reviewer_id: string | null;
  status: 'Request information' | 'Demo reviewed' | 'Needs attention';
  notes: string | null;
  created_at: string;
};

export type AuditLog = {
  id: string;
  user_id: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: Json;
  created_at: string;
};
