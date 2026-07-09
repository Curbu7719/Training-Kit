import { cn } from '@/lib/utils';
import { TarsWordmark } from '@/components/ui/TarsLogo';

/**
 * Brand lockup — the TARS wordmark logo (grooved "TARS" + red dot, the
 * "// AI-Driven SDLC Platform" line and a red "Training Suite"). Used on the
 * login card. (Vodafone lockup removed to keep the login screen uncluttered.)
 */
export function Brand({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center', className)}>
      <TarsWordmark size={34} />
    </div>
  );
}
