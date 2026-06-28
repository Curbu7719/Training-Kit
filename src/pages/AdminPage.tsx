import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n';
import {
  listModules,
  listUsers,
  getProgressReport,
  getUserDetail,
  listReflections,
  getRolePaths,
  updateRolePath,
  type ModuleSummary,
  type UserSummary,
  type ProgressUser,
  type UserDetail,
  type DetailCell,
  type ReflectionEntry,
  type RolePathRow,
  type RolePathEntry,
} from '@/lib/adminApi';
import { ROLE_ORDER } from '@/lib/rolePaths';
import type { TranslationKey } from '@/lib/locales/en';

// ---------------------------------------------------------------------------
// UsersTab
// ---------------------------------------------------------------------------

// No track labels — single shared curriculum, no per-user track.

function UsersTab() {
  const { t, lang } = useLanguage();
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const fmtLogin = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' })
      : t('admin.users.never');

  // "Online" = heartbeat within the last 5 minutes (it pings ~once a minute).
  const ONLINE_WINDOW_MS = 5 * 60 * 1000;
  const isOnline = (iso: string | null) => !!iso && Date.now() - new Date(iso).getTime() < ONLINE_WINDOW_MS;

  // Initial load + auto-refresh every 30s so the online status stays current.
  useEffect(() => {
    let active = true;
    const load = () =>
      listUsers()
        .then((d) => { if (active) setUsers(d); })
        .catch((e: Error) => { if (active) setFetchErr(e.message); })
        .finally(() => { if (active) setLoading(false); });
    load();
    const id = setInterval(load, 30_000);
    return () => { active = false; clearInterval(id); };
  }, []);

  const onlineCount = users.filter((u) => isOnline(u.last_seen_at)).length;

  if (selected) {
    return <UserDetailView userId={selected} onBack={() => setSelected(null)} />;
  }

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
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        {t('admin.users.onlineCount', { count: onlineCount, total: users.length })}
      </p>
      <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
            <th className="pb-2 pr-4">{t('admin.users.col.online')}</th>
            <th className="pb-2 pr-4">{t('admin.users.col.name')}</th>
            <th className="pb-2 pr-4">{t('admin.users.col.email')}</th>
            <th className="pb-2 pr-4">{t('admin.users.col.role')}</th>
            <th className="pb-2 pr-4 text-right">{t('admin.users.col.modules')}</th>
            <th className="pb-2 pr-4 text-right">{t('admin.users.col.score')}</th>
            <th className="pb-2 pr-4 text-right">{t('admin.users.col.badges')}</th>
            <th className="pb-2 text-right">{t('admin.users.col.lastLogin')}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-border/50 last:border-0">
              <td className="py-2 pr-4">
                {isOnline(u.last_seen_at) ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
                    <span className="h-2 w-2 rounded-full bg-success" aria-hidden />
                    {t('admin.users.online')}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40" aria-hidden />
                    {t('admin.users.offline')}
                  </span>
                )}
              </td>
              <td className="py-2 pr-4">
                <button
                  type="button"
                  onClick={() => setSelected(u.id)}
                  className="font-medium text-primary hover:underline"
                >
                  {u.display_name ?? '—'}
                </button>
              </td>
              <td className="py-2 pr-4 text-muted-foreground">{u.email ?? '—'}</td>
              <td className="py-2 pr-4">
                <Badge variant={u.role === 'admin' ? 'accent' : 'outline'} className="text-xs">
                  {u.role}
                </Badge>
              </td>
              <td className="py-2 pr-4 text-right tabular-nums">{u.modules_passed}</td>
              <td className="py-2 pr-4 text-right tabular-nums">{u.total_score}</td>
              <td className="py-2 pr-4 text-right tabular-nums">{u.badge_count}</td>
              <td className="py-2 text-right tabular-nums text-muted-foreground whitespace-nowrap">{fmtLogin(u.last_sign_in_at)}</td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={8} className="py-6 text-center text-muted-foreground">
                {t('admin.users.empty')}
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

// ---------------------------------------------------------------------------
// UserDetailView — full development drill-down for one learner
// ---------------------------------------------------------------------------

function Metric({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="text-lg font-extrabold leading-tight tabular-nums">{value}</div>
      <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  );
}

function CellPill({ cell }: { cell: DetailCell | null }) {
  const { t } = useLanguage();
  if (!cell) return <span className="text-muted-foreground">—</span>;
  const label =
    cell.status === 'passed' ? t('status.passed')
      : cell.status === 'in_progress' ? t('status.inProgress')
        : cell.status === 'locked' ? t('status.locked')
          : t('status.notStarted');
  const cls =
    cell.status === 'passed' ? 'bg-success/10 text-success'
      : cell.status === 'in_progress' ? 'bg-accent/10 text-accent'
        : 'bg-muted text-muted-foreground';
  const showScore = cell.status === 'passed' || cell.status === 'in_progress';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {label}{showScore ? ` · ${Math.round(cell.score)}` : ''}
    </span>
  );
}

function UserDetailView({ userId, onBack }: { userId: string; onBack: () => void }) {
  const { t, lang } = useLanguage();
  const [d, setD] = useState<UserDetail | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getUserDetail(userId)
      .then((x) => { if (active) setD(x); })
      .catch((e: Error) => { if (active) setErr(e.message); });
    return () => { active = false; };
  }, [userId]);

  const fmt = (iso: string | null) =>
    iso ? new Date(iso).toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }) : t('admin.users.never');
  const fmtDate = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { dateStyle: 'medium' }) : t('admin.users.never');

  if (err) {
    return (
      <div className="space-y-3">
        <Button variant="outline" size="sm" onClick={onBack} className="gap-1.5"><ArrowLeft className="h-4 w-4" />{t('admin.detail.back')}</Button>
        <p className="text-sm text-destructive">{err}</p>
      </div>
    );
  }
  if (!d) {
    return (
      <div className="space-y-3">
        <Button variant="outline" size="sm" onClick={onBack} className="gap-1.5"><ArrowLeft className="h-4 w-4" />{t('admin.detail.back')}</Button>
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      </div>
    );
  }

  const l1Total = d.modules.filter((m) => m.l1).length;
  const l1Passed = d.modules.filter((m) => m.l1?.status === 'passed').length;
  const l2Passed = d.modules.filter((m) => m.l2?.status === 'passed').length;

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={onBack} className="gap-1.5">
        <ArrowLeft className="h-4 w-4" />{t('admin.detail.back')}
      </Button>

      {/* Identity header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">{d.profile.display_name ?? '—'}</h2>
          <p className="text-sm text-muted-foreground">{d.profile.email ?? '—'}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant={d.profile.role === 'admin' ? 'accent' : 'outline'} className="text-xs">{d.profile.role}</Badge>
            {d.profile.learning_role && (
              <Badge variant="default" className="text-xs">{t(`role.${d.profile.learning_role}` as TranslationKey)}</Badge>
            )}
          </div>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <div>{t('admin.detail.lastSeen')}: {fmt(d.profile.last_seen_at)}</div>
          <div>{t('admin.detail.joined')}: {fmtDate(d.profile.created_at)}</div>
        </div>
      </div>

      {/* Metric tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Metric value={`${l1Passed}/${l1Total}`} label={t('dashboard.stat.passed')} />
        <Metric value={l2Passed} label={t('dashboard.stat.deepDives')} />
        <Metric value={d.quiz.accuracy != null ? `${d.quiz.accuracy}%` : '—'} label={t('dashboard.stat.quiz')} />
        <Metric value={d.exercise.pct != null ? `${d.exercise.pct}%` : '—'} label={t('dashboard.stat.exercise')} />
        <Metric value={d.exam_best != null ? d.exam_best : '—'} label={t('dashboard.stat.exam')} />
        <Metric value={d.badges.length} label={t('dashboard.stat.badges')} />
      </div>

      {/* Integrity flags — implausibly fast or metronomic completions */}
      {d.integrity.flagged && (
        <div className="space-y-1 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
          {d.integrity.fast_modules > 0 && (
            <div>{t('admin.detail.integrityFast', { n: d.integrity.fast_modules })}</div>
          )}
          {d.integrity.uniform_pacing && (
            <div>
              {t('admin.detail.integrityUniform', {
                n: d.integrity.active_answers,
                sec: d.integrity.median_gap_sec ?? 0,
                cov: d.integrity.cov ?? 0,
              })}
            </div>
          )}
        </div>
      )}

      {/* Module-by-module */}
      <section>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t('admin.detail.modules')}</h3>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left text-xs font-medium text-muted-foreground">
                <th className="px-3 py-2">{t('admin.detail.col.module')}</th>
                <th className="px-3 py-2">L1</th>
                <th className="px-3 py-2">L2</th>
                <th className="px-3 py-2 text-right">{t('admin.detail.col.time')}</th>
              </tr>
            </thead>
            <tbody>
              {d.modules.map((m) => (
                <tr key={m.code} className={`border-b border-border/50 last:border-0 ${m.fast ? 'bg-destructive/5' : ''}`}>
                  <td className="px-3 py-2 font-medium">{m.title}</td>
                  <td className="px-3 py-2"><CellPill cell={m.l1} /></td>
                  <td className="px-3 py-2"><CellPill cell={m.l2} /></td>
                  <td className="px-3 py-2 whitespace-nowrap text-right">
                    <span className="tabular-nums text-muted-foreground">
                      {m.events > 0 ? t('admin.detail.min', { min: m.minutes }) : '—'}
                    </span>
                    {m.fast && (
                      <span
                        title={t('admin.detail.fastTitle', { sec: m.median_gap_sec ?? 0, n: m.events })}
                        className="ml-2 inline-flex items-center rounded-full bg-destructive/10 px-1.5 py-0.5 text-[10px] font-bold text-destructive"
                      >
                        ⚡ {t('admin.detail.fast')}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Exam attempts */}
        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t('admin.detail.exams')}</h3>
          {d.exams.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('admin.detail.noExams')}</p>
          ) : (
            <ul className="space-y-1.5">
              {d.exams.map((e, i) => (
                <li key={i} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                  <span className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${e.passed ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                      {e.passed ? t('status.passed') : t('admin.detail.failed')}
                    </span>
                    <span className="font-semibold tabular-nums">{e.score}%</span>
                  </span>
                  <span className="text-xs text-muted-foreground">{fmt(e.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Activity + badges */}
        <section className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t('admin.detail.activity')}</h3>
            {d.activity.first_at ? (
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">{t('admin.detail.firstActivity')}</span><span>{fmt(d.activity.first_at)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{t('admin.detail.lastActivity')}</span><span>{fmt(d.activity.last_at)}</span></div>
                <p className="pt-1 text-xs text-muted-foreground">{t('admin.detail.attempts', { quiz: d.activity.quiz_attempts, ex: d.activity.exercise_subs })}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t('admin.detail.noActivity')}</p>
            )}
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t('dashboard.stat.badges')}</h3>
            {d.badges.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('admin.detail.noBadges')}</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {d.badges.map((b, i) => (
                  <span key={i} title={fmtDate(b.awarded_at)} className="inline-flex items-center rounded-full bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning">
                    {b.title ?? b.code}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Reflection */}
      {d.reflection && (
        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t('admin.detail.reflection')}</h3>
          <Card>
            <CardContent className="space-y-3 pt-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('admin.reflections.work')}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{d.reflection.work_application}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('admin.reflections.value')}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{d.reflection.expected_value}</p>
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ProgressTab
// ---------------------------------------------------------------------------

function ProgressTab() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<ProgressUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    getProgressReport()
      .then(({ users: us }) => setUsers(us))
      .catch((e: Error) => setFetchErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (selected) {
    return <UserDetailView userId={selected} onBack={() => setSelected(null)} />;
  }

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
              <th className="pb-2 pr-4 text-right">{t('admin.progress.col.path')}</th>
              <th className="pb-2 pr-4">{t('admin.progress.col.score')}</th>
              <th className="pb-2 pr-4 text-right">{t('admin.progress.col.quality')}</th>
              <th className="pb-2 pr-4 text-right">{t('admin.progress.col.recommended')}</th>
              <th className="pb-2 pr-4 text-right">{t('admin.progress.col.exam')}</th>
              <th className="pb-2 text-right">{t('admin.progress.col.total')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const pct = u.mandatory.total ? Math.round((u.mandatory.passed / u.mandatory.total) * 100) : 0;
              return (
                <tr key={u.id} className="border-b border-border/50 last:border-0">
                  <td className="py-2 pr-4">
                    <button
                      type="button"
                      onClick={() => setSelected(u.id)}
                      className="font-medium text-primary hover:underline"
                    >
                      {u.display_name}
                    </button>
                  </td>
                  <td className="py-2 pr-4">
                    <Badge variant="outline" className="text-xs">
                      {u.learning_role ? t(`role.${u.learning_role}` as TranslationKey) : '—'}
                    </Badge>
                  </td>
                  <td className="py-2 pr-4 text-right tabular-nums text-xs text-muted-foreground whitespace-nowrap">
                    {u.mandatory.passed}/{u.mandatory.total}
                    <span className="mx-1 opacity-40">·</span>{pct}%
                  </td>
                  <td className="py-2 pr-4">
                    <DevScoreCell score={u.path_score} />
                  </td>
                  <td className={`py-2 pr-4 text-right text-sm font-semibold tabular-nums ${devScoreTextColor(u.quality)}`}>
                    {u.quality}%
                  </td>
                  <td className="py-2 pr-4 text-right tabular-nums text-xs whitespace-nowrap">
                    <span className="text-muted-foreground">{u.recommended.passed}/{u.recommended.total}</span>
                    {u.bonus > 0 && <span className="ml-1 font-semibold text-success">+{u.bonus}</span>}
                  </td>
                  <td className="py-2 pr-4 text-right tabular-nums text-xs">
                    {u.exam_best !== null ? `${u.exam_best}%` : t('admin.progress.examNever')}
                  </td>
                  <td className="py-2 text-right">
                    <span className="text-sm font-bold tabular-nums">{u.total_score}</span>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 text-center text-muted-foreground">
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

        <Tabs defaultValue="users">
          <TabsList className="mb-6">
            <TabsTrigger value="users">{t('admin.tab.users')}</TabsTrigger>
            <TabsTrigger value="progress">{t('admin.tab.progress')}</TabsTrigger>
            <TabsTrigger value="rolepaths">{t('admin.tab.rolePaths')}</TabsTrigger>
            <TabsTrigger value="reflections">{t('admin.tab.reflections')}</TabsTrigger>
          </TabsList>

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
