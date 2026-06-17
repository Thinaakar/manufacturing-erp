'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail, Zap } from 'lucide-react';
import { LoginHero } from '@/components/login/login-hero';
import { Button } from '@/components/ui/button';
import { DEMO_SUPER_ADMIN_EMAIL, DEMO_SUPER_ADMIN_PASSWORD } from '@/data/mock-auth';
import { getLoginRedirect } from '@/lib/permissions';
import { useAuthStore } from '@/providers/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const { login, demoLogin, isAuthenticated, loading, currentUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated && currentUser) {
      router.replace(getLoginRedirect(currentUser.role));
    }
  }, [loading, isAuthenticated, currentUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const session = await login(email, password);
    setSubmitting(false);
    if (session) {
      router.push(getLoginRedirect(session.role));
    } else {
      setError('Invalid credentials or inactive account.');
    }
  };

  const handleDemo = async () => {
    setError('');
    setEmail(DEMO_SUPER_ADMIN_EMAIL);
    setPassword(DEMO_SUPER_ADMIN_PASSWORD);
    setSubmitting(true);
    const session = await demoLogin();
    setSubmitting(false);
    if (session) {
      router.push(getLoginRedirect(session.role));
    } else {
      setError('Demo login failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-erp-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-erp-muted border-t-erp-accent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <LoginHero />

      <div className="flex w-full flex-1 items-center justify-center bg-erp-bg p-6 lg:w-[40%]">
        <div className="w-full max-w-md">
          <div className="erp-glass rounded-erp-lg p-8 lg:p-10">
            <h2 className="font-display text-2xl font-semibold text-erp-text">Sign in</h2>
            <p className="mt-1 text-sm text-erp-muted">Access your manufacturing workspace</p>

            {error && (
              <p className="mt-4 rounded-xl border border-erp-danger/30 bg-erp-danger/5 px-4 py-3 text-sm text-erp-danger">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="erp-label mb-2 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-erp-muted" />
                  <input
                    type="email"
                    className="erp-input pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@apexprecision.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="erp-label mb-2 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-erp-muted" />
                  <input
                    type="password"
                    className="erp-input pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full gap-2" disabled={submitting}>
                {submitting ? 'Signing in...' : 'Sign In'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <Button variant="ghost" className="mt-3 w-full gap-2" onClick={handleDemo} disabled={submitting}>
              <Zap className="h-4 w-4" />
              Demo Super Admin
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
