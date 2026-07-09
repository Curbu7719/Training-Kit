import logoUrl from '@/assets/logo.png';
import { cn } from '@/lib/utils';
import { TarsLockup } from '@/components/ui/TarsLogo';

/**
 * Brand lockup — Vodafone logo + a hairline separator + the TARS logo: the
 * 3-bar monolith mark, the "TARS" wordmark, a red underline and the
 * "SDLC AI PLATFORM / Training Suite" taglines. Used in every app header and
 * on the login card.
 */
export function Brand({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <img src={logoUrl} alt="Vodafone" className="h-6 w-auto select-none" draggable={false} />
      <span className="h-8 w-px bg-border" aria-hidden />
      <TarsLockup size={30} tagline="SDLC AI PLATFORM" subtagline="Training Suite" />
    </div>
  );
}
