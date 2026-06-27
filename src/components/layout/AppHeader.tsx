import { useNavigate, useLocation } from 'react-router-dom';
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
 * white bar matching the "Clean Corporate" design.
 */
export function AppHeader({ width = 'max-w-[1760px]' }: AppHeaderProps) {
  const { profile, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const items: { to: string; label: string; testId?: string }[] = [
    { to: '/path', label: t('nav.myPath'), testId: 'nav-mypath-btn' },
    { to: '/start', label: t('nav.basics') },
    { to: '/glossary', label: t('nav.glossary') },
    { to: '/leaderboard', label: t('nav.leaderboard') },
  ];
  if (profile?.role === 'admin') items.push({ to: '/admin', label: t('nav.admin') });

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card/85 shadow-header backdrop-blur">
      <div className={cn('mx-auto flex h-[68px] items-center justify-between gap-4 px-5 sm:px-8', width)}>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={t('nav.brand')}
        >
          <Brand />
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {items.map((it) => {
            const active = pathname === it.to;
            return (
              <button
                key={it.to}
                type="button"
                data-testid={it.testId}
                onClick={() => navigate(it.to)}
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
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            title={profile?.display_name ?? ''}
            className="hidden h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[hsl(0_100%_33%)] text-xs font-bold text-primary-foreground sm:flex"
          >
            {initials(profile?.display_name)}
          </button>
          <Button variant="outline" size="sm" onClick={() => void signOut()} data-testid="sign-out-btn">
            {t('nav.signOut')}
          </Button>
        </div>
      </div>
    </header>
  );
}
