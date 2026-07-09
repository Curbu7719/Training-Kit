import { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Menu, X, Route, Sparkles, Library, Trophy, Award, Shield, LogOut, type LucideIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/i18n';
import { TarsLockup } from '@/components/ui/TarsLogo';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { cn } from '@/lib/utils';
import type { TranslationKey } from '@/lib/locales/en';

function initials(name?: string | null): string {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  const two = (parts[0]?.[0] ?? '') + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '');
  return (two || name[0] || 'U').toUpperCase();
}

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  testId?: string;
}
interface NavGroup {
  title: string;
  items: NavItem[];
}

/**
 * AppShell — the authenticated learner chrome. A fixed left sidebar (TARS logo,
 * grouped navigation, account block) on desktop; a top bar + slide-in drawer on
 * mobile. Routed pages render into <Outlet/> in the content column. Matches the
 * LMS convention (Coursera/Moodle-style left rail) and gives the logo room to
 * read at full size.
 */
export function AppShell() {
  const { profile, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const key = (k: string) => t(k as TranslationKey);

  const groups: NavGroup[] = [
    {
      title: key('nav.group.learn'),
      items: [
        { to: '/path', label: key('nav.myPath'), icon: Route, testId: 'nav-mypath-btn' },
        { to: '/start', label: key('nav.basics'), icon: Sparkles },
        { to: '/glossary', label: key('nav.glossary'), icon: Library },
      ],
    },
    {
      title: key('nav.group.progress'),
      items: [
        { to: '/leaderboard', label: key('nav.leaderboard'), icon: Trophy },
        { to: '/certificate', label: key('nav.certificate'), icon: Award },
      ],
    },
  ];
  if (profile?.role === 'admin') {
    groups.push({
      title: key('nav.group.admin'),
      items: [{ to: '/admin', label: key('nav.admin'), icon: Shield }],
    });
  }

  const go = (to: string) => {
    setMenuOpen(false);
    navigate(to);
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center justify-center border-b border-border px-3 py-6">
        <button
          type="button"
          onClick={() => go('/dashboard')}
          aria-label={key('nav.brand')}
          className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <TarsLockup size={44} tagline="SDLC AI PLATFORM" subtagline="Training Suite" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {groups.map((g) => (
          <div key={g.title} className="mb-4 last:mb-0">
            <p className="px-3 pb-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground/70">
              {g.title}
            </p>
            <div className="flex flex-col gap-0.5">
              {g.items.map((it) => {
                const active = pathname === it.to;
                const Icon = it.icon;
                return (
                  <button
                    key={it.to}
                    type="button"
                    data-testid={it.testId}
                    onClick={() => go(it.to)}
                    className={cn(
                      'relative flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
                      active
                        ? "bg-primary/10 text-primary before:absolute before:-left-3 before:top-1/2 before:h-5 before:w-[3px] before:-translate-y-1/2 before:rounded-full before:bg-primary before:content-['']"
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    )}
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" />
                    {it.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Account */}
      <div className="space-y-2.5 border-t border-border p-3">
        <div className="flex items-center gap-2.5 px-1">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[hsl(0_100%_33%)] text-xs font-bold text-primary-foreground">
            {initials(profile?.display_name)}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
            {profile?.display_name ?? ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button
            variant="outline"
            size="sm"
            onClick={() => void signOut()}
            data-testid="sign-out-btn"
            className="flex-1 gap-1.5"
          >
            <LogOut className="h-4 w-4" />
            {key('nav.signOut')}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/90 px-4 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={menuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <button
          type="button"
          onClick={() => go('/dashboard')}
          aria-label={key('nav.brand')}
          className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <TarsLockup size={22} tagline="SDLC AI PLATFORM" subtagline="Training Suite" />
        </button>
        <span className="flex-1" />
        <LanguageSwitcher />
      </header>

      <div className="lg:flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
          {sidebar}
        </aside>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
              aria-hidden
            />
            <aside className="absolute left-0 top-0 h-full w-[280px] max-w-[85vw] border-r border-border bg-card shadow-2xl">
              {sidebar}
            </aside>
          </div>
        )}

        {/* Content */}
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
