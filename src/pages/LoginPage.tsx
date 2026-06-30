import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/i18n';
import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardHeader, CardDescription, CardContent } from '@/components/ui/card';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { Brand } from '@/components/ui/Brand';
import { Spinner } from '@/components/ui/spinner';
import mascotUrl from '@/assets/wingmate-mascot.svg';

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
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-3">
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>
        <Card className="shadow-cardhover">
          <CardHeader className="items-center pb-4 pt-7 text-center">
            <img src={mascotUrl} alt="Wingmate" className="mb-3 h-24 w-24 drop-shadow-sm" />
            <Brand className="justify-center" />
            <CardDescription className="mt-3">{t('login.tagline')}</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm onSuccess={handleSuccess} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
