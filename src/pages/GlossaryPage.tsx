import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { Input } from '@/components/ui/input';
import { GLOSSARY } from '@/data/glossary';

export function GlossaryPage() {
  const { t, lang } = useLanguage();
  const [query, setQuery] = useState('');

  const terms = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term));
    if (!q) return sorted;
    return sorted.filter(
      (it) => it.term.toLowerCase().includes(q) || it[lang].toLowerCase().includes(q)
    );
  }, [query, lang]);

  return (
    <>

      <main className="mx-auto w-full max-w-[1760px] space-y-6 px-5 py-8 sm:px-8">
        <div>
          <h1 className="text-2xl font-bold">{t('glossary.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('glossary.subtitle')}</p>
        </div>

        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('glossary.search')}
            className="pl-9"
          />
        </div>

        {terms.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">{t('glossary.empty')}</p>
        ) : (
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {terms.map((it) => (
              <div key={it.term} className="rounded-lg border border-border bg-card px-4 py-3">
                <dt className="text-sm font-semibold text-foreground">{it.term}</dt>
                <dd className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{it[lang]}</dd>
              </div>
            ))}
          </dl>
        )}
      </main>
    </>
  );
}
