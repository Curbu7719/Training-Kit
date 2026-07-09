import type { ReactNode } from 'react';
import { TarsMascot, type TarsExpression } from '@/components/ui/TarsMascot';
import { cn } from '@/lib/utils';

interface TarsSpeechProps {
  /** What TARS says — plain text or rich nodes. */
  children: ReactNode;
  expression?: TarsExpression;
  animated?: boolean;
  size?: number;
  className?: string;
}

/**
 * TARS speaking — the mascot next to a speech bubble. The device that gives the
 * platform its voice: TARS greets, nudges and celebrates the learner. Reuse it
 * wherever the app talks to the user.
 */
export function TarsSpeech({
  children,
  expression = 'talking',
  animated = true,
  size = 96,
  className,
}: TarsSpeechProps) {
  return (
    <div className={cn('flex items-center gap-2 sm:gap-3', className)}>
      <TarsMascot expression={expression} animated={animated} size={size} className="shrink-0" />
      <div className="relative rounded-2xl border border-border bg-card px-4 py-3 shadow-card">
        {/* Tail pointing left toward TARS */}
        <span
          className="absolute left-[-6px] top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 border-b border-l border-border bg-card"
          aria-hidden
        />
        <div className="relative text-sm leading-relaxed text-foreground">{children}</div>
      </div>
    </div>
  );
}
