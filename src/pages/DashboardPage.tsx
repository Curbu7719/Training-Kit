import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Clock, CheckCircle2, Circle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BadgeShelf } from '@/components/dashboard/BadgeShelf';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Single shared curriculum — one path for everyone (no role splitting).
// Titles/descriptions are display copy; `code` matches the modules table.
// ---------------------------------------------------------------------------

interface Module {
  code: string;
  title: string;
  description: string;
}

const MODULES: Module[] = [
  { code: 'llm_foundations', title: 'How LLMs Work', description: 'What an LLM is and does; capabilities and limits; choosing the right model for a task.' },
  { code: 'tokens', title: 'Tokens & Costs', description: 'What a token is; estimating usage and cost; designing prompts that stay within budget and limits.' },
  { code: 'context_management', title: 'Context Window Management', description: 'Handling long conversations and documents without losing information or hitting limits.' },
  { code: 'prompting', title: 'Prompting for Real Work', description: 'Writing system prompts and user turns that produce reliable, structured output.' },
  { code: 'guardrails', title: 'Guardrails & Safety', description: 'Identifying prompt injection and jailbreak risks; designing layered defenses.' },
  { code: 'tool_use_agents', title: 'Tool Use & Agents', description: 'Function-calling integrations; reasoning about agentic loops and failure modes.' },
  { code: 'rag', title: 'RAG — Retrieval-Augmented Generation', description: 'Building a retrieval pipeline; choosing chunking and embedding strategies.' },
  { code: 'evaluation', title: 'Evaluation & Testing', description: 'Defining evals; measuring quality; setting up regression tests for prompts and pipelines.' },
  { code: 'cost_latency', title: 'Cost, Latency & Reliability', description: 'Profiling a pipeline; applying caching, routing, and streaming; setting SLOs.' },
  { code: 'ai_architecture', title: 'AI System Architecture', description: 'Reading and drawing a full AI system architecture; identifying security and privacy risks.' },
];

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

const STATUS_CONFIG: Record<CellStatus, { label: string; icon: typeof Lock; className: string }> = {
  not_started: { label: 'Not started', icon: Circle, className: 'bg-muted text-muted-foreground' },
  locked: { label: 'Locked', icon: Lock, className: 'bg-warning/10 text-warning' },
  in_progress: { label: 'In progress', icon: Clock, className: 'bg-accent/10 text-accent' },
  passed: { label: 'Passed', icon: CheckCircle2, className: 'bg-success/10 text-success' },
};

function StatusBadge({ status }: { status: CellStatus }) {
  const { label, icon: Icon, className } = STATUS_CONFIG[status];
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', className)}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Module card
// ---------------------------------------------------------------------------

interface ModuleCardProps {
  module: Module;
  index: number;
  l1Status: CellStatus;
  l2Status: CellStatus;
  onOpen: () => void;
}

function ModuleCard({ module, index, l1Status, l2Status, onOpen }: ModuleCardProps) {
  // Primary action label reflects where the learner is in this module.
  const ctaLabel =
    l1Status === 'passed' && l2Status === 'passed'
      ? 'Review'
      : l1Status === 'in_progress' || l1Status === 'passed'
        ? 'Continue'
        : 'Start';

  return (
    <Card data-testid={`module-card-${module.code}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {index + 1}
          </span>
          <div>
            <CardTitle className="text-base leading-snug">{module.title}</CardTitle>
            <CardDescription className="mt-0.5">{module.description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {/* L1 row */}
        <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">L1</span>
            <span className="text-sm">Foundations</span>
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
            <span className="text-sm">Deep dive</span>
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

  const passedCount = MODULES.filter((m) => statusFor(m.code).l1Passed).length;
  const overallPct = Math.round((passedCount / MODULES.length) * 100);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4">
          <span className="text-xl font-bold text-primary">TrainingKit</span>
          <div className="flex items-center gap-3">
            {profile?.display_name && (
              <span className="hidden text-sm text-muted-foreground sm:block">{profile.display_name}</span>
            )}
            <Button variant="ghost" size="sm" onClick={() => navigate('/leaderboard')}>
              Leaderboard
            </Button>
            {profile?.role === 'admin' && (
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
                Admin
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => void signOut()} data-testid="sign-out-btn">
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-4xl px-6 py-8 space-y-8">
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Your learning path</h1>
            <span className="text-sm text-muted-foreground">{passedCount}/{MODULES.length} modules passed</span>
          </div>
          <Progress value={overallPct} className="h-2" />
          <p className="mt-1.5 text-xs text-muted-foreground">
            10 modules · two levels each · complete L1 to unlock L2
          </p>
        </section>

        <section>
          <div className="grid gap-4 sm:grid-cols-2">
            {MODULES.map((mod, i) => {
              const { l1, l2 } = statusFor(mod.code);
              return (
                <ModuleCard
                  key={mod.code}
                  module={mod}
                  index={i}
                  l1Status={l1}
                  l2Status={l2}
                  onOpen={() => navigate(`/learn/${mod.code}`)}
                />
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Your badges</h2>
          <BadgeShelf />
        </section>
      </main>

      {loading && <span className="sr-only">Loading progress…</span>}
    </div>
  );
}
