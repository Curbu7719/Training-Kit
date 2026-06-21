import { useState } from 'react';
import { CheckCircle2, XCircle, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { ExerciseSubmitResponse, PromptRepairAnswer } from '@/lib/api';

// ---------------------------------------------------------------------------
// Spec shape (client-safe — the detection rules live in answer_key, not here)
// ---------------------------------------------------------------------------

export interface PromptRepairSpec {
  /** The weak starter prompt the learner edits. */
  starter: string;
  /** Human-readable requirements the edited prompt must satisfy. */
  requirements: { id: string; label: string }[];
}

interface Props {
  exerciseId: string;
  spec: PromptRepairSpec;
  onSubmit: (answer: PromptRepairAnswer) => Promise<ExerciseSubmitResponse>;
}

// ---------------------------------------------------------------------------

export function PromptRepairExercise({ spec, onSubmit }: Props) {
  const { t } = useLanguage();
  const [text, setText] = useState(spec.starter ?? '');
  const [result, setResult] = useState<ExerciseSubmitResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Map requirement id → met, from the graded result.
  const metById = new Map((result?.details ?? []).map((d) => [d.id, d.met]));
  const canSubmit = text.trim().length > 0 && result === null;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      setResult(await onSubmit({ text }));
    } catch (e) {
      setError(e instanceof Error ? e.message : t('exercise.submissionFailed'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{t('exercise.promptRepair.instruction')}</p>

      {/* Editable prompt */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={result !== null}
        rows={7}
        spellCheck={false}
        aria-label={t('exercise.promptRepair.editorLabel')}
        className={cn(
          'w-full resize-y rounded-md border border-border bg-background px-3 py-2 font-mono text-sm',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          result !== null && 'opacity-70'
        )}
      />

      {/* Requirements checklist — turns into a met/missing report after grading */}
      <div>
        <p className="mb-2 text-sm font-semibold">{t('exercise.promptRepair.requirements')}</p>
        <ul className="space-y-1.5">
          {spec.requirements.map((req) => {
            const graded = result !== null;
            const met = metById.get(req.id) === true;
            const Icon = !graded ? Circle : met ? CheckCircle2 : XCircle;
            return (
              <li
                key={req.id}
                className={cn(
                  'flex items-start gap-2 text-sm',
                  !graded && 'text-muted-foreground',
                  graded && met && 'text-success',
                  graded && !met && 'text-destructive'
                )}
              >
                <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{req.label}</span>
              </li>
            );
          })}
        </ul>
      </div>

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
          {t('exercise.promptRepair.result', {
            score: result.score,
            max: result.max_score,
            met: (result.details ?? []).filter((d) => d.met).length,
            total: spec.requirements.length,
          })}
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
