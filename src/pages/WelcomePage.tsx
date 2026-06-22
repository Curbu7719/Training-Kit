import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { ROLE_ORDER } from '@/lib/rolePaths';
import type { TranslationKey } from '@/lib/locales/en';

/**
 * Entry page after login. Shows a leadership (CIO) message, then asks the
 * learner to pick their SDLC role and start. The chosen role is saved to
 * profiles.learning_role; the dashboard then shows that role's path.
 */
export function WelcomePage() {
  const { profile, refreshProfile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [role, setRole] = useState('');
  const [saving, setSaving] = useState(false);

  // Pre-select an existing choice if the learner already picked one.
  useEffect(() => {
    if (profile?.learning_role) setRole(profile.learning_role);
  }, [profile?.learning_role]);

  async function handleStart() {
    if (!role || !profile) return;
    setSaving(true);
    try {
      await supabase.from('profiles').update({ learning_role: role }).eq('id', profile.id);
      await refreshProfile();
    } finally {
      setSaving(false);
      navigate('/dashboard', { replace: true });
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
          <span className="text-xl font-bold text-primary">{t('nav.brand')}</span>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 space-y-8">
        {/* CIO message */}
        <section className="rounded-lg border border-primary/30 bg-primary/5 px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {t('welcome.cio.eyebrow')}
          </p>
          <h1 className="mt-1 text-2xl font-bold leading-tight">{t('welcome.cio.title')}</h1>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/90">
            <p>{t('welcome.cio.body1')}</p>
            <p>{t('welcome.cio.body2')}</p>
            <p>{t('welcome.cio.body3')}</p>
          </div>
          <p className="mt-4 text-sm font-medium text-muted-foreground">{t('welcome.cio.signature')}</p>
        </section>

        {/* Role picker + start */}
        <section className="rounded-lg border border-border bg-card px-6 py-6">
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
      </main>
    </div>
  );
}
