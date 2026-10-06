-- ARPAN: Technology as Seva
-- Database Schema Migration
-- Designed around Offer, Ask, Serve, Support, Dignity, Humility, and Privacy.

-- Extensions
create extension if not exists "uuid-ossp";

-- 1. PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_letter text,
  avatar_url text,
  bio text,
  location text default 'Bengaluru',
  skills text default '',
  languages text default 'English, Hindi',
  availability text default 'Weekends',
  privacy_settings jsonb default '{"show_name":true,"show_profile_photo":true,"show_skills":true,"show_offers":true,"show_needs":false,"participate_privately":false}'::jsonb,
  is_admin boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. OFFERS (Give what you have)
create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references public.profiles(id) on delete set null,
  offer_type text not null, -- 'Time', 'Skill', 'Knowledge', 'Physical help', 'Resources', 'Financial support', 'Other'
  title text not null,
  story text not null,
  help_details text,
  availability text,
  date text,
  time text,
  duration text,
  location text not null,
  is_remote boolean default false,
  privacy text not null default 'Community', -- 'Public', 'Community', 'Anonymous'
  status text not null default 'active', -- 'active', 'paused', 'closed'
  verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. NEEDS (Ask with dignity)
create table if not exists public.needs (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references public.profiles(id) on delete set null,
  support_type text not null, -- 'Education', 'Healthcare', 'Food', 'Technology', 'Mobility', 'Resources', 'Other'
  title text not null,
  story text not null,
  help_details text,
  availability text,
  date text,
  time text,
  duration text,
  location text not null,
  is_remote boolean default false,
  privacy text not null default 'Community-visible', -- 'Public', 'Anonymous', 'Community-visible', 'Matched-only'
  consent_given boolean default true,
  status text not null default 'submitted', -- 'draft', 'submitted', 'under_verification', 'needs_more_information', 'verified', 'being_helped', 'paused', 'closed', 'rejected'
  verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. SEVAS (Show up with others)
create table if not exists public.sevas (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid references public.profiles(id) on delete set null,
  kind text not null, -- 'Teaching', 'Food', 'Elder Care', 'Environment', 'Skill Sharing', 'Health', 'Miscellaneous', etc.
  title text not null,
  context text not null,
  date text not null,
  time text not null,
  duration text not null,
  location text not null,
  is_remote boolean default false,
  spaces integer not null default 8,
  recurring boolean default false,
  roles_description text,
  safety_guidelines text,
  accessibility_notes text,
  image_url text,
  status text not null default 'active', -- 'active', 'completed', 'cancelled'
  verified boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. SEVA PARTICIPANTS (Sankalps)
create table if not exists public.seva_participants (
  id uuid primary key default gen_random_uuid(),
  seva_id uuid not null references public.sevas(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role_selected text default 'Hands-on support',
  is_anonymous boolean default false,
  created_at timestamptz default now(),
  unique(seva_id, user_id)
);

-- 6. INSTITUTIONS (Stand with a community)
create table if not exists public.institutions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  context text not null,
  category text not null,
  location text not null,
  image_url text,
  verified boolean default true,
  status text not null default 'verified',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 7. INSTITUTION WISHLISTS
create table if not exists public.institution_wishlists (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  item_title text not null,
  description text,
  created_at timestamptz default now()
);

-- 8. INSTITUTION SUPPORT
create table if not exists public.institution_support (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  support_type text not null, -- 'Time', 'Skill', 'Resource', 'Wishlist item', 'Volunteer', 'Financial support', 'Other'
  details text,
  demo_amount numeric,
  is_anonymous boolean default false,
  created_at timestamptz default now()
);

-- 9. CONVERSATIONS
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  context_type text not null, -- 'seva', 'institution', 'offer', 'need'
  context_id uuid,
  created_at timestamptz default now()
);

-- 10. CONVERSATION MEMBERS
create table if not exists public.conversation_members (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  is_muted boolean default false,
  is_blocked boolean default false,
  created_at timestamptz default now(),
  unique(conversation_id, user_id)
);

-- 11. MESSAGES
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  sender_name text not null,
  content text not null,
  reply_to_content text,
  is_system boolean default false,
  created_at timestamptz default now()
);

-- 12. REFLECTIONS (STRICTLY PRIVATE - OFFER & RELEASE)
create table if not exists public.reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  seva_id uuid references public.sevas(id) on delete set null,
  content text not null,
  is_released boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 13. BOOKMARKS
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  target_type text not null, -- 'seva', 'needs', 'offers', 'institutions'
  target_id uuid not null,
  created_at timestamptz default now(),
  unique(user_id, target_type, target_id)
);

-- 14. NOTIFICATIONS
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  text text not null,
  type text not null, -- 'seva', 'chat', 'need', 'offer', 'reflection'
  target_url text,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- 15. REPORTS (SAFETY & MODERATION)
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete set null,
  target_type text not null, -- 'offer', 'need', 'seva', 'institution', 'message', 'user'
  target_id uuid,
  reason text not null,
  details text,
  status text not null default 'pending', -- 'pending', 'reviewed', 'resolved'
  created_at timestamptz default now()
);

-- 16. VERIFICATION RECORDS
create table if not exists public.verification_records (
  id uuid primary key default gen_random_uuid(),
  target_type text not null, -- 'need', 'institution', 'seva'
  target_id uuid not null,
  reviewer_id uuid references public.profiles(id) on delete set null,
  status text not null, -- 'Request information', 'Demo reviewed', 'Needs attention'
  notes text,
  created_at timestamptz default now()
);

-- 17. AUDIT LOGS
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  target_type text,
  target_id uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- INDEXES
create index if not exists idx_offers_creator on public.offers(creator_id);
create index if not exists idx_offers_status on public.offers(status);
create index if not exists idx_needs_creator on public.needs(creator_id);
create index if not exists idx_needs_status on public.needs(status);
create index if not exists idx_sevas_organizer on public.sevas(organizer_id);
create index if not exists idx_sevas_date on public.sevas(date);
create index if not exists idx_seva_participants_seva on public.seva_participants(seva_id);
create index if not exists idx_seva_participants_user on public.seva_participants(user_id);
create index if not exists idx_reflections_user on public.reflections(user_id);
create index if not exists idx_bookmarks_user on public.bookmarks(user_id);
create index if not exists idx_notifications_user on public.notifications(user_id, is_read);
create index if not exists idx_messages_conversation on public.messages(conversation_id, created_at);

-- ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.offers enable row level security;
alter table public.needs enable row level security;
alter table public.sevas enable row level security;
alter table public.seva_participants enable row level security;
alter table public.institutions enable row level security;
alter table public.institution_wishlists enable row level security;
alter table public.institution_support enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table public.reflections enable row level security;
alter table public.bookmarks enable row level security;
alter table public.notifications enable row level security;
alter table public.reports enable row level security;
alter table public.verification_records enable row level security;
alter table public.audit_logs enable row level security;

-- PROFILES POLICIES
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- OFFERS POLICIES
create policy "Active offers are viewable by all"
  on public.offers for select
  using (status != 'closed' or auth.uid() = creator_id);

create policy "Users can insert their own offers"
  on public.offers for insert
  with check (auth.uid() = creator_id);

create policy "Users can update their own offers"
  on public.offers for update
  using (auth.uid() = creator_id or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Users can delete their own offers"
  on public.offers for delete
  using (auth.uid() = creator_id);

-- NEEDS POLICIES
create policy "Visible needs are viewable"
  on public.needs for select
  using (
    (status not in ('draft', 'rejected') and privacy != 'Matched-only')
    or auth.uid() = creator_id
    or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Users can insert their own needs"
  on public.needs for insert
  with check (auth.uid() = creator_id);

create policy "Users can update their own needs"
  on public.needs for update
  using (auth.uid() = creator_id or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- SEVAS POLICIES
create policy "Active sevas are viewable by all"
  on public.sevas for select
  using (true);

create policy "Users can create sevas"
  on public.sevas for insert
  with check (auth.uid() = organizer_id);

create policy "Organizers can update their own sevas"
  on public.sevas for update
  using (auth.uid() = organizer_id or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- SEVA PARTICIPANTS POLICIES
create policy "Participants can view their own registrations and organizers can view non-anonymous"
  on public.seva_participants for select
  using (true);

create policy "Users can register their own Sankalp"
  on public.seva_participants for insert
  with check (auth.uid() = user_id);

create policy "Users can leave their own Sankalp"
  on public.seva_participants for delete
  using (auth.uid() = user_id);

-- INSTITUTIONS POLICIES
create policy "Institutions viewable by all"
  on public.institutions for select
  using (true);

create policy "Institution wishlists viewable by all"
  on public.institution_wishlists for select
  using (true);

create policy "Users can insert institution support"
  on public.institution_support for insert
  with check (auth.uid() = user_id or user_id is null);

create policy "Users can view their own institution support or admins"
  on public.institution_support for select
  using (auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- REFLECTIONS POLICIES (STRICTLY PRIVATE - NO ADMIN ACCESS)
create policy "Reflections are strictly accessible by their owner only"
  on public.reflections for select
  using (auth.uid() = user_id);

create policy "Users can insert their own reflections"
  on public.reflections for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reflections"
  on public.reflections for update
  using (auth.uid() = user_id);

create policy "Users can delete their own reflections"
  on public.reflections for delete
  using (auth.uid() = user_id);

-- BOOKMARKS POLICIES
create policy "Users can view their own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- CONVERSATIONS & MESSAGES POLICIES
create policy "Conversation members can view conversations"
  on public.conversations for select
  using (
    auth.uid() is not null
  );

create policy "Authenticated users can create conversations"
  on public.conversations for insert
  with check (auth.uid() is not null);

create policy "Users can view conversation members"
  on public.conversation_members for select
  using (true);

create policy "Authenticated users can add conversation members"
  on public.conversation_members for insert
  with check (auth.uid() is not null);

create policy "Conversation members can view messages"
  on public.messages for select
  using (
    exists (select 1 from public.conversation_members where conversation_id = messages.conversation_id and user_id = auth.uid())
    or exists (select 1 from public.conversations c where c.id = messages.conversation_id and c.context_type in ('seva', 'institution'))
  );

create policy "Conversation members can insert messages"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and (
      exists (
        select 1 from public.conversation_members where conversation_id = messages.conversation_id and user_id = auth.uid()
      ) or exists (
        select 1 from public.conversations c where c.id = messages.conversation_id and c.context_type in ('seva', 'institution')
      )
    )
  );

-- NOTIFICATIONS POLICIES
create policy "Users can view their own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update their own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

-- REPORTS POLICIES
create policy "Users can create safety reports"
  on public.reports for insert
  with check (auth.uid() = reporter_id or reporter_id is null);

create policy "Only admins can view and resolve reports"
  on public.reports for select
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Admins can update reports"
  on public.reports for update
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- VERIFICATION & AUDIT POLICIES
create policy "Admins can view verification records"
  on public.verification_records for select
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Admins can create verification records"
  on public.verification_records for insert
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Admins can view audit logs"
  on public.audit_logs for select
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Authenticated users can create audit log entries"
  on public.audit_logs for insert
  with check (auth.uid() = user_id or user_id is null);

-- AUTOMATIC PROFILE CREATION TRIGGER
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_letter, bio)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    upper(substring(coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)), 1, 1)),
    'Learning to show up with a little more patience. Happy to share what I know.'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
