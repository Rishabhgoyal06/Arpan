import { useState } from 'react';
import { Link, useParams, useNavigate } from '@tanstack/react-router';
import { Check, EyeOff, Leaf, Send, ShieldCheck, Sprout, Bell, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useArpan } from '@/lib/arpan/state';
import { useAuth } from '@/lib/arpan/auth';
import { submitReport } from '@/lib/arpan/api';
import { MindfulGraph } from './insights';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useConversations,
  useChatMessages,
  useSendMessage,
} from '@/lib/arpan/queries';
import { DemoNote, Empty, PageHeading, EntryCard } from './shared';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

export function JourneyPage() {
  const { entries, joined, reflections } = useArpan();
  const [tab, setTab] = useState('My Seva');

  return (
    <div className="page-container">
      <PageHeading
        eyebrow="YOUR JOURNEY, AT YOUR PACE"
        title="A little more present."
        description="Not a record of achievements. A space to notice what stays with you."
      />
      <div className="journey-intention">
        <Sprout size={34} strokeWidth={1} />
        <p>
          “I showed up. I did what I could.
          <br />
          I let go of the result.”
        </p>
      </div>
      <div className="journey-track">
        {['Sankalp', 'Seva', 'Reflection', 'Offer & Release'].map((s, i) => (
          <div key={s}>
            <span>{i + 1}</span>
            {s}
            {i < 3 && <ArrowRight />}
          </div>
        ))}
      </div>
      <div className="discovery-tabs">
        {['My Seva', 'Reflections', 'Saved', 'Insights'].map((t) => (
          <Button
            key={t}
            variant="ghost"
            className={tab === t ? 'active' : ''}
            onClick={() => setTab(t)}
          >
            {t === 'Insights' && <Sparkles size={14} className="mr-1 inline-block text-serve" />}
            {t}
          </Button>
        ))}
      </div>
      {tab === 'Insights' ? (
        <div className="max-w-2xl mx-auto py-4">
          <MindfulGraph userId={useAuth().user?.id || ''} />
        </div>
      ) : tab === 'My Seva' ? (
        <>
          {joined.length ? (
            <div className="entry-grid">
              {entries
                .filter((e) => joined.includes(e.id))
                .map((e) => (
                  <div key={e.id}>
                    <EntryCard entry={e} />
                    <Button asChild variant="outline" className="reflection-link">
                      <Link to="/journey/reflection/$id" params={{ id: e.id }}>
                        Make time to reflect <ArrowUpRight />
                      </Link>
                    </Button>
                  </div>
                ))}
            </div>
          ) : (
            <Empty
              title="Your journey begins with showing up."
              text="Find a Seva that feels meaningful. Your intention will have a place here."
            />
          )}
          <Button asChild variant="outline">
            <Link to="/seva">
              Find your next Seva <ArrowRight />
            </Link>
          </Button>
        </>
      ) : tab === 'Reflections' ? (
        <>
          {Object.keys(reflections).length ? (
            Object.entries(reflections).map(([id, text]) => (
              <article className="reflection-entry" key={id}>
                <span className="eyebrow">
                  <EyeOff size={13} />
                  ONLY YOU
                </span>
                <h3>{entries.find((e) => e.id === id)?.title || 'A quiet reflection'}</h3>
                <p>{text}</p>
              </article>
            ))
          ) : (
            <Empty
              title="A space for what stays with you."
              text="A reflection is yours alone. There is no right way to begin."
            />
          )}
          {joined.length > 0 ? (
            <Button variant="outline" asChild>
              <Link to="/journey/reflection/$id" params={{ id: joined[0] }}>
                Write a private reflection
              </Link>
            </Button>
          ) : (
            <Button variant="outline" asChild>
              <Link to="/seva">Explore Seva to reflect upon</Link>
            </Button>
          )}
        </>
      ) : (
        <SavedEntries />
      )}
      <div className="growth-themes">
        <p className="eyebrow">THINGS WE PRACTISE, NOT POINTS WE EARN</p>
        <span>Humility</span>
        <span>Patience</span>
        <span>Empathy</span>
        <span>Steadiness</span>
        <span>Consistency</span>
      </div>
    </div>
  );
}

function SavedEntries() {
  const { entries, saved } = useArpan();
  return saved.length ? (
    <div className="entry-grid">
      {entries
        .filter((e) => saved.includes(e.id))
        .map((e) => (
          <EntryCard key={e.id} entry={e} />
        ))}
    </div>
  ) : (
    <Empty
      title="Room for what speaks to you."
      text="Saved opportunities will appear here."
    />
  );
}

export function ReflectionPage() {
  const { id } = useParams({ strict: false }) as { id?: string };
  const { entries, joined, reflections, saveReflection } = useArpan();
  const targetId = id || (joined[0] ?? 'reflection-session');
  const [text, setText] = useState(reflections[targetId] ?? '');
  const [notice, setNotice] = useState('');
  const [done, setDone] = useState(false);

  return (
    <div className="reflection-page">
      {done ? (
        <>
          <Sprout size={44} strokeWidth={1} />
          <p className="eyebrow">OFFER & RELEASE</p>
          <h1>
            I showed up.
            <br />
            I did what I could.
            <br />
            I let go of the result.
          </h1>
          <p>Your reflection is held privately in your personal journey.</p>
          <Button variant="outline" asChild>
            <Link to="/journey">Return to your journey</Link>
          </Button>
        </>
      ) : (
        <>
          <p className="eyebrow">
            <EyeOff size={14} /> A MOMENT THAT IS ONLY YOURS
          </p>
          <h1>What stayed with you?</h1>
          <p>{entries.find((e) => e.id === targetId)?.title || 'Your time in Seva'}</p>
          <div className="reflection-prompts">
            <h3>How was your experience?</h3>
            <p>What did you notice? What did you learn about yourself?</p>
            <p>Was there a moment of patience, humility or empathy that stayed with you?</p>
          </div>
          <label className="sr-only" htmlFor="reflection">
            Your private reflection
          </label>
          <textarea
            id="reflection"
            placeholder="There is no perfect answer. Begin with a moment…"
            rows={9}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flow-actions">
            <Button
              variant="ghost"
              onClick={() => {
                saveReflection(targetId, text);
                setNotice('Your reflection is saved privately.');
              }}
            >
              Save privately
            </Button>
            <Button
              disabled={!text.trim()}
              onClick={() => {
                saveReflection(targetId, text, true);
                setDone(true);
              }}
            >
              Offer & Release <Leaf />
            </Button>
          </div>
          <p className="status-message" role="status">
            {notice}
          </p>
          <p className="reflection-footnote">
            No audience. No expectations. Just a little room to notice.
          </p>
          <div className="quiet-note" style={{ marginTop: '40px', borderTop: '1px solid var(--border)', paddingTop: '30px' }}>
            <p style={{ fontStyle: 'italic', color: 'var(--muted-foreground)', fontSize: '12px', lineHeight: 1.6 }}>
              “Experience is the only teacher we have. We may talk and reason all our lives, but we shall not understand a word of truth until we experience it ourselves.”
              <br />
              <span style={{ fontSize: '10px', marginTop: '12px', display: 'block', fontStyle: 'normal', letterSpacing: '1px', textTransform: 'uppercase' }}>— Swami Vivekananda</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export function ProfilePage() {
  const { name, setName, entries, joined, reflections, privacy: preferences, setPrivacy } = useArpan();
  const { user, profile, updateProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [value, setValue] = useState(profile?.display_name || name);
  const [about, setAbout] = useState(profile?.bio || '');
  const [skills, setSkills] = useState(profile?.skills || '');
  const [languages, setLanguages] = useState(profile?.languages || '');
  const [availability, setAvailability] = useState(profile?.availability || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [tab, setTab] = useState('About me');
  const [status, setStatus] = useState('');
  const [visibility, setVisibility] = useState('Community');
  const [privacyValues, setPrivacyValues] = useState(preferences);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      display_name: value,
      bio: about,
      skills,
      languages,
      availability,
      location,
    });
    setName(value);
    setStatus('Your profile has been saved and updated.');
  };

  if (!user) {
    return (
      <div className="page-container">
        <PageHeading
          eyebrow="YOUR SPACE IN THE COMMUNITY"
          title="Sign in to view your profile"
          description="Your personal reflections, privacy settings, and community offerings are kept private to your account."
          action={
            <Button asChild>
              <Link to="/login">Sign in</Link>
            </Button>
          }
        />
        <div className="empty-state">
          <p>Please sign in or create an account to manage your profile and view your journey.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <PageHeading
        eyebrow="YOUR SPACE IN THE COMMUNITY"
        title="A person, not a role."
        description="You are more than what you give, or what you need."
        action={
          <Button
            variant="outline"
            onClick={async () => {
              await signOut();
              navigate({ to: '/login' });
            }}
          >
            Sign out
          </Button>
        }
      />
      <div className="profile-header">
        <span className="profile-avatar">{value.charAt(0) || 'A'}</span>
        <div>
          <h2>{value}</h2>
          <p>
            {location || 'Community member'} {languages ? `· ${languages}` : ''}
          </p>
          <span className="role-badge">ARPAN COMMUNITY MEMBER</span>
        </div>
      </div>
      <div className="discovery-tabs">
        {['About me', 'Insights', 'What I offer', 'What I need', 'My Seva', 'My reflections', 'Privacy'].map(
          (t) => (
            <Button
              key={t}
              variant="ghost"
              className={tab === t ? 'active' : ''}
              onClick={() => setTab(t)}
            >
              {t === 'Insights' && <Sparkles size={14} className="mr-1 inline-block text-serve" />}
              {t}
            </Button>
          )
        )}
      </div>
      {tab === 'About me' ? (
        <form className="profile-form" onSubmit={handleProfileSave}>
          <label>
            Your name
            <input value={value} onChange={(e) => setValue(e.target.value)} required />
          </label>
          <label>
            Location
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Your city or neighbourhood"
            />
          </label>
          <label>
            A little about you
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows={4}
              placeholder="Share what moves you or how you like to show up…"
            />
          </label>
          <label>
            Skills
            <input
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. Teaching, cooking, gardening, technology"
            />
          </label>
          <label>
            Languages
            <input
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              placeholder="Languages you are comfortable with"
            />
          </label>
          <label>
            Availability
            <input
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              placeholder="e.g. Saturday mornings, flexible"
            />
          </label>
          <Button type="submit">Save your changes</Button>
          <p role="status">{status}</p>
        </form>
      ) : tab === 'Insights' ? (
        <div className="max-w-2xl mx-auto py-4">
          <MindfulGraph userId={user.id} />
        </div>
      ) : tab === 'Privacy' ? (
        <div className="profile-form">
          <h2>Your story is yours.</h2>
          <label>
            Profile visibility
            <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
              <option>Community</option>
              <option>Public</option>
              <option>Private</option>
            </select>
          </label>
          {[
            'Show my name',
            'Show my profile photo',
            'Show my skills',
            'Show my offers',
            'Show my needs',
            'Participate privately',
          ].map((t) => (
            <label key={t} className="privacy-toggle">
              <span>{t}</span>
              <input
                type="checkbox"
                checked={privacyValues[t] ?? false}
                onChange={(e) =>
                  setPrivacyValues((p) => ({ ...p, [t]: e.target.checked }))
                }
                role="switch"
                aria-label={t}
              />
            </label>
          ))}
          <Button
            onClick={() => {
              setPrivacy(privacyValues);
              setStatus('Your privacy choices have been saved.');
            }}
          >
            Save privacy choices
          </Button>
          <p role="status">{status}</p>
          <p className="privacy-reminder">
            <EyeOff />
            Reflections are always private.
          </p>
        </div>
      ) : tab === 'My reflections' ? (
        Object.values(reflections).length ? (
          Object.values(reflections).map((t, i) => (
            <article className="reflection-entry" key={i}>
              <EyeOff />
              <p>{t}</p>
            </article>
          ))
        ) : (
          <Empty title="Your reflections have a quiet home here." />
        )
      ) : tab === 'My Seva' ? (
        joined.length ? (
          <div className="entry-grid">
            {entries
              .filter((e) => joined.includes(e.id))
              .map((e) => (
                <EntryCard key={e.id} entry={e} />
              ))}
          </div>
        ) : (
          <Empty title="Your next Seva is waiting to be discovered." />
        )
      ) : (
        <>
          {entries.some(
            (e) =>
              (e.organizer === value || e.user_id === user?.id) &&
              e.kind === (tab === 'What I offer' ? 'offers' : 'needs')
          ) ? (
            <div className="entry-grid">
              {entries
                .filter(
                  (e) =>
                    (e.organizer === value || e.user_id === user?.id) &&
                    e.kind === (tab === 'What I offer' ? 'offers' : 'needs')
                )
                .map((e) => (
                  <EntryCard key={e.id} entry={e} />
                ))}
            </div>
          ) : (
            <Empty
              title={
                tab === 'What I offer'
                  ? 'Your offers will appear here.'
                  : 'Your requests will appear here.'
              }
              text="You decide how much to share, and with whom."
            />
          )}
          <Button asChild>
            <Link to={tab === 'What I offer' ? '/offer/create' : '/ask/create'}>
              {tab === 'What I offer' ? 'Offer something' : 'Ask for support'}
            </Link>
          </Button>
        </>
      )}
      <DemoNote />
    </div>
  );
}

export function NotificationsPage() {
  const { user } = useAuth();
  const { data: realNotifications = [] } = useNotifications(user?.id);
  const markAll = useMarkAllNotificationsRead(user?.id);
  const markOne = useMarkNotificationRead(user?.id);

  return (
    <div className="page-container">
      <PageHeading
        eyebrow="A GENTLE NUDGE"
        title="Your community, in a few words."
        description="Updates on the connections you’ve made."
        action={
          realNotifications.length > 0 ? (
            <Button variant="outline" onClick={() => markAll.mutate()}>
              <Check />
              Mark all as read
            </Button>
          ) : undefined
        }
      />
      {realNotifications.length === 0 ? (
        <Empty
          title="No notifications yet."
          text="When there are community updates or responses, they will appear here."
        />
      ) : (
        <div className="notification-list">
          {realNotifications.map((n) => (
            <Link
              key={n.id}
              to={n.action_url || '/journey'}
              onClick={() => markOne.mutate(n.id)}
              className={n.is_read ? 'notification-item read' : 'notification-item'}
            >
              <span>
                <Bell size={20} />
              </span>
              <div>
                <h3>{n.title}</h3>
                <p>{n.message}</p>
                <small>{new Date(n.created_at).toLocaleDateString()}</small>
              </div>
              {!n.is_read && <i />}
              <ArrowUpRight size={18} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function ChatsPage() {
  const { id } = useParams({ strict: false }) as { id?: string };
  const { user, profile } = useAuth();
  const { data: conversations = [] } = useConversations();

  const active =
    conversations.find((c) => c.id === id) ||
    conversations[0] ||
    null;

  const activeId = active?.id || '';
  const { data: chatMessages = [] } = useChatMessages(activeId);
  const sendMessageMutation = useSendMessage(activeId);

  const [draft, setDraft] = useState('');
  const [muted, setMuted] = useState(false);
  const [report, setReport] = useState(false);
  const [reason, setReason] = useState('Privacy concern');
  const [reported, setReported] = useState(false);
  const [reply, setReply] = useState('');
  const [blocked, setBlocked] = useState(false);

  const senderName = profile?.display_name || user?.email?.split('@')[0] || 'Community Member';

  if (conversations.length === 0) {
    return (
      <div className="page-container">
        <PageHeading
          eyebrow="A SPACE TO CONNECT"
          title="Conversations, with care."
          description="A private space to coordinate Seva and mutual support."
        />
        <Empty
          title="No active conversations yet."
          text="Join a Seva or connect with an Offer or Need to begin a community circle."
        />
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Button asChild variant="outline">
            <Link to="/seva">Explore Seva circles</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <PageHeading eyebrow="A SPACE TO CONNECT" title="Conversations, with care." />
      <div className="chat-layout">
        <aside className="chat-list">
          {conversations.map((c) => (
            <Link
              to="/chats/$id"
              params={{ id: c.id }}
              key={c.id}
              className={active?.id === c.id ? 'active' : ''}
            >
              <span className="chat-avatar">{c.initials}</span>
              <div>
                <h3>{c.title}</h3>
                <p>{c.preview}</p>
              </div>
            </Link>
          ))}
          <p>
            <ShieldCheck size={16} />
            No adult–minor private messaging. Personal phone numbers stay private.
          </p>
        </aside>

        {active && (
          <section className="chat-room">
            <header>
              <div>
                <h3>{active.title}</h3>
                <small>{active.subtitle}</small>
              </div>
              <Button variant="ghost" onClick={() => setMuted(!muted)}>
                {muted ? 'Unmute' : 'Mute'}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Report conversation"
                aria-label="Report conversation"
                onClick={() => setReport(true)}
              >
                <ShieldCheck />
              </Button>
            </header>

            <div className="chat-messages">
              <p className="system-message">
                <ShieldCheck size={14} />
                This is a community conversation. Keep personal details private and meet one another with care.
              </p>
              {chatMessages.map((m) => (
                <div
                  className={m.senderId === user?.id || m.sender === senderName ? 'message outgoing' : 'message'}
                  key={m.id}
                >
                  <span className="message-avatar">{(m.sender || 'C').charAt(0)}</span>
                  <div>
                    <small>
                      {m.sender} · {m.time}
                    </small>
                    {m.reply && <blockquote>{m.reply}</blockquote>}
                    <p>{m.text}</p>
                    <Button variant="link" size="sm" onClick={() => setReply(m.text)}>
                      Reply
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {reply && (
              <div className="reply-preview">
                Replying to: {reply}
                <Button variant="ghost" onClick={() => setReply('')}>
                  Cancel
                </Button>
              </div>
            )}

            <form
              className="chat-compose"
              onSubmit={(e) => {
                e.preventDefault();
                if (!draft.trim() || !activeId) return;
                sendMessageMutation.mutate({
                  text: draft,
                  sender: senderName,
                  senderId: user?.id,
                  reply: reply || undefined,
                });
                setDraft('');
                setReply('');
              }}
            >
              <input
                aria-label="Your message"
                placeholder={blocked ? 'Conversation blocked for this session' : 'Write with care…'}
                disabled={blocked}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!draft.trim() || blocked}
                aria-label="Send message"
              >
                <Send />
              </Button>
            </form>
            <p className="chat-footer">
              {muted
                ? 'This conversation is muted.'
                : 'Shared with this community. No personal contact details needed.'}
            </p>
          </section>
        )}
      </div>

      <Dialog open={report} onOpenChange={setReport}>
        <DialogContent>
          <DialogTitle>{reported ? 'Your report has been noted.' : 'Keep this space safe.'}</DialogTitle>
          <DialogDescription>
            {reported
              ? 'Your report has been received and will be reviewed with care.'
              : 'Tell us what feels wrong. Reports are private.'}
          </DialogDescription>
          {!reported && (
            <>
              <label>
                Reason
                <select value={reason} onChange={(e) => setReason(e.target.value)}>
                  <option>Privacy concern</option>
                  <option>Unkind or harmful language</option>
                  <option>Unsafe conduct</option>
                  <option>Other</option>
                </select>
              </label>
              <textarea aria-label="Report details" placeholder="Share only what is necessary…" />
              <Button
                onClick={() => {
                  if (active) {
                    submitReport({
                      target_type: 'conversation',
                      target_id: active.id,
                      reason,
                      details: reason,
                      reporter_id: user?.id,
                    });
                  }
                  setReported(true);
                }}
              >
                Submit report
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setBlocked(true);
                  setReport(false);
                }}
              >
                Block this conversation
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
