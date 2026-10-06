import { Link } from '@tanstack/react-router';
import { Search, SlidersHorizontal, X, MapPin, ArrowUpRight, Sun, Moon, Bookmark, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useArpan } from '@/lib/arpan/state';
import { useAuth } from '@/lib/arpan/auth';
import { categories, type Kind } from '@/lib/arpan/data';
import { ActionGrid, PageHeading, EntryCard, DemoNote, Empty } from './shared';

const tabs = [
  { kind: 'seva', name: 'Seva', to: '/explore/seva' },
  { kind: 'needs', name: 'Needs', to: '/explore/needs' },
  { kind: 'offers', name: 'Offers', to: '/explore/offers' },
  { kind: 'institutions', name: 'Institutions', to: '/explore/institutions' },
] as const;

export function Discovery({
  kind = 'seva',
  dedicated = false,
}: {
  kind?: Kind;
  dedicated?: boolean;
}) {
  const { entries, saved, joined } = useArpan();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All categories');
  const [location, setLocation] = useState('All locations');
  const [filters, setFilters] = useState(false);
  const [verified, setVerified] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [onlySaved, setOnlySaved] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('Any time');
  const [skill, setSkill] = useState('');
  const [availability, setAvailability] = useState('Any availability');

  const filtered = entries.filter((e) => {
    if (e.kind !== kind) return false;

    if (dedicated) {
      if (!user) return false;

      if (kind === 'offers') {
        if (e.creator_id !== user.id) return false;
      } else if (kind === 'needs') {
        if (e.creator_id !== user.id) return false;
      } else if (kind === 'seva') {
        const isHost = e.creator_id === user.id;
        const isJoined = joined.includes(e.id);
        if (!isHost && !isJoined) return false;
      }
    } else {
      if (e.privacy === 'Matched-only') return false;
    }

    return (
      `${e.title} ${e.context} ${e.category}`.toLowerCase().includes(search.toLowerCase()) &&
      (category === 'All categories' || e.category === category) &&
      (location === 'All locations' || e.location === location) &&
      (!verified || e.verified) &&
      (!recurring || e.recurring) &&
      (!onlySaved || saved.includes(e.id)) &&
      (!date || e.date === date) &&
      (time === 'Any time' ||
        (time === 'Morning' && (e.time || '').includes('AM')) ||
        (time === 'Afternoon' && (e.time || '').includes('PM'))) &&
      (!skill || `${e.title} ${e.category}`.toLowerCase().includes(skill.toLowerCase())) &&
      (availability === 'Any availability' || availability === 'Weekends')
    );
  });

  function reset() {
    setSearch('');
    setCategory('All categories');
    setLocation('All locations');
    setVerified(false);
    setRecurring(false);
    setOnlySaved(false);
    setDate('');
    setTime('Any time');
    setSkill('');
    setAvailability('Any availability');
  }

  return (
    <div className="page-container">
      <PageHeading
        eyebrow={dedicated ? 'YOUR PARTICIPATION' : 'CONNECTION BEGINS WITH CURIOSITY'}
        title={
          dedicated
            ? kind === 'offers'
              ? 'Your Offers'
              : kind === 'needs'
              ? 'Your Requests'
              : kind === 'institutions'
              ? 'Stand with a community.'
              : 'Your Sevas'
            : 'Find your way to connect.'
        }
        description={
          dedicated
            ? kind === 'offers'
              ? 'Offers you have created and shared with the community.'
              : kind === 'needs'
              ? 'Requests for support you have asked for with dignity.'
              : kind === 'seva'
              ? 'Sevas you are hosting or have taken Sankalp to join.'
              : 'Community partners and shared initiatives.'
            : kind === 'needs'
            ? 'Every request is a person’s story. Meet it with care.'
            : 'A little time, a shared skill, a moment of presence. Begin where you are.'
        }
        action={
          kind === 'seva' ? (
            <Button variant="outline" asChild>
              <Link to="/seva/create">
                <Plus />
                Host Seva
              </Link>
            </Button>
          ) : kind === 'offers' ? (
            <Button asChild>
              <Link to="/offer/create">
                <Plus />
                Offer something
              </Link>
            </Button>
          ) : kind === 'needs' ? (
            <Button asChild>
              <Link to="/ask/create">
                <Plus />
                Ask for support
              </Link>
            </Button>
          ) : undefined
        }
      />
      {!dedicated && (
        <div className="discovery-tabs" role="navigation" aria-label="Discovery categories">
          {tabs.map((t) => (
            <Link key={t.kind} to={t.to} className={kind === t.kind ? 'active' : ''}>
              {t.name}
            </Link>
          ))}
        </div>
      )}
      <div className="filter-bar">
        <label className="search-field">
          <Search size={18} />
          <input
            aria-label="Search opportunities"
            placeholder={`Search ${kind}, skills, or a little inspiration…`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <Button size="icon" variant="ghost" aria-label="Clear search" onClick={() => setSearch('')}>
              <X />
            </Button>
          )}
        </label>
        <label className="select-field">
          <MapPin size={16} />
          <select aria-label="Location" value={location} onChange={(e) => setLocation(e.target.value)}>
            {['All locations', 'Bengaluru', 'Pune', 'Mumbai', 'Delhi', 'Chennai', 'Online'].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <Button variant="outline" onClick={() => setFilters(!filters)}>
          <SlidersHorizontal />
          Filters
        </Button>
        <Button
          variant={onlySaved ? 'secondary' : 'outline'}
          size="icon"
          title="Saved opportunities"
          aria-label="Show saved opportunities"
          onClick={() => setOnlySaved(!onlySaved)}
        >
          <Bookmark />
        </Button>
      </div>
      {filters && (
        <div className="expanded-filters">
          <label>
            Category
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>All categories</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
              <option>Community</option>
            </select>
          </label>
          <label>
            Date
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label>
            Time
            <select value={time} onChange={(e) => setTime(e.target.value)}>
              <option>Any time</option>
              <option>Morning</option>
              <option>Afternoon</option>
            </select>
          </label>
          <label>
            Skill
            <input
              placeholder="e.g. Python"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
            />
          </label>
          <label>
            Availability
            <select value={availability} onChange={(e) => setAvailability(e.target.value)}>
              <option>Any availability</option>
              <option>Weekends</option>
              <option>Weekdays</option>
            </select>
          </label>
          <label className="check-label">
            <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} />
            Verified only
          </label>
          <label className="check-label">
            <input type="checkbox" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} />
            Recurring
          </label>
          <Button variant="ghost" onClick={reset}>
            Reset
          </Button>
        </div>
      )}
      <div className="results-heading">
        <p>
          {filtered.length}{' '}
          {dedicated
            ? kind === 'seva'
              ? filtered.length === 1 ? 'Seva you host or joined' : 'Sevas you host or joined'
              : kind === 'offers'
              ? filtered.length === 1 ? 'offer shared by you' : 'offers shared by you'
              : kind === 'needs'
              ? filtered.length === 1 ? 'request asked by you' : 'requests asked by you'
              : 'communities to meet'
            : kind === 'seva'
            ? 'ways to show up'
            : kind === 'institutions'
            ? 'communities to meet'
            : kind === 'offers'
            ? 'offers to connect with'
            : 'requests to meet with care'}
        </p>
        <span>
          {dedicated
            ? 'Your personal participation in the community.'
            : 'Everyone has something to offer.'}
        </span>
      </div>
      {filtered.length ? (
        <div className="entry-grid">
          {filtered.map((e) => (
            <EntryCard key={e.id} entry={e} />
          ))}
        </div>
      ) : dedicated && !user ? (
        <Empty
          title="Sign in to view your activity"
          text={`Sign in to see the ${kind === 'needs' ? 'requests' : kind === 'offers' ? 'offers' : 'Sevas'} you host, join or request.`}
        >
          <div className="mt-4 flex gap-2 justify-center">
            <Button asChild>
              <Link to="/login">Sign in</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to={kind === 'needs' ? '/explore/needs' : kind === 'offers' ? '/explore/offers' : '/explore/seva'}>
                Explore community {kind}
              </Link>
            </Button>
          </div>
        </Empty>
      ) : dedicated && user ? (
        <Empty
          title={
            kind === 'offers'
              ? 'You have not created any offers yet.'
              : kind === 'needs'
              ? 'You have not submitted any requests yet.'
              : kind === 'seva'
              ? 'You have not hosted or joined any Sevas yet.'
              : 'Nothing found.'
          }
          text={
            kind === 'offers'
              ? 'Everyone has something to share. Offer a skill, some time, or care.'
              : kind === 'needs'
              ? 'Needing support is part of being human. Share what would help you with dignity.'
              : kind === 'seva'
              ? 'Join a community Seva by taking Sankalp or host an initiative yourself.'
              : 'Try exploring community spaces.'
          }
        >
          <div className="mt-4 flex gap-2 justify-center">
            {kind === 'offers' ? (
              <>
                <Button asChild>
                  <Link to="/offer/create"><Plus /> Offer something</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/explore/offers">Explore community offers</Link>
                </Button>
              </>
            ) : kind === 'needs' ? (
              <>
                <Button asChild>
                  <Link to="/ask/create"><Plus /> Ask for support</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/explore/needs">Explore community requests</Link>
                </Button>
              </>
            ) : kind === 'seva' ? (
              <>
                <Button asChild>
                  <Link to="/seva/create"><Plus /> Host Seva</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/explore/seva">Explore community Seva</Link>
                </Button>
              </>
            ) : null}
          </div>
        </Empty>
      ) : (
        <Empty
          title={kind === 'needs' ? 'No requests here right now.' : 'Nothing nearby right now.'}
          text="Seva doesn’t always arrive on schedule. Try a different search."
          onReset={reset}
        />
      )}
      <DemoNote />
    </div>
  );
}

export function HomePage() {
  const { entries, name, joined } = useArpan();
  const [greeting, setGreeting] = useState('Welcome');
  const [Icon, setIcon] = useState(() => Sun);

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening');
    setIcon(hour < 17 ? () => Sun : () => Moon);
  }, []);

  return (
    <div className="page-container">
      <div className="home-welcome">
        <span>
          <Icon size={19} /> A NEW MOMENT TO BEGIN
        </span>
        <h1 suppressHydrationWarning>{greeting}, {name}.</h1>
        <p>What would you like to do?</p>
      </div>
      <ActionGrid />
      {joined.length > 0 && (
        <div className="joined-banner">
          <div>
            <p className="eyebrow">YOUR SANKALP</p>
            <h3>You have a place at the next Seva.</h3>
            <p>{entries.find((e) => e.id === joined[0])?.title}</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/journey">
              View your journey <ArrowUpRight />
            </Link>
          </Button>
        </div>
      )}
      <div className="section-heading">
        <div>
          <p className="eyebrow">BEGIN WHERE YOU ARE</p>
          <h2>For you</h2>
        </div>
        <Link className="text-link" to="/explore">
          Explore the community <ArrowUpRight size={18} />
        </Link>
      </div>
      <div className="entry-grid home-entry-grid">
        {['seva', 'needs', 'offers', 'institutions'].map((k) => {
          const entry = entries.find((e) => e.kind === k);
          return entry ? <EntryCard key={k} entry={entry} /> : null;
        })}
      </div>
      <div className="quiet-note">
        <SproutIcon />
        <p>
          “This is the gist of all worship — to be pure and to do good to others.”
          <br />
          <span style={{ fontSize: '10px', marginTop: '8px', display: 'block', color: 'var(--muted-foreground)', letterSpacing: '1px' }}>— SWAMI VIVEKANANDA</span>
        </p>
      </div>
      <DemoNote />
    </div>
  );
}

function SproutIcon() {
  return <Sun size={28} strokeWidth={1} />;
}
