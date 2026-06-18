import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLeaderboard, type LeaderboardEntry } from '@/lib/adminApi';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// LeaderboardPage — ranked table, accessible to any authenticated user.
// ---------------------------------------------------------------------------

export function LeaderboardPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { t } = useLanguage();

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
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
            {t('nav.dashboard')}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold">{t('leaderboard.title')}</h1>

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
                  <th className="pb-2 pr-4 text-right">{t('leaderboard.col.score')}</th>
                  <th className="pb-2 pr-4 text-right">{t('leaderboard.col.badges')}</th>
                  <th className="pb-2 text-right">{t('leaderboard.col.modules')}</th>
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
                      <td className="py-2.5 pr-4 text-right tabular-nums">{entry.total_score}</td>
                      <td className="py-2.5 pr-4 text-right tabular-nums">{entry.badges}</td>
                      <td className="py-2.5 text-right tabular-nums">{entry.modules_passed}</td>
                    </tr>
                  );
                })}
                {entries.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-muted-foreground">
                      {t('leaderboard.empty')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
