import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/spinner';
import type { ReactNode } from 'react';

interface AdminRouteProps {
  children: ReactNode;
}

/**
 * Guards a route behind authentication AND admin role.
 *
 * - While auth is resolving: render a centred spinner.
 * - No session: redirect to /login.
 * - Authenticated but not admin: render a "Not authorized" message.
 * - Admin: render children.
 */
export function AdminRoute({ children }: AdminRouteProps) {
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

  if (profile?.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-foreground">Not authorized</p>
          <p className="text-sm text-muted-foreground">
            This page is restricted to administrators.
          </p>
          <a href="/dashboard" className="text-sm text-primary underline underline-offset-4">
            Back to dashboard
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
