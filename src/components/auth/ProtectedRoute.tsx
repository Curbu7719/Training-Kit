import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AppLoader } from '@/components/ui/AppLoader';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Guards a route behind authentication.
 *
 * - While the auth session is resolving: centred spinner.
 * - No session: redirect to /login.
 * - Authenticated: render children.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <AppLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
