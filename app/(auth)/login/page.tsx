'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEmailNotConfirmed, setIsEmailNotConfirmed] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsEmailNotConfirmed(false);
    setResendSuccess(false);
    setLoading(true);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;

      if (data.user) {
        // Redirect to home page
        router.push('/');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during login';
      setError(errorMessage);

      // Check if error is about email not being confirmed
      if (errorMessage.toLowerCase().includes('email not confirmed') ||
          errorMessage.toLowerCase().includes('email is not confirmed')) {
        setIsEmailNotConfirmed(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsResending(true);
    setResendSuccess(false);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        setError(`Failed to resend: ${error.message}`);
      } else {
        setResendSuccess(true);
        setError('');
      }
    } catch {
      setError('Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold font-garamond mb-6 text-primary text-center">
          Login to Brian&apos;s Bookcase
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
            {isEmailNotConfirmed && (
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="mt-2 text-sm underline hover:no-underline flex items-center gap-1 disabled:opacity-50"
              >
                <RefreshCw size={14} className={isResending ? 'animate-spin' : ''} />
                {isResending ? 'Sending...' : 'Resend verification email'}
              </button>
            )}
          </div>
        )}

        {resendSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Verification email sent! Check your inbox and spam folder.
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-crimson mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-crimson mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white py-2 rounded hover:bg-primary transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-center font-crimson">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-accent hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
