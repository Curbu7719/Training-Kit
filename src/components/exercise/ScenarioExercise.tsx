import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n';
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
  const { t } = useLanguage();
  const [decision, setDecision] = useState<number | null>(null);
  const [reason, setReason] = useState<number | null>(null);
  const [result, setResult] = useState<ExerciseSubmitResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = decision !== null && reason !== null;
  const correctDecision = result?.correct?.decision;
  const correctReason = result?.correct?.reason;

  async function handleSubmit() {
    if (decision === null || reason === null) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await onSubmit({ decision, reason });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('exercise.submissionFailed'));
    } finally {
      setSubmitting(false);
    }
  }

  /** One radio option, result-aware: green if correct, red if wrongly picked. */
  function renderOption(
    choice: string,
    idx: number,
    chosen: number | null,
    correctIdx: number | undefined,
    onPick: (i: number) => void,
  ) {
    const isSelected = chosen === idx;
    const graded = result !== null;
    const isCorrect = graded && correctIdx === idx;
    const isWrongPick = graded && isSelected && correctIdx !== idx;
    return (
      <button
        key={idx}
        type="button"
        role="radio"
        aria-checked={isSelected}
        onClick={() => { if (!graded) onPick(idx); }}
        disabled={graded}
        className={cn(
          'flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left text-sm transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          isSelected && !graded && 'border-primary bg-primary/5 text-primary',
          !isSelected && !graded && 'border-border hover:border-primary/50 hover:bg-muted/50',
          isCorrect && 'border-success bg-success/10 text-success',
          isWrongPick && 'border-destructive bg-destructive/10 text-destructive',
          graded && !isCorrect && !isWrongPick && 'border-border opacity-60',
          graded && 'cursor-default'
        )}
      >
        <span
          className={cn(
            'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-xs',
            isCorrect ? 'border-success bg-success text-success-foreground' :
            isWrongPick ? 'border-destructive bg-destructive text-destructive-foreground' :
            isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
          )}
          aria-hidden
        >
          {isCorrect ? '✓' : isWrongPick ? '✕' : isSelected ? '✓' : ''}
        </span>
        {choice}
      </button>
    );
  }

  return (
    <div className="space-y-5">
      {/* Decision */}
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">{t('exercise.scenario.decision')}</legend>
        <div className="space-y-2" role="radiogroup" aria-label={t('exercise.scenario.decision')}>
          {spec.decision_choices.map((choice, idx) =>
            renderOption(choice, idx, decision, correctDecision, setDecision))}
        </div>
      </fieldset>

      {/* Reason — shown once a decision is picked */}
      {(decision !== null || result) && (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">{t('exercise.scenario.reason')}</legend>
          <div className="space-y-2" role="radiogroup" aria-label={t('exercise.scenario.reason')}>
            {spec.reason_choices.map((choice, idx) =>
              renderOption(choice, idx, reason, correctReason, setReason))}
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
            ? t('exercise.scenario.bothCorrect', { score: result.score, max: result.max_score })
            : result.score > 0
              ? t('exercise.scenario.partialCorrect', { score: result.score, max: result.max_score })
              : t('exercise.result.incorrect', { score: result.score, max: result.max_score })}
        </div>
      )}

      {!result && (
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          className="mt-1"
          data-testid="exercise-submit-btn"
        >
          {submitting ? t('exercise.submitting') : t('exercise.submit')}
        </Button>
      )}
    </div>
  );
}
