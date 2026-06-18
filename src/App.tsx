import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Spinner } from '@/components/ui/spinner';
import { Toaster } from '@/components/ui/toast';
import { LoginPage } from '@/pages/LoginPage';
import { TrackPickerPage } from '@/pages/TrackPickerPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { LessonPlayerPage } from '@/pages/LessonPlayerPage';
import { LeaderboardPage } from '@/pages/LeaderboardPage';
import { AdminPage } from '@/pages/AdminPage';
import { AdminRoute } from '@/components/auth/AdminRoute';

// ---------------------------------------------------------------------------
// TrackPickerGuard — auth required, but active_track not required.
// ProtectedRoute always redirects to /track when there's no track, which would
// cause an infinite loop if we used it to guard /track itself.
// ---------------------------------------------------------------------------

function TrackPickerGuard() {
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

  // If the user already has a track, skip straight to the dashboard.
  if (profile?.active_track) {
    return <Navigate to="/dashboard" replace />;
  }

  return <TrackPickerPage />;
}

// ---------------------------------------------------------------------------
// App — wraps everything in AuthProvider, declares all routes.
// ---------------------------------------------------------------------------

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Auth-gated (no track requirement) */}
        <Route path="/track" element={<TrackPickerGuard />} />

        {/* Auth + track required */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Lesson player — auth + track required */}
        <Route
          path="/learn/:moduleCode"
          element={
            <ProtectedRoute>
              <LessonPlayerPage />
            </ProtectedRoute>
          }
        />

        {/* Leaderboard — auth + track required */}
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <LeaderboardPage />
            </ProtectedRoute>
          }
        />

        {/* Admin panel — admin role required */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />

        {/* Root → dashboard (ProtectedRoute handles further redirects) */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Anything else → root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Toast notifications — rendered outside Routes so they survive navigation */}
      <Toaster />
    </AuthProvider>
  );
}
