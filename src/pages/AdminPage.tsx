import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n';
import {
  listModules,
  getModuleFull,
  updateLesson,
  updateQuizQuestion,
  updateExercise,
  listUsers,
  type ModuleSummary,
  type ModuleFull,
  type LessonRow,
  type QuizQuestionRow,
  type ExerciseRow,
  type UserSummary,
} from '@/lib/adminApi';

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
          </TabsList>

          <TabsContent value="content">
            <ContentTab />
          </TabsContent>

          <TabsContent value="users">
            <UsersTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
