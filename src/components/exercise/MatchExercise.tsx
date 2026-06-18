import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ExerciseSubmitResponse, MatchAnswer } from '@/lib/api';

// ---------------------------------------------------------------------------
// Spec shape
// ---------------------------------------------------------------------------

export interface MatchSpec {
  left: string[];
  right: string[];
}

interface Props {
  exerciseId: string;
  spec: MatchSpec;
  onSubmit: (answer: MatchAnswer) => Promise<ExerciseSubmitResponse>;
}

// ---------------------------------------------------------------------------
// Interaction: user selects a right-side item for each left-side item via a
// dropdown-style selector. Keyboard accessible via native <select>.
// ---------------------------------------------------------------------------

export function MatchExercise({ spec, onSubmit }: Props) {
  // pairs[leftIdx] = rightIdx selected by the user (or -1 = unset)
  const [pairs, setPairs] = useState<number[]>(spec.left.map(() => -1));
  const [result, setResult] = useState<ExerciseSubmitResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function selectRight(leftIdx: number, rightIdx: number) {
    if (result) return;
    setPairs((prev) => {
      const next = [...prev];
      next[leftIdx] = rightIdx;
      return next;
    });
  }

  const allSelected = pairs.every((p) => p >= 0);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const submittedPairs: [number, number][] = pairs.map(
        (rightIdx, leftIdx) => [leftIdx, rightIdx]
      );
      const res = await onSubmit({ pairs: submittedPairs });
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
        For each item on the left, select the matching item on the right.
      </p>

      <div className="space-y-2">
        {spec.left.map((leftItem, leftIdx) => (
          <div
            key={leftIdx}
            className="grid grid-cols-2 items-center gap-4 rounded-md border border-border bg-card px-4 py-3"
          >
            <span className="text-sm font-medium">{leftItem}</span>
            <select
              value={pairs[leftIdx] >= 0 ? pairs[leftIdx] : ''}
              onChange={(e) => selectRight(leftIdx, Number(e.target.value))}
              disabled={result !== null}
              aria-label={`Match for: ${leftItem}`}
              className={cn(
                'rounded-md border border-input bg-background px-3 py-1.5 text-sm',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'disabled:cursor-default disabled:opacity-70'
              )}
            >
              <option value="" disabled>
                — select —
              </option>
              {spec.right.map((rightItem, rightIdx) => (
                <option key={rightIdx} value={rightIdx}>
                  {rightItem}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

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
        >
          {result.passed ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <XCircle className="h-4 w-4 shrink-0" />
          )}
          {result.passed
            ? `All matched correctly — ${result.score}/${result.max_score} points`
            : `Some pairs incorrect — ${result.score}/${result.max_score} points`}
        </div>
      )}

      {!result && (
        <Button
          onClick={handleSubmit}
          disabled={!allSelected || submitting}
          className="mt-2"
        >
          {submitting ? 'Submitting…' : 'Submit'}
        </Button>
      )}
    </div>
  );
}
