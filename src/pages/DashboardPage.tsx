import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Clock, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import type { TrackCode } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BadgeShelf } from '@/components/dashboard/BadgeShelf';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Static module × track matrix — mirrors DESIGN.md §2.1
// ---------------------------------------------------------------------------

type Level = 'L1' | 'L2';
type ModuleStatus = 'locked' | 'in_progress' | 'passed';

interface ModuleEntry {
  code: string;
  title: string;
  requiredLevel: Record<TrackCode, Level | null>;
}

const MODULES: ModuleEntry[] = [
  {
    code: 'layered_architecture',
    title: 'Layered Architecture',
    requiredLevel: { developer: 'L1', business_analyst: 'L1', pm_po: 'L1', qa_architect: 'L1' },
  },
  {
    code: 'data_modeling',
    title: 'Data Modeling & Schema Design',
    requiredLevel: { developer: 'L1', business_analyst: 'L2', pm_po: null, qa_architect: 'L2' },
  },
  {
    code: 'authz_security',
    title: 'Authorization & Security',
    requiredLevel: { developer: 'L1', business_analyst: 'L2', pm_po: 'L2', qa_architect: 'L1' },
  },
  {
    code: 'abstraction_swappability',
    title: 'Abstraction & Swappability',
    requiredLevel: { developer: 'L1', business_analyst: null, pm_po: 'L2', qa_architect: 'L1' },
  },
  {
    code: 'streaming_realtime',
    title: 'Streaming & Real-Time Data',
    requiredLevel: { developer: 'L2', business_analyst: null, pm_po: null, qa_architect: 'L2' },
  },
  {
    code: 'context_state',
    title: 'Context & State Management',
    requiredLevel: { developer: 'L2', business_analyst: 'L2', pm_po: 'L2', qa_architect: 'L1' },
  },
  {
    code: 'config_composition',
    title: 'Configuration & Layered Composition',
    requiredLevel: { developer: 'L1', business_analyst: 'L1', pm_po: 'L1', qa_architect: 'L1' },
  },
  {
    code: 'adr_tradeoffs',
    title: 'Decision Records & Trade-Off Analysis',
    requiredLevel: { developer: 'L1', business_analyst: 'L1', pm_po: 'L1', qa_architect: 'L1' },
  },
  {
    code: 'migration_planning',
    title: 'Migration Planning',
    requiredLevel: { developer: 'L2', business_analyst: null, pm_po: 'L2', qa_architect: 'L1' },
  },
  {
    code: 'extensibility_seams',
    title: 'Extensibility & Seams',
    requiredLevel: { developer: 'L2', business_analyst: 'L2', pm_po: 'L2', qa_architect: 'L1' },
  },
];

const TRACK_LABELS: Record<TrackCode, string> = {
  developer: 'Developer / Engineer',
  business_analyst: 'Business Analyst',
  pm_po: 'PM / Product Owner',
  qa_architect: 'QA & Architect',
};

// ---------------------------------------------------------------------------
// DB progress row shape
// ---------------------------------------------------------------------------

interface ProgressRow {
  module_id: string;
  level: Level;
  status: ModuleStatus;
  score: number;
}

interface ModuleDbRow {
  id: string;
  code: string;
}

// ---------------------------------------------------------------------------
// Status badge component
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<
  ModuleStatus,
  { label: string; icon: typeof Lock; badgeVariant: 'warning' | 'accent' | 'success' }
> = {
  locked: { label: 'Locked', icon: Lock, badgeVariant: 'warning' },
  in_progress: { label: 'In progress', icon: Clock, badgeVariant: 'accent' },
  passed: { label: 'Passed', icon: CheckCircle2, badgeVariant: 'success' },
};

function StatusBadge({ status }: { status: ModuleStatus }) {
  const { label, icon: Icon, badgeVariant } = STATUS_CONFIG[status];
  return (
    <Badge variant={badgeVariant}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// DashboardPage
// ---------------------------------------------------------------------------

export function DashboardPage() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const track = profile!.active_track!;
  const trackLabel = TRACK_LABELS[track];

  // Map module_id → progress row, loaded from user_progress.
  const [progressMap, setProgressMap] = useState<Record<string, ProgressRow>>({});
  // Map module code → module id, needed to look up progress.
  const [moduleIdMap, setModuleIdMap] = useState<Record<string, string>>({});
  const [loadingProgress, setLoadingProgress] = useState(true);

  const loadProgress = useCallback(async () => {
    if (!profile) return;
    setLoadingProgress(true);

    // Fetch module id → code mapping
    const { data: modData } = await supabase
      .from('modules')
      .select('id, code');

    const idMap: Record<string, string> = {};
    if (modData) {
      for (const m of modData as ModuleDbRow[]) {
        idMap[m.code] = m.id;
      }
    }
    setModuleIdMap(idMap);

    // Fetch user's progress rows
    const { data: progData } = await supabase
      .from('user_progress')
      .select('module_id, level, status, score')
      .eq('user_id', profile.id);

    const pMap: Record<string, ProgressRow> = {};
    if (progData) {
      for (const row of progData as ProgressRow[]) {
        pMap[row.module_id] = row;
      }
    }
    setProgressMap(pMap);
    setLoadingProgress(false);
  }, [profile]);

  useEffect(() => {
    void loadProgress();
  }, [loadProgress]);

  async function handleSignOut() {
    await signOut();
  }

  // Compute overall track progress: required modules passed / total required.
  const requiredModules = MODULES.filter((m) => m.requiredLevel[track] !== null);
  const passedRequired = requiredModules.filter((m) => {
    const moduleId = moduleIdMap[m.code];
    if (!moduleId) return false;
    return progressMap[moduleId]?.status === 'passed';
  }).length;
  const trackPct =
    requiredModules.length > 0
      ? Math.round((passedRequired / requiredModules.length) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-primary">TrainingKit</span>
            <span className="hidden rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary sm:inline-block">
              {trackLabel}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {profile?.display_name && (
              <span className="hidden text-sm text-muted-foreground sm:block">
                {profile.display_name}
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={() => navigate('/leaderboard')}>
              Leaderboard
            </Button>
            {profile?.role === 'admin' && (
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
                Admin
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => void handleSignOut()} data-testid="sign-out-btn">
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8 space-y-8">
        {/* Track progress strip */}
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Your learning path</h1>
            <span className="text-sm text-muted-foreground">
              {passedRequired}/{requiredModules.length} required modules passed
            </span>
          </div>
          <Progress value={trackPct} className="h-2" />
          <p className="mt-1.5 text-xs text-muted-foreground">
            {trackPct}% of {trackLabel} track complete
          </p>
        </section>

        {/* Module grid */}
        <section>
          <div className="grid gap-4 sm:grid-cols-2">
            {MODULES.map((mod) => {
              const level = mod.requiredLevel[track];
              const isRequired = level !== null;
              const moduleId = moduleIdMap[mod.code];
              const progress = moduleId ? progressMap[moduleId] : undefined;
              const status: ModuleStatus = progress?.status ?? 'locked';
              const scoreRaw = progress?.score ?? 0;
              const scorePct = Math.round(scoreRaw * 100);

              return (
                <Card
                  key={mod.code}
                  className={cn(!isRequired && 'opacity-60')}
                  data-testid={`module-card-${mod.code}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base">{mod.title}</CardTitle>
                      <StatusBadge status={status} />
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      {isRequired ? (
                        <>
                          Required
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {level}
                          </Badge>
                        </>
                      ) : (
                        'Optional'
                      )}
                      {progress && (
                        <span className="ml-auto text-xs">{scorePct}%</span>
                      )}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Score progress bar */}
                    <Progress
                      value={scorePct}
                      className={cn(
                        'h-1.5',
                        status === 'passed' && '[&>div]:bg-success',
                        status === 'in_progress' && '[&>div]:bg-accent',
                        status === 'locked' && '[&>div]:bg-border'
                      )}
                    />

                    {/* CTA */}
                    {status !== 'locked' && (
                      <Button
                        size="sm"
                        variant={status === 'passed' ? 'outline' : 'default'}
                        onClick={() => navigate(`/learn/${mod.code}`)}
                        className="w-full"
                      >
                        {status === 'passed' ? 'Review' : 'Continue'}
                      </Button>
                    )}
                    {status === 'locked' && isRequired && (
                      <Button
                        size="sm"
                        onClick={() => navigate(`/learn/${mod.code}`)}
                        className="w-full"
                        disabled={loadingProgress}
                      >
                        Start
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Badges / certificate strip */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">Your badges</h2>
          <BadgeShelf />
        </section>
      </main>
    </div>
  );
}
