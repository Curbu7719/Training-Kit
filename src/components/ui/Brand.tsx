import logoUrl from '@/assets/logo.png';
import { cn } from '@/lib/utils';
import { TarsTerminal } from '@/components/ui/TarsLogo';

/**
 * Brand lockup — Vodafone logo + a hairline separator + the TARS terminal
 * logo: bracketed [ TARS ], a "// AI-Driven SDLC Platform" line and a red
 * "Training Suite" line. Used on the login card.
 */
export function Brand({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <img src={logoUrl} alt="Vodafone" className="h-6 w-auto select-none" draggable={false} />
      <span className="h-8 w-px bg-border" aria-hidden />
      <TarsTerminal size={26} />
    </div>
  );
}
