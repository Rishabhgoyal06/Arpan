import { Link } from '@tanstack/react-router';
import { Search, SlidersHorizontal, X, MapPin, ArrowUpRight, Sun, Bookmark, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useArpan } from '@/lib/arpan/state';
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
  const { entries, saved } = useArpan();
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

  const filtered = entries.filter(
    (e) =>
      e.kind === kind &&
      e.privacy !== 'Matched-only' &&
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
        eyebrow={dedicated ? 'OUR COMMUNITY' : 'CONNECTION BEGINS WITH CURIOSITY'}
        title={
          dedicated
            ? kind === 'offers'
              ? 'Offer what you can.'
              : kind === 'needs'
              ? 'It’s okay to ask.'
              : kind === 'institutions'
              ? 'Stand with a community.'
              : 'Find a place to be present.'
            : 'Find your way to connect.'
        }
        description={
          kind === 'needs'
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
      <div className="discovery-tabs" role="navigation" aria-label="Discovery categories">
        {tabs.map((t) => (
          <Link key={t.kind} to={t.to} className={kind === t.kind ? 'active' : ''}>
            {t.name}
          </Link>
        ))}
      </div>
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
          {kind === 'seva'
            ? 'ways to show up'
            : kind === 'institutions'
            ? 'communities to meet'
            : kind === 'offers'
            ? 'offers to connect with'
            : 'requests to meet with care'}
        </p>
        <span>Everyone has something to offer.</span>
      </div>
      {filtered.length ? (
        <div className="entry-grid">
          {filtered.map((e) => (
            <EntryCard key={e.id} entry={e} />
          ))}
        </div>
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
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="page-container">
      <div className="home-welcome">
        <span>
          <Sun size={19} /> A NEW MOMENT TO BEGIN
        </span>
        <h1>{greeting}, {name}.</h1>
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
          “You don’t need to be a hero.
          <br />
          You can simply show up.”
        </p>
      </div>
      <DemoNote />
    </div>
  );
}

function SproutIcon() {
  return <Sun size={28} strokeWidth={1} />;
}
