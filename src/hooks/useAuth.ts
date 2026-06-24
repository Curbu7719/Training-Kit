import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
  createElement,
} from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Profile {
  id: string;
  display_name: string | null;
  role: 'user' | 'admin';
  lang: 'en' | 'tr';
  /** Chosen SDLC learning role (ROLE_PATHS key); null until the user picks one. */
  learning_role: string | null;
}

export interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  /** Re-fetch the current user's profile (e.g. after changing learning_role). */
  refreshProfile: () => Promise<void>;
  // -----------------------------------------------------------------------
  // LDAP / SSO seam — DEFERRED (DESIGN.md §1 decision 7)
  // When LDAP/SSO is introduced, add signInWithSSO() here. No schema change
  // is required — Supabase Auth handles the identity; the profiles row is
  // created/updated via the same trigger that handles email/password users.
  // signInWithSSO: (provider: SSOProvider) => Promise<void>;
  // -----------------------------------------------------------------------
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, role, lang, learning_role')
    .eq('id', userId)
    .single();

  if (error) {
    // Profile row may not exist yet (race between trigger and first page load).
    return null;
  }

  return data as Profile;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // The uid whose profile we've already fetched. Lets us skip redundant
  // re-fetches on benign auth events (TOKEN_REFRESHED, tab focus) that keep the
  // same identity — otherwise `profile` churns and data-loading effects re-run,
  // which looks like the page refreshing itself.
  const syncedUid = useRef<string | null>(null);

  // Sync profile whenever the authenticated user changes.
  const syncProfile = useCallback(async (u: User | null) => {
    if (!u) {
      syncedUid.current = null;
      setProfile(null);
      return;
    }
    const p = await fetchProfile(u.id);
    syncedUid.current = u.id;
    setProfile(p);
  }, []);

  // Exposed so screens that mutate the profile (e.g. picking a learning role)
  // can pull the fresh row without a full page reload.
  const refreshProfile = useCallback(async () => {
    const { data: { user: u } } = await supabase.auth.getUser();
    await syncProfile(u ?? null);
  }, [syncProfile]);

  useEffect(() => {
    // Bootstrap: read the existing session on mount.
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      syncProfile(u).finally(() => setLoading(false));
    });

    // Stay in sync. Only re-fetch the profile when the identity actually
    // changes — sign-in/out/user-switch — not on every token refresh.
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if ((u?.id ?? null) !== syncedUid.current) {
        syncProfile(u);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [syncProfile]);

  // Presence heartbeat: while signed in, bump our own last_seen_at ~once a
  // minute (and whenever the tab regains focus) so the admin can see who's
  // online. Own-row update is permitted by the profiles_own_update RLS policy.
  useEffect(() => {
    if (!user) return;
    const ping = () => {
      void supabase.from('profiles').update({ last_seen_at: new Date().toISOString() }).eq('id', user.id);
    };
    ping();
    const interval = setInterval(ping, 60_000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') ping();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [user]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // onAuthStateChange fires → user + profile updated automatically.
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const value: AuthContextValue = { user, profile, loading, signIn, signUp, signOut, refreshProfile };

  // Use createElement to avoid JSX in a .ts file.
  return createElement(AuthContext.Provider, { value }, children);
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return ctx;
}
