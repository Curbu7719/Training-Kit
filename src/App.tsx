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
import { ReflectionPage } from '@/pages/ReflectionPage';
import { GlossaryPage } from '@/pages/GlossaryPage';
import { IntroPage } from '@/pages/IntroPage';
import { WelcomePage } from '@/pages/WelcomePage';
import { Spinner } from '@/components/ui/spinner';

// Post-login landing: first-time learners (no role yet) see the Welcome page
// with the CIO message + role picker; once they've picked a role they go
// straight to the dashboard on every later entry.
function HomeRedirect() {
  const { profile, loading } = useAuth();
  if (loading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  return <Navigate to={profile.learning_role ? '/dashboard' : '/welcome'} replace />;
}

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

          {/* Welcome / onboarding — CIO message + role picker */}
          <Route
            path="/welcome"
            element={
              <ProtectedRoute>
                <WelcomePage />
              </ProtectedRoute>
            }
          />

          {/* Mandatory end-of-training reflection */}
          <Route
            path="/reflection"
            element={
              <ProtectedRoute>
                <ReflectionPage />
              </ProtectedRoute>
            }
          />

          {/* AI basics primer + glossary */}
          <Route
            path="/start"
            element={
              <ProtectedRoute>
                <IntroPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/glossary"
            element={
              <ProtectedRoute>
                <GlossaryPage />
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

          {/* Root → Welcome (first run) or dashboard (returning) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomeRedirect />
              </ProtectedRoute>
            }
          />

          {/* Everything else → root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Toast notifications — rendered outside Routes so they survive navigation */}
        <Toaster />
      </LanguageBridge>
    </AuthProvider>
  );
}
