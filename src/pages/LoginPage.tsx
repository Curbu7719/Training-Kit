import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { Brand } from '@/components/ui/Brand';
import { AppLoader } from '@/components/ui/AppLoader';

export function LoginPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Already authenticated — let the root redirect decide Welcome vs dashboard.
  useEffect(() => {
    if (!loading && user) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <AppLoader />;
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
            <Brand className="justify-center" />
          </CardHeader>
          <CardContent>
            <LoginForm onSuccess={handleSuccess} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
