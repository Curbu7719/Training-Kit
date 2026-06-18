import { useState } from 'react';
import { ArrowUp, ArrowDown, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ExerciseSubmitResponse, OrderAnswer } from '@/lib/api';

// ---------------------------------------------------------------------------
// Spec shape
// ---------------------------------------------------------------------------

export interface OrderSpec {
  items: string[];
}

interface Props {
  exerciseId: string;
  spec: OrderSpec;
  onSubmit: (answer: OrderAnswer) => Promise<ExerciseSubmitResponse>;
}

// ---------------------------------------------------------------------------

export function OrderExercise({ spec, onSubmit }: Props) {
  // order[i] = index into spec.items that is currently at position i
  const [order, setOrder] = useState<number[]>(spec.items.map((_, i) => i));
  const [result, setResult] = useState<ExerciseSubmitResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function move(pos: number, dir: -1 | 1) {
    if (result) return;
    const newOrder = [...order];
    const target = pos + dir;
    if (target < 0 || target >= newOrder.length) return;
    [newOrder[pos], newOrder[target]] = [newOrder[target], newOrder[pos]];
    setOrder(newOrder);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await onSubmit({ order });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Drag or use the arrows to arrange the items in the correct order.
      </p>

      <ol className="space-y-2">
        {order.map((itemIdx, pos) => (
          <li
            key={itemIdx}
            className={cn(
              'flex items-center gap-3 rounded-md border border-border bg-card px-4 py-3 text-sm',
              result && 'opacity-80'
            )}
          >
            <span className="w-5 shrink-0 text-center text-xs font-semibold text-muted-foreground">
              {pos + 1}
            </span>
            <span className="flex-1">{spec.items[itemIdx]}</span>
            {!result && (
              <span className="flex flex-col">
                <button
                  type="button"
                  onClick={() => move(pos, -1)}
                  disabled={pos === 0}
                  aria-label={`Move "${spec.items[itemIdx]}" up`}
                  className={cn(
                    'rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    'disabled:pointer-events-none disabled:opacity-30'
                  )}
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(pos, 1)}
                  disabled={pos === order.length - 1}
                  aria-label={`Move "${spec.items[itemIdx]}" down`}
                  className={cn(
                    'rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    'disabled:pointer-events-none disabled:opacity-30'
                  )}
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </span>
            )}
          </li>
        ))}
      </ol>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div
          className={cn(
            'flex items-center gap-2 rounded-md border px-4 py-3 text-sm font-medium',
            result.passed
              ? 'border-success/20 bg-success/10 text-success'
              : 'border-destructive/20 bg-destructive/10 text-destructive'
          )}
          role="status"
          data-testid="exercise-result"
        >
          {result.passed ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <XCircle className="h-4 w-4 shrink-0" />
          )}
          {result.passed
            ? `Correct order — ${result.score}/${result.max_score} points`
            : `Incorrect order — ${result.score}/${result.max_score} points`}
        </div>
      )}

      {!result && (
        <Button onClick={handleSubmit} disabled={submitting} className="mt-2" data-testid="exercise-submit-btn">
          {submitting ? 'Submitting…' : 'Submit'}
        </Button>
      )}
    </div>
  );
}
