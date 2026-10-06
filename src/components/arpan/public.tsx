import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowRight, ArrowUpRight, HeartHandshake, Shield, EyeOff, Sprout, HandHeart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { images } from '@/lib/arpan/data';
import { useArpan } from '@/lib/arpan/state';
import { useAuth } from '@/lib/arpan/auth';
import { ActionGrid, EntryCard, PageHeading } from './shared';
export function Landing(){ const {entries}=useArpan(); return <><section className="landing-hero"><img src={images.community} alt="Community members planting together in a shared garden" width={1920} height={1024}/><div className="hero-shade"/><div className="container hero-content"><span className="hero-eyebrow"><span/> SMALL ACTS. SHARED HUMANITY.</span><h1>ARPAN<span>Technology as Seva</span></h1><h2>Offer yourself.<br/>Grow by serving.</h2><p>Give what you can. Ask when you need.<br/>Serve with others.</p><div className="hero-buttons"><Button asChild size="lg"><Link to="/signup">Begin with ARPAN <ArrowUpRight/></Link></Button><Button variant="outline" size="lg" asChild className="hero-secondary"><Link to="/explore">Explore Seva <ArrowRight/></Link></Button></div></div><div className="hero-caption"><span className="caption-line"/>No act is too small.<br/>No person is only a receiver.</div></section><section className="participation-section container"><div className="section-heading"><div><p className="eyebrow">A LITTLE OF YOU CAN MEAN A LOT</p><h2>There is more than one way to give.</h2></div><p>You don’t need to have everything.<br/>You can begin with what you have.</p></div><ActionGrid/></section><section className="reciprocity-band"><div className="container reciprocity-inner"><span className="reciprocity-symbol"><HeartHandshake size={46} strokeWidth={1.2}/></span><div><p className="eyebrow">NO LABELS. JUST PEOPLE.</p><h2>Everyone can give.<br/>Everyone can receive.</h2></div><div className="reciprocity-copy"><p>You may have something to offer today.<br/>You may need support tomorrow.</p><p>Here, neither defines you. We meet as people,<br/>with something to share and room to grow.</p><Link to="/philosophy">The spirit of ARPAN <ArrowUpRight size={17}/></Link></div></div></section><section className="container opportunities-section"><div className="section-heading"><div><p className="eyebrow">FIND SOMETHING THAT SPEAKS TO YOU</p><h2>A place to show up.</h2></div><Link className="text-link" to="/explore">Explore all Seva <ArrowUpRight size={18}/></Link></div><div className="entry-grid">{entries.filter(e=>e.kind==='seva').slice(0,3).map(e=><EntryCard key={e.id} entry={e}/>)}</div><p className="discreet-demo">Connecting community through Seva · Opportunities to offer, ask, serve, and support.</p></section><section className="journey-band"><div className="container"><div className="section-heading"><div><p className="eyebrow">SERVICE IS A PRACTICE, NOT AN ACHIEVEMENT</p><h2>A journey inward. Together.</h2></div><Link className="text-link" to="/journey">Discover your journey <ArrowUpRight size={17}/></Link></div><div className="journey-steps">{[['01','Feel','Notice what moves you.'],['02','Organize','Find a way to be present.'],['03','Serve','Do what you can.'],['04','Reflect','Pause. Notice. Learn.'],['05','Release','Let go of the result.']].map(([n,t,d])=><div key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}</div></div></section><section className="container privacy-section"><div><EyeOff size={34} strokeWidth={1.2}/><p className="eyebrow">PRESENCE, NOT RECOGNITION</p><h2>Service does not<br/>need an audience.</h2></div><div><p>Offer quietly. Ask safely. Support anonymously.</p><p>Your story is yours to share. ARPAN is built around dignity, privacy, humility and the freedom to simply be yourself.</p><Link className="text-link" to="/profile">Your privacy, your choice <ArrowUpRight size={17}/></Link></div></section><section className="final-cta"><Sprout strokeWidth={1}/><h2>You don’t have to save the world.<br/>You can simply show up.</h2><Button size="lg" asChild><Link to="/signup">Begin your journey <ArrowUpRight/></Link></Button></section></>}
export function AboutPage({mode='about'}:{mode?:'about'|'philosophy'|'how'}){return <div className="container editorial-page"><PageHeading eyebrow="THE SPIRIT OF ARPAN" title={mode==='about'?'Technology as Seva.':mode==='philosophy'?'Offer yourself. Grow by serving.':'Begin with what you have.'} description={mode==='about'?'A place where people give, receive and serve with dignity.':mode==='philosophy'?'Service as a practice of presence, humility and connection.':'Four ways to participate. One shared community.'}/><img className="editorial-cover" src={images.community} alt="A community tending a garden together" width={1920} height={1024}/>{mode==='how'?<><ActionGrid/><div className="editorial-copy"><h2>Intention becomes connection.</h2><p>Explore a need, an offer, a community or a seva that speaks to you. Read the human context, choose how you would like to participate, and offer what feels possible.</p><h2>Take Sankalp. Show up. Reflect.</h2><p>Before joining a seva, pause with an intention. Afterward, make room for a private reflection. There is nothing to earn and no one to outperform.</p></div></>:<div className="editorial-copy"><h2>Everyone can give. Everyone can receive.</h2><p>ARPAN is a reciprocal community, not a charity marketplace. A person can offer today, ask tomorrow, serve next week and support a community later. No single act defines who you are.</p><h2>Inspired by seva.</h2><p>Rooted in the spirit of seva and the teachings associated with Swami Vivekananda, ARPAN invites us to serve without hierarchy and act without attachment to the result. This philosophy shapes how we ask, connect, participate and reflect.</p><div className="values-grid">{[['Dignity','People are never cases, statistics or problems to be solved.'],['Humility','Giving does not make one person superior to another.'],['Reciprocity','You have something to offer, and you may need something too.'],['Privacy','Your identity, story and presence belong to you.']].map(([t,d])=><div key={t}><Shield size={22}/><h3>{t}</h3><p>{d}</p></div>)}</div><blockquote>“I showed up.<br/>I did what I could.<br/>I let go of the result.”</blockquote><Button asChild size="lg"><Link to="/home">Find your place <ArrowRight/></Link></Button></div>}</div>}
export function AuthPage({signup=false}:{signup?:boolean}){
  const { user, profile, signIn, signUp, signOut } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      if (signup) {
        const { error } = await signUp(email, password, name);
        if (error) {
          setErrorMsg(error.message || 'Signup failed. Please try again.');
          setSubmitting(false);
          return;
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setErrorMsg(error.message || 'Invalid email or password.');
          setSubmitting(false);
          return;
        }
      }
      navigate({ to: '/home' });
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-image">
        <img src={images.learning} alt="Adults sharing knowledge at a community learning circle" width={1024} height={768}/>
        <div>
          <HandHeart size={36}/>
          <h2>A little of you.<br/>A place for all of us.</h2>
          <p>Everyone can give. Everyone can receive.</p>
        </div>
      </div>
      <div className="auth-form">
        <p className="eyebrow">WELCOME TO ARPAN</p>
        <h1>{signup ? 'Begin your journey.' : 'Welcome back.'}</h1>
        <p>{signup ? 'You don’t need to prove anything. Simply be yourself.' : 'A place to offer, ask, and show up.'}</p>

        {user && (
          <div className="mb-4 p-3 bg-muted/40 rounded border border-border text-sm flex items-center justify-between">
            <span>Signed in as <strong>{profile?.display_name || user.email}</strong></span>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => navigate({ to: '/home' })}>Enter Home</Button>
              <Button size="sm" variant="outline" onClick={() => signOut()}>Sign out</Button>
            </div>
          </div>
        )}

        {errorMsg && (
          <div role="alert" className="p-3 mb-3 text-sm text-destructive bg-destructive/10 rounded border border-destructive/20">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {signup && (
            <label>
              Your name
              <input
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="What would you like us to call you?"
                autoComplete="given-name"
              />
            </label>
          )}
          <label>
            Email address
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="At least 6 characters"
              autoComplete={signup ? 'new-password' : 'current-password'}
            />
          </label>
          {signup && (
            <label className="check-label">
              <input type="checkbox" required />
              I agree to connect with dignity and respect everyone’s privacy.
            </label>
          )}
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? 'Connecting…' : signup ? 'Begin with ARPAN' : 'Enter community'}
            <ArrowRight />
          </Button>
        </form>

        <p>
          {signup ? 'Already part of the community?' : 'New to ARPAN?'}
          <Link to={signup ? '/login' : '/signup'}>{signup ? 'Log in' : 'Begin your journey'}</Link>
        </p>
        <Button variant="outline" asChild>
          <Link to="/home">Explore without an account</Link>
        </Button>
      </div>
    </div>
  );
}
