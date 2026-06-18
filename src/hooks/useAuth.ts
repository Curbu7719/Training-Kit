import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
  createElement,
} from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TrackCode = 'developer' | 'business_analyst' | 'pm_po' | 'qa_architect';

export interface Profile {
  id: string;
  display_name: string | null;
  role: 'user' | 'admin';
  active_track: TrackCode | null;
}

export interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  /** Re-fetch the profile row from the DB and update context state. */
  refreshProfile: () => Promise<void>;
  // -----------------------------------------------------------------------
  // LDAP / SSO seam — DEFERRED (DESIGN.md §1 decision 7, ARCHITECTURE §6.2)
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
    .select('id, display_name, role, active_track')
    .eq('id', userId)
    .single();

  if (error) {
    // Profile row may not exist yet (e.g. race between trigger and first load).
    // Return null; the hook will surface this as profile === null.
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

  // Sync profile whenever the user identity changes.
  const syncProfile = useCallback(async (u: User | null) => {
    if (!u) {
      setProfile(null);
      return;
    }
    const p = await fetchProfile(u.id);
    setProfile(p);
  }, []);

  useEffect(() => {
    // Bootstrap: read the existing session (if any) on mount.
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      syncProfile(u).finally(() => setLoading(false));
    });

    // Stay in sync with auth state changes (sign-in, sign-out, token refresh).
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      // Don't block the state update; profile load is async.
      syncProfile(u);
    });

    return () => listener.subscription.unsubscribe();
  }, [syncProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // onAuthStateChange fires → user + profile updated automatically.
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    // Supabase sends a confirmation email; user may land back with a session.
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const refreshProfile = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    await syncProfile(session?.user ?? null);
  }, [syncProfile]);

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
