import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, Clock, Lock, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/i18n';
import { hasPassedExam, getMyReflection } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { AppHeader } from '@/components/layout/AppHeader';
import { StatsPanel } from '@/components/dashboard/StatsPanel';
import { BadgeShelf } from '@/components/dashboard/BadgeShelf';
import { cn } from '@/lib/utils';
import type { TranslationKey } from '@/lib/locales/en';
import { ROLE_PATHS, type RoleKey, type RoleModule, type RolePath } from '@/lib/rolePaths';

type Level = 'L1' | 'L2';
type CellStatus = 'not_started' | 'locked' | 'in_progress' | 'passed';

const STATUS_ICON: Record<CellStatus, { icon: typeof Lock; cls: string }> = {
  not_started: { icon: Circle, cls: 'text-muted-foreground' },
  locked: { icon: Lock, cls: 'text-warning' },
  in_progress: { icon: Clock, cls: 'text-accent' },
  passed: { icon: CheckCircle2, cls: 'text-success' },
};

// Split a role path into the user's framing:
//   Mandatory  = the L1 of every module (baseline for all roles) PLUS the role's
//                own L2 deep dives (the modules it needs at L2).
//   Recommended = the L2 of every other module (optional deeper study).
// (The stored data marks everything `core` with the level the role needs.)
function derivePath(p: RolePath): { mandatory: RoleModule[]; recommended: RoleModule[] } {
  const all = [...p.core, ...p.recommended];
  // Unique module codes, in path order.
  const codes: string[] = [];
  const seen = new Set<string>();
  for (const e of all) if (!seen.has(e.code)) { seen.add(e.code); codes.push(e.code); }
  // Modules the role goes deep on → their L2 is mandatory.
  const l2Codes = new Set(all.filter((e) => e.level === 'L2').map((e) => e.code));

  const mandatory: RoleModule[] = [];
  for (const code of codes) mandatory.push({ code, level: 'L1' });                 // every L1
  for (const code of codes) if (l2Codes.has(code)) mandatory.push({ code, level: 'L2' }); // role's L2s

  const recommended: RoleModule[] = [];
  for (const code of codes) if (!l2Codes.has(code)) recommended.push({ code, level: 'L2' }); // other L2s

  return { mandatory, recommended };
}

// One module row in the path — clickable, opens that module at its level.
function PathItem({
  rm,
  kind,
  status,
  onOpen,
}: {
  rm: RoleModule;
  kind: 'must' | 'recommended';
  status: CellStatus;
  onOpen: () => void;
}) {
  const { t } = useLanguage();
  const { icon: Icon, cls } = STATUS_ICON[status];
  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        disabled={status === 'locked'}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-md border border-border px-3 py-2.5 text-left text-sm transition-colors',
          status === 'locked' ? 'opacity-50' : 'hover:border-primary/50 hover:bg-muted/50'
        )}
      >
        <span className="flex items-center gap-2">
          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">{rm.level}</span>
          <span className="font-medium">{t(`module.${rm.code}.title` as TranslationKey)}</span>
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
              kind === 'must' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            )}
          >
            {kind === 'must' ? t('path.must') : t('path.recommended')}
          </span>
        </span>
        <Icon className={cn('h-4 w-4 shrink-0', cls)} />
      </button>
    </li>
  );
}

export function LearningPathPage() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [path, setPath] = useState<RolePath | null>(null);
  const [moduleIdByCode, setModuleIdByCode] = useState<Record<string, string>>({});
  const [progressByModule, setProgressByModule] = useState<Record<string, Partial<Record<Level, string>>>>({});
  // Completion gates beyond modules: the exam pass and the written reflection.
  const [examPassed, setExamPassed] = useState(false);
  const [reflectionDone, setReflectionDone] = useState(false);

  // No role yet → send back to pick one.
  useEffect(() => {
    if (profile && !profile.learning_role) navigate('/welcome', { replace: true });
  }, [profile, navigate]);

  const load = useCallback(async () => {
    if (!profile?.learning_role) return;
    setLoading(true);

    const { data: mods } = await supabase.from('modules').select('id, code');
    const idMap: Record<string, string> = {};
    for (const m of (mods ?? []) as { id: string; code: string }[]) idMap[m.code] = m.id;
    setModuleIdByCode(idMap);

    const { data: prog } = await supabase
      .from('user_progress')
      .select('module_id, level, status')
      .eq('user_id', profile.id);
    const byModule: Record<string, Partial<Record<Level, string>>> = {};
    for (const r of (prog ?? []) as { module_id: string; level: Level; status: string }[]) {
      (byModule[r.module_id] ??= {})[r.level] = r.status;
    }
    setProgressByModule(byModule);

    // Admin-managed path from the DB, falling back to the static config.
    const { data: rp } = await supabase
      .from('role_paths')
      .select('module_code, level, kind, sort_order')
      .eq('role', profile.learning_role);
    const rows = (rp ?? []) as { module_code: string; level: Level; kind: string; sort_order: number }[];
    if (rows.length > 0) {
      const pick = (kind: string) =>
        rows.filter((r) => r.kind === kind).sort((a, b) => a.sort_order - b.sort_order).map((r) => ({ code: r.module_code, level: r.level }));
      setPath({ core: pick('core'), recommended: pick('recommended') });
    } else if (profile.learning_role in ROLE_PATHS) {
      setPath(ROLE_PATHS[profile.learning_role as RoleKey]);
    } else {
      setPath(null);
    }

    // Completion gates: exam pass + written reflection.
    try {
      const [passed, reflection] = await Promise.all([hasPassedExam(), getMyReflection()]);
      setExamPassed(passed);
      setReflectionDone(!!reflection);
    } catch {
      setExamPassed(false);
      setReflectionDone(false);
    }

    setLoading(false);
  }, [profile]);

  useEffect(() => {
    void load();
  }, [load]);

  function statusFor(rm: RoleModule): CellStatus {
    const id = moduleIdByCode[rm.code];
    const rows = id ? progressByModule[id] : undefined;
    const l1Passed = rows?.L1 === 'passed';
    if (rm.level === 'L2') {
      if (!l1Passed) return 'locked';
      return (rows?.L2 as CellStatus) ?? 'not_started';
    }
    return (rows?.L1 as CellStatus) ?? 'not_started';
  }

  function open(rm: RoleModule) {
    navigate(`/learn/${rm.code}?level=${rm.level}`);
  }

  // Start learning → the first mandatory (L1) module not yet passed (else first).
  function startLearning() {
    if (!path) return navigate('/dashboard');
    const { mandatory } = derivePath(path);
    const target = mandatory.find((rm) => statusFor(rm) !== 'passed') ?? mandatory[0];
    if (target) navigate(`/learn/${target.code}?level=${target.level}`);
    else navigate('/dashboard');
  }

  const role = profile?.learning_role ?? '';
  const { mandatory, recommended } = path ? derivePath(path) : { mandatory: [], recommended: [] };

  // Completion = every required (core) module passed + exam passed + reflection.
  const reflectionDue = examPassed && !reflectionDone;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="mx-auto w-full max-w-[1760px] space-y-6 px-5 py-10 sm:px-8">
        {/* Your stats — progress, role, what's left and detailed metrics */}
        <StatsPanel />

        {/* Badges earned */}
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t('dashboard.badges')}
          </h2>
          <BadgeShelf />
        </section>

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

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-bold">{t('path.title')}</h1>
            {role && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-sm font-medium text-primary">
                {t(`role.${role}` as TranslationKey)}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t('path.intro')}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : !path ? (
          <p className="text-sm text-muted-foreground">{t('path.none')}</p>
        ) : (
          <>
            {/* Start CTA */}
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-5 py-4">
              <Button onClick={startLearning} data-testid="start-learning-btn" className="gap-1.5">
                {t('path.startLearning')}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => navigate('/dashboard')} data-testid="browse-all-btn">
                {t('path.browseAll')}
              </Button>
              <span className="text-xs text-muted-foreground">{t('path.freeChoice')}</span>
            </div>

            {/* Mandatory (L1 of the role's core modules) */}
            <section className="rounded-lg border border-border bg-card px-5 py-4">
              <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-primary">{t('path.mustSection')}</h2>
              <p className="mb-3 text-xs text-muted-foreground">{t('path.mustHelp')}</p>
              <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {mandatory.map((rm) => (
                  <PathItem key={`${rm.code}-${rm.level}`} rm={rm} kind="must" status={statusFor(rm)} onOpen={() => open(rm)} />
                ))}
              </ul>
            </section>

            {/* Recommended (role-specific L2 deep dives) */}
            {recommended.length > 0 && (
              <section className="rounded-lg border border-border bg-card px-5 py-4">
                <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t('path.recommendedSection')}</h2>
                <p className="mb-3 text-xs text-muted-foreground">{t('path.recommendedHelp')}</p>
                <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {recommended.map((rm) => (
                    <PathItem key={`${rm.code}-${rm.level}`} rm={rm} kind="recommended" status={statusFor(rm)} onOpen={() => open(rm)} />
                  ))}
                </ul>
              </section>
            )}

            {/* SDLC exam — directly reachable from the path */}
            <section className="rounded-lg border border-border bg-card px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t('section.exam.title')}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">{t('exam.cta.blurb')}</p>
                </div>
                <div className="flex items-center gap-2">
                  {examPassed && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {t('status.passed')}
                    </span>
                  )}
                  <Button onClick={() => navigate('/exam')} data-testid="path-exam-btn">
                    {t('exam.cta.button')}
                  </Button>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
