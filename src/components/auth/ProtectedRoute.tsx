import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/spinner';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Guards a route behind authentication.
 *
 * - While the auth session is resolving: render a centred spinner.
 * - No session: redirect to /login.
 * - Authenticated but no active_track set: redirect to /track.
 * - Otherwise: render children.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Profile has loaded (or failed to load) — bounce to track picker if no track set.
  // We only redirect once profile is non-null OR we know load finished without a profile row.
  // If profile is still null after loading=false it means the row doesn't exist yet → /track.
  if (!profile?.active_track) {
    return <Navigate to="/track" replace />;
  }

  return <>{children}</>;
}
