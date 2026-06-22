import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Clock, CheckCircle2, Circle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BadgeShelf } from '@/components/dashboard/BadgeShelf';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { cn } from '@/lib/utils';
import { hasPassedExam, getMyReflection } from '@/lib/api';
import type { TranslationKey } from '@/lib/locales/en';
import { ROLE_PATHS, type RoleKey, type RoleModule } from '@/lib/rolePaths';

// ---------------------------------------------------------------------------
// Single shared curriculum — one path for everyone (no role splitting).
// `code` matches the modules table; title/description come from i18n.
// ---------------------------------------------------------------------------

// Two sections: the operational "AI in the SDLC" strand and the separate
// "AI Strategy Literacy" strand.
const SDLC_CODES = [
  'llm_foundations',
  'tokens',
  'context_management',
  'prompting',
  'guardrails',
  'security_privacy',
  'tool_use_agents',
  'rag',
  'evaluation',
  'cost_latency',
  'ai_architecture',
  'ai_operations_sre',
] as const;

const STRATEGY_CODES = ['ai_fit_buildbuy', 'ai_risk_governance', 'ai_value_scaling', 'ai_delivery_portfolio'] as const;

const VIBE_CODES = ['vibe_coding'] as const;

const MODULE_CODES = [...SDLC_CODES, ...STRATEGY_CODES, ...VIBE_CODES] as const;

type ModuleCode = (typeof MODULE_CODES)[number];

// Draft estimated minutes per level (L1 = foundations, L2 = deep dive).
// Language-agnostic; rendered with a localized "~N min" suffix.
const MODULE_MINUTES: Record<ModuleCode, { l1: number; l2: number }> = {
  llm_foundations:      { l1: 15, l2: 15 },
  tokens:               { l1: 12, l2: 15 },
  context_management:   { l1: 15, l2: 15 },
  prompting:            { l1: 18, l2: 18 },
  guardrails:           { l1: 18, l2: 18 },
  security_privacy:     { l1: 18, l2: 18 },
  tool_use_agents:      { l1: 20, l2: 25 },
  rag:                  { l1: 20, l2: 25 },
  evaluation:           { l1: 18, l2: 20 },
  cost_latency:         { l1: 18, l2: 20 },
  ai_architecture:      { l1: 20, l2: 25 },
  ai_operations_sre:    { l1: 20, l2: 25 },
  ai_fit_buildbuy:      { l1: 15, l2: 15 },
  ai_risk_governance:   { l1: 15, l2: 18 },
  ai_value_scaling:     { l1: 15, l2: 15 },
  ai_delivery_portfolio:{ l1: 18, l2: 18 },
  vibe_coding:          { l1: 18, l2: 18 },
};

const SECTIONS = [
  { titleKey: 'section.sdlc.title', codes: SDLC_CODES },
  { titleKey: 'section.strategy.title', codes: STRATEGY_CODES },
  { titleKey: 'section.vibe.title', codes: VIBE_CODES },
] as const;

// ---------------------------------------------------------------------------
// Status model
// ---------------------------------------------------------------------------

type Level = 'L1' | 'L2';
type DbStatus = 'locked' | 'in_progress' | 'passed';
type CellStatus = 'not_started' | 'locked' | 'in_progress' | 'passed';

interface ProgressRow {
  module_id: string;
  level: Level;
  status: DbStatus;
  score: number;
}

const STATUS_CONFIG: Record<CellStatus, { labelKey: TranslationKey; icon: typeof Lock; className: string }> = {
  not_started: { labelKey: 'status.notStarted', icon: Circle, className: 'bg-muted text-muted-foreground' },
  locked:      { labelKey: 'status.locked',     icon: Lock,          className: 'bg-warning/10 text-warning' },
  in_progress: { labelKey: 'status.inProgress', icon: Clock,         className: 'bg-accent/10 text-accent' },
  passed:      { labelKey: 'status.passed',      icon: CheckCircle2,  className: 'bg-success/10 text-success' },
};

function StatusBadge({ status }: { status: CellStatus }) {
  const { t } = useLanguage();
  const { labelKey, icon: Icon, className } = STATUS_CONFIG[status];
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', className)}>
      <Icon className="h-3 w-3" />
      {t(labelKey)}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Module card
// ---------------------------------------------------------------------------

interface ModuleCardProps {
  code: ModuleCode;
  index: number;
  l1Status: CellStatus;
  l2Status: CellStatus;
  required?: boolean;
  onOpen: () => void;
}

function ModuleCard({ code, index, l1Status, l2Status, required, onOpen }: ModuleCardProps) {
  const { t } = useLanguage();
  const minutes = MODULE_MINUTES[code];

  const ctaLabel =
    l1Status === 'passed' && l2Status === 'passed'
      ? t('dashboard.cta.review')
      : l1Status === 'in_progress' || l1Status === 'passed'
        ? t('dashboard.cta.continue')
        : t('dashboard.cta.start');

  return (
    <Card data-testid={`module-card-${code}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {index + 1}
          </span>
          <div>
            <CardTitle className="text-base leading-snug">
              {t(`module.${code}.title` as TranslationKey)}
              {required && (
                <span className="ml-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wide text-primary">
                  {t('role.required')}
                </span>
              )}
            </CardTitle>
            <CardDescription className="mt-0.5">
              {t(`module.${code}.desc` as TranslationKey)}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {/* L1 row */}
        <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">L1</span>
            <span className="text-sm">{t('dashboard.level.foundations')}</span>
            <span className="text-xs text-muted-foreground">· {t('dashboard.minutes', { min: minutes.l1 })}</span>
          </div>
          <StatusBadge status={l1Status} />
        </div>

        {/* L2 row — dimmed while locked */}
        <div
          className={cn(
            'flex items-center justify-between rounded-md border border-border px-3 py-2',
            l2Status === 'locked' && 'opacity-50'
          )}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">L2</span>
            <span className="text-sm">{t('dashboard.level.deepDive')}</span>
            <span className="text-xs text-muted-foreground">· {t('dashboard.minutes', { min: minutes.l2 })}</span>
          </div>
          <StatusBadge status={l2Status} />
        </div>

        <Button size="sm" className="mt-1 w-full" onClick={onOpen}>
          {ctaLabel}
        </Button>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Role path — a titled list of modules (core or recommended) with status
// ---------------------------------------------------------------------------

function PathList({
  titleKey,
  items,
  statusFor,
  onOpen,
}: {
  titleKey: TranslationKey;
  items: RoleModule[];
  statusFor: (code: string) => { l1: CellStatus; l2: CellStatus; l1Passed: boolean };
  onOpen: (code: string) => void;
}) {
  const { t } = useLanguage();
  if (items.length === 0) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t(titleKey)}</p>
      <ul className="space-y-1.5">
        {items.map((rm) => {
          const s = statusFor(rm.code);
          const cell = rm.level === 'L2' ? s.l2 : s.l1;
          return (
            <li key={`${rm.code}-${rm.level}`}>
              <button
                type="button"
                onClick={() => onOpen(rm.code)}
                className="flex w-full items-center justify-between gap-2 rounded-md border border-border px-3 py-2 text-left text-sm transition-colors hover:bg-muted/50"
              >
                <span className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-muted-foreground">{rm.level}</span>
                  <span>{t(`module.${rm.code}.title` as TranslationKey)}</span>
                </span>
                <StatusBadge status={cell} />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ChecklistRow — one completion gate (required modules / exam / reflection)
// ---------------------------------------------------------------------------

function ChecklistRow({
  done,
  label,
  action,
}: {
  done: boolean;
  label: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-2 text-sm">
        {done ? (
          <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
        ) : (
          <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
        <span className={done ? 'text-foreground' : 'text-muted-foreground'}>{label}</span>
      </span>
      {action && !done && (
        <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function DashboardPage() {
  const { profile, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // module code → id, and module_id → { L1, L2 } progress.
  const [moduleIdByCode, setModuleIdByCode] = useState<Record<string, string>>({});
  const [progressByModule, setProgressByModule] = useState<Record<string, Partial<Record<Level, ProgressRow>>>>({});
  const [loading, setLoading] = useState(true);
  // Completion gates beyond modules: the exam pass and the written reflection.
  const [examPassed, setExamPassed] = useState(false);
  const [reflectionDone, setReflectionDone] = useState(false);

  const load = useCallback(async () => {
    if (!profile) return;
    setLoading(true);

    const { data: mods } = await supabase.from('modules').select('id, code');
    const idMap: Record<string, string> = {};
    for (const m of (mods ?? []) as { id: string; code: string }[]) idMap[m.code] = m.id;
    setModuleIdByCode(idMap);

    const { data: prog } = await supabase
      .from('user_progress')
      .select('module_id, level, status, score')
      .eq('user_id', profile.id);

    const byModule: Record<string, Partial<Record<Level, ProgressRow>>> = {};
    for (const row of (prog ?? []) as ProgressRow[]) {
      (byModule[row.module_id] ??= {})[row.level] = row;
    }
    setProgressByModule(byModule);
    setLoading(false);

    // Track the exam + reflection gates for the completion checklist.
    try {
      const [passed, reflection] = await Promise.all([hasPassedExam(), getMyReflection()]);
      setExamPassed(passed);
      setReflectionDone(!!reflection);
    } catch {
      setExamPassed(false);
      setReflectionDone(false);
    }
  }, [profile]);

  useEffect(() => {
    void load();
  }, [load]);

  // Derive L1/L2 status for a module. L2 stays locked until L1 is passed.
  function statusFor(code: string): { l1: CellStatus; l2: CellStatus; l1Passed: boolean } {
    const moduleId = moduleIdByCode[code];
    const rows = moduleId ? progressByModule[moduleId] : undefined;
    const l1: CellStatus = rows?.L1?.status ?? 'not_started';
    const l1Passed = l1 === 'passed';
    const l2: CellStatus = l1Passed ? (rows?.L2?.status ?? 'not_started') : 'locked';
    return { l1, l2, l1Passed };
  }

  const passedCount = MODULE_CODES.filter((code) => statusFor(code).l1Passed).length;
  const overallPct = Math.round((passedCount / MODULE_CODES.length) * 100);

  // Role is chosen once on the Welcome page and locked thereafter. If a learner
  // somehow reaches the dashboard without one, send them back to pick it.
  const role = profile?.learning_role ?? '';
  useEffect(() => {
    if (profile && !profile.learning_role) navigate('/welcome', { replace: true });
  }, [profile, navigate]);

  const path = role && role in ROLE_PATHS ? ROLE_PATHS[role as RoleKey] : null;
  const moduleSatisfied = (rm: RoleModule) => {
    const s = statusFor(rm.code);
    return rm.level === 'L2' ? s.l2 === 'passed' : s.l1Passed;
  };
  const coreCodes = new Set(path?.core.map((rm) => rm.code) ?? []);
  const coreDone = path ? path.core.filter(moduleSatisfied).length : 0;

  // Completion = every required module passed + exam passed + reflection written.
  const requiredDone = path ? coreDone === path.core.length : false;
  const complete = requiredDone && examPassed && reflectionDone;
  const reflectionDue = examPassed && !reflectionDone;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4">
          <span className="text-xl font-bold text-primary">{t('nav.brand')}</span>
          <div className="flex items-center gap-3">
            {profile?.display_name && (
              <span className="hidden text-sm text-muted-foreground sm:block">{profile.display_name}</span>
            )}
            <Button variant="ghost" size="sm" onClick={() => navigate('/start')}>
              {t('nav.basics')}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/glossary')}>
              {t('nav.glossary')}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/leaderboard')}>
              {t('nav.leaderboard')}
            </Button>
            {profile?.role === 'admin' && (
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
                {t('nav.admin')}
              </Button>
            )}
            <LanguageSwitcher />
            <Button variant="outline" size="sm" onClick={() => void signOut()} data-testid="sign-out-btn">
              {t('nav.signOut')}
            </Button>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-4xl px-6 py-8 space-y-8">
        {/* Mandatory completion reflection — due after passing the exam */}
        {reflectionDue && (
          <button
            type="button"
            data-testid="reflection-banner"
            onClick={() => navigate('/reflection')}
            className="flex w-full items-center justify-between gap-3 rounded-lg border border-amber-400/60 bg-amber-50 px-4 py-3 text-left transition-colors hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-950/50"
          >
            <span>
              <span className="block text-sm font-semibold text-amber-900 dark:text-amber-200">
                {t('dashboard.reflection.title')}
              </span>
              <span className="block text-xs text-amber-800/80 dark:text-amber-200/70">
                {t('dashboard.reflection.body')}
              </span>
            </span>
            <span className="shrink-0 rounded-md bg-amber-500 px-3 py-1.5 text-xs font-medium text-white">
              {t('dashboard.reflection.cta')}
            </span>
          </button>
        )}

        {/* Positioning — what this training is and how to use it */}
        <section className="rounded-lg border border-border bg-card px-5 py-4">
          <h2 className="text-sm font-semibold">{t('dashboard.about.title')}</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t('dashboard.about.body')}</p>
        </section>

        {/* Role-based path */}
        <section className="rounded-lg border border-border bg-card px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold">{t('role.panel.title')}</h2>
            {role && (
              <span
                data-testid="role-locked"
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-sm font-medium text-primary"
              >
                {t(`role.${role}` as TranslationKey)}
              </span>
            )}
          </div>

          {path && (
            <div className="mt-3 space-y-4">
              {/* Completion = all required modules + exam + reflection */}
              {complete ? (
                <div
                  data-testid="training-complete"
                  className="inline-flex items-center gap-1.5 rounded-md bg-success/10 px-3 py-1.5 text-sm font-medium text-success"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {t('dashboard.complete.title')}
                </div>
              ) : (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t('dashboard.complete.checklist')}
                  </p>
                  <ChecklistRow
                    done={requiredDone}
                    label={t('dashboard.complete.modules', { done: coreDone, total: path.core.length })}
                  />
                  <ChecklistRow
                    done={examPassed}
                    label={t('dashboard.complete.exam')}
                    action={!examPassed ? { label: t('exam.cta.button'), onClick: () => navigate('/exam') } : undefined}
                  />
                  <ChecklistRow
                    done={reflectionDone}
                    label={t('dashboard.complete.reflection')}
                    action={examPassed && !reflectionDone ? { label: t('dashboard.reflection.cta'), onClick: () => navigate('/reflection') } : undefined}
                  />
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <PathList titleKey="role.panel.core" items={path.core} statusFor={statusFor} onOpen={(c) => navigate(`/learn/${c}`)} />
                <PathList titleKey="role.panel.recommended" items={path.recommended} statusFor={statusFor} onOpen={(c) => navigate(`/learn/${c}`)} />
              </div>

              <p className="text-xs text-muted-foreground">{t('role.panel.note')}</p>
            </div>
          )}
        </section>

        {/* New-to-AI on-ramp */}
        <button
          type="button"
          onClick={() => navigate('/start')}
          className="flex w-full items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-left text-sm transition-colors hover:bg-primary/10"
        >
          <span className="font-medium text-primary">{t('dashboard.newToAi')}</span>
          <span className="text-primary">→</span>
        </button>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h1 className="text-2xl font-bold">{t('dashboard.learningPath')}</h1>
            <span className="text-sm text-muted-foreground">
              {t('dashboard.modulesPassed', { passed: passedCount, total: MODULE_CODES.length })}
            </span>
          </div>
          <Progress value={overallPct} className="h-2" />
          <p className="mt-1.5 text-xs text-muted-foreground">{t('dashboard.summary')}</p>
        </section>

        {SECTIONS.map(({ titleKey, codes }) => (
          <section key={titleKey}>
            <h2 className="mb-4 text-lg font-semibold">{t(titleKey as TranslationKey)}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {codes.map((code, i) => {
                const { l1, l2 } = statusFor(code);
                return (
                  <ModuleCard
                    key={code}
                    code={code}
                    index={i}
                    l1Status={l1}
                    l2Status={l2}
                    required={coreCodes.has(code)}
                    onOpen={() => navigate(`/learn/${code}`)}
                  />
                );
              })}
            </div>
          </section>
        ))}

        {/* SDLC Exam CTA */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">{t('section.exam.title')}</h2>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t('section.exam.title')}</CardTitle>
              <CardDescription>{t('exam.cta.blurb')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                data-testid="start-exam-btn"
                onClick={() => navigate('/exam')}
              >
                {t('exam.cta.button')}
              </Button>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">{t('dashboard.badges')}</h2>
          <BadgeShelf />
        </section>
      </main>

      {loading && <span className="sr-only">{t('dashboard.loadingProgress')}</span>}
    </div>
  );
}
