import mascotUrl from '@/assets/wingmate-mascot.svg';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/**
 * Brand lockup — the Wingmate mascot + the product name ("Training Platform").
 * Used in every app header.
 */
export function Brand({ className }: { className?: string }) {
  const { t } = useLanguage();
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <img src={mascotUrl} alt="" aria-hidden className="h-8 w-auto select-none" draggable={false} />
      <span className="text-[15px] font-bold tracking-tight text-foreground sm:text-base">
        {t('nav.brand')}
      </span>
    </div>
  );
}
