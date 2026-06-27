import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/i18n';
import { Brand } from '@/components/ui/Brand';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { cn } from '@/lib/utils';

function initials(name?: string | null): string {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  const two = (parts[0]?.[0] ?? '') + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '');
  return (two || name[0] || 'U').toUpperCase();
}

interface AppHeaderProps {
  /** Match the page body's max-width so the brand lines up with content. */
  width?: string;
}

/**
 * Shared top navigation — Vodafone brand lockup, primary nav with an active
 * highlight, language switcher, profile avatar and sign-out. Sticky, glassy
 * white bar matching the "Clean Corporate" design. Below md the nav collapses
 * into a hamburger menu so mobile users can still reach every page.
 */
export function AppHeader({ width = 'max-w-[1760px]' }: AppHeaderProps) {
  const { profile, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const items: { to: string; label: string; testId?: string }[] = [
    { to: '/path', label: t('nav.myPath'), testId: 'nav-mypath-btn' },
    { to: '/start', label: t('nav.basics') },
    { to: '/glossary', label: t('nav.glossary') },
    { to: '/leaderboard', label: t('nav.leaderboard') },
  ];
  if (profile?.role === 'admin') items.push({ to: '/admin', label: t('nav.admin') });

  const go = (to: string) => {
    setMenuOpen(false);
    navigate(to);
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card/85 shadow-header backdrop-blur">
      <div className={cn('mx-auto flex h-[68px] items-center justify-between gap-4 px-5 sm:px-8', width)}>
        <button
          type="button"
          onClick={() => go('/dashboard')}
          className="shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={t('nav.brand')}
        >
          <Brand />
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {items.map((it) => {
            const active = pathname === it.to;
            return (
              <button
                key={it.to}
                type="button"
                data-testid={it.testId}
                onClick={() => go(it.to)}
                className={cn(
                  'rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                {it.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <LanguageSwitcher />
          {/* Desktop-only avatar + sign out */}
          <button
            type="button"
            onClick={() => go('/dashboard')}
            title={profile?.display_name ?? ''}
            className="hidden h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[hsl(0_100%_33%)] text-xs font-bold text-primary-foreground md:flex"
          >
            {initials(profile?.display_name)}
          </button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void signOut()}
            data-testid="sign-out-btn"
            className="hidden md:inline-flex"
          >
            {t('nav.signOut')}
          </Button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <nav className={cn('mx-auto px-3 pb-3 pt-1 md:hidden', width)}>
          {items.map((it) => {
            const active = pathname === it.to;
            return (
              <button
                key={it.to}
                type="button"
                onClick={() => go(it.to)}
                className={cn(
                  'block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors',
                  active ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-secondary'
                )}
              >
                {it.label}
              </button>
            );
          })}
          <div className="my-1.5 border-t border-border" />
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              void signOut();
            }}
            className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-foreground hover:bg-secondary"
          >
            {t('nav.signOut')}
          </button>
        </nav>
      )}
    </header>
  );
}
