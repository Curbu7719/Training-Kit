import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ExerciseSubmitResponse, McqAnswer } from '@/lib/api';

// ---------------------------------------------------------------------------
// Spec shape — populated from exercises.spec (mcq type)
// ---------------------------------------------------------------------------

export interface McqSpec {
  choices: string[];
  multi?: boolean;
}

interface Props {
  exerciseId: string;
  spec: McqSpec;
  onSubmit: (answer: McqAnswer) => Promise<ExerciseSubmitResponse>;
}

// ---------------------------------------------------------------------------

export function McqExercise({ spec, onSubmit }: Props) {
  const [selected, setSelected] = useState<number[]>([]);
  const [result, setResult] = useState<ExerciseSubmitResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const multi = spec.multi ?? false;

  function toggle(idx: number) {
    if (result) return; // locked after submit
    if (multi) {
      setSelected((prev) =>
        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
      );
    } else {
      setSelected([idx]);
    }
  }

  async function handleSubmit() {
    if (selected.length === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await onSubmit({ selected });
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
        {multi ? 'Select all that apply.' : 'Select one option.'}
      </p>

      <div className="space-y-2" role="group" aria-label="Answer choices">
        {spec.choices.map((choice, idx) => {
          const isSelected = selected.includes(idx);
          const isDisabled = result !== null;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => toggle(idx)}
              disabled={isDisabled}
              aria-pressed={isSelected}
              className={cn(
                'flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left text-sm transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                isSelected && !result && 'border-primary bg-primary/5 text-primary',
                !isSelected && !result && 'border-border hover:border-primary/50 hover:bg-muted/50',
                isDisabled && 'cursor-default'
              )}
            >
              {/* Checkbox / radio indicator */}
              <span
                className={cn(
                  'flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border text-xs',
                  multi ? 'rounded-sm' : 'rounded-full',
                  isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                )}
                aria-hidden
              >
                {isSelected && '✓'}
              </span>
              {choice}
            </button>
          );
        })}
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
          data-testid="exercise-result"
        >
          {result.passed ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <XCircle className="h-4 w-4 shrink-0" />
          )}
          {result.passed
            ? `Correct — ${result.score}/${result.max_score} points`
            : `Incorrect — ${result.score}/${result.max_score} points`}
        </div>
      )}

      {!result && (
        <Button
          onClick={handleSubmit}
          disabled={selected.length === 0 || submitting}
          className="mt-2"
          data-testid="exercise-submit-btn"
        >
          {submitting ? 'Submitting…' : 'Submit'}
        </Button>
      )}
    </div>
  );
}
