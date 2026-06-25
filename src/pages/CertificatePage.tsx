import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, CheckCircle2, Circle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { hasPassedExam, getMyReflection } from '@/lib/api';
import { ROLE_PATHS, type RoleKey, type RolePath } from '@/lib/rolePaths';
import type { TranslationKey } from '@/lib/locales/en';

const VF_RED = '#e60000';

export function CertificatePage() {
  const { profile } = useAuth();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [complete, setComplete] = useState(false);
  const [missing, setMissing] = useState({ modules: true, exam: true, reflection: true });

  useEffect(() => {
    if (profile && !profile.learning_role) navigate('/welcome', { replace: true });
  }, [profile, navigate]);

  const load = useCallback(async () => {
    if (!profile) return;
    setLoading(true);

    const { data: mods } = await supabase.from('modules').select('id, code');
    const idByCode: Record<string, string> = {};
    for (const m of (mods ?? []) as { id: string; code: string }[]) idByCode[m.code] = m.id;

    const { data: prog } = await supabase
      .from('user_progress').select('module_id, level, status').eq('user_id', profile.id);
    const passed = new Set<string>();
    for (const r of (prog ?? []) as { module_id: string; level: string; status: string }[]) {
      if (r.status === 'passed') passed.add(`${r.module_id}:${r.level}`);
    }

    let path: RolePath | null = null;
    if (profile.learning_role) {
      const { data: rp } = await supabase
        .from('role_paths').select('module_code, level, kind, sort_order').eq('role', profile.learning_role);
      const rows = (rp ?? []) as { module_code: string; level: 'L1' | 'L2'; kind: string; sort_order: number }[];
      if (rows.length > 0) {
        const pick = (kind: string) =>
          rows.filter((r) => r.kind === kind).sort((a, b) => a.sort_order - b.sort_order).map((r) => ({ code: r.module_code, level: r.level }));
        path = { core: pick('core'), recommended: pick('recommended') };
      } else if (profile.learning_role in ROLE_PATHS) {
        path = ROLE_PATHS[profile.learning_role as RoleKey];
      }
    }
    const core = path?.core ?? [];
    const modulesDone = core.length > 0 && core.every((rm) => passed.has(`${idByCode[rm.code]}:${rm.level}`));

    let examPassed = false, reflectionDone = false;
    try {
      const [e, r] = await Promise.all([hasPassedExam(), getMyReflection()]);
      examPassed = e;
      reflectionDone = !!r;
    } catch { /* leave false */ }

    setMissing({ modules: !modulesDone, exam: !examPassed, reflection: !reflectionDone });
    setComplete(modulesDone && examPassed && reflectionDone);
    setLoading(false);
  }, [profile]);

  useEffect(() => { void load(); }, [load]);

  const name = profile?.display_name || profile?.id || '';
  const roleLabel = profile?.learning_role ? t(`role.${profile.learning_role}` as TranslationKey) : '';
  const dateStr = new Date().toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!complete) {
    const Row = ({ done, label }: { done: boolean; label: string }) => (
      <li className="flex items-center gap-2 text-sm">
        {done ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
        <span className={done ? 'text-foreground' : 'text-muted-foreground'}>{label}</span>
      </li>
    );
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-5 px-6 text-center">
        <h1 className="text-xl font-bold">{t('cert.incomplete.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('cert.incomplete.desc')}</p>
        <ul className="space-y-1.5 text-left">
          <Row done={!missing.modules} label={t('cert.req.modules')} />
          <Row done={!missing.exam} label={t('cert.req.exam')} />
          <Row done={!missing.reflection} label={t('cert.req.reflection')} />
        </ul>
        <Button variant="outline" onClick={() => navigate('/path')}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          {t('nav.myPath')}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      {/* Controls — hidden when printing */}
      <div className="no-print mx-auto mb-6 flex max-w-3xl items-center justify-between px-6">
        <Button variant="ghost" onClick={() => navigate('/path')} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          {t('nav.myPath')}
        </Button>
        <Button onClick={() => window.print()} data-testid="cert-download-btn" className="gap-1.5">
          <Download className="h-4 w-4" />
          {t('cert.download')}
        </Button>
      </div>

      {/* Certificate */}
      <div className="mx-auto max-w-3xl px-6">
        <div
          className="certificate relative overflow-hidden rounded-lg bg-white px-10 py-12 text-center shadow-sm"
          style={{ border: `2px solid ${VF_RED}`, color: '#1a1a1a' }}
        >
          <div className="pointer-events-none absolute inset-0" style={{ border: '1px solid rgba(230,0,0,0.25)', margin: '10px' }} />

          {/* Vodafone wordmark */}
          <div className="mb-8 flex items-center justify-center">
            <span className="text-3xl font-bold tracking-tight" style={{ color: VF_RED }}>Vodafone</span>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: VF_RED }}>
            {t('cert.eyebrow')}
          </p>
          <h1 className="mt-2 text-3xl font-bold">{t('cert.title')}</h1>

          <p className="mt-8 text-sm text-gray-600">{t('cert.presentedTo')}</p>
          <p className="mt-1 text-2xl font-bold">{name}</p>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-gray-700">
            {t('cert.body', { role: roleLabel })}
          </p>

          <div className="mx-auto mt-10 flex max-w-xl items-end justify-between gap-6 text-left">
            <div>
              <div className="border-t pt-1 text-xs text-gray-500" style={{ borderColor: '#d1d5db', minWidth: '9rem' }}>
                {t('cert.date')}
              </div>
              <div className="mt-0.5 text-sm font-medium">{dateStr}</div>
            </div>
            <div className="text-right">
              <div className="border-t pt-1 text-xs text-gray-500" style={{ borderColor: '#d1d5db', minWidth: '9rem' }}>
                {t('cert.issuer')}
              </div>
              <div className="mt-0.5 text-sm font-medium" style={{ color: VF_RED }}>Vodafone Learning</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
