import { useState, type FormEvent } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

interface LoginFormProps {
  /** Called when authentication succeeds so the parent page can redirect. */
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        // After sign-up Supabase may require email confirmation. If it returns a
        // session immediately (confirm disabled) onSuccess() redirects normally;
        // otherwise show a nudge. We optimistically call onSuccess — the
        // ProtectedRoute will bounce to /login if there's no live session yet.
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
          data-testid="email-input"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          required
          minLength={mode === 'signup' ? 8 : undefined}
          placeholder={mode === 'signup' ? 'At least 8 characters' : ''}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={submitting}
          data-testid="password-input"
        />
      </div>

      {error && (
        <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" disabled={submitting} className="w-full" data-testid="auth-submit-btn">
        {submitting ? (
          <>
            <Spinner size="sm" />
            {mode === 'signin' ? 'Signing in…' : 'Creating account…'}
          </>
        ) : mode === 'signin' ? (
          'Sign in'
        ) : (
          'Create account'
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {mode === 'signin' ? (
          <>
            No account?{' '}
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null); }}
              className="font-medium text-primary underline-offset-4 hover:underline"
              data-testid="switch-to-signup"
            >
              Create one
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(null); }}
              className="font-medium text-primary underline-offset-4 hover:underline"
              data-testid="switch-to-signin"
            >
              Sign in
            </button>
          </>
        )}
      </p>
    </form>
  );
}
