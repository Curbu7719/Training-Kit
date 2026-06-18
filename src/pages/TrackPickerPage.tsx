import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { TrackCode } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Track definitions — codes must match DB tracks.code column exactly.
// ---------------------------------------------------------------------------

interface Track {
  code: TrackCode;
  title: string;
  description: string;
}

const TRACKS: Track[] = [
  {
    code: 'developer',
    title: 'Developer / Engineer',
    description: 'Deep dives into architecture patterns, data modeling, and system design.',
  },
  {
    code: 'business_analyst',
    title: 'Business Analyst',
    description: 'RLS / security, configuration, ADRs, and decision trade-off analysis.',
  },
  {
    code: 'pm_po',
    title: 'PM / Product Owner',
    description: 'Layered architecture, security, configuration, ADRs, and extensibility.',
  },
  {
    code: 'qa_architect',
    title: 'QA & Architect',
    description: 'Full-stack view: all ten modules with an emphasis on quality and extensibility.',
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function TrackPickerPage() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [selected, setSelected] = useState<TrackCode | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (!selected || !user) return;
    setError(null);
    setSaving(true);

    const { error: dbError } = await supabase
      .from('profiles')
      .update({ active_track: selected })
      .eq('id', user.id);

    if (dbError) {
      setError(dbError.message);
      setSaving(false);
      return;
    }

    // Sync the in-memory profile so ProtectedRoute sees active_track before we navigate.
    await refreshProfile();
    navigate('/dashboard', { replace: true });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-muted/30 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary">Choose your track</h1>
        <p className="mt-2 text-muted-foreground">
          Your track shapes which modules are required and at what depth.
        </p>
      </div>

      <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
        {TRACKS.map((track) => {
          const isSelected = selected === track.code;
          return (
            <button
              key={track.code}
              type="button"
              onClick={() => setSelected(track.code)}
              data-testid={`track-card-${track.code}`}
              className={cn(
                'rounded-lg border-2 bg-card p-5 text-left transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                isSelected
                  ? 'border-primary shadow-sm'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <p className="font-semibold text-card-foreground">{track.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{track.description}</p>
            </button>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button
        onClick={handleConfirm}
        disabled={!selected || saving}
        size="lg"
        data-testid="start-learning-btn"
      >
        {saving ? (
          <>
            <Spinner size="sm" />
            Saving…
          </>
        ) : (
          'Start learning'
        )}
      </Button>
    </main>
  );
}
