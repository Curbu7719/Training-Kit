import { useEffect, useState, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Target, Star, GraduationCap, ListChecks, PenLine, Award } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/i18n';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { getMyReflection } from '@/lib/api';
import { ROLE_PATHS, type RoleKey } from '@/lib/rolePaths';
import type { TranslationKey } from '@/lib/locales/en';

type Level = 'L1' | 'L2';
interface ProgressRow {
  module_id: string;
  level: Level;
  status: 'locked' | 'in_progress' | 'passed';
  score: number;
}

// ---------------------------------------------------------------------------
// Stat tile — a compact icon + value + label cell
// ---------------------------------------------------------------------------

function StatTile({
  icon: Icon,
  value,
  label,
  sub,
}: {
  icon: typeof Award;
  value: string | number;
  label: string;
  sub?: string;
}) {
  return (
    <div className="flex items-center gap-3.5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <div className="text-xl font-extrabold leading-tight">{value}</div>
        <div className="truncate text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
        {sub && <div className="truncate text-[11px] text-muted-foreground">{sub}</div>}
      </div>
    </div>
  );
}

interface PanelData {
  overallPct: number;
  total: number;
  passedCount: number;
  l2PassedCount: number;
  mandPct: number;
  mandDone: number;
  mandTotal: number;
  recDone: number;
  recTotal: number;
  examScore: number | null;
  examPassed: boolean;
  quizPct: number | null;
  quizN: number;
  exPct: number | null;
  exN: number;
  badges: number;
  reflectionDone: boolean;
  completedAt: string | null;
}

// ---------------------------------------------------------------------------
// StatsPanel — self-contained "Your stats" card: progress + role, what's left,
// and the detailed metric cells. Fetches everything itself (RLS-scoped).
// ---------------------------------------------------------------------------

export function StatsPanel({ mascot }: { mascot?: ReactNode } = {}) {
  const { profile } = useAuth();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const role = profile?.learning_role ?? '';
  const [d, setD] = useState<PanelData | null>(null);

  const load = useCallback(async () => {
    if (!profile) return;

    const { data: mods } = await supabase.from('modules').select('id, code');
    const modRows = (mods ?? []) as { id: string; code: string }[];
    const total = modRows.length;
    const idByCode = new Map<string, string>();
    for (const m of modRows) idByCode.set(m.code, m.id);

    const { data: prog } = await supabase
      .from('user_progress')
      .select('module_id, level, status, score')
      .eq('user_id', profile.id);
    const byModule = new Map<string, Partial<Record<Level, ProgressRow>>>();
    for (const row of (prog ?? []) as ProgressRow[]) {
      const m = byModule.get(row.module_id) ?? {};
      m[row.level] = row;
      byModule.set(row.module_id, m);
    }
    const l1Passed = (id: string) => byModule.get(id)?.L1?.status === 'passed';
    const l2Passed = (id: string) => byModule.get(id)?.L2?.status === 'passed';
    const passedCount = modRows.filter((m) => l1Passed(m.id)).length;
    const l2PassedCount = modRows.filter((m) => l2Passed(m.id)).length;
    const overallPct = total ? Math.round((passedCount / total) * 100) : 0;

    // Role path (admin-managed, with constant fallback) → mandatory/recommended L2.
    let core: { code: string; level: Level }[] = [];
    let recommended: { code: string; level: Level }[] = [];
    if (profile.learning_role) {
      const { data: rp } = await supabase
        .from('role_paths')
        .select('module_code, level, kind, sort_order')
        .eq('role', profile.learning_role);
      const rows = (rp ?? []) as { module_code: string; level: Level; kind: string }[];
      if (rows.length > 0) {
        core = rows.filter((r) => r.kind === 'core').map((r) => ({ code: r.module_code, level: r.level }));
        recommended = rows.filter((r) => r.kind === 'recommended').map((r) => ({ code: r.module_code, level: r.level }));
      } else if (profile.learning_role in ROLE_PATHS) {
        const p = ROLE_PATHS[profile.learning_role as RoleKey];
        core = p.core;
        recommended = p.recommended;
      }
    }
    const codeL2Passed = (code: string) => {
      const id = idByCode.get(code);
      return id ? l2Passed(id) : false;
    };
    const mandL2 = core.filter((r) => r.level === 'L2').map((r) => r.code);
    const recL2 = recommended.filter((r) => r.level === 'L2').map((r) => r.code);
    const mandTotal = total + mandL2.length;
    const mandDone = passedCount + mandL2.filter(codeL2Passed).length;
    const mandPct = mandTotal ? Math.round((mandDone / mandTotal) * 100) : 0;
    const recTotal = recL2.length;
    const recDone = recL2.filter(codeL2Passed).length;

    // Aggregate performance metrics (all RLS-scoped to me).
    const [examRes, badgeRes, quizRes, exRes, exDefRes, reflection] = await Promise.all([
      supabase.from('exam_results').select('score, passed').eq('user_id', profile.id).order('score', { ascending: false }).limit(1),
      supabase.from('user_badges').select('badge_id').eq('user_id', profile.id),
      supabase.from('quiz_attempts').select('quiz_question_id, is_correct').eq('user_id', profile.id),
      supabase.from('exercise_subs').select('exercise_id, score').eq('user_id', profile.id),
      supabase.from('exercises').select('id, max_score'),
      getMyReflection().catch(() => null),
    ]);

    // Quiz accuracy — a question counts as correct if any attempt got it right.
    const qBest = new Map<string, boolean>();
    for (const r of (quizRes.data ?? []) as { quiz_question_id: string; is_correct: boolean }[]) {
      qBest.set(r.quiz_question_id, (qBest.get(r.quiz_question_id) ?? false) || r.is_correct);
    }
    const quizN = qBest.size;
    const quizPct = quizN ? Math.round(([...qBest.values()].filter(Boolean).length / quizN) * 100) : null;

    // Exercise score — best score per exercise over its max_score.
    const maxById = new Map<string, number>();
    for (const e of (exDefRes.data ?? []) as { id: string; max_score: number }[]) maxById.set(e.id, e.max_score);
    const exBest = new Map<string, number>();
    for (const r of (exRes.data ?? []) as { exercise_id: string; score: number }[]) {
      exBest.set(r.exercise_id, Math.max(exBest.get(r.exercise_id) ?? 0, r.score));
    }
    let exEarned = 0;
    let exPossible = 0;
    for (const [id, best] of exBest) {
      exEarned += best;
      exPossible += maxById.get(id) ?? 0;
    }
    const exN = exBest.size;
    const exPct = exPossible ? Math.round((exEarned / exPossible) * 100) : null;

    const examTop = examRes.data?.[0] as { score: number; passed: boolean } | undefined;

    setD({
      overallPct,
      total,
      passedCount,
      l2PassedCount,
      mandPct,
      mandDone,
      mandTotal,
      recDone,
      recTotal,
      examScore: examTop?.score ?? null,
      examPassed: examTop?.passed ?? false,
      quizPct,
      quizN,
      exPct,
      exN,
      badges: (badgeRes.data ?? []).length,
      reflectionDone: reflection != null,
      completedAt: reflection?.created_at ?? null,
    });
  }, [profile]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!d) {
    return (
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {t('dashboard.stats.title')}
        </h2>
        <Card className="flex items-center justify-center p-10">
          <Spinner size="lg" />
        </Card>
      </section>
    );
  }

  const modLeft = Math.max(0, d.mandTotal - d.mandDone);
  const remaining: string[] = [];
  if (modLeft > 0) remaining.push(t('dashboard.remaining.modules', { n: modLeft }));
  if (!d.examPassed) remaining.push(t('dashboard.remaining.exam'));
  if (!d.reflectionDone) remaining.push(t('dashboard.remaining.reflection'));

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {t('dashboard.stats.title')}
      </h2>
      <Card className="p-6">
        {/* Top row: mascot + progress ring + role, and what's left + continue */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            {mascot && <div className="shrink-0">{mascot}</div>}
            <div className="relative h-24 w-24 shrink-0">
              <div
                className="h-full w-full rounded-full"
                style={{ background: `conic-gradient(hsl(var(--primary)) ${d.overallPct}%, hsl(var(--muted)) 0)` }}
              />
              <div className="absolute inset-[9px] flex flex-col items-center justify-center rounded-full bg-card">
                <span className="text-xl font-extrabold leading-none">{d.overallPct}%</span>
                <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('dashboard.stat.complete')}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              {role && (
                <Badge variant="default" className="w-fit gap-2 px-3 py-1 text-sm">
                  <span className="text-primary">●</span>
                  {t(`role.${role}` as TranslationKey)}
                </Badge>
              )}
              <div className="text-sm text-muted-foreground">
                {t('dashboard.modulesPassed', { passed: d.passedCount, total: d.total })} · {d.l2PassedCount}{' '}
                {t('dashboard.stat.deepDives')}
              </div>
            </div>
          </div>

          {/* What's left to finish + continue */}
          <div className="flex flex-col gap-2 lg:items-end">
            {remaining.length > 0 ? (
              <div className="flex flex-col gap-1.5 lg:items-end">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('dashboard.remaining.title')}
                </span>
                <div className="flex flex-wrap gap-1.5 lg:justify-end">
                  {remaining.map((r) => (
                    <span
                      key={r}
                      className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1 lg:items-end">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-sm font-semibold text-success">
                  <CheckCircle2 className="h-4 w-4" />
                  {t('dashboard.remaining.done')}
                </span>
                {d.completedAt && (
                  <span className="text-xs text-muted-foreground">
                    {t('dashboard.completedOn', {
                      date: new Date(d.completedAt).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { dateStyle: 'medium' }),
                    })}
                  </span>
                )}
              </div>
            )}
            <Button
              className="mt-1 w-fit"
              onClick={() => navigate(remaining.length > 0 ? '/dashboard' : '/certificate')}
            >
              {remaining.length > 0 ? t('dashboard.continueLearning') : t('cert.cta')} →
            </Button>
          </div>
        </div>

        <div className="my-5 border-t border-border" />

        {/* Metric cells */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 xl:grid-cols-6">
          <StatTile icon={Target} value={`${d.mandPct}%`} label={t('dashboard.stat.mandatory')} sub={`${d.mandDone}/${d.mandTotal}`} />
          <StatTile icon={Star} value={`${d.recDone}/${d.recTotal}`} label={t('dashboard.stat.recommended')} />
          <StatTile
            icon={GraduationCap}
            value={d.examScore != null ? String(d.examScore) : '—'}
            label={t('dashboard.stat.exam')}
            sub={d.examScore == null ? t('dashboard.stat.notTaken') : '/ 100'}
          />
          <StatTile
            icon={ListChecks}
            value={d.quizPct != null ? `${d.quizPct}%` : '—'}
            label={t('dashboard.stat.quiz')}
            sub={d.quizN ? t('dashboard.stat.attempts', { n: d.quizN }) : undefined}
          />
          <StatTile
            icon={PenLine}
            value={d.exPct != null ? `${d.exPct}%` : '—'}
            label={t('dashboard.stat.exercise')}
            sub={d.exN ? t('dashboard.stat.attempts', { n: d.exN }) : undefined}
          />
          <StatTile icon={Award} value={String(d.badges)} label={t('dashboard.stat.badges')} />
        </div>
      </Card>
    </section>
  );
}
