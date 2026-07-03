import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Clock, CheckCircle2, Circle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AppHeader } from '@/components/layout/AppHeader';
import { cn } from '@/lib/utils';
import type { TranslationKey } from '@/lib/locales/en';
import { ROLE_PATHS, type RoleKey, type RolePath } from '@/lib/rolePaths';

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

// Universal safety core — shown first, required for every role.
const FOUNDATION_CODES = ['using_ai_safely', 'ai_vs_automation'] as const;

const MODULE_CODES = [...FOUNDATION_CODES, ...SDLC_CODES, ...STRATEGY_CODES, ...VIBE_CODES] as const;

type ModuleCode = (typeof MODULE_CODES)[number];

// Draft estimated minutes per level (L1 = foundations, L2 = deep dive).
// Language-agnostic; rendered with a localized "~N min" suffix.
const MODULE_MINUTES: Record<ModuleCode, { l1: number; l2: number }> = {
  using_ai_safely:      { l1: 12, l2: 12 },
  ai_vs_automation:     { l1: 12, l2: 15 },
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
  { titleKey: 'section.foundations.title', codes: FOUNDATION_CODES },
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
  locked:      { labelKey: 'status.locked',     icon: Lock,          className: 'bg-muted text-muted-foreground' },
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
  /** Whether this module's L2 is mandatory (a role deep-dive) vs. recommended. */
  l2Mandatory?: boolean;
  onOpen: (level: 'L1' | 'L2') => void;
}

function ModuleCard({ code, index, l1Status, l2Status, l2Mandatory, onOpen }: ModuleCardProps) {
  const { t } = useLanguage();
  const minutes = MODULE_MINUTES[code];

  const ctaLabel =
    l1Status === 'passed' && l2Status === 'passed'
      ? t('dashboard.cta.review')
      : l1Status === 'in_progress' || l1Status === 'passed'
        ? t('dashboard.cta.continue')
        : t('dashboard.cta.start');

  // Where the main CTA lands: continue into L2 only when L1 is passed but L2
  // isn't yet; otherwise open L1 (start, or review from the beginning).
  const ctaLevel: 'L1' | 'L2' = l1Status === 'passed' && l2Status !== 'passed' ? 'L2' : 'L1';

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
            </CardTitle>
            <CardDescription className="mt-0.5">
              {t(`module.${code}.desc` as TranslationKey)}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {/* L1 row — click to open L1 directly */}
        <button
          type="button"
          onClick={() => onOpen('L1')}
          className="flex w-full items-center justify-between rounded-md border border-border px-3 py-2 text-left transition-colors hover:border-primary/50 hover:bg-muted/50"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">L1</span>
            <span className="text-sm">{t('dashboard.level.foundations')}</span>
            <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
              {t('role.required')}
            </span>
            <span className="text-xs text-muted-foreground">· {t('dashboard.minutes', { min: minutes.l1 })}</span>
          </div>
          <StatusBadge status={l1Status} />
        </button>

        {/* L2 row — click to open L2 (locked until L1 passes) */}
        <button
          type="button"
          onClick={() => onOpen('L2')}
          disabled={l2Status === 'locked'}
          className={cn(
            'flex w-full items-center justify-between rounded-md border border-border px-3 py-2 text-left transition-colors',
            l2Status === 'locked' ? 'opacity-50' : 'hover:border-primary/50 hover:bg-muted/50'
          )}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">L2</span>
            <span className="text-sm">{t('dashboard.level.deepDive')}</span>
            {l2Mandatory ? (
              <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                {t('role.required')}
              </span>
            ) : (
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                {t('path.recommended')}
              </span>
            )}
            <span className="text-xs text-muted-foreground">· {t('dashboard.minutes', { min: minutes.l2 })}</span>
          </div>
          <StatusBadge status={l2Status} />
        </button>

        <Button size="sm" className="mt-1 w-full" onClick={() => onOpen(ctaLevel)}>
          {ctaLabel}
        </Button>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function DashboardPage() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // module code → id, and module_id → { L1, L2 } progress.
  const [moduleIdByCode, setModuleIdByCode] = useState<Record<string, string>>({});
  const [progressByModule, setProgressByModule] = useState<Record<string, Partial<Record<Level, ProgressRow>>>>({});
  const [loading, setLoading] = useState(true);
  // Role path loaded from the DB (admin-managed); falls back to the constant.
  // Used only to flag which modules are "Required" for the chosen role.
  const [dbPath, setDbPath] = useState<RolePath | null>(null);

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

    // Load the admin-managed role path for this user's role.
    if (profile.learning_role) {
      const { data: rp } = await supabase
        .from('role_paths')
        .select('module_code, level, kind, sort_order')
        .eq('role', profile.learning_role);
      const rows = (rp ?? []) as { module_code: string; level: Level; kind: string; sort_order: number }[];
      if (rows.length > 0) {
        const pick = (kind: string) =>
          rows.filter((r) => r.kind === kind)
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((r) => ({ code: r.module_code, level: r.level }));
        setDbPath({ core: pick('core'), recommended: pick('recommended') });
      } else {
        setDbPath(null);
      }
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

  const firstName = (profile?.display_name ?? '').trim().split(/\s+/)[0] ?? '';

  // Role is chosen once on the Welcome page and locked thereafter. If a learner
  // somehow reaches the dashboard without one, send them back to pick it.
  const role = profile?.learning_role ?? '';
  useEffect(() => {
    if (profile && !profile.learning_role) navigate('/welcome', { replace: true });
  }, [profile, navigate]);

  const path = dbPath ?? (role && role in ROLE_PATHS ? ROLE_PATHS[role as RoleKey] : null);
  // Modules the role goes deep on → their L2 is mandatory. Every module's L1 is
  // mandatory for everyone; the L2 of the remaining modules is recommended.
  const l2MandatoryCodes = new Set(
    [...(path?.core ?? []), ...(path?.recommended ?? [])]
      .filter((rm) => rm.level === 'L2')
      .map((rm) => rm.code)
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Body */}
      <main className="mx-auto w-full max-w-[1760px] space-y-8 px-5 py-8 sm:px-8">
        {/* Greeting */}
        <section>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            {t('dashboard.greeting', { name: firstName })}
          </h1>
          <p className="mt-1.5 text-[15px] text-muted-foreground">{t('dashboard.hero.sub')}</p>
        </section>

        {SECTIONS.map(({ titleKey, codes }) => (
          <section key={titleKey}>
            <h2 className="mb-4 text-lg font-semibold">{t(titleKey as TranslationKey)}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {codes.map((code, i) => {
                const { l1, l2 } = statusFor(code);
                return (
                  <ModuleCard
                    key={code}
                    code={code}
                    index={i}
                    l1Status={l1}
                    l2Status={l2}
                    l2Mandatory={l2MandatoryCodes.has(code)}
                    onOpen={(lv) => navigate(`/learn/${code}?level=${lv}`)}
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
      </main>

      {loading && <span className="sr-only">{t('dashboard.loadingProgress')}</span>}
    </div>
  );
}
