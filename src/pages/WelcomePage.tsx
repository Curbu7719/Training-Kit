import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/layout/AppHeader';
import { ROLE_ORDER } from '@/lib/rolePaths';
import type { TranslationKey } from '@/lib/locales/en';
import mascotUrl from '@/assets/wingmate-mascot.svg';

/**
 * Entry page, shown on every app open. Leads with the leadership (CIO) message.
 * If the learner has already chosen a role, it offers "Continue learning"; if
 * not, it asks them to pick their SDLC role and start. The role is chosen once
 * and locked (saved to profiles.learning_role).
 */
export function WelcomePage() {
  const { profile, refreshProfile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [role, setRole] = useState('');
  const [saving, setSaving] = useState(false);

  const hasRole = !!profile?.learning_role;

  async function handleStart() {
    if (!role || !profile) return;
    setSaving(true);
    try {
      await supabase.from('profiles').update({ learning_role: role }).eq('id', profile.id);
      await refreshProfile();
    } finally {
      setSaving(false);
      navigate('/path', { replace: true });
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="mx-auto w-full max-w-[1760px] px-5 py-10 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        {/* CIO message */}
        <section className="rounded-2xl border border-primary/30 bg-primary/5 px-6 py-6 shadow-card lg:px-9 lg:py-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {t('welcome.cio.eyebrow')}
          </p>
          <h1 className="mt-1 text-2xl font-bold leading-tight">{t('welcome.cio.title')}</h1>
          <div className="mt-4 max-w-3xl space-y-3 text-sm leading-relaxed text-foreground/90">
            <p>{t('welcome.cio.body1')}</p>
            <p>{t('welcome.cio.body2')}</p>
            <p>{t('welcome.cio.body3')}</p>
          </div>
          <p className="mt-4 text-sm font-medium text-muted-foreground">{t('welcome.cio.signature')}</p>
        </section>

        <div className="lg:sticky lg:top-[84px]">
        <div className="mb-4 flex flex-col items-center gap-2 text-center">
          <img src={mascotUrl} alt="Wingmate" className="h-28 w-28 drop-shadow-sm" />
          <p className="text-sm font-semibold text-foreground">{t('welcome.mascot')}</p>
        </div>
        {hasRole ? (
          /* Returning learner — role already chosen and locked */
          <section className="rounded-2xl border border-border bg-card px-6 py-6 shadow-card">
            <h2 className="text-lg font-semibold">{t('welcome.back.title')}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t('welcome.back.role')}{' '}
              <span className="font-medium text-primary">
                {t(`role.${profile!.learning_role}` as TranslationKey)}
              </span>
            </p>
            <Button
              className="mt-4"
              data-testid="welcome-continue-btn"
              onClick={() => navigate('/path')}
            >
              {t('welcome.continue')}
            </Button>
          </section>
        ) : (
          /* First time — pick a role and start */
          <section className="rounded-2xl border border-border bg-card px-6 py-6 shadow-card">
            <h2 className="text-lg font-semibold">{t('welcome.role.title')}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t('welcome.role.help')}</p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                aria-label={t('welcome.role.title')}
                data-testid="welcome-role-select"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:max-w-xs"
              >
                <option value="">{t('role.panel.placeholder')}</option>
                {ROLE_ORDER.map((r) => (
                  <option key={r} value={r}>{t(`role.${r}` as TranslationKey)}</option>
                ))}
              </select>

              <Button
                data-testid="welcome-start-btn"
                onClick={() => void handleStart()}
                disabled={!role || saving}
              >
                {t('welcome.start')}
              </Button>
            </div>

            {!role && <p className="mt-2 text-xs text-muted-foreground">{t('welcome.start.hint')}</p>}
          </section>
        )}
        </div>
        </div>
      </main>
    </div>
  );
}
