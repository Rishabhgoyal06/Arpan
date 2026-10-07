import { Link, useRouterState, useRouter } from '@tanstack/react-router';
import {
  ArrowUpRight,
  ArrowRight,
  Bell,
  BookOpen,
  Bookmark,
  Check,
  Compass,
  HandHeart,
  Heart,
  Home,
  Leaf,
  MapPin,
  MessageCircle,
  Plus,
  ShieldCheck,
  Sprout,
  User,
  Users,
  Menu,
  X,
  Moon,
  Sun, Smile, Sparkles, Book, Utensils, Stethoscope, Gift, Monitor, Shirt, HandCoins, Sprout as SproutIcon, Users as UsersIcon } from 'lucide-react';
import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useArpan } from '@/lib/arpan/state';
import { useLanguage } from '@/lib/arpan/i18n';
import type { Entry } from '@/lib/arpan/data';

import { useAuth } from '@/lib/arpan/auth';

export function AnimatedTopbarMessage() {
  const [index, setIndex] = useState(0);
  const messages = [
    "Offer what you can. Be present.",
    "They alone live, who live for others.",
    "Unselfishness is God.",
    "Work for work's sake. Worship for worship's sake.",
    "Serve silently. Expect nothing."
  ];
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  return (
    <span className="topbar-message animated-message-container">
      <span key={index} className="msg-fade-in">{messages[index]}</span>
    </span>
  );
}
export function Mark() {
  return (
    <span className="brand-mark">
      <Sprout strokeWidth={1.6} />
    </span>
  );
}

import vivekanandaImg from '@/assets/vivekananda.png';

export function Brand() {
  const { user } = useAuth();
  return (
    <Link to={user ? "/home" : "/"} className="brand">
      <Mark />
      <span className="brand-text-wrapper">
        <span className="brand-title">ARPAN</span>
        <small>TECHNOLOGY AS SEVA</small>
      </span>
      <img src={vivekanandaImg} alt="Swami Vivekananda" className="brand-swami" />
    </Link>
  );
}
const nav = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/offer', label: 'Offer', icon: HandHeart },
  { to: '/ask', label: 'Ask', icon: Heart },
  { to: '/seva', label: 'Seva', icon: Users },
  { to: '/institutions', label: 'Institutions', icon: Leaf },
  { to: '/journey', label: 'Journey', icon: BookOpen },
  { to: '/chats', label: 'Chats', icon: MessageCircle },
] as const;

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

export function LanguageSelector() {
  const { lang, setLang } = useLanguage();
  return (
    <select 
      value={lang} 
      onChange={(e) => setLang(e.target.value as any)}
      className="language-selector"
      aria-label="Select language"
      style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: '4px', padding: '4px 8px', fontSize: '13px', color: 'var(--foreground)', cursor: 'pointer', outline: 'none' }}
    >
      <option value="en">English</option>
      <option value="hi">हिंदी (Hindi)</option>
      <option value="kn">ಕನ್ನಡ (Kannada)</option>
      <option value="ta">தமிழ் (Tamil)</option>
      <option value="te">తెలుగు (Telugu)</option>
      <option value="mr">मराठी (Marathi)</option>
      <option value="bn">বাংলা (Bengali)</option>
    </select>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const router = useRouter();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);
  const publicPage = ['/', '/about', '/philosophy', '/how-it-works', '/login', '/signup'].includes(path);
  const isAppView = !publicPage || isAuthenticated;
  const isLanding = path === '/' || path === '/login' || path === '/signup';
  const [menu, setMenu] = useState(false);
  const { name, read } = useArpan();

  const prevPathRef = useRef(path);
  const transitionClassRef = useRef('transition-fade');

  if (path !== prevPathRef.current) {
    const from = prevPathRef.current;
    const to = path;
    const action = (router as any).history?.action || 'PUSH';
    
    if (action === 'POP') {
      transitionClassRef.current = 'transition-slide-backward';
    } else if (
      to.includes('/create') || 
      (from === '/' && (to === '/login' || to === '/signup')) ||
      to.includes('/reflection')
    ) {
      transitionClassRef.current = 'transition-slide-forward';
    } else if (
      (to.startsWith('/seva/') && to !== '/seva/create') ||
      (to.startsWith('/offer/') && to !== '/offer/create') ||
      (to.startsWith('/needs/') && to !== '/needs/create') ||
      (to.startsWith('/institutions/') && to !== '/institutions/create') ||
      (from === '/login' || from === '/signup') && to === '/home'
    ) {
      transitionClassRef.current = 'transition-pop-in';
    } else {
      transitionClassRef.current = 'transition-fade';
    }
    prevPathRef.current = path;
  }

  return (
    <div className={isAppView ? 'app-shell' : `public-shell ${isLanding ? 'is-landing' : ''}`}>
      <header className="topbar">
        <Brand />
        <nav className="public-nav" aria-label="Main navigation">
          {!isAuthenticated ? (
            <>
              <Link to="/explore">{t('nav.explore')}</Link>
              <Link to="/about">About ARPAN</Link>
              <Link to="/philosophy">Our philosophy</Link>
              <Link to="/how-it-works">How it works</Link>
            </>
          ) : (
            <AnimatedTopbarMessage />
          )}
        </nav>
        <div className="header-actions">
          {isAuthenticated ? (
            <>
              {publicPage && path !== '/home' && (
                <Button variant="ghost" asChild>
                  <Link to="/home">{t('nav.home')}</Link>
                </Button>
              )}
              <LanguageSelector />
          <ThemeToggle />
              <Button variant="ghost" size="icon" asChild title="Notifications">
                <Link aria-label="Notifications" to="/notifications">
                  <Bell />
                  {read.length === 0 && <span className="notification-dot" />}
                </Link>
              </Button>
              <Link className="avatar" to="/profile" aria-label="Your profile">
                {name.slice(0, 1) || 'A'}
              </Link>
            </>
          ) : (
            <>
              <LanguageSelector />
          <ThemeToggle />
              <Link className="login-link" to="/login">
                Log in
              </Link>
              <Button asChild>
                <Link to="/signup">
                  Begin with ARPAN <ArrowUpRight />
                </Link>
              </Button>
            </>
          )}
          <Button
            className="menu-button"
            size="icon"
            variant="ghost"
            aria-label={menu ? 'Close navigation' : 'Open navigation'}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </Button>
        </div>
      </header>

      {menu && (
        <nav className="mobile-menu" aria-label="Expanded navigation" onClick={() => setMenu(false)}>
          {isAuthenticated ? (
            <>
              {nav.map((n) => (
                <Link key={n.to} to={n.to}>
                  {t('nav.' + n.label.toLowerCase())}
                </Link>
              ))}
              <Link to="/profile">Profile</Link>
            </>
          ) : (
            <>
              <Link to="/explore">{t('nav.explore')}</Link>
              <Link to="/about">About ARPAN</Link>
              <Link to="/philosophy">Our philosophy</Link>
              <Link to="/how-it-works">How it works</Link>
              <Link to="/login">Log in</Link>
              <Link to="/signup">Begin with ARPAN</Link>
            </>
          )}
        </nav>
      )}

      {isAppView && path !== '/' && (
        <aside className="sidebar">
          <nav aria-label="Community navigation">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={path === n.to || path.startsWith(n.to + '/') ? 'side-link active' : 'side-link'}
              >
                <n.icon />
                {t('nav.' + n.label.toLowerCase())}
              </Link>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <ShieldCheck />
            <p>
              A place to give.
              <br />
              A place to receive.
              <br />
              A place to belong.
            </p>
            <Link to="/about">
              The spirit of ARPAN <ArrowUpRight size={14} />
            </Link>
            <Link className="admin-link" to="/admin">
              Community moderation
            </Link>
          </div>
        </aside>
      )}

      {!isLanding && <><WholesomeBackground /><SwamiVivekanandaWatermark /></>}
      <main key={path} className={`${isAppView ? 'app-main' : 'public-main'} ${transitionClassRef.current}`}>{children}</main>

      {isAppView && (
        <nav className="bottom-nav" aria-label="Mobile navigation">
          {nav
            .filter((n) => ['Home', 'Explore', 'Journey'].includes(n.label))
            .map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={path.startsWith(n.to) ? 'active' : ''}
              >
                <n.icon />
                {t('nav.' + n.label.toLowerCase())}
              </Link>
            ))}
          <Link to="/profile">
            <User />
            Profile
          </Link>
        </nav>
      )}

      {!isAppView && <Footer />}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <Brand />
        <p>Offer yourself. Grow by serving.</p>
        <div>
          <Link to="/philosophy">Our philosophy</Link>
          <Link to="/about">About</Link>
          <Link to="/explore">Explore</Link>
        </div>
        <small>Â© 2026 ARPAN Â· Built around dignity.</small>
      </div>
    </footer>
  );
}

export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function DemoNote() {
  return (
    <p className="demo-note">
      <ShieldCheck size={14} /> Community space rooted in dignity, privacy, and reciprocal care.
    </p>
  );
}

export function EntryLink({
  entry,
  children,
  className,
}: {
  entry: Entry;
  children: ReactNode;
  className?: string;
}) {
  if (entry.kind === 'seva') return <Link className={className} to="/seva/$id" params={{ id: entry.id }}>{children}</Link>;
  if (entry.kind === 'institutions') return <Link className={className} to="/institutions/$id" params={{ id: entry.id }}>{children}</Link>;
  if (entry.kind === 'offers') return <Link className={className} to="/offer/$id" params={{ id: entry.id }}>{children}</Link>;
  return <Link className={className} to="/needs/$id" params={{ id: entry.id }}>{children}</Link>;
}

export function EntryCard({ entry }: { entry: Entry }) {
  const { saved, toggleSave, joined } = useArpan();
  const { user } = useAuth();
  const isMine = Boolean(user && entry.creator_id && entry.creator_id === user.id);
  const isJoined = joined.includes(entry.id);

  return (
    <article className={`entry-card kind-${entry.kind} ${entry.image ? '' : 'text-card'}`}>
      {entry.image && (
        <EntryLink entry={entry} className="card-image">
          <img src={entry.image} alt={entry.title} loading="lazy" width={1024} height={768} />
          <span className="image-category">{entry.category}</span>
        </EntryLink>
      )}
      <div className="card-content">
        <div className="card-meta">
          <span className="kind-label">
            {entry.kind === 'seva' ? 'Seva' : entry.kind === 'offers' ? 'Offer' : entry.kind === 'needs' ? 'Request' : 'Support'}
          </span>
          {entry.verified && (
            <span className="verified">
              <ShieldCheck size={13} /> Verified
            </span>
          )}
          {isMine && (
            <span className="verified" style={{ background: 'var(--muted)', color: 'var(--primary)' }}>
              {entry.kind === 'seva' ? 'Hosting' : entry.kind === 'offers' ? 'Your offer' : 'Your request'}
            </span>
          )}
          {!isMine && isJoined && (
            <span className="verified" style={{ background: 'var(--muted)', color: 'var(--foreground)' }}>
              Joined (Sankalp)
            </span>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="bookmark-button"
            title={saved.includes(entry.id) ? 'Remove saved opportunity' : 'Save opportunity'}
            aria-label={saved.includes(entry.id) ? 'Remove saved opportunity' : 'Save opportunity'}
            onClick={() => toggleSave(entry.id)}
          >
            <Bookmark className={saved.includes(entry.id) ? 'saved' : ''} />
          </Button>
        </div>
        {!entry.image && (
          <div className="text-category-wrapper">
            <span className="text-category">{entry.category}</span>
            <CategoryAnimation category={entry.category} />
          </div>
        )}
        <EntryLink entry={entry}>
          <h3>{entry.title}</h3>
        </EntryLink>
        <p>{entry.context}</p>
        <div className="card-location">
          <MapPin size={14} />
          {entry.location}
          <span>Â·</span>
          {entry.kind === 'seva' ? (entry.date || 'Community gathering') : entry.kind === 'offers' ? 'Flexible' : 'Community-visible'}
        </div>
        <div className="card-footer">
          <span>
            {entry.kind === 'seva'
              ? `${entry.time || '10:00 AM'} Â· ${entry.duration || '2 hours'}`
              : entry.kind === 'institutions'
              ? 'Time, skills & resources'
              : 'Offer what you can'}
          </span>
          <EntryLink entry={entry}>
            {entry.kind === 'offers'
              ? 'Connect'
              : entry.kind === 'needs'
              ? 'View need'
              : entry.kind === 'institutions'
              ? 'Meet the community'
              : 'Explore Seva'}
            <ArrowUpRight size={16} />
          </EntryLink>
        </div>
      </div>
    </article>
  );
}

const actions = [
  {
    title: 'Offer',
    text: 'Give what you have.',
    detail: 'Your time, skills, or a little of what you can spare.',
    to: '/offer/create',
    icon: HandHeart,
    tone: 'offer',
  },
  {
    title: 'Ask',
    text: 'Ask when you need.',
    detail: 'A helping hand. A listening ear. A way forward.',
    to: '/ask/create',
    icon: Heart,
    tone: 'ask',
  },
  {
    title: 'Serve',
    text: 'Show up with others.',
    detail: 'Find a seva that speaks to you. Be a part of it.',
    to: '/seva',
    icon: Users,
    tone: 'serve',
  },
  {
    title: 'Support',
    text: 'Stand with a community.',
    detail: 'Connect with institutions doing meaningful work.',
    to: '/institutions',
    icon: Leaf,
    tone: 'support',
  },
] as const;

export function ActionGrid() {
  return (
    <div className="action-grid">
      {actions.map((a) => (
        <Link key={a.title} to={a.to} className={`action-item ${a.tone}`}>
          <div className="action-top">
            <span className="action-icon">
              <a.icon strokeWidth={1.5} />
            </span>
            <ArrowUpRight size={18} />
          </div>
          <span className="eyebrow">{a.title}</span>
          <h3>{a.text}</h3>
          <p>{a.detail}</p>
        </Link>
      ))}
    </div>
  );
}

export function Empty({
  title = 'Nothing here right now.',
  text = 'Try a different search, or come back when the time feels right.',
  onReset,
  children,
}: {
  title?: string;
  text?: string;
  onReset?: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <Sprout size={40} strokeWidth={1} />
      <h3>{title}</h3>
      <p>{text}</p>
      {children}
      {onReset && (
        <Button variant="outline" onClick={onReset}>
          Clear filters
        </Button>
      )}
    </div>
  );
}

export function Success({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children?: ReactNode;
}) {
  return (
    <div className="success-state">
      <span>
        <Check size={30} />
      </span>
      <h1>{title}</h1>
      <p>{text}</p>
      {children}
    </div>
  );
}

export { ArrowRight, ArrowUpRight, Plus };

export function WholesomeBackground() {
  return (
    <div className="wholesome-bg" aria-hidden="true">
      <div className="svg-container pos-1">
        <MandalaSVG />
      </div>
      <div className="svg-container pos-2">
        <MandalaSVG />
      </div>
    </div>
  );
}

function MandalaSVG() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="animated-mandala">
      <g stroke="currentColor" fill="none" strokeWidth="0.6" transform="translate(100 100)">
        <circle cx="0" cy="0" r="85" opacity="0.15" />
        <circle cx="0" cy="0" r="75" opacity="0.25" />
        <circle cx="0" cy="0" r="25" opacity="0.4" />
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <g key={deg} transform={`rotate(${deg})`}>
            <g className="petal outer-petal">
              <path d="M0 25 C -20 40, -10 70, 0 85 C 10 70, 20 40, 0 25 Z" opacity="0.4" />
            </g>
            <g className="petal inner-petal">
              <path d="M0 25 C -10 35, -5 60, 0 75 C 5 60, 10 35, 0 25 Z" opacity="0.6" />
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}


export function MindfulnessStory() {
  return (
    <div className="mindfulness-story" aria-hidden="true" title="Selfless service brings inner joy">
      <div className="story-person story-receiver">
        <User size={48} strokeWidth={1} />
      </div>
      <div className="story-heart">
        <Heart size={20} fill="currentColor" stroke="none" />
      </div>
      <div className="story-person story-server">
        <div className="server-base"><User size={48} strokeWidth={1} /></div>
        <div className="server-happy"><Smile size={48} strokeWidth={1} /></div>
        <div className="server-sparkles"><Sparkles size={64} strokeWidth={1} /></div>
      </div>
    </div>
  );
}




export function CategoryAnimation({ category }: { category: string }) {
  const cat = category.toLowerCase();
  
  if (cat.includes('teach') || cat.includes('education') || cat.includes('skill')) {
    return (
      <div className="cat-anim cat-teach">
        <Book size={48} className="cat-icon-main" strokeWidth={1.5} />
        <Sparkles size={24} className="cat-icon-sub" strokeWidth={2} />
      </div>
    );
  }
  if (cat.includes('food')) {
    return (
      <div className="cat-anim cat-food">
        <Utensils size={48} className="cat-icon-main" strokeWidth={1.5} />
        <Heart size={20} className="cat-icon-sub" strokeWidth={2} />
      </div>
    );
  }
  if (cat.includes('health') || cat.includes('medical') || cat.includes('elder')) {
    return (
      <div className="cat-anim cat-health">
        <Stethoscope size={48} className="cat-icon-main" strokeWidth={1.5} />
        <Plus size={20} className="cat-icon-sub" strokeWidth={2.5} />
      </div>
    );
  }
  if (cat.includes('environment') || cat.includes('clean')) {
    return (
      <div className="cat-anim cat-env">
        <Leaf size={48} className="cat-icon-main" strokeWidth={1.5} />
        <SproutIcon size={24} className="cat-icon-sub" strokeWidth={1.5} />
      </div>
    );
  }
  if (cat.includes('tech') || cat.includes('digital')) {
    return (
      <div className="cat-anim cat-tech">
        <Monitor size={48} className="cat-icon-main" strokeWidth={1.5} />
        <ArrowUpRight size={24} className="cat-icon-sub" strokeWidth={2} />
      </div>
    );
  }
  if (cat.includes('cloth')) {
    return (
      <div className="cat-anim cat-cloth">
        <Shirt size={48} className="cat-icon-main" strokeWidth={1.5} />
        <Sparkles size={20} className="cat-icon-sub" strokeWidth={2} />
      </div>
    );
  }
  if (cat.includes('donat') || cat.includes('financ') || cat.includes('resource')) {
    return (
      <div className="cat-anim cat-donate">
        <HandCoins size={48} className="cat-icon-main" strokeWidth={1.5} />
        <Gift size={24} className="cat-icon-sub" strokeWidth={1.5} />
      </div>
    );
  }
  
  // Default fallback (Community, Misc, Mobility)
  return (
    <div className="cat-anim cat-misc">
      <UsersIcon size={48} className="cat-icon-main" strokeWidth={1.5} />
      <Heart size={20} className="cat-icon-sub" strokeWidth={2} />
    </div>
  );
}









export function SwamiVivekanandaWatermark() {
  return (
    <div className="vivekananda-watermark" aria-hidden="true" title="Swami Vivekananda">
      <img src={vivekanandaImg} alt="Swami Vivekananda background silhouette" />
    </div>
  );
}





