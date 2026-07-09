import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award } from 'lucide-react';
import { getLeaderboard, type LeaderboardEntry } from '@/lib/adminApi';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { TarsSpeech } from '@/components/ui/TarsSpeech';
import { cn } from '@/lib/utils';
import type { TranslationKey } from '@/lib/locales/en';

// ---------------------------------------------------------------------------
// LeaderboardPage — ranked table, accessible to any authenticated user.
// ---------------------------------------------------------------------------

export function LeaderboardPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { t, lang } = useLanguage();

  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState<string | null>(null);

  useEffect(() => {
    getLeaderboard()
      .then(setEntries)
      .catch((e: Error) => setFetchErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Highlight the current user's row when their display name matches.
  const currentName = profile?.display_name ?? null;

  return (
    <>

      <main className="mx-auto w-full max-w-[1760px] px-5 py-8 sm:px-8">
        <TarsSpeech expression="idle" size={84} className="mb-6">{t('tars.leaderboard')}</TarsSpeech>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">{t('leaderboard.title')}</h1>
          <Button variant="outline" size="sm" onClick={() => navigate('/certificate')} className="gap-1.5" data-testid="leaderboard-cert-btn">
            <Award className="h-4 w-4" />
            {t('leaderboard.certificate')}
          </Button>
        </div>

        <details className="mb-6 rounded-xl border border-border bg-card px-4 py-3 text-sm">
          <summary className="cursor-pointer select-none font-medium text-foreground marker:text-primary">
            {t('leaderboard.scoreInfo.title')}
          </summary>
          <p className="mt-2 leading-relaxed text-muted-foreground">{t('leaderboard.scoreInfo.body')}</p>
        </details>

        {loading && (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        )}

        {fetchErr && !loading && (
          <p className="text-sm text-destructive py-4">{fetchErr}</p>
        )}

        {!loading && !fetchErr && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
                  <th className="pb-2 pr-4 w-12">{t('leaderboard.col.rank')}</th>
                  <th className="pb-2 pr-4">{t('leaderboard.col.name')}</th>
                  <th className="pb-2 pr-4">{t('leaderboard.col.role')}</th>
                  <th className="pb-2 pr-4 text-right">{t('leaderboard.col.score')}</th>
                  <th className="pb-2 pr-4 text-right">{t('leaderboard.col.badges')}</th>
                  <th className="pb-2 pr-4 text-right">{t('leaderboard.col.modules')}</th>
                  <th className="pb-2 text-right">{t('leaderboard.col.finished')}</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => {
                  const isCurrentUser = currentName !== null && entry.name === currentName;
                  return (
                    <tr
                      key={entry.rank}
                      className={cn(
                        'border-b border-border/50 last:border-0',
                        isCurrentUser && 'bg-primary/5 font-medium'
                      )}
                    >
                      <td className="py-2.5 pr-4 tabular-nums text-muted-foreground">
                        {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                      </td>
                      <td className="py-2.5 pr-4">
                        {entry.name}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs text-primary font-normal">{t('leaderboard.you')}</span>
                        )}
                      </td>
                      <td className="py-2.5 pr-4">
                        {entry.role ? (
                          <span className="inline-flex items-center gap-1">
                            <span>{t(`role.${entry.role}` as TranslationKey)}</span>
                            {entry.certified && (
                              isCurrentUser ? (
                                <button
                                  type="button"
                                  onClick={() => navigate('/certificate')}
                                  title={t('leaderboard.certificate')}
                                  aria-label={t('leaderboard.certificate')}
                                  className="text-amber-500 transition-colors hover:text-amber-600"
                                >
                                  <Award className="h-4 w-4" />
                                </button>
                              ) : (
                                <Award className="h-4 w-4 text-amber-500" aria-label={t('role.panel.certified')} />
                              )
                            )}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-2.5 pr-4 text-right tabular-nums">{entry.total_score}</td>
                      <td className="py-2.5 pr-4 text-right tabular-nums">{entry.badges}</td>
                      <td className="py-2.5 pr-4 text-right tabular-nums">{entry.modules_passed}</td>
                      <td className="py-2.5 text-right tabular-nums text-muted-foreground whitespace-nowrap">
                        {entry.finished_at
                          ? new Date(entry.finished_at).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { dateStyle: 'medium' })
                          : '—'}
                      </td>
                    </tr>
                  );
                })}
                {entries.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-muted-foreground">
                      {t('leaderboard.empty')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
