import { useEffect, useState } from 'react';
import { Award } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/i18n';
import { Spinner } from '@/components/ui/spinner';
import mascotUrl from '@/assets/wingmate-mascot.svg';

// ---------------------------------------------------------------------------
// DB row types
// ---------------------------------------------------------------------------

interface BadgeRow {
  id: string;
  code: string;
  title: string;
}

interface UserBadgeRow {
  badge_id: string;
  awarded_at: string;
  badges: BadgeRow;
}

interface EarnedBadge {
  id: string;
  code: string;
  title: string;
  awardedAt: string;
}

// ---------------------------------------------------------------------------

export function BadgeShelf() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [badges, setBadges] = useState<EarnedBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchBadges() {
      const { data, error } = await supabase
        .from('user_badges')
        .select('badge_id, awarded_at, badges(id, code, title)')
        .eq('user_id', user!.id)
        .order('awarded_at', { ascending: false });

      if (!error && data) {
        const mapped = (data as unknown as UserBadgeRow[]).map((row) => ({
          id: row.badges.id,
          code: row.badges.code,
          title: row.badges.title,
          awardedAt: row.awarded_at,
        }));
        setBadges(mapped);
      }
      setLoading(false);
    }

    void fetchBadges();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Spinner size="sm" />
      </div>
    );
  }

  if (badges.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <img src={mascotUrl} alt="" className="h-16 w-16 opacity-90" />
        <p className="text-sm text-muted-foreground">{t('badge.noBadges')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {badges.map((badge) => (
        <div
          key={badge.id}
          title={t('badge.earned', { date: new Date(badge.awardedAt).toLocaleDateString() })}
          className="flex flex-col items-center gap-1.5 rounded-lg border border-warning/30 bg-warning/5 p-3 text-center"
        >
          <Award className="h-8 w-8 text-warning" />
          <span className="max-w-[80px] text-xs font-medium leading-tight">{badge.title}</span>
        </div>
      ))}
    </div>
  );
}
