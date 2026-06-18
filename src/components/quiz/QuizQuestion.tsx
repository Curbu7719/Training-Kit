import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { QuizSubmitResponse } from '@/lib/api';

// ---------------------------------------------------------------------------
// DB row shape (client-safe — no `correct` field)
// ---------------------------------------------------------------------------

export interface QuizQuestionRow {
  id: string;
  prompt: string;
  choices: string[];
  points: number;
}

interface Props {
  question: QuizQuestionRow;
  questionNumber: number;
  totalQuestions: number;
  onSubmit: (questionId: string, chosen: number[]) => Promise<QuizSubmitResponse>;
  onNext: () => void;
}

// ---------------------------------------------------------------------------

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  onSubmit,
  onNext,
}: Props) {
  const [selected, setSelected] = useState<number[]>([]);
  const [result, setResult] = useState<QuizSubmitResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(idx: number) {
    if (result) return;
    // For quiz questions we allow multi-select — the server knows how many correct answers exist.
    setSelected((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  }

  async function handleSubmit() {
    if (selected.length === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await onSubmit(question.id, selected);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Progress indicator */}
      <p className="text-xs text-muted-foreground">
        Question {questionNumber} of {totalQuestions}
      </p>

      <p className="text-sm font-medium leading-relaxed">{question.prompt}</p>

      <div className="space-y-2" role="group" aria-label="Answer choices">
        {question.choices.map((choice, idx) => {
          const isSelected = selected.includes(idx);
          const isCorrect = result?.correct.includes(idx) ?? false;
          const isWrong = result !== null && isSelected && !isCorrect;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => toggle(idx)}
              disabled={result !== null}
              aria-pressed={isSelected}
              className={cn(
                'flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left text-sm transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                // Pre-submit styling
                isSelected && !result && 'border-primary bg-primary/5 text-primary',
                !isSelected && !result && 'border-border hover:border-primary/50 hover:bg-muted/50',
                // Post-submit: highlight correct in green
                result && isCorrect && 'border-success/50 bg-success/10 text-success',
                // Post-submit: highlight user's wrong pick in red
                result && isWrong && 'border-destructive/50 bg-destructive/10 text-destructive',
                // Post-submit: unselected, non-correct stays neutral
                result && !isCorrect && !isWrong && 'border-border opacity-60',
                result && 'cursor-default'
              )}
            >
              <span
                className={cn(
                  'flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border text-xs',
                  isSelected && !result && 'border-primary bg-primary text-primary-foreground',
                  result && isCorrect && 'border-success bg-success text-success-foreground',
                  result && isWrong && 'border-destructive bg-destructive text-destructive-foreground',
                  !isSelected && !result && 'border-border'
                )}
                aria-hidden
              >
                {result ? (isCorrect ? '✓' : isWrong ? '✗' : '') : isSelected ? '✓' : ''}
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
            'flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium',
            result.is_correct
              ? 'border-success/20 bg-success/10 text-success'
              : 'border-destructive/20 bg-destructive/10 text-destructive'
          )}
          role="status"
        >
          {result.is_correct ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <XCircle className="h-4 w-4 shrink-0" />
          )}
          {result.is_correct
            ? `Correct! +${result.points} point${result.points !== 1 ? 's' : ''}`
            : `Incorrect — correct answer${result.correct.length > 1 ? 's are' : ' is'} highlighted above`}
        </div>
      )}

      <div className="flex justify-end">
        {!result ? (
          <Button onClick={handleSubmit} disabled={selected.length === 0 || submitting} data-testid="quiz-submit-btn">
            {submitting ? 'Checking…' : 'Submit answer'}
          </Button>
        ) : (
          <Button onClick={onNext} data-testid="quiz-next-btn">
            {questionNumber < totalQuestions ? 'Next question' : 'Finish quiz'}
          </Button>
        )}
      </div>
    </div>
  );
}
