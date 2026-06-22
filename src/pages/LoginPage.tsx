import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/i18n';
import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { Spinner } from '@/components/ui/spinner';

export function LoginPage() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Already authenticated — let the root redirect decide Welcome vs dashboard.
  useEffect(() => {
    if (!loading && user) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (user) return null; // redirecting — don't flash the form

  function handleSuccess() {
    navigate('/', { replace: true });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm space-y-3">
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">{t('nav.brand')}</CardTitle>
            <CardDescription>{t('login.tagline')}</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm onSuccess={handleSuccess} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
