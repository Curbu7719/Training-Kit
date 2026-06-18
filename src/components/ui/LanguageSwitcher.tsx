import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// LanguageSwitcher — compact EN / TR toggle used in page headers.
// ---------------------------------------------------------------------------

interface Props {
  className?: string;
}

export function LanguageSwitcher({ className }: Props) {
  const { lang, setLang, t } = useLanguage();

  return (
    <div
      className={cn(
        'inline-flex rounded-md border border-border text-xs font-medium overflow-hidden',
        className
      )}
    >
      <button
        type="button"
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        className={cn(
          'px-2 py-1 transition-colors',
          lang === 'en'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted'
        )}
      >
        {t('lang.en')}
      </button>
      <button
        type="button"
        onClick={() => setLang('tr')}
        aria-pressed={lang === 'tr'}
        className={cn(
          'px-2 py-1 transition-colors border-l border-border',
          lang === 'tr'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted'
        )}
      >
        {t('lang.tr')}
      </button>
    </div>
  );
}
