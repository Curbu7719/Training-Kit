import { CheckCircle2, XCircle, MinusCircle, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Markdown } from '@/lib/markdown';
import { Button } from '@/components/ui/button';
import type { ReviewQuizQuestion, ReviewExerciseData } from '@/lib/api';

// ---------------------------------------------------------------------------
// Read-only review of a learner's previous answers next to the correct ones.
// Used when revisiting a level that has already been worked through.
// ---------------------------------------------------------------------------

function ChoiceRow({
  text,
  picked,
  correct,
}: {
  text: string;
  picked: boolean;
  correct: boolean;
}) {
  const wrongPick = picked && !correct;
  return (
    <div
      className={cn(
        'flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left text-sm',
        correct && 'border-success/50 bg-success/10 text-success',
        wrongPick && 'border-destructive/50 bg-destructive/10 text-destructive',
        !correct && !wrongPick && 'border-border opacity-60'
      )}
    >
      <span
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border text-xs',
          correct && 'border-success bg-success text-success-foreground',
          wrongPick && 'border-destructive bg-destructive text-destructive-foreground',
          !correct && !wrongPick && 'border-border'
        )}
        aria-hidden
      >
        {correct ? '✓' : wrongPick ? '✗' : ''}
      </span>
      {text}
    </div>
  );
}

function StatusPill({ state }: { state: 'correct' | 'incorrect' | 'skipped' }) {
  const { t } = useLanguage();
  const cfg = {
    correct: { icon: CheckCircle2, cls: 'border-success/20 bg-success/10 text-success', label: t('review.correct') },
    incorrect: { icon: XCircle, cls: 'border-destructive/20 bg-destructive/10 text-destructive', label: t('review.incorrect') },
    skipped: { icon: MinusCircle, cls: 'border-border bg-muted text-muted-foreground', label: t('review.notAttempted') },
  }[state];
  const Icon = cfg.icon;
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium', cfg.cls)}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

export function ReviewQuiz({ questions, onRedo }: { questions: ReviewQuizQuestion[]; onRedo?: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      {onRedo && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={onRedo} className="gap-1.5" data-testid="redo-quiz-btn">
            <RotateCcw className="h-3.5 w-3.5" />
            {t('lesson.retry')}
          </Button>
        </div>
      )}
      {questions.map((q, qi) => {
        const chosen = q.chosen ?? [];
        const correct = q.correct ?? [];
        const state: 'correct' | 'incorrect' | 'skipped' =
          q.chosen === null ? 'skipped' : q.is_correct ? 'correct' : 'incorrect';
        return (
          <div key={q.id} className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium leading-relaxed">
                {qi + 1}. {q.prompt}
              </p>
              <StatusPill state={state} />
            </div>
            <div className="space-y-2">
              {q.choices.map((choice, idx) => (
                <ChoiceRow
                  key={idx}
                  text={choice}
                  picked={chosen.includes(idx)}
                  correct={correct.includes(idx)}
                />
              ))}
            </div>
            {q.explanation && (
              <div className="rounded-md border border-border bg-muted/40 px-4 py-3 text-sm leading-relaxed">
                <span className="mr-1 font-semibold text-foreground">{t('quiz.why')}</span>
                <span className="text-muted-foreground">{q.explanation}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// --- exercise review -------------------------------------------------------

function AnswerBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="text-sm">{children}</div>
    </div>
  );
}

function asNums(v: unknown): number[] {
  return Array.isArray(v) ? (v as number[]) : [];
}

export function ReviewExercise({ exercise, onRedo }: { exercise: ReviewExerciseData; onRedo?: () => void }) {
  const { t } = useLanguage();
  const { type, spec, answer, answer_key: key, score, max_score, passed } = exercise;
  const attempted = answer !== null;
  const ans = (answer ?? {}) as Record<string, unknown>;
  const ak = (key ?? {}) as Record<string, unknown>;

  function body() {
    if (!attempted) return <p className="text-sm text-muted-foreground">{t('review.notAttempted')}</p>;

    if (type === 'mcq') {
      const choices = (spec.choices as string[]) ?? [];
      const sel = asNums(ans.selected);
      const correct = asNums(ak.correct);
      return (
        <div className="space-y-2">
          {choices.map((c, idx) => (
            <ChoiceRow key={idx} text={c} picked={sel.includes(idx)} correct={correct.includes(idx)} />
          ))}
        </div>
      );
    }

    if (type === 'scenario') {
      const dec = (spec.decision_choices as string[]) ?? [];
      const rea = (spec.reason_choices as string[]) ?? [];
      const uDec = ans.decision as number, uRea = ans.reason as number;
      const cDec = ak.decision as number, cRea = ak.reason as number;
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <AnswerBlock label={t('review.yourAnswer')}>
            <p>{dec[uDec] ?? '—'}</p>
            <p className="text-muted-foreground">{rea[uRea] ?? '—'}</p>
          </AnswerBlock>
          <AnswerBlock label={t('review.correctAnswer')}>
            <p className="text-success">{dec[cDec] ?? '—'}</p>
            <p className="text-success/80">{rea[cRea] ?? '—'}</p>
          </AnswerBlock>
        </div>
      );
    }

    if (type === 'order') {
      const items = (spec.items as string[]) ?? [];
      const uOrder = asNums(ans.order);
      const cOrder = asNums(ak.order);
      const list = (order: number[]) => (
        <ol className="list-decimal space-y-0.5 pl-5">
          {order.map((i, k) => <li key={k}>{items[i] ?? '—'}</li>)}
        </ol>
      );
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <AnswerBlock label={t('review.yourAnswer')}>{list(uOrder)}</AnswerBlock>
          <AnswerBlock label={t('review.correctAnswer')}>{list(cOrder)}</AnswerBlock>
        </div>
      );
    }

    if (type === 'match') {
      const left = (spec.left as string[]) ?? [];
      const right = (spec.right as string[]) ?? [];
      const uPairs = (ans.pairs as [number, number][]) ?? [];
      const cPairs = (ak.pairs as [number, number][]) ?? [];
      const list = (pairs: [number, number][]) => (
        <ul className="space-y-0.5">
          {pairs.map(([l, r], k) => <li key={k}>{(left[l] ?? '—')} → {(right[r] ?? '—')}</li>)}
        </ul>
      );
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <AnswerBlock label={t('review.yourAnswer')}>{list(uPairs)}</AnswerBlock>
          <AnswerBlock label={t('review.correctAnswer')}>{list(cPairs)}</AnswerBlock>
        </div>
      );
    }

    if (type === 'fill') {
      const values = (ans.values as string[]) ?? [];
      const accept = (ak.accept as string[][]) ?? [];
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <AnswerBlock label={t('review.yourAnswer')}>
            <ul className="space-y-0.5">{values.map((v, k) => <li key={k}>{k + 1}. {v || '—'}</li>)}</ul>
          </AnswerBlock>
          <AnswerBlock label={t('review.correctAnswer')}>
            <ul className="space-y-0.5">{accept.map((a, k) => <li key={k}>{k + 1}. {a.join(' / ')}</li>)}</ul>
          </AnswerBlock>
        </div>
      );
    }

    // prompt_repair — free text, graded by requirements; no single correct answer
    if (type === 'prompt_repair') {
      const reqs = (spec.requirements as { id: string; label: string }[]) ?? [];
      return (
        <div className="space-y-3">
          <AnswerBlock label={t('review.yourAnswer')}>
            <div className="whitespace-pre-wrap rounded-md border border-border bg-muted/40 px-3 py-2">
              {(ans.text as string) || '—'}
            </div>
          </AnswerBlock>
          {reqs.length > 0 && (
            <AnswerBlock label={t('review.requirements')}>
              <ul className="list-disc space-y-0.5 pl-5 text-muted-foreground">
                {reqs.map((r) => <li key={r.id}>{r.label}</li>)}
              </ul>
            </AnswerBlock>
          )}
        </div>
      );
    }

    return null;
  }

  return (
    <div className="space-y-4">
      <Markdown>{exercise.prompt_md}</Markdown>
      <div className="flex flex-wrap items-center gap-3">
        {attempted && (
          <div
            className={cn(
              'inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium',
              passed ? 'border-success/20 bg-success/10 text-success' : 'border-destructive/20 bg-destructive/10 text-destructive'
            )}
          >
            {passed ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {t('review.yourScore', { score: score ?? 0, max: max_score })}
          </div>
        )}
        {onRedo && (
          <Button variant="outline" size="sm" onClick={onRedo} className="gap-1.5" data-testid="redo-exercise-btn">
            <RotateCcw className="h-3.5 w-3.5" />
            {t('lesson.retry')}
          </Button>
        )}
      </div>
      {body()}
    </div>
  );
}
