import { useNavigate } from 'react-router-dom';
import { BookOpen, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/layout/AppHeader';
import { Markdown } from '@/lib/markdown';
import { INTRO } from '@/data/intro';

export function IntroPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader width="max-w-3xl" />

      <main className="mx-auto max-w-3xl px-6 py-8 space-y-6">
        <article className="rounded-lg border border-border bg-card px-6 py-5">
          <Markdown>{INTRO[lang]}</Markdown>
        </article>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => navigate('/glossary')} variant="outline">
            <BookOpen className="h-4 w-4" />
            {t('intro.cta.glossary')}
          </Button>
          <Button onClick={() => navigate('/dashboard')}>
            <LayoutDashboard className="h-4 w-4" />
            {t('intro.cta.start')}
          </Button>
        </div>
      </main>
    </div>
  );
}
