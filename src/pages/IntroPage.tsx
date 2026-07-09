import { useNavigate } from 'react-router-dom';
import { BookOpen, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/layout/AppHeader';
import { TarsMascot } from '@/components/ui/TarsMascot';
import { Markdown } from '@/lib/markdown';
import { INTRO } from '@/data/intro';

export function IntroPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="mx-auto w-full max-w-[1760px] px-5 py-8 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <article className="rounded-2xl border border-border bg-card px-6 py-6 shadow-card lg:px-10 lg:py-8">
            <div className="max-w-3xl">
              <Markdown>{INTRO[lang]}</Markdown>
            </div>
          </article>

          <aside className="flex flex-col gap-3 lg:sticky lg:top-[84px]">
            {/* TARS, standing by — static picture. */}
            <div className="flex justify-center rounded-2xl border border-border bg-card py-4">
              <TarsMascot expression="idle" animated={false} size={140} />
            </div>
            <Button onClick={() => navigate('/dashboard')} className="justify-start">
              <LayoutDashboard className="h-4 w-4" />
              {t('intro.cta.start')}
            </Button>
            <Button onClick={() => navigate('/glossary')} variant="outline" className="justify-start">
              <BookOpen className="h-4 w-4" />
              {t('intro.cta.glossary')}
            </Button>
          </aside>
        </div>
      </main>
    </div>
  );
}
