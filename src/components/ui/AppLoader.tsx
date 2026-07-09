import { useLanguage } from '@/lib/i18n';
import { TarsMascot } from '@/components/ui/TarsMascot';

/**
 * Full-screen loading state — an animated TARS mascot (walking + "working"
 * face) with a localized label. Used for route/Suspense fallbacks and while the
 * auth session resolves, so every page load greets you with TARS.
 */
export function AppLoader() {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-background">
      <TarsMascot expression="working" animated size={160} />
      <p className="text-sm font-medium text-muted-foreground">{t('common.loading')}</p>
    </div>
  );
}
