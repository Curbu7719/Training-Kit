import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { supabase } from '@/lib/supabase';
import en, { type TranslationKey } from '@/lib/locales/en';
import tr from '@/lib/locales/tr';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Lang = 'en' | 'tr';

type Dict = Record<string, string>;

const DICTS: Record<Lang, Dict> = {
  en: en as Dict,
  tr: tr as Dict,
};

const STORAGE_KEY = 'lang';

export interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Look up a UI string by dotted key; supports {var} interpolation. */
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const LanguageContext = createContext<LanguageContextValue | null>(null);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k) =>
    k in vars ? String(vars[k]) : `{${k}}`
  );
}

function readStoredLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'tr') return stored;
  } catch {
    // localStorage unavailable (e.g. SSR or private mode)
  }
  return 'en';
}

function writeLangStorage(l: Lang) {
  try {
    localStorage.setItem(STORAGE_KEY, l);
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface LanguageProviderProps {
  children: ReactNode;
  /** Optionally seed the initial lang from the authenticated profile. */
  profileLang?: Lang | null;
  /** Supabase user id — used to persist lang to profiles table when logged in. */
  userId?: string | null;
}

export function LanguageProvider({ children, profileLang, userId }: LanguageProviderProps) {
  // Priority: profileLang → localStorage → 'en'
  const [lang, setLangState] = useState<Lang>(() => {
    if (profileLang === 'en' || profileLang === 'tr') return profileLang;
    return readStoredLang();
  });

  // When a profile loads after initial mount, sync its lang preference.
  useEffect(() => {
    if (profileLang === 'en' || profileLang === 'tr') {
      setLangState(profileLang);
    }
  }, [profileLang]);

  const setLang = useCallback(
    (l: Lang) => {
      setLangState(l);
      writeLangStorage(l);
      if (userId) {
        // Fire-and-forget — no need to await; failures are non-critical
        void supabase.from('profiles').update({ lang: l }).eq('id', userId);
      }
    },
    [userId]
  );

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>): string => {
      const dict = DICTS[lang];
      const fallback = DICTS['en'];
      const template = dict[key] ?? fallback[key] ?? key;
      return interpolate(template, vars);
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a <LanguageProvider>');
  }
  return ctx;
}
