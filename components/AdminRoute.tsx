'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { isAdmin } from '@/lib/adminCheck';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in - redirect to login
        router.push('/login');
      } else if (!isAdmin(user)) {
        // Logged in but not admin - redirect to home with error
        router.push('/?error=unauthorized');
      }
    }
  }, [user, loading, router]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-parchment">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="font-crimson text-primary">Loading...</p>
        </div>
      </div>
    );
  }

  // Only render children if user is admin
  if (!user || !isAdmin(user)) {
    return null;
  }

  return <>{children}</>;
}
