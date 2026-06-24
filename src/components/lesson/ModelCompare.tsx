import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Non-graded interactive demo: pick a preset prompt and compare how different
// models answer it. Responses are curated/illustrative (no live model calls).
// Data lives in the lesson's body_md as JSON.
// ---------------------------------------------------------------------------

export interface ModelCompareData {
  intro?: string;
  items: {
    id: string;
    label?: string;
    prompt: string;
    responses: { model: string; text: string }[];
    note?: string;
  }[];
}

export function ModelCompare({ data }: { data: ModelCompareData }) {
  const { t } = useLanguage();
  const [sel, setSel] = useState(0);
  const items = data.items ?? [];
  const item = items[sel];
  if (!item) return null;

  return (
    <div className="space-y-4">
      {data.intro && <p className="text-sm text-muted-foreground">{data.intro}</p>}

      {/* Prompt picker */}
      <div className="flex flex-wrap gap-2" role="group" aria-label={t('demo.pickPrompt')}>
        {items.map((it, i) => (
          <button
            key={it.id}
            type="button"
            onClick={() => setSel(i)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              i === sel
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:border-primary/50'
            )}
          >
            {it.label ?? `${t('demo.prompt')} ${i + 1}`}
          </button>
        ))}
      </div>

      {/* The shared prompt */}
      <div className="rounded-md border border-border bg-muted/40 px-4 py-3">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('demo.promptLabel')}</p>
        <p className="font-mono text-sm leading-relaxed">{item.prompt}</p>
      </div>

      {/* Each model's answer, side by side */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {item.responses.map((r, i) => (
          <div key={i} className="flex flex-col rounded-md border border-border bg-card px-4 py-3">
            <p className="mb-1.5 text-xs font-semibold text-primary">{r.model}</p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{r.text}</p>
          </div>
        ))}
      </div>

      {/* What differs */}
      {item.note && (
        <div className="rounded-md border border-border bg-muted/40 px-4 py-3 text-sm leading-relaxed">
          <span className="mr-1 font-semibold text-foreground">{t('demo.note')}</span>
          <span className="text-muted-foreground">{item.note}</span>
        </div>
      )}
    </div>
  );
}
