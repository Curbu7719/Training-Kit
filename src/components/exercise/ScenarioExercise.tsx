import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ExerciseSubmitResponse, ScenarioAnswer } from '@/lib/api';

// ---------------------------------------------------------------------------
// Spec shape
// ---------------------------------------------------------------------------

export interface ScenarioSpec {
  decision_choices: string[];
  reason_choices: string[];
}

interface Props {
  exerciseId: string;
  spec: ScenarioSpec;
  onSubmit: (answer: ScenarioAnswer) => Promise<ExerciseSubmitResponse>;
}

// ---------------------------------------------------------------------------

export function ScenarioExercise({ spec, onSubmit }: Props) {
  const [decision, setDecision] = useState<number | null>(null);
  const [reason, setReason] = useState<number | null>(null);
  const [result, setResult] = useState<ExerciseSubmitResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = decision !== null && reason !== null;

  async function handleSubmit() {
    if (decision === null || reason === null) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await onSubmit({ decision, reason });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Decision MCQ */}
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">
          What is the best decision?
        </legend>
        <div className="space-y-2" role="radiogroup" aria-label="Decision">
          {spec.decision_choices.map((choice, idx) => {
            const isSelected = decision === idx;
            const isDisabled = result !== null;
            return (
              <button
                key={idx}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => { if (!isDisabled) setDecision(idx); }}
                disabled={isDisabled}
                className={cn(
                  'flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left text-sm transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  isSelected && !result && 'border-primary bg-primary/5 text-primary',
                  !isSelected && !result && 'border-border hover:border-primary/50 hover:bg-muted/50',
                  isDisabled && 'cursor-default'
                )}
              >
                <span
                  className={cn(
                    'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-xs',
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
      </fieldset>

      {/* Reason MCQ — rendered once a decision is picked */}
      {(decision !== null || result) && (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">
            What is the best reason for that decision?
          </legend>
          <div className="space-y-2" role="radiogroup" aria-label="Reason">
            {spec.reason_choices.map((choice, idx) => {
              const isSelected = reason === idx;
              const isDisabled = result !== null;
              return (
                <button
                  key={idx}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => { if (!isDisabled) setReason(idx); }}
                  disabled={isDisabled}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left text-sm transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    isSelected && !result && 'border-primary bg-primary/5 text-primary',
                    !isSelected && !result && 'border-border hover:border-primary/50 hover:bg-muted/50',
                    isDisabled && 'cursor-default'
                  )}
                >
                  <span
                    className={cn(
                      'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-xs',
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
        </fieldset>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div
          className={cn(
            'flex items-center gap-2 rounded-md border px-4 py-3 text-sm font-medium',
            result.passed
              ? 'border-success/20 bg-success/10 text-success'
              : result.score > 0
                ? 'border-warning/20 bg-warning/10 text-warning'
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
            ? `Both correct — ${result.score}/${result.max_score} points`
            : result.score > 0
              ? `Decision correct, reason incorrect — ${result.score}/${result.max_score} points`
              : `Incorrect — ${result.score}/${result.max_score} points`}
        </div>
      )}

      {!result && (
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          className="mt-1"
          data-testid="exercise-submit-btn"
        >
          {submitting ? 'Submitting…' : 'Submit'}
        </Button>
      )}
    </div>
  );
}
