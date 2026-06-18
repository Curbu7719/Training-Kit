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
import type { TranslationKey } from '@/lib/locales/en';

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
] as const;

const STRATEGY_CODES = ['ai_fit_buildbuy', 'ai_risk_governance', 'ai_value_scaling'] as const;

const MODULE_CODES = [...SDLC_CODES, ...STRATEGY_CODES] as const;

type ModuleCode = (typeof MODULE_CODES)[number];

const SECTIONS = [
  { titleKey: 'section.sdlc.title', codes: SDLC_CODES },
  { titleKey: 'section.strategy.title', codes: STRATEGY_CODES },
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
  onOpen: () => void;
}

function ModuleCard({ code, index, l1Status, l2Status, onOpen }: ModuleCardProps) {
  const { t } = useLanguage();

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
                    onOpen={() => navigate(`/learn/${code}`)}
                  />
                );
              })}
            </div>
          </section>
        ))}

        <section>
          <h2 className="mb-4 text-lg font-semibold">{t('dashboard.badges')}</h2>
          <BadgeShelf />
        </section>
      </main>

      {loading && <span className="sr-only">{t('dashboard.loadingProgress')}</span>}
    </div>
  );
}
