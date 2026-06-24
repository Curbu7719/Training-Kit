import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, Clock, Lock, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
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

// Split a role path into the user's framing: the L1 foundation of every module
// is mandatory; the role's L2 deep dives are recommended. (The stored data marks
// everything `core` with the level the role needs — kind isn't used here.)
function derivePath(p: RolePath): { mandatory: RoleModule[]; recommended: RoleModule[] } {
  const all = [...p.core, ...p.recommended];
  const mandatory: RoleModule[] = [];
  const recommended: RoleModule[] = [];
  const seenM = new Set<string>();
  const seenR = new Set<string>();
  for (const e of all) {
    if (!seenM.has(e.code)) { seenM.add(e.code); mandatory.push({ code: e.code, level: 'L1' }); }
    if (e.level === 'L2' && !seenR.has(e.code)) { seenR.add(e.code); recommended.push({ code: e.code, level: 'L2' }); }
  }
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
  const { profile, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [path, setPath] = useState<RolePath | null>(null);
  const [moduleIdByCode, setModuleIdByCode] = useState<Record<string, string>>({});
  const [progressByModule, setProgressByModule] = useState<Record<string, Partial<Record<Level, string>>>>({});

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

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
          <span className="text-xl font-bold text-primary">{t('nav.brand')}</span>
          <div className="flex items-center gap-3">
            {profile?.display_name && (
              <span className="hidden text-sm text-muted-foreground sm:block">{profile.display_name}</span>
            )}
            <LanguageSwitcher />
            <Button variant="outline" size="sm" onClick={() => void signOut()} data-testid="sign-out-btn">
              {t('nav.signOut')}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 space-y-6">
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
              <ul className="space-y-2">
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
                <ul className="space-y-2">
                  {recommended.map((rm) => (
                    <PathItem key={`${rm.code}-${rm.level}`} rm={rm} kind="recommended" status={statusFor(rm)} onOpen={() => open(rm)} />
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
