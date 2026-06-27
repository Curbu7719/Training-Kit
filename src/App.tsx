import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { LanguageProvider } from '@/lib/i18n';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { Toaster } from '@/components/ui/toast';
import { Spinner } from '@/components/ui/spinner';

// Route components are code-split so each page ships as its own chunk and the
// initial bundle only carries the landing route.
const LoginPage = lazy(() => import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const LessonPlayerPage = lazy(() => import('@/pages/LessonPlayerPage').then((m) => ({ default: m.LessonPlayerPage })));
const LeaderboardPage = lazy(() => import('@/pages/LeaderboardPage').then((m) => ({ default: m.LeaderboardPage })));
const AdminPage = lazy(() => import('@/pages/AdminPage').then((m) => ({ default: m.AdminPage })));
const ExamPage = lazy(() => import('@/pages/ExamPage').then((m) => ({ default: m.ExamPage })));
const ReflectionPage = lazy(() => import('@/pages/ReflectionPage').then((m) => ({ default: m.ReflectionPage })));
const GlossaryPage = lazy(() => import('@/pages/GlossaryPage').then((m) => ({ default: m.GlossaryPage })));
const IntroPage = lazy(() => import('@/pages/IntroPage').then((m) => ({ default: m.IntroPage })));
const WelcomePage = lazy(() => import('@/pages/WelcomePage').then((m) => ({ default: m.WelcomePage })));
const LearningPathPage = lazy(() => import('@/pages/LearningPathPage').then((m) => ({ default: m.LearningPathPage })));
const CertificatePage = lazy(() => import('@/pages/CertificatePage').then((m) => ({ default: m.CertificatePage })));

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

// Post-login landing: always the Welcome page (CIO message). It offers
// "Continue learning" if a role is already chosen, or role-pick + start if not.
function HomeRedirect() {
  const { profile, loading } = useAuth();
  if (loading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  return <Navigate to="/welcome" replace />;
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
        <Suspense fallback={<PageFallback />}>
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

          {/* Role learning path — shown after role selection (core/recommended) */}
          <Route
            path="/path"
            element={
              <ProtectedRoute>
                <LearningPathPage />
              </ProtectedRoute>
            }
          />

          {/* Completion certificate (role-based, VF-branded) */}
          <Route
            path="/certificate"
            element={
              <ProtectedRoute>
                <CertificatePage />
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
        </Suspense>

        {/* Toast notifications — rendered outside Routes so they survive navigation */}
        <Toaster />
      </LanguageBridge>
    </AuthProvider>
  );
}
