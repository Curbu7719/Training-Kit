import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { TarsWordmark } from '@/components/ui/TarsLogo';
import { TarsSpeech } from '@/components/ui/TarsSpeech';
import { getMyReflection, saveReflection } from '@/lib/api';

// Minimum characters per answer so the writeup is meaningful, not a single word.
const MIN_LEN = 20;

export function ReflectionPage() {
  const { profile } = useAuth();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [work, setWork] = useState('');
  const [value, setValue] = useState('');
  const [alreadyHad, setAlreadyHad] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getMyReflection()
      .then((r) => {
        if (cancelled) return;
        if (r) {
          setWork(r.work_application);
          setValue(r.expected_value);
          setAlreadyHad(true);
        }
      })
      .catch((e: Error) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const valid = work.trim().length >= MIN_LEN && value.trim().length >= MIN_LEN;

  async function handleSubmit() {
    if (!profile || !valid) return;
    setSaving(true);
    setError(null);
    try {
      await saveReflection(profile.id, work.trim(), value.trim(), lang);
      setSaved(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
          <TarsWordmark size={22} tagline={null} subtagline={null} />
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            {t('nav.backToDashboard')}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8 space-y-6">
        <TarsSpeech expression="talking" size={92}>{t('tars.reflection')}</TarsSpeech>
        <section>
          <h1 className="text-2xl font-bold">{t('reflection.title')}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t('reflection.intro')}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t('reflection.privacy')}</p>
        </section>

        {saved && (
          <Card className="border-success/50">
            <CardHeader className="flex flex-row items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
              <div>
                <CardTitle className="text-base text-success">{t('reflection.saved')}</CardTitle>
                <CardDescription>{t('reflection.savedNote')}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button onClick={() => navigate('/dashboard')}>{t('nav.backToDashboard')}</Button>
                <Button variant="outline" onClick={() => setSaved(false)}>
                  {t('reflection.revise')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          !saved && (
            <Card>
              <CardContent className="space-y-5 pt-6">
                {alreadyHad && (
                  <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                    {t('reflection.editExisting')}
                  </p>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="work" className="text-sm font-medium">
                    {t('reflection.q1.label')}
                  </label>
                  <textarea
                    id="work"
                    data-testid="reflection-work"
                    value={work}
                    onChange={(e) => setWork(e.target.value)}
                    placeholder={t('reflection.q1.placeholder')}
                    className="min-h-[140px] w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm leading-relaxed text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="value" className="text-sm font-medium">
                    {t('reflection.q2.label')}
                  </label>
                  <textarea
                    id="value"
                    data-testid="reflection-value"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={t('reflection.q2.placeholder')}
                    className="min-h-[140px] w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm leading-relaxed text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}
                {!valid && <p className="text-xs text-muted-foreground">{t('reflection.required')}</p>}

                <Button
                  data-testid="reflection-submit"
                  onClick={() => void handleSubmit()}
                  disabled={saving || !valid}
                >
                  {saving ? t('reflection.saving') : t('reflection.submit')}
                </Button>
              </CardContent>
            </Card>
          )
        )}
      </main>
    </div>
  );
}
