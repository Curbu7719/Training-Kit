import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, BookOpen, FlaskConical, HelpCircle, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/i18n';
import { submitExercise, refreshProgress } from '@/lib/api';
import type { ExerciseAnswer } from '@/lib/api';
import { Markdown } from '@/lib/markdown';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HintPanel, splitBodyMd } from '@/components/lesson/HintPanel';
import { QuizRunner } from '@/components/quiz/QuizRunner';
import type { QuizQuestionRow } from '@/components/quiz/QuizQuestion';
import { McqExercise, type McqSpec } from '@/components/exercise/McqExercise';
import { OrderExercise, type OrderSpec } from '@/components/exercise/OrderExercise';
import { MatchExercise, type MatchSpec } from '@/components/exercise/MatchExercise';
import { FillExercise, type FillSpec } from '@/components/exercise/FillExercise';
import { ScenarioExercise, type ScenarioSpec } from '@/components/exercise/ScenarioExercise';
import { PromptRepairExercise, type PromptRepairSpec } from '@/components/exercise/PromptRepairExercise';
import { toast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// DB row types (client-safe — no answer_key / correct columns)
// ---------------------------------------------------------------------------

interface LessonRow {
  id: string;
  module_id: string;
  kind: 'concept' | 'example' | 'quiz' | 'exercise';
  title: string;
  body_md: string;
  sort_order: number;
  level: 'L1' | 'L2';
}

interface QuizQuestionDbRow {
  id: string;
  lesson_id: string;
  prompt: string;
  choices: string[];
  points: number;
}

interface ExerciseDbRow {
  id: string;
  lesson_id: string;
  type: 'mcq' | 'order' | 'match' | 'fill' | 'scenario' | 'prompt_repair';
  prompt_md: string;
  spec: Record<string, unknown>;
  max_score: number;
}

interface ModuleRow {
  id: string;
  code: string;
  title: string;
}

// ---------------------------------------------------------------------------
// Lesson kind metadata (icons only — labels come from t())
// ---------------------------------------------------------------------------

const KIND_ICONS = {
  concept:  BookOpen,
  example:  FileText,
  quiz:     HelpCircle,
  exercise: FlaskConical,
} as const;

// ---------------------------------------------------------------------------
// Exercise dispatcher
// ---------------------------------------------------------------------------

function ExerciseWidget({
  exercise,
  onDone,
}: {
  exercise: ExerciseDbRow;
  onDone: () => void;
}) {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(answer: ExerciseAnswer) {
    const res = await submitExercise(exercise.id, answer);
    setSubmitted(true);
    return res;
  }

  return (
    <div className="space-y-4">
      <Markdown>{exercise.prompt_md}</Markdown>

      {exercise.type === 'mcq' && (
        <McqExercise
          exerciseId={exercise.id}
          spec={exercise.spec as unknown as McqSpec}
          onSubmit={handleSubmit}
        />
      )}
      {exercise.type === 'order' && (
        <OrderExercise
          exerciseId={exercise.id}
          spec={exercise.spec as unknown as OrderSpec}
          onSubmit={handleSubmit}
        />
      )}
      {exercise.type === 'match' && (
        <MatchExercise
          exerciseId={exercise.id}
          spec={exercise.spec as unknown as MatchSpec}
          onSubmit={handleSubmit}
        />
      )}
      {exercise.type === 'fill' && (
        <FillExercise
          exerciseId={exercise.id}
          spec={exercise.spec as unknown as FillSpec}
          onSubmit={handleSubmit}
        />
      )}
      {exercise.type === 'scenario' && (
        <ScenarioExercise
          exerciseId={exercise.id}
          spec={exercise.spec as unknown as ScenarioSpec}
          onSubmit={handleSubmit}
        />
      )}
      {exercise.type === 'prompt_repair' && (
        <PromptRepairExercise
          exerciseId={exercise.id}
          spec={exercise.spec as unknown as PromptRepairSpec}
          onSubmit={handleSubmit}
        />
      )}

      {submitted && (
        <Button onClick={onDone} className="mt-2" data-testid="exercise-continue-btn">
          {t('exercise.continue')}
        </Button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// LessonCard — renders one lesson unit
// ---------------------------------------------------------------------------

interface LessonCardProps {
  lesson: LessonRow;
  questions: QuizQuestionDbRow[];
  exercise: ExerciseDbRow | null;
  onQuizComplete: (score: number, max: number) => void;
  onExerciseDone: () => void;
}

function LessonCard({
  lesson,
  questions,
  exercise,
  onQuizComplete,
  onExerciseDone,
}: LessonCardProps) {
  const { t } = useLanguage();
  const Icon = KIND_ICONS[lesson.kind];
  const kindKey = `lesson.kind.${lesson.kind}` as const;

  // For concept/example lessons, strip the hint section from body_md before rendering.
  const displayMd =
    lesson.kind === 'concept' || lesson.kind === 'example'
      ? splitBodyMd(lesson.body_md).concept
      : lesson.body_md;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t(kindKey)}
        </span>
      </div>

      <h2 className="text-xl font-bold">{lesson.title}</h2>

      {(lesson.kind === 'concept' || lesson.kind === 'example') && (
        <>
          <Markdown>{displayMd}</Markdown>
          {lesson.kind === 'concept' && <HintPanel bodyMd={lesson.body_md} />}
        </>
      )}

      {lesson.kind === 'quiz' && (
        <QuizRunner questions={questions as QuizQuestionRow[]} onComplete={onQuizComplete} />
      )}

      {lesson.kind === 'exercise' && exercise && (
        <ExerciseWidget exercise={exercise} onDone={onExerciseDone} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// LessonPlayerPage
// ---------------------------------------------------------------------------

export function LessonPlayerPage() {
  const { moduleCode } = useParams<{ moduleCode: string }>();
  const { profile } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [moduleRow, setModuleRow] = useState<ModuleRow | null>(null);
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [questions, setQuestions] = useState<Record<string, QuizQuestionDbRow[]>>({});
  const [exercises, setExercises] = useState<Record<string, ExerciseDbRow>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completedIdxs, setCompletedIdxs] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [finishing, setFinishing] = useState(false);

  // The level the user is currently working on (L1 default; L2 once L1 is passed).
  // Determined from user_progress — no track required.
  const [userLevel, setUserLevel] = useState<'L1' | 'L2'>('L1');

  const load = useCallback(async () => {
    if (!moduleCode || !profile) return;
    setLoading(true);
    setLoadError(null);

    try {
      // 1. Resolve module row
      const { data: modData, error: modErr } = await supabase
        .from('modules')
        .select('id, code, title')
        .eq('code', moduleCode)
        .single();
      if (modErr || !modData) throw new Error(`Module "${moduleCode}" not found.`);
      setModuleRow(modData as ModuleRow);

      // 2. Determine the user's active level from user_progress.
      //    L2 is accessible once the user has passed L1 for this module.
      const { data: progressRows } = await supabase
        .from('user_progress')
        .select('level, status')
        .eq('user_id', profile.id)
        .eq('module_id', modData.id);

      const l1Passed = (progressRows ?? []).some(
        (r: { level: string; status: string }) => r.level === 'L1' && r.status === 'passed'
      );
      const resolvedLevel: 'L1' | 'L2' = l1Passed ? 'L2' : 'L1';
      setUserLevel(resolvedLevel);

      // 3. Load level-filtered lessons, also filtered by the current UI language.
      //    L2 session loads L1+L2 (cumulative view).
      const levelFilter: string[] =
        resolvedLevel === 'L2' ? ['L1', 'L2'] : ['L1'];

      const { data: lessonData, error: lessonErr } = await supabase
        .from('lessons')
        .select('id, module_id, kind, title, body_md, sort_order, level')
        .eq('module_id', modData.id)
        .eq('lang', lang)
        .in('level', levelFilter)
        .order('sort_order');
      if (lessonErr) throw lessonErr;
      const fetchedLessons = (lessonData ?? []) as LessonRow[];
      setLessons(fetchedLessons);

      // 4. Load quiz questions for quiz lessons
      const quizLessonIds = fetchedLessons
        .filter((l) => l.kind === 'quiz')
        .map((l) => l.id);

      if (quizLessonIds.length > 0) {
        const { data: qData, error: qErr } = await supabase
          .from('quiz_questions')
          .select('id, lesson_id, prompt, choices, points')
          .in('lesson_id', quizLessonIds);
        if (qErr) throw qErr;
        const qMap: Record<string, QuizQuestionDbRow[]> = {};
        for (const q of qData as QuizQuestionDbRow[]) {
          (qMap[q.lesson_id] ??= []).push(q);
        }
        setQuestions(qMap);
      }

      // 5. Load exercises for exercise lessons
      const exerciseLessonIds = fetchedLessons
        .filter((l) => l.kind === 'exercise')
        .map((l) => l.id);

      if (exerciseLessonIds.length > 0) {
        const { data: exData, error: exErr } = await supabase
          .from('exercises')
          .select('id, lesson_id, type, prompt_md, spec, max_score')
          .in('lesson_id', exerciseLessonIds);
        if (exErr) throw exErr;
        const exMap: Record<string, ExerciseDbRow> = {};
        for (const ex of exData as (ExerciseDbRow & { lesson_id: string })[]) {
          exMap[ex.lesson_id] = ex;
        }
        setExercises(exMap);
      }
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Failed to load module.');
    } finally {
      setLoading(false);
    }
  }, [moduleCode, profile, lang]);

  useEffect(() => {
    void load();
  }, [load]);

  function markComplete(idx: number) {
    setCompletedIdxs((prev) => new Set([...prev, idx]));
  }

  function advanceOrComplete(idx: number) {
    markComplete(idx);
    if (idx + 1 < lessons.length) {
      setCurrentIdx(idx + 1);
    }
  }

  async function handleComplete() {
    if (!moduleRow) return;
    setFinishing(true);
    try {
      const res = await refreshProgress(moduleRow.id, userLevel, lang);
      if (res.newBadges.length > 0) {
        toast({
          title: t('toast.newBadge.title'),
          description: res.newBadges.join(', '),
          variant: 'success',
        });
      }
      navigate('/dashboard');
    } catch {
      toast({ title: t('lesson.saveError'), variant: 'destructive' });
      navigate('/dashboard');
    } finally {
      setFinishing(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-destructive">{loadError}</p>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          {t('nav.backToDashboard')}
        </Button>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-muted-foreground">{t('lesson.noLessons')}</p>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          {t('nav.backToDashboard')}
        </Button>
      </div>
    );
  }

  const currentLesson = lessons[currentIdx];
  const allDone = completedIdxs.size === lessons.length;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('nav.dashboard')}
          </Button>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-semibold">{moduleRow?.title}</p>
            <p className="text-xs text-muted-foreground">
              {t('lesson.level', { level: userLevel })} &middot;{' '}
              {t('lesson.progress', { done: completedIdxs.size, total: lessons.length })}
            </p>
          </div>
          <Badge variant={userLevel === 'L2' ? 'accent' : 'default'}>{userLevel}</Badge>
        </div>

        {/* Lesson progress bar */}
        <div className="mx-auto max-w-3xl px-6 pb-2">
          <div className="flex gap-1">
            {lessons.map((l, i) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setCurrentIdx(i)}
                aria-label={t('lesson.goToLesson', { title: l.title })}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-colors',
                  completedIdxs.has(i) && 'bg-success',
                  !completedIdxs.has(i) && i === currentIdx && 'bg-primary',
                  !completedIdxs.has(i) && i !== currentIdx && 'bg-border'
                )}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-3xl px-6 py-8">
        {/* Lesson navigation sidebar pills (small screens: row; large: compact sidebar pill row) */}
        <div className="mb-6 flex flex-wrap gap-2">
          {lessons.map((l, i) => {
            const Icon = KIND_ICONS[l.kind];
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => setCurrentIdx(i)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  i === currentIdx && 'border-primary bg-primary/10 text-primary',
                  i !== currentIdx && completedIdxs.has(i) && 'border-success/50 bg-success/10 text-success',
                  i !== currentIdx && !completedIdxs.has(i) && 'border-border text-muted-foreground hover:border-primary/50'
                )}
              >
                <Icon className="h-3 w-3" />
                {l.title}
                {completedIdxs.has(i) && (
                  <CheckCircle2 className="h-3 w-3 text-success" />
                )}
              </button>
            );
          })}
        </div>

        {/* Current lesson */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <LessonCard
            key={currentLesson.id}
            lesson={currentLesson}
            questions={questions[currentLesson.id] ?? []}
            exercise={exercises[currentLesson.id] ?? null}
            onQuizComplete={(_score, _max) => advanceOrComplete(currentIdx)}
            onExerciseDone={() => advanceOrComplete(currentIdx)}
          />

          {/* Advance controls for non-interactive lessons */}
          {(currentLesson.kind === 'concept' || currentLesson.kind === 'example') && (
            <div className="mt-6 flex justify-end border-t border-border pt-4">
              <Button onClick={() => advanceOrComplete(currentIdx)} data-testid="lesson-next-btn">
                {currentIdx + 1 < lessons.length ? t('lesson.next') : t('lesson.markComplete')}
              </Button>
            </div>
          )}
        </div>

        {/* Complete module CTA — shown when all lessons done */}
        {allDone && (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-lg border border-success/30 bg-success/5 p-6 text-center" data-testid="all-lessons-done-banner">
            <CheckCircle2 className="h-8 w-8 text-success" />
            <p className="font-semibold">{t('lesson.allDone')}</p>
            <p className="text-sm text-muted-foreground">{t('lesson.allDoneDesc')}</p>
            <Button onClick={() => void handleComplete()} disabled={finishing} data-testid="complete-module-btn">
              {finishing ? t('lesson.saving') : t('lesson.completeModule')}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
