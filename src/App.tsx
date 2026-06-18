import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { LanguageProvider } from '@/lib/i18n';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Toaster } from '@/components/ui/toast';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { LessonPlayerPage } from '@/pages/LessonPlayerPage';
import { LeaderboardPage } from '@/pages/LeaderboardPage';
import { AdminPage } from '@/pages/AdminPage';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { ExamPage } from '@/pages/ExamPage';

// ---------------------------------------------------------------------------
// App — wraps everything in AuthProvider, declares all routes.
// No track picker: the platform has one shared curriculum for everyone.
// ---------------------------------------------------------------------------

// Bridge: reads profile lang/id from AuthContext so LanguageProvider can seed
// the correct language without prop-drilling through every route.
function LanguageBridge({ children }: { children: React.ReactNode }) {
  const { profile, user } = useAuth();
  return (
    <LanguageProvider
      profileLang={profile?.lang ?? null}
      userId={user?.id ?? null}
    >
      {children}
    </LanguageProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageBridge>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Auth-gated */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Lesson player */}
          <Route
            path="/learn/:moduleCode"
            element={
              <ProtectedRoute>
                <LessonPlayerPage />
              </ProtectedRoute>
            }
          />

          {/* Leaderboard */}
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <LeaderboardPage />
              </ProtectedRoute>
            }
          />

          {/* SDLC Exam */}
          <Route
            path="/exam"
            element={
              <ProtectedRoute>
                <ExamPage />
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

          {/* Root → dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Everything else → root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Toast notifications — rendered outside Routes so they survive navigation */}
        <Toaster />
      </LanguageBridge>
    </AuthProvider>
  );
}
