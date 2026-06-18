import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage, type LanguageContextValue } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { submitExam, type ExamSubmitResponse } from '@/lib/api';
import { burstConfetti } from '@/lib/confetti';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ExamQuestion {
  id: string;
  prompt: string;
  choices: string[];
  sort_order: number;
}

// ---------------------------------------------------------------------------
// Question card
// ---------------------------------------------------------------------------

interface QuestionCardProps {
  question: ExamQuestion;
  index: number;
  total: number;
  selected: number | undefined;
  onSelect: (choiceIdx: number) => void;
}

function QuestionCard({ question, index, total, selected, onSelect }: QuestionCardProps) {
  const { t } = useLanguage();
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-muted-foreground">
          {t('exam.questionLabel', { n: index + 1, total })}
        </CardTitle>
        <CardDescription className="text-base text-card-foreground mt-1 leading-snug">
          {question.prompt}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {question.choices.map((choice, ci) => (
          <button
            key={ci}
            type="button"
            onClick={() => onSelect(ci)}
            className={cn(
              'w-full rounded-md border px-4 py-2.5 text-left text-sm transition-colors',
              selected === ci
                ? 'border-primary bg-primary/10 text-primary font-medium'
                : 'border-border hover:bg-secondary/50'
            )}
          >
            <span className="mr-2 font-semibold">
              {String.fromCharCode(65 + ci)}.
            </span>
            {choice}
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Result item
// ---------------------------------------------------------------------------

interface ResultItemProps {
  question: ExamQuestion;
  index: number;
  total: number;
  chosenIdx: number;
  isCorrect: boolean;
  correctIdx: number;
  explanation: string;
}

function ResultItem({
  question,
  index,
  total,
  chosenIdx,
  isCorrect,
  correctIdx,
  explanation,
}: ResultItemProps) {
  const { t } = useLanguage();
  return (
    <Card className={cn(isCorrect ? 'border-success/40' : 'border-destructive/30')}>
      <CardHeader className="pb-2">
        <div className="flex items-start gap-2">
          {isCorrect ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-success mt-0.5" />
          ) : (
            <XCircle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
          )}
          <div>
            <p className="text-xs font-semibold text-muted-foreground">
              {t('exam.questionLabel', { n: index + 1, total })} &mdash;{' '}
              <span className={isCorrect ? 'text-success' : 'text-destructive'}>
                {isCorrect ? t('exam.correct') : t('exam.incorrect')}
              </span>
            </p>
            <p className="mt-1 text-sm leading-snug">{question.prompt}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {question.choices.map((choice, ci) => {
          const isChosen = ci === chosenIdx;
          const isRight = ci === correctIdx;
          return (
            <div
              key={ci}
              className={cn(
                'rounded-md border px-3 py-2 text-sm',
                isRight
                  ? 'border-success/60 bg-success/10 text-success font-medium'
                  : isChosen && !isCorrect
                  ? 'border-destructive/40 bg-destructive/10 text-destructive line-through'
                  : 'border-border text-muted-foreground'
              )}
            >
              <span className="mr-1.5 font-semibold">{String.fromCharCode(65 + ci)}.</span>
              {choice}
            </div>
          );
        })}
        {/* Explanation — prominent on correct, subtle on incorrect */}
        <div
          className={cn(
            'mt-2 rounded-md p-3 text-sm',
            isCorrect
              ? 'bg-success/10 text-success border border-success/30 font-medium'
              : 'bg-muted/50 text-muted-foreground border border-border'
          )}
        >
          {explanation}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Score headline
// ---------------------------------------------------------------------------

function scoreHeadline(score: number, passed: boolean, t: LanguageContextValue['t']): string {
  if (passed) {
    if (score === 100) return t('exam.headline.perfect');
    if (score >= 90) return t('exam.headline.outstanding');
    return t('exam.headline.passed');
  }
  if (score >= 60) return t('exam.headline.close');
  return t('exam.headline.keepGoing');
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function ExamPage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [loadingQ, setLoadingQ] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // answers: question_id → chosen choice index
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [results, setResults] = useState<ExamSubmitResponse | null>(null);

  // ---------------------------------------------------------------------------
  // Load questions
  // ---------------------------------------------------------------------------

  useEffect(() => {
    setLoadingQ(true);
    setLoadError(null);
    setAnswers({});
    setResults(null);

    supabase
      .from('exam_questions')
      .select('id, lang, prompt, choices, sort_order')
      .eq('lang', lang)
      .order('sort_order')
      .then(({ data, error }) => {
        if (error) {
          setLoadError(error.message);
        } else {
          setQuestions((data ?? []) as ExamQuestion[]);
        }
        setLoadingQ(false);
      });
  }, [lang]);

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await submitExam(answers, lang);
      setResults(res);
      if (res.passed) {
        burstConfetti();
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t('exam.submitError'));
    } finally {
      setSubmitting(false);
    }
  }

  function handleRetake() {
    setAnswers({});
    setResults(null);
    setSubmitError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ---------------------------------------------------------------------------
  // Derived
  // ---------------------------------------------------------------------------

  const answeredCount = Object.keys(answers).length;
  const totalCount = questions.length;
  const allAnswered = answeredCount === totalCount && totalCount > 0;

  // ---------------------------------------------------------------------------
  // Loading / error states
  // ---------------------------------------------------------------------------

  if (loadingQ) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">{t('exam.loadingQuestions')}</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-destructive">{loadError}</p>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          {t('nav.backToDashboard')}
        </Button>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Results view
  // ---------------------------------------------------------------------------

  if (results) {
    const headline = scoreHeadline(results.score, results.passed, t);

    return (
      <div className="min-h-screen bg-muted/30">
        <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
            <span className="text-xl font-bold text-primary">{t('nav.brand')}</span>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              {t('nav.backToDashboard')}
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-6 py-8 space-y-6">
          {/* Score summary */}
          <Card className={cn('text-center', results.passed ? 'border-success/50' : 'border-border')}>
            <CardHeader>
              <CardTitle className="text-4xl font-black" data-testid="exam-score">
                {results.score}
                <span className="text-xl font-normal text-muted-foreground"> / 100</span>
              </CardTitle>
              <CardDescription className="text-lg font-semibold text-card-foreground mt-1">
                {headline}
              </CardDescription>
              <p className="text-sm text-muted-foreground">
                {t('exam.scoreSummary', { correct: results.correctCount, total: results.total })}
              </p>
              {results.newBadge && (
                <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {t('exam.badgeEarned', { badge: results.newBadge })}
                </p>
              )}
            </CardHeader>
            <CardContent className="flex justify-center gap-3">
              <Button onClick={handleRetake} variant="outline">
                {t('exam.retake')}
              </Button>
              <Button onClick={() => navigate('/dashboard')}>
                {t('nav.backToDashboard')}
              </Button>
            </CardContent>
          </Card>

          {/* Per-question breakdown */}
          <div className="space-y-4">
            {results.results.map((r) => {
              const q = questions.find((q) => q.id === r.question_id);
              if (!q) return null;
              return (
                <ResultItem
                  key={r.question_id}
                  question={q}
                  index={questions.indexOf(q)}
                  total={questions.length}
                  chosenIdx={answers[r.question_id] ?? -1}
                  isCorrect={r.is_correct}
                  correctIdx={r.correct}
                  explanation={r.explanation}
                />
              );
            })}
          </div>

          <div className="flex justify-center gap-3 pb-8">
            <Button onClick={handleRetake} variant="outline">
              {t('exam.retake')}
            </Button>
            <Button onClick={() => navigate('/dashboard')}>
              {t('nav.backToDashboard')}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Question form view
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
          <span className="text-xl font-bold text-primary">{t('nav.brand')}</span>
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            {t('nav.backToDashboard')}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8 space-y-6">
        {/* Page heading */}
        <section>
          <h1 className="text-2xl font-bold">{t('exam.pageTitle')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('exam.instructions')}</p>
        </section>

        {/* Progress indicator */}
        <div className="flex items-center justify-between rounded-md bg-card border border-border px-4 py-2.5">
          <span className="text-sm text-muted-foreground">
            {t('exam.answeredOf', { answered: answeredCount, total: totalCount })}
          </span>
          {allAnswered && (
            <span className="text-xs font-medium text-success">{t('exam.allAnswered')}</span>
          )}
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {questions.map((q, i) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={i}
              total={questions.length}
              selected={answers[q.id]}
              onSelect={(ci) => setAnswers((prev) => ({ ...prev, [q.id]: ci }))}
            />
          ))}
        </div>

        {/* Submit */}
        {submitError && (
          <p className="text-sm text-destructive">{submitError}</p>
        )}

        <div className="flex items-center justify-between pb-8">
          <span className="text-sm text-muted-foreground">
            {t('exam.answeredOf', { answered: answeredCount, total: totalCount })}
          </span>
          <Button
            data-testid="exam-submit-btn"
            onClick={() => void handleSubmit()}
            disabled={submitting || !allAnswered}
          >
            {submitting ? t('exam.submitting') : t('exam.submit')}
          </Button>
        </div>
      </main>
    </div>
  );
}
