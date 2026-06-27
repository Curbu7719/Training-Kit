import logoUrl from '@/assets/logo.png';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/**
 * Brand lockup — Vodafone logo + a hairline separator + the product name
 * ("Training Platform"). Used in every app header.
 */
export function Brand({ className }: { className?: string }) {
  const { t } = useLanguage();
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <img src={logoUrl} alt="Vodafone" className="h-6 w-auto select-none" draggable={false} />
      <span className="h-6 w-px bg-border" aria-hidden />
      <span className="text-[15px] font-bold tracking-tight text-foreground sm:text-base">
        {t('nav.brand')}
      </span>
    </div>
  );
}
