import { useEffect, useState, createContext, useContext, type ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isLiveSupabaseConfigured } from '@/lib/supabase/client';
import type { Profile } from '@/lib/supabase/types';

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password?: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password?: string, displayName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (!isLiveSupabaseConfigured) {
        setLoading(false);
        return;
      }

      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Error fetching Supabase session:', error);
        }
        if (mounted && currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          await loadProfile(currentSession.user.id, currentSession.user);
        }
      } catch (err) {
        console.warn('Error initializing auth session:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    if (isLiveSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        if (!mounted) return;

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          if (newSession?.user) {
            setSession(newSession);
            setUser(newSession.user);
            await loadProfile(newSession.user.id, newSession.user);
          }
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setProfile(null);
          setLoading(false);
        } else if (event === 'INITIAL_SESSION') {
          if (newSession?.user) {
            setSession(newSession);
            setUser(newSession.user);
            await loadProfile(newSession.user.id, newSession.user);
          }
          setLoading(false);
        }
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  async function loadProfile(userId: string, currentUser?: User) {
    if (!isLiveSupabaseConfigured) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (data && !error) {
        setProfile(data as Profile);
        return;
      }

      // If user is authenticated in Supabase but profile row doesn't exist yet, create it
      if (currentUser) {
        const rawName = currentUser.user_metadata?.display_name || currentUser.email?.split('@')[0] || 'Community Member';
        const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

        const newProfileData = {
          id: userId,
          display_name: formattedName,
          avatar_letter: formattedName.charAt(0).toUpperCase(),
          bio: '',
          location: 'Bengaluru',
          skills: '',
          languages: 'English, Hindi',
          availability: 'Weekends',
          privacy_settings: {
            show_name: true,
            show_profile_photo: true,
            show_skills: true,
            show_offers: true,
            show_needs: false,
            participate_privately: false,
          },
          is_admin: false,
        };

        const { data: createdProfile } = await supabase
          .from('profiles')
          .insert(newProfileData)
          .select()
          .maybeSingle();

        if (createdProfile) {
          setProfile(createdProfile as Profile);
        }
      }
    } catch (err) {
      console.warn('Unable to load user profile:', err);
    }
  }

  const signIn = async (email: string, password?: string) => {
    if (!password) {
      return { error: new Error('Password is required') };
    }

    try {
      if (isLiveSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { error };
        if (data.user) {
          setUser(data.user);
          setSession(data.session);
          await loadProfile(data.user.id, data.user);
        }
        return { error: null };
      }
      return { error: new Error('Backend connection is not configured') };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signUp = async (email: string, password?: string, displayName?: string) => {
    if (!email || !password) {
      return { error: new Error('Email and password are required') };
    }

    try {
      const name = displayName?.trim() || email.split('@')[0] || 'Community Member';
      const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

      if (isLiveSupabaseConfigured) {
        // 1. Register through server endpoint (auto-confirms email and avoids GoTrue free-tier rate limits)
        try {
          const resp = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, displayName: formattedName }),
          });

          const result = await resp.json().catch(() => null);
          if (resp.ok && result?.success) {
            // Sign in immediately with Supabase public client to obtain browser session
            const { data: signinData, error: signinErr } = await supabase.auth.signInWithPassword({ email, password });
            if (!signinErr && signinData?.user) {
              setUser(signinData.user);
              setSession(signinData.session);
              await loadProfile(signinData.user.id, signinData.user);
              return { error: null };
            }
          } else if (result?.error) {
            return { error: new Error(result.error) };
          }
        } catch (serverErr) {
          console.warn('Server registration route unreachable, trying direct auth:', serverErr);
        }

        // 2. Direct Supabase signUp fallback
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: formattedName },
          },
        });

        if (error) {
          return { error };
        }

        if (data?.session) {
          setUser(data.user);
          setSession(data.session);
          await loadProfile(data.user!.id, data.user!);
          return { error: null };
        }

        // Attempt sign-in if session was not immediately returned
        const { data: finalSignin, error: finalSigninErr } = await supabase.auth.signInWithPassword({ email, password });
        if (!finalSigninErr && finalSignin?.user) {
          setUser(finalSignin.user);
          setSession(finalSignin.session);
          await loadProfile(finalSignin.user.id, finalSignin.user);
          return { error: null };
        }

        return { error: null };
      }

      return { error: new Error('Backend connection is not configured') };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    if (isLiveSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      return { error: new Error('You must be signed in to update your profile') };
    }

    try {
      if (isLiveSupabaseConfigured) {
        const { data, error } = await supabase
          .from('profiles')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id)
          .select()
          .maybeSingle();

        if (error) return { error };
        if (data) setProfile(data as Profile);
      }

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
