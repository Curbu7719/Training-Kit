import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

export function LoginPage() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, skip straight to the right destination.
  useEffect(() => {
    if (loading) return;
    if (user) {
      navigate(profile?.active_track ? '/dashboard' : '/track', { replace: true });
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Already redirecting — don't flash the login form.
  if (user) return null;

  function handleSuccess() {
    // Auth state will update via onAuthStateChange; the effect above drives redirect.
    // We do a manual navigate here as a fast path for when the profile is already known.
    navigate(profile?.active_track ? '/dashboard' : '/track', { replace: true });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">TrainingKit</CardTitle>
          <CardDescription>Role-based architecture training</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </main>
  );
}
