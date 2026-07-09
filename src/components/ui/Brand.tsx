import logoUrl from '@/assets/logo.png';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { TarsMascot } from '@/components/ui/TarsMascot';

/**
 * Brand lockup — the TARS mascot + Vodafone logo + a hairline separator + the
 * product name ("TARS Training Platform"). Used in every app header. The mascot
 * here is a calm, static picture (no animation) so the header stays quiet.
 */
export function Brand({ className }: { className?: string }) {
  const { t } = useLanguage();
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <TarsMascot expression="idle" animated={false} size={38} className="-my-2 shrink-0" />
      <img src={logoUrl} alt="Vodafone" className="h-6 w-auto select-none" draggable={false} />
      <span className="h-6 w-px bg-border" aria-hidden />
      <span className="text-[15px] font-bold tracking-tight text-foreground sm:text-base">
        {t('nav.brand')}
      </span>
    </div>
  );
}
