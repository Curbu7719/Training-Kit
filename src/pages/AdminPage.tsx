import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { useLanguage, type LanguageContextValue } from '@/lib/i18n';
import {
  listModules,
  getModuleFull,
  updateLesson,
  updateQuizQuestion,
  updateExercise,
  listUsers,
  getProgressReport,
  listReflections,
  getRolePaths,
  updateRolePath,
  type ModuleSummary,
  type ModuleFull,
  type LessonRow,
  type QuizQuestionRow,
  type ExerciseRow,
  type UserSummary,
  type ProgressUser,
  type ReflectionEntry,
  type RolePathRow,
  type RolePathEntry,
} from '@/lib/adminApi';
import { ROLE_ORDER } from '@/lib/rolePaths';
import type { TranslationKey } from '@/lib/locales/en';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function JsonTextarea({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error: string | null;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <textarea
        className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[80px] resize-y"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function parseJson(raw: string): { value: unknown; error: string | null } {
  try {
    return { value: JSON.parse(raw), error: null };
  } catch (e) {
    return { value: null, error: (e as Error).message };
  }
}

// ---------------------------------------------------------------------------
// LessonEditor
// ---------------------------------------------------------------------------

function LessonEditor({ lesson }: { lesson: LessonRow }) {
  const { t } = useLanguage();
  const [title, setTitle] = useState(lesson.title);
  const [bodyMd, setBodyMd] = useState(lesson.body_md ?? '');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  async function handleSave() {
    setSaving(true);
    setSavedMsg('');
    try {
      await updateLesson({ id: lesson.id, title, body_md: bodyMd });
      setSavedMsg(t('admin.saved'));
    } catch (e) {
      setSavedMsg(`Error: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="mb-3">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">
          {t('admin.lesson.title')} — <span className="font-normal text-muted-foreground capitalize">{lesson.kind}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">{t('admin.lesson.kind.label')}</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">{t('admin.lesson.body')}</label>
          <textarea
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[120px] resize-y"
            value={bodyMd}
            onChange={(e) => setBodyMd(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" onClick={() => void handleSave()} disabled={saving}>
            {saving ? <Spinner size="sm" /> : t('admin.save')}
          </Button>
          {savedMsg && (
            <span className={`text-xs ${savedMsg.startsWith('Error') ? 'text-destructive' : 'text-success'}`}>
              {savedMsg}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// QuizQuestionEditor
// ---------------------------------------------------------------------------

function QuizQuestionEditor({ question }: { question: QuizQuestionRow }) {
  const { t } = useLanguage();
  const [prompt, setPrompt] = useState(question.prompt);
  const [choicesRaw, setChoicesRaw] = useState(JSON.stringify(question.choices, null, 2));
  const [correctRaw, setCorrectRaw] = useState(JSON.stringify(question.correct, null, 2));
  const [points, setPoints] = useState(String(question.points));
  const [choicesErr, setChoicesErr] = useState<string | null>(null);
  const [correctErr, setCorrectErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  async function handleSave() {
    const { value: choicesParsed, error: ce } = parseJson(choicesRaw);
    const { value: correctParsed, error: cre } = parseJson(correctRaw);
    setChoicesErr(ce);
    setCorrectErr(cre);
    if (ce || cre) return;

    setSaving(true);
    setSavedMsg('');
    try {
      await updateQuizQuestion({
        id: question.id,
        prompt,
        choices: choicesParsed,
        correct: correctParsed,
        points: Number(points),
      });
      setSavedMsg(t('admin.saved'));
    } catch (e) {
      setSavedMsg(`Error: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="mb-3">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{t('admin.quiz.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">{t('admin.quiz.prompt')}</label>
          <Input value={prompt} onChange={(e) => setPrompt(e.target.value)} className="text-sm" />
        </div>
        <JsonTextarea label={t('admin.quiz.choices')} value={choicesRaw} onChange={setChoicesRaw} error={choicesErr} />
        <JsonTextarea label={t('admin.quiz.correct')} value={correctRaw} onChange={setCorrectRaw} error={correctErr} />
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">{t('admin.quiz.points')}</label>
          <Input
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            className="w-24 text-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" onClick={() => void handleSave()} disabled={saving}>
            {saving ? <Spinner size="sm" /> : t('admin.save')}
          </Button>
          {savedMsg && (
            <span className={`text-xs ${savedMsg.startsWith('Error') ? 'text-destructive' : 'text-success'}`}>
              {savedMsg}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// ExerciseEditor
// ---------------------------------------------------------------------------

function ExerciseEditor({ exercise }: { exercise: ExerciseRow }) {
  const { t } = useLanguage();
  const [promptMd, setPromptMd] = useState(exercise.prompt_md);
  const [specRaw, setSpecRaw] = useState(JSON.stringify(exercise.spec, null, 2));
  const [answerKeyRaw, setAnswerKeyRaw] = useState(JSON.stringify(exercise.answer_key, null, 2));
  const [maxScore, setMaxScore] = useState(String(exercise.max_score));
  const [specErr, setSpecErr] = useState<string | null>(null);
  const [answerKeyErr, setAnswerKeyErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  async function handleSave() {
    const { value: specParsed, error: se } = parseJson(specRaw);
    const { value: answerKeyParsed, error: ake } = parseJson(answerKeyRaw);
    setSpecErr(se);
    setAnswerKeyErr(ake);
    if (se || ake) return;

    setSaving(true);
    setSavedMsg('');
    try {
      await updateExercise({
        id: exercise.id,
        prompt_md: promptMd,
        spec: specParsed,
        answer_key: answerKeyParsed,
        max_score: Number(maxScore),
      });
      setSavedMsg(t('admin.saved'));
    } catch (e) {
      setSavedMsg(`Error: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="mb-3">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">
          {t('admin.exercise.title')} — <span className="font-normal text-muted-foreground capitalize">{exercise.type}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">{t('admin.exercise.prompt')}</label>
          <textarea
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[80px] resize-y"
            value={promptMd}
            onChange={(e) => setPromptMd(e.target.value)}
          />
        </div>
        <JsonTextarea label={t('admin.exercise.spec')} value={specRaw} onChange={setSpecRaw} error={specErr} />
        <JsonTextarea label={t('admin.exercise.answerKey')} value={answerKeyRaw} onChange={setAnswerKeyRaw} error={answerKeyErr} />
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">{t('admin.exercise.maxScore')}</label>
          <Input
            type="number"
            value={maxScore}
            onChange={(e) => setMaxScore(e.target.value)}
            className="w-24 text-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" onClick={() => void handleSave()} disabled={saving}>
            {saving ? <Spinner size="sm" /> : t('admin.save')}
          </Button>
          {savedMsg && (
            <span className={`text-xs ${savedMsg.startsWith('Error') ? 'text-destructive' : 'text-success'}`}>
              {savedMsg}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// ContentTab
// ---------------------------------------------------------------------------

function ContentTab() {
  const { t } = useLanguage();
  const [modules, setModules] = useState<ModuleSummary[]>([]);
  const [loadingModules, setLoadingModules] = useState(true);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [moduleFull, setModuleFull] = useState<ModuleFull | null>(null);
  const [loadingFull, setLoadingFull] = useState(false);
  const [fetchErr, setFetchErr] = useState<string | null>(null);

  useEffect(() => {
    listModules()
      .then(setModules)
      .catch((e: Error) => setFetchErr(e.message))
      .finally(() => setLoadingModules(false));
  }, []);

  const selectModule = useCallback(async (code: string) => {
    setSelectedCode(code);
    setModuleFull(null);
    setLoadingFull(true);
    setFetchErr(null);
    try {
      const full = await getModuleFull(code);
      setModuleFull(full);
    } catch (e) {
      setFetchErr((e as Error).message);
    } finally {
      setLoadingFull(false);
    }
  }, []);

  if (loadingModules) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (fetchErr && !selectedCode) {
    return <p className="text-sm text-destructive py-4">{fetchErr}</p>;
  }

  return (
    <div className="flex gap-6">
      {/* Module list */}
      <aside className="w-56 shrink-0 space-y-1">
        {modules.map((m) => (
          <button
            key={m.code}
            onClick={() => void selectModule(m.code)}
            className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
              selectedCode === m.code
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted text-foreground'
            }`}
          >
            {m.title}
          </button>
        ))}
      </aside>

      {/* Module detail */}
      <div className="flex-1 min-w-0">
        {!selectedCode && (
          <p className="text-sm text-muted-foreground">{t('admin.content.selectModule')}</p>
        )}

        {selectedCode && loadingFull && (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        )}

        {selectedCode && fetchErr && !loadingFull && (
          <p className="text-sm text-destructive py-4">{fetchErr}</p>
        )}

        {moduleFull && !loadingFull && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">{moduleFull.module.title}</h2>

            {moduleFull.lessons.length > 0 && (
              <section>
                <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {t('admin.sections.lessons')}
                </h3>
                {moduleFull.lessons.map((l) => (
                  <LessonEditor key={l.id} lesson={l} />
                ))}
              </section>
            )}

            {moduleFull.quiz_questions.length > 0 && (
              <section>
                <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {t('admin.sections.quizQuestions')}
                </h3>
                {moduleFull.quiz_questions.map((q) => (
                  <QuizQuestionEditor key={q.id} question={q} />
                ))}
              </section>
            )}

            {moduleFull.exercises.length > 0 && (
              <section>
                <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {t('admin.sections.exercises')}
                </h3>
                {moduleFull.exercises.map((ex) => (
                  <ExerciseEditor key={ex.id} exercise={ex} />
                ))}
              </section>
            )}

            {moduleFull.lessons.length === 0 &&
              moduleFull.quiz_questions.length === 0 &&
              moduleFull.exercises.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  {t('admin.content.noContent')}
                </p>
              )}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// UsersTab
// ---------------------------------------------------------------------------

// No track labels — single shared curriculum, no per-user track.

function UsersTab() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState<string | null>(null);

  useEffect(() => {
    listUsers()
      .then(setUsers)
      .catch((e: Error) => setFetchErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (fetchErr) {
    return <p className="text-sm text-destructive py-4">{fetchErr}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
            <th className="pb-2 pr-4">{t('admin.users.col.name')}</th>
            <th className="pb-2 pr-4">{t('admin.users.col.role')}</th>
            <th className="pb-2 pr-4 text-right">{t('admin.users.col.modules')}</th>
            <th className="pb-2 pr-4 text-right">{t('admin.users.col.score')}</th>
            <th className="pb-2 text-right">{t('admin.users.col.badges')}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-border/50 last:border-0">
              <td className="py-2 pr-4 font-medium">{u.display_name ?? '—'}</td>
              <td className="py-2 pr-4">
                <Badge variant={u.role === 'admin' ? 'accent' : 'outline'} className="text-xs">
                  {u.role}
                </Badge>
              </td>
              <td className="py-2 pr-4 text-right tabular-nums">{u.modules_passed}</td>
              <td className="py-2 pr-4 text-right tabular-nums">{u.total_score}</td>
              <td className="py-2 text-right tabular-nums">{u.badge_count}</td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-center text-muted-foreground">
                {t('admin.users.empty')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ProgressTab helpers
// ---------------------------------------------------------------------------

function devScoreColor(score: number): string {
  if (score >= 75) return 'bg-green-500';
  if (score >= 40) return 'bg-amber-400';
  return 'bg-muted-foreground';
}

function devScoreTextColor(score: number): string {
  if (score >= 75) return 'text-green-600 dark:text-green-400';
  if (score >= 40) return 'text-amber-600 dark:text-amber-400';
  return 'text-muted-foreground';
}

function SectionCell({ unitsPassed, unitsTotal, avgScore }: { unitsPassed: number; unitsTotal: number; avgScore: number }) {
  return (
    <span className="tabular-nums text-xs text-muted-foreground">
      {unitsPassed}/{unitsTotal}
      <span className="mx-1 opacity-40">·</span>
      {Math.round(avgScore)}%
    </span>
  );
}

function DevScoreCell({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2 justify-end">
      <span className={`text-sm font-semibold tabular-nums ${devScoreTextColor(score)}`}>
        {Math.round(score)}
      </span>
      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full ${devScoreColor(score)}`}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
    </div>
  );
}

function categoryLabel(category: string, t: LanguageContextValue['t']): string {
  if (category === 'sdlc') return t('section.sdlc.title');
  if (category === 'strategy') return t('section.strategy.title');
  if (category === 'practice') return t('section.vibe.title');
  return category;
}

// ---------------------------------------------------------------------------
// ProgressTab
// ---------------------------------------------------------------------------

function ProgressTab() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<string[]>([]);
  const [users, setUsers] = useState<ProgressUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState<string | null>(null);

  useEffect(() => {
    getProgressReport()
      .then(({ categories: cats, users: us }) => {
        setCategories(cats);
        setUsers(us);
      })
      .catch((e: Error) => setFetchErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (fetchErr) {
    return <p className="text-sm text-destructive py-4">{fetchErr}</p>;
  }

  return (
    <div className="space-y-4">
      {/* Legend */}
      <p className="text-xs text-muted-foreground">{t('admin.progress.legend')}</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
              <th className="pb-2 pr-4">{t('admin.progress.col.user')}</th>
              <th className="pb-2 pr-4">{t('admin.progress.col.role')}</th>
              {categories.map((cat) => (
                <th key={cat} className="pb-2 pr-4 text-right capitalize">
                  {categoryLabel(cat, t)}
                </th>
              ))}
              <th className="pb-2 pr-4 text-right">{t('admin.progress.col.exam')}</th>
              <th className="pb-2 text-right">{t('admin.progress.col.devScore')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border/50 last:border-0">
                <td className="py-2 pr-4 font-medium">{u.display_name}</td>
                <td className="py-2 pr-4">
                  <Badge variant={u.role === 'admin' ? 'accent' : 'outline'} className="text-xs">
                    {u.role}
                  </Badge>
                </td>
                {u.sections.map((sec, i) => (
                  <td key={i} className="py-2 pr-4 text-right">
                    <SectionCell
                      unitsPassed={sec.unitsPassed}
                      unitsTotal={sec.unitsTotal}
                      avgScore={sec.avgScore}
                    />
                  </td>
                ))}
                <td className="py-2 pr-4 text-right tabular-nums text-xs">
                  {u.exam_best !== null ? `${u.exam_best}%` : t('admin.progress.examNever')}
                </td>
                <td className="py-2">
                  <DevScoreCell score={u.development_score} />
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={3 + categories.length + 2} className="py-6 text-center text-muted-foreground">
                  {t('admin.progress.empty')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ReflectionsTab — learners' mandatory end-of-training writeups (admin-only)
// ---------------------------------------------------------------------------

function ReflectionsTab() {
  const { t } = useLanguage();
  const [items, setItems] = useState<ReflectionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState<string | null>(null);

  useEffect(() => {
    listReflections()
      .then(setItems)
      .catch((e: Error) => setFetchErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (fetchErr) {
    return <p className="text-sm text-destructive py-4">{fetchErr}</p>;
  }

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground py-4">{t('admin.reflections.empty')}</p>;
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">{t('admin.reflections.intro')}</p>
      {items.map((r) => (
        <Card key={r.user_id}>
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-sm">{r.display_name ?? r.user_id}</CardTitle>
              <div className="flex items-center gap-2">
                {r.learning_role && (
                  <Badge variant="outline" className="text-xs">{r.learning_role}</Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {new Date(r.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t('admin.reflections.work')}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{r.work_application}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t('admin.reflections.value')}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{r.expected_value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// RolePathsTab — set which modules are core (must) / recommended per role
// ---------------------------------------------------------------------------

type PathKind = 'off' | 'core' | 'recommended';
interface RowState { kind: PathKind; level: 'L1' | 'L2' }

function RolePathsTab() {
  const { t } = useLanguage();
  const [modules, setModules] = useState<ModuleSummary[]>([]);
  const [allPaths, setAllPaths] = useState<RolePathRow[]>([]);
  const [role, setRole] = useState<string>(ROLE_ORDER[0]);
  const [state, setState] = useState<Record<string, RowState>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [fetchErr, setFetchErr] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([listModules(), getRolePaths()])
      .then(([mods, paths]) => {
        // Show modules in their natural sort order.
        setModules([...mods].sort((a, b) => a.sort_order - b.sort_order));
        setAllPaths(paths);
      })
      .catch((e: Error) => setFetchErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Rebuild the editable map whenever the role or loaded paths change.
  useEffect(() => {
    const map: Record<string, RowState> = {};
    for (const p of allPaths.filter((p) => p.role === role)) {
      map[p.module_code] = { kind: p.kind, level: p.level };
    }
    setState(map);
    setSavedMsg('');
  }, [role, allPaths]);

  function setKind(code: string, kind: PathKind) {
    setState((prev) => ({ ...prev, [code]: { kind, level: prev[code]?.level ?? 'L1' } }));
  }
  function setLevel(code: string, level: 'L1' | 'L2') {
    setState((prev) => ({ ...prev, [code]: { kind: prev[code]?.kind ?? 'off', level } }));
  }

  async function handleSave() {
    setSaving(true);
    setSavedMsg('');
    // Preserve module order; number core and recommended independently.
    const counters: Record<string, number> = { core: 0, recommended: 0 };
    const entries: RolePathEntry[] = [];
    for (const m of modules) {
      const r = state[m.code];
      if (!r || r.kind === 'off') continue;
      entries.push({ module_code: m.code, kind: r.kind, level: r.level, sort_order: counters[r.kind]++ });
    }
    try {
      await updateRolePath(role, entries);
      // Refresh the canonical copy so switching roles reflects the save.
      setAllPaths((prev) => [
        ...prev.filter((p) => p.role !== role),
        ...entries.map((e) => ({ role, module_code: e.module_code, level: e.level, kind: e.kind, sort_order: e.sort_order ?? 0 })),
      ]);
      setSavedMsg(t('admin.saved'));
    } catch (e) {
      setSavedMsg(`Error: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
  }
  if (fetchErr) {
    return <p className="text-sm text-destructive py-4">{fetchErr}</p>;
  }

  const coreCount = Object.values(state).filter((r) => r.kind === 'core').length;
  const recCount = Object.values(state).filter((r) => r.kind === 'recommended').length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">{t('admin.rolePaths.role')}</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            data-testid="admin-role-select"
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {ROLE_ORDER.map((r) => (
              <option key={r} value={r}>{t(`role.${r}` as TranslationKey)}</option>
            ))}
          </select>
          <span className="text-xs text-muted-foreground">
            {t('admin.rolePaths.counts', { core: coreCount, rec: recCount })}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" onClick={() => void handleSave()} disabled={saving}>
            {saving ? <Spinner size="sm" /> : t('admin.save')}
          </Button>
          {savedMsg && (
            <span className={`text-xs ${savedMsg.startsWith('Error') ? 'text-destructive' : 'text-success'}`}>{savedMsg}</span>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">{t('admin.rolePaths.help')}</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
              <th className="pb-2 pr-4">{t('admin.rolePaths.col.module')}</th>
              <th className="pb-2 pr-4">{t('admin.rolePaths.col.kind')}</th>
              <th className="pb-2">{t('admin.rolePaths.col.level')}</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((m) => {
              const r = state[m.code] ?? { kind: 'off' as PathKind, level: 'L1' as const };
              return (
                <tr key={m.code} className="border-b border-border/50 last:border-0">
                  <td className="py-2 pr-4 font-medium">{m.title}</td>
                  <td className="py-2 pr-4">
                    <select
                      value={r.kind}
                      onChange={(e) => setKind(m.code, e.target.value as PathKind)}
                      className="rounded-md border border-input bg-background px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="off">{t('admin.rolePaths.kind.off')}</option>
                      <option value="core">{t('admin.rolePaths.kind.core')}</option>
                      <option value="recommended">{t('admin.rolePaths.kind.recommended')}</option>
                    </select>
                  </td>
                  <td className="py-2">
                    <select
                      value={r.level}
                      disabled={r.kind === 'off'}
                      onChange={(e) => setLevel(m.code, e.target.value as 'L1' | 'L2')}
                      className="rounded-md border border-input bg-background px-2 py-1 text-xs disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="L1">L1</option>
                      <option value="L2">L2</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AdminPage
// ---------------------------------------------------------------------------

export function AdminPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-xl font-bold text-primary hover:opacity-80 transition-opacity"
            >
              {t('nav.brand')}
            </button>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {t('admin.badge')}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
            {t('nav.dashboard')}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold">{t('admin.title')}</h1>

        <Tabs defaultValue="content">
          <TabsList className="mb-6">
            <TabsTrigger value="content">{t('admin.tab.content')}</TabsTrigger>
            <TabsTrigger value="users">{t('admin.tab.users')}</TabsTrigger>
            <TabsTrigger value="progress">{t('admin.tab.progress')}</TabsTrigger>
            <TabsTrigger value="rolepaths">{t('admin.tab.rolePaths')}</TabsTrigger>
            <TabsTrigger value="reflections">{t('admin.tab.reflections')}</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <ContentTab />
          </TabsContent>

          <TabsContent value="users">
            <UsersTab />
          </TabsContent>

          <TabsContent value="progress">
            <ProgressTab />
          </TabsContent>

          <TabsContent value="rolepaths">
            <RolePathsTab />
          </TabsContent>

          <TabsContent value="reflections">
            <ReflectionsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
