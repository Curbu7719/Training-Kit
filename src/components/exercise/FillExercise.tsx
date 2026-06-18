import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { ExerciseSubmitResponse, FillAnswer } from '@/lib/api';

// ---------------------------------------------------------------------------
// Spec shape
// ---------------------------------------------------------------------------

export interface FillSpec {
  blanks: number;
  keywords: string[][];
}

interface Props {
  exerciseId: string;
  spec: FillSpec;
  onSubmit: (answer: FillAnswer) => Promise<ExerciseSubmitResponse>;
}

// ---------------------------------------------------------------------------

export function FillExercise({ spec, onSubmit }: Props) {
  const { t } = useLanguage();
  const [values, setValues] = useState<string[]>(Array(spec.blanks).fill(''));
  const [result, setResult] = useState<ExerciseSubmitResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setValue(idx: number, val: string) {
    if (result) return;
    setValues((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  }

  const allFilled = values.every((v) => v.trim().length > 0);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await onSubmit({ values: values.map((v) => v.trim()) });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('exercise.submissionFailed'));
    } finally {
      setSubmitting(false);
    }
  }

  const fillInstruction =
    spec.blanks === 1
      ? t('exercise.fill.instructionSingle')
      : t('exercise.fill.instructionPlural', { n: spec.blanks });

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">{fillInstruction}</p>

      <div className="space-y-3">
        {values.map((val, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            {spec.blanks > 1 && (
              <label
                htmlFor={`fill-blank-${idx}`}
                className="text-xs font-medium text-muted-foreground"
              >
                {t('exercise.fill.blankLabel', { n: idx + 1 })}
              </label>
            )}
            <Input
              id={`fill-blank-${idx}`}
              value={val}
              onChange={(e) => setValue(idx, e.target.value)}
              disabled={result !== null}
              placeholder={t('exercise.fill.placeholder')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && allFilled && !result) {
                  void handleSubmit();
                }
              }}
              className={cn(
                result &&
                  (result.passed
                    ? 'border-success/50 bg-success/5'
                    : 'border-destructive/50 bg-destructive/5')
              )}
            />
          </div>
        ))}
      </div>

      {/* Hint: show accepted keywords after failed attempt */}
      {result && !result.passed && (
        <div className="rounded-md border border-border bg-muted/40 px-4 py-3 text-sm">
          <p className="mb-1 font-medium text-muted-foreground">{t('exercise.fill.acceptedAnswers')}</p>
          {spec.keywords.map((kwSet, idx) => (
            <p key={idx} className="text-muted-foreground">
              {spec.blanks > 1 && (
                <span className="font-medium">{t('exercise.fill.blankLabel', { n: idx + 1 })}: </span>
              )}
              {kwSet.join(', ')}
            </p>
          ))}
        </div>
      )}

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
            ? t('exercise.result.correct', { score: result.score, max: result.max_score })
            : t('exercise.result.incorrect', { score: result.score, max: result.max_score })}
        </div>
      )}

      {!result && (
        <Button
          onClick={handleSubmit}
          disabled={!allFilled || submitting}
          className="mt-2"
        >
          {submitting ? t('exercise.submitting') : t('exercise.submit')}
        </Button>
      )}
    </div>
  );
}
